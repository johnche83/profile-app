// api/analyze.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, role, purpose, top10, sten, substen, family, lang = "ko" } = req.body;
  if (!top10 || top10.length < 5) return res.status(400).json({ error: "CS 테마가 부족합니다 (최소 5개)" });

  const DOMAINS = { executing:"실행력", influencing:"영향력", relationship:"대인관계", strategic:"전략적 사고" };
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

  const csStr = top10.map((en,i) => {
    const t = THEMES.find(x => x.en === en);
    return `${i+1}.${t?t.ko:en}(${t?DOMAINS[t.d]:"?"})`;
  }).join(" ");

  const cnt = {executing:0,influencing:0,relationship:0,strategic:0};
  top10.forEach(en => { const t = THEMES.find(x => x.en===en); if(t) cnt[t.d]++; });

  const subfStr = substen ? Object.entries(substen).filter(([,v])=>v!==5.5).map(([k,v])=>`${k}:${v}`).join(" ") : "";

  const isKo = lang !== "en";

  const promptKo = `당신은 CliftonStrengths와 Facet5 인증 수퍼바이저입니다. 두 진단 데이터를 교차 분석하여 심층 통합 프로파일 JSON을 작성하세요.

대상자: ${name}${role?" / "+role:""} | 목적: ${purpose}
CS Top${top10.length}(순서): ${csStr}
CS 영역: 실행력${cnt.executing} 영향력${cnt.influencing} 대인관계${cnt.relationship} 전략적사고${cnt.strategic}
Facet5(스텐): Will ${sten.W} Energy ${sten.E} Affection ${sten.A} Control ${sten.C} Emotionality ${sten.Em} | 패밀리: ${family}
${subfStr?"하위요인: "+subfStr:""}

마크다운 없이 JSON만 반환. 모든 텍스트는 한국어. 아래 스키마를 빠짐없이 채울 것.
스텐 해석: 1~3=매우낮음, 4=낮음, 5~6=보통, 7=높음, 8~10=매우높음. 평균은 5.5.

{
  "tagline": "핵심 한 줄 (15자 이내, 명사형)",
  "summary": "두 진단 핵심 작동 방식 2문장 (120자 이내)",
  "dominant_domain": "주도 영역명",
  "dominant_reason": "주도 영역 이유 1문장 (60자 이내)",
  "best_context": "빛나는 업무 장면 2가지, 쉼표 구분 (50자 이내)",
  "signatures": [
    {"label":"시그니처명(10자이내)","cs":"CS 근거 테마명 포함(35자)","f5":"F5 근거 요인명 포함(35자)"},
    {"label":"...","cs":"...","f5":"..."},
    {"label":"...","cs":"...","f5":"..."}
  ],
  "tensions": [
    {"title":"긴장 제목(12자이내)","desc":"가설 1문장(55자이내)"},
    {"title":"...","desc":"..."}
  ],
  "debrief_questions": ["질문1(30자이내)","질문2","질문3"],
  "highlight_narrative": "두 진단 통합 서술 2~3문장 (200자 이내)",
  "cs_domain_narratives": {
    "executing": "실행력 테마 작동 방식 2문장(100자), 테마명 언급. 테마 없으면 null",
    "influencing": "영향력 테마 작동 방식 2문장(100자). 테마 없으면 null",
    "relationship": "대인관계 테마 작동 방식 2문장(100자). 테마 없으면 null",
    "strategic": "전략적 사고 테마 작동 방식 2문장(100자). 테마 없으면 null"
  },
  "theme_dynamics": [
    {"combo":"테마A × 테마B","hypothesis":"두 테마 상호작용 발현 가설 1~2문장"},
    {"combo":"...","hypothesis":"..."},
    {"combo":"...","hypothesis":"..."},
    {"combo":"...","hypothesis":"..."}
  ],
  "lower_themes_inferred": [
    {"name":"테마명","rank_hint":"추정 하위권","implication":"실무적 의미 및 보완 전략 1~2문장"},
    {"name":"...","rank_hint":"...","implication":"..."},
    {"name":"...","rank_hint":"...","implication":"..."},
    {"name":"...","rank_hint":"...","implication":"..."}
  ],
  "blind_spots": [
    {"title":"[테마명]의 그림자","desc":"행동 패턴 서술 + 관리 방법 2~3문장"},
    {"title":"...","desc":"..."},
    {"title":"...","desc":"..."}
  ],
  "f5_factor_analysis": {
    "W": "의지 ${sten.W} 해석: 점수+행동패턴+CS연결 (80자)",
    "E": "활력 ${sten.E} 해석: 에너지원천+CS연결 (80자)",
    "A": "친화성 ${sten.A} 해석: 관계방식+CS연결 (80자)",
    "C": "통제력 ${sten.C} 해석: 구조화성향+CS연결 (80자)",
    "Em": "정서 ${sten.Em} 해석: 정서처리+CS연결 (80자)"
  },
  "convergence_signals": [
    {"title":"수렴 특성명(10자)","cs_evidence":"CS 근거(50자)","f5_evidence":"F5 근거(50자)"},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."}
  ],
  "facilitator_note_convergence": "퍼실리테이터 노트 1~2문장(80자)",
  "tension_points_detailed": [
    {"title":"긴장 N — 제목(15자)","desc":"가설 2문장(100자)","verify_q":"검증 질문(40자)"},
    {"title":"...","desc":"...","verify_q":"..."},
    {"title":"...","desc":"...","verify_q":"..."},
    {"title":"...","desc":"...","verify_q":"..."}
  ],
  "operating_model": {
    "name": "작동 모델 이름(10자이내)",
    "narrative": "작동 방식 2문장(100자)",
    "best_scenes": ["장면1(25자)","장면2","장면3","장면4"],
    "energizers": ["조건1(20자)","조건2","조건3","조건4","조건5"],
    "drainers": ["소진1(20자)","소진2","소진3","소진4","소진5"],
    "partner_note": "파트너십 제안 1~2문장(80자)"
  },
  "debrief_questions_detailed": [
    {"q":"탐색 질문(40자, 테마/점수 명시)","context":"근거(20자)"},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."}
  ],
  "session_flow": [
    {"phase":"오프닝","duration":"15분","content":"내용(40자)"},
    {"phase":"탐색","duration":"35분","content":"내용(40자)"},
    {"phase":"통합","duration":"25분","content":"내용(40자)"},
    {"phase":"액션","duration":"15분","content":"내용(40자)"}
  ],
  "development_experiments": [
    {"title":"실험명(15자)","desc":"실험 방법 2문장(100자)"},
    {"title":"...","desc":"..."},
    {"title":"...","desc":"..."}
  ]
}`;

  const promptEn = `You are a certified CliftonStrengths and Facet5 supervisor. Analyze the two assessment data sets and produce a comprehensive integrated profile JSON.

Subject: ${name}${role?" / "+role:""} | Purpose: ${purpose}
CS Top${top10.length} (in order): ${csStr}
CS Domains: Executing ${cnt.executing} Influencing ${cnt.influencing} Relationship ${cnt.relationship} Strategic Thinking ${cnt.strategic}
Facet5 (sten): Will ${sten.W} Energy ${sten.E} Affection ${sten.A} Control ${sten.C} Emotionality ${sten.Em} | Family: ${family}
${subfStr?"Sub-factors: "+subfStr:""}

Return ONLY JSON, no markdown. All text in English. Fill every field in the schema below.
Sten interpretation: 1~3=very low, 4=low, 5~6=average, 7=high, 8~10=very high. Mean=5.5.

{
  "tagline": "Core profile in one phrase (under 8 words, noun-based)",
  "summary": "2 sentences on the core operating mode across both assessments (under 80 words)",
  "dominant_domain": "dominant domain name",
  "dominant_reason": "1 sentence explaining why this domain dominates (under 40 words)",
  "best_context": "2 work contexts where this person shines, comma-separated (under 35 words)",
  "signatures": [
    {"label":"Signature name (under 5 words)","cs":"CS theme evidence incl. theme name (under 30 words)","f5":"Facet5 factor evidence incl. factor name (under 30 words)"},
    {"label":"...","cs":"...","f5":"..."},
    {"label":"...","cs":"...","f5":"..."}
  ],
  "tensions": [
    {"title":"Tension title (under 5 words)","desc":"Hypothesis sentence (under 35 words)"},
    {"title":"...","desc":"..."}
  ],
  "debrief_questions": ["Question 1 (under 20 words)","Question 2","Question 3"],
  "highlight_narrative": "2~3 sentence integrated narrative across both assessments (under 120 words)",
  "cs_domain_narratives": {
    "executing": "3~4 sentences on Executing themes' operating style, naming specific themes. null if 0 themes",
    "influencing": "3~4 sentences on Influencing themes. null if 0 themes",
    "relationship": "3~4 sentences on Relationship Building themes. null if 0 themes",
    "strategic": "3~4 sentences on Strategic Thinking themes. null if 0 themes"
  },
  "theme_dynamics": [
    {"combo":"Theme A × Theme B","hypothesis":"1~2 sentences on how these two themes interact"},
    {"combo":"...","hypothesis":"..."},
    {"combo":"...","hypothesis":"..."},
    {"combo":"...","hypothesis":"..."}
  ],
  "lower_themes_inferred": [
    {"name":"Theme name","rank_hint":"likely lower","implication":"1~2 sentences on practical meaning and compensation strategy"},
    {"name":"...","rank_hint":"...","implication":"..."},
    {"name":"...","rank_hint":"...","implication":"..."},
    {"name":"...","rank_hint":"...","implication":"..."}
  ],
  "blind_spots": [
    {"title":"Shadow of [Theme]","desc":"2~3 sentences on behavioral pattern and management approach"},
    {"title":"...","desc":"..."},
    {"title":"...","desc":"..."}
  ],
  "f5_factor_analysis": {
    "W": "Will (${sten.W}): contextualize score, analyze sub-factor gaps, predict behavioral patterns, connect to CS themes (under 100 words)",
    "E": "Energy (${sten.E}): energy source and style, connect to CS (under 100 words)",
    "A": "Affection (${sten.A}): relationship approach, connect to CS (under 100 words)",
    "C": "Control (${sten.C}): structure tendency, connect to CS (under 100 words)",
    "Em": "Emotionality (${sten.Em}): emotional processing style, connect to CS (under 100 words)"
  },
  "convergence_signals": [
    {"title":"Convergence signal name","cs_evidence":"1~2 sentences of CS theme evidence","f5_evidence":"1~2 sentences of Facet5 factor evidence"},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."},
    {"title":"...","cs_evidence":"...","f5_evidence":"..."}
  ],
  "facilitator_note_convergence": "2~3 sentences facilitator note on using these convergence signals",
  "tension_points_detailed": [
    {"title":"Tension N — Title","desc":"2~3 sentences of detailed description and hypothesis","verify_q":"1 verification question to explore this tension"},
    {"title":"...","desc":"...","verify_q":"..."},
    {"title":"...","desc":"...","verify_q":"..."},
    {"title":"...","desc":"...","verify_q":"..."}
  ],
  "operating_model": {
    "name": "Operating model name (e.g., Context-Driven Designer)",
    "narrative": "2~3 sentences on integrated operating mode",
    "best_scenes": ["Shining scene 1","Shining scene 2","Shining scene 3","Shining scene 4"],
    "energizers": ["Energy condition 1","Energy condition 2","Energy condition 3","Energy condition 4","Energy condition 5"],
    "drainers": ["Demotivator 1","Demotivator 2","Demotivator 3","Demotivator 4","Demotivator 5"],
    "partner_note": "2~3 sentences on complementary partnership suggestions"
  },
  "debrief_questions_detailed": [
    {"q":"Exploration question (cite specific theme/score)","context":"(evidence basis)"},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."},
    {"q":"...","context":"..."}
  ],
  "session_flow": [
    {"phase":"Opening","duration":"15 min","content":"Session opening content"},
    {"phase":"Exploration","duration":"35 min","content":"Exploration phase content"},
    {"phase":"Integration","duration":"25 min","content":"Integration phase content"},
    {"phase":"Action","duration":"15 min","content":"Action planning content"}
  ],
  "development_experiments": [
    {"title":"Experiment name","desc":"2~3 sentences on specific experiment methodology"},
    {"title":"...","desc":"..."},
    {"title":"...","desc":"..."}
  ]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 8000,
        messages: [{ role: "user", content: isKo ? promptKo : promptEn }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API 오류");

    const text = data.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
    const clean = text.replace(/```json|```/g,"").trim();
    const result = JSON.parse(clean);
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
