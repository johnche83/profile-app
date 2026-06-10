// api/analyze.js
// Vercel Serverless Function — Claude API를 서버에서 호출해 API 키를 보호합니다

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, role, purpose, top10, sten, substen, family } = req.body;

  if (!top10 || top10.length < 5) {
    return res.status(400).json({ error: "CS 테마가 부족합니다 (최소 5개)" });
  }

  const DOMAINS = {
    executing: "실행력", influencing: "영향력",
    relationship: "대인관계", strategic: "전략적 사고"
  };
  const THEMES = [
    {en:"Achiever",ko:"성취",d:"executing"},{en:"Arranger",ko:"정리",d:"executing"},
    {en:"Belief",ko:"신념",d:"executing"},{en:"Consistency",ko:"공정성",d:"executing"},
    {en:"Deliberative",ko:"심사숙고",d:"executing"},{en:"Discipline",ko:"체계",d:"executing"},
    {en:"Focus",ko:"집중",d:"executing"},{en:"Responsibility",ko:"책임",d:"executing"},
    {en:"Restorative",ko:"복구",d:"executing"},{en:"Activator",ko:"행동",d:"influencing"},
    {en:"Command",ko:"주도력",d:"influencing"},{en:"Communication",ko:"커뮤니케이션",d:"influencing"},
    {en:"Competition",ko:"승부",d:"influencing"},{en:"Maximizer",ko:"최상화",d:"influencing"},
    {en:"Self-Assurance",ko:"자기확신",d:"influencing"},{en:"Significance",ko:"존재감",d:"influencing"},
    {en:"Woo",ko:"사교성",d:"influencing"},{en:"Adaptability",ko:"적응",d:"relationship"},
    {en:"Connectedness",ko:"연결성",d:"relationship"},{en:"Developer",ko:"개발",d:"relationship"},
    {en:"Empathy",ko:"공감",d:"relationship"},{en:"Harmony",ko:"화합",d:"relationship"},
    {en:"Includer",ko:"포용",d:"relationship"},{en:"Individualization",ko:"개별화",d:"relationship"},
    {en:"Positivity",ko:"긍정",d:"relationship"},{en:"Relator",ko:"절친",d:"relationship"},
    {en:"Analytical",ko:"분석",d:"strategic"},{en:"Context",ko:"회고",d:"strategic"},
    {en:"Futuristic",ko:"미래지향",d:"strategic"},{en:"Ideation",ko:"발상",d:"strategic"},
    {en:"Input",ko:"수집",d:"strategic"},{en:"Intellection",ko:"지적사고",d:"strategic"},
    {en:"Learner",ko:"배움",d:"strategic"},{en:"Strategic",ko:"전략",d:"strategic"}
  ];

  const csStr = top10.map((en, i) => {
    const t = THEMES.find(x => x.en === en);
    return `${i+1}.${t ? t.ko : en}(${t ? DOMAINS[t.d] : ''})`;
  }).join(" ");

  const cnt = { executing:0, influencing:0, relationship:0, strategic:0 };
  top10.forEach(en => { const t = THEMES.find(x => x.en === en); if(t) cnt[t.d]++; });

  const subfStr = substen ? Object.entries(substen)
    .filter(([,v]) => v !== 5.5)
    .map(([k,v]) => `${k}:${v}`)
    .join(" ") : "";

  const prompt = `당신은 CliftonStrengths와 Facet5 인증 수퍼바이저입니다.
대상자: ${name}${role ? " / "+role : ""} / 목적: ${purpose}
CS Top${top10.length}(순서): ${csStr}
CS 영역: 실행력${cnt.executing} 영향력${cnt.influencing} 대인관계${cnt.relationship} 전략적사고${cnt.strategic}
Facet5: Will ${sten.W} Energy ${sten.E} Affection ${sten.A} Control ${sten.C} Emotionality ${sten.Em} / 패밀리: ${family}
${subfStr ? "하위요인: "+subfStr : ""}

반드시 아래 JSON만 반환. 마크다운 백틱·서문·후기 없이. 한국어.
{
  "tagline": "프로파일 핵심 한 문장 (15자 이내, 명사형)",
  "summary": "두 진단을 관통하는 핵심 작동 방식 2문장 (120자 이내)",
  "dominant_domain": "지배 영역 이름",
  "dominant_reason": "지배 영역인 이유 1문장 (60자 이내)",
  "signatures": [
    {"label":"시그니처 이름 (10자 이내)","cs":"CS 근거 테마명 포함 (35자 이내)","f5":"Facet5 근거 요인명 포함 (35자 이내)"},
    {"label":"...","cs":"...","f5":"..."},
    {"label":"...","cs":"...","f5":"..."}
  ],
  "tensions": [
    {"title":"긴장 포인트 제목 (12자 이내)","desc":"가설 1문장 (55자 이내)"},
    {"title":"...","desc":"..."}
  ],
  "best_context": "가장 빛나는 업무 장면 2가지, 쉼표로 구분 (50자 이내)",
  "debrief_questions": [
    "탐색 질문 1 (30자 이내)",
    "탐색 질문 2 (30자 이내)",
    "탐색 질문 3 (30자 이내)"
  ]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,  // Vercel 환경변수
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API 오류");

    const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return res.status(200).json({ ok: true, result });

  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
