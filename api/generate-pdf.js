// api/generate-pdf.js
// PDF HTML 템플릿을 반환 → 브라우저에서 window.print()로 저장하는 방식
// (Vercel 무료 플랜은 Chromium 실행 불가 → HTML 반환 후 클라이언트 프린트)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { name, role, purpose, top10, sten, substen, family, analysis } = req.body;

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
  const SUBFACTORS = [
    {k:"W1",pk:"W",n:"결의"},{k:"W2",pk:"W",n:"정면대응"},{k:"W3",pk:"W",n:"독립심"},
    {k:"E1",pk:"E",n:"생동력"},{k:"E2",pk:"E",n:"사교성"},{k:"E3",pk:"E",n:"적응성"},
    {k:"A1",pk:"A",n:"이타심"},{k:"A2",pk:"A",n:"도움"},{k:"A3",pk:"A",n:"신뢰"},
    {k:"C1",pk:"C",n:"규율"},{k:"C2",pk:"C",n:"책임감"},
    {k:"Em1",pk:"Em",n:"긴장"},{k:"Em2",pk:"Em",n:"이해도"}
  ];
  const F5_COLORS = {W:"#2E9E5B",E:"#C79A00",A:"#DD3F3F",C:"#3A66B0",Em:"#A04070"};
  const F5_NAMES = {W:"의지",E:"활력",A:"친화성",C:"통제력",Em:"정서"};
  const DOM_COLORS = {executing:"#7B5EA7",influencing:"#D88C2A",relationship:"#3B6EA8",strategic:"#3E8E6E"};
  const DOM_NAMES = {executing:"실행력",influencing:"영향력",relationship:"대인관계",strategic:"전략적 사고"};

  const cnt = {executing:0,influencing:0,relationship:0,strategic:0};
  top10.forEach(en => { const t = THEMES.find(x => x.en === en); if(t) cnt[t.d]++; });

  const barHtml = (val, color) => {
    const pct = Math.round(val * 10);
    return `<div style="position:relative;height:8px;background:#EDF0F3;border-radius:4px;margin:3px 0">
      <div style="position:absolute;left:50%;top:-2px;width:1px;height:12px;background:#C5C9CF"></div>
      <div style="position:absolute;left:0;top:0;height:8px;width:${pct}%;background:${color}40;border-radius:4px"></div>
      <div style="position:absolute;left:calc(${pct}% - 7px);top:-3px;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff"></div>
    </div>`;
  };

  const f5Rows = Object.entries(sten).map(([k,v]) => `
    <tr>
      <td style="padding:6px 0;font-size:9pt"><span style="color:${F5_COLORS[k]}">●</span> <b>${F5_NAMES[k]}</b> <span style="color:#888;font-size:8pt">${k}</span></td>
      <td style="padding:6px 8px;width:200px">${barHtml(v, F5_COLORS[k])}</td>
      <td style="padding:6px 0;text-align:right;font-weight:700;color:${F5_COLORS[k]};font-size:10pt">${parseFloat(v).toFixed(1)}</td>
    </tr>`).join("");

  const subfRows = substen ? SUBFACTORS.filter(s => substen[s.k] && substen[s.k] !== 5.5).map(s => {
    const pk = s.pk; const color = F5_COLORS[pk];
    return `<tr>
      <td style="padding:4px 0 4px 14px;font-size:8.5pt;color:#555">${s.n}</td>
      <td style="padding:4px 8px;width:200px">${barHtml(substen[s.k], color)}</td>
      <td style="padding:4px 0;text-align:right;color:${color};font-size:9pt">${parseFloat(substen[s.k]).toFixed(1)}</td>
    </tr>`;
  }).join("") : "";

  const today = new Date().toLocaleDateString("ko-KR");

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>통합 프로파일 — ${name}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans KR',sans-serif;color:#222;font-size:10pt;line-height:1.65;background:#fff}
@media print{
  @page{size:A4;margin:15mm 14mm 18mm}
  .no-print{display:none}
  .page-break{page-break-before:always}
}
.wrap{max-width:800px;margin:0 auto;padding:24px}
h2{font-size:14pt;font-weight:900;border-bottom:2px solid #1B2733;padding-bottom:5px;margin:20px 0 12px}
h3{font-size:10.5pt;font-weight:700;margin:12px 0 5px}
.callout{background:#1B2733;color:#fff;border-radius:8px;padding:12px 16px;margin:10px 0}
.callout b{color:#9FE1CB}
table{width:100%;border-collapse:collapse}
.tbl td,.tbl th{padding:6px 8px;font-size:9pt;border-bottom:1px solid #E8ECF0;vertical-align:top}
.tbl th{font-weight:700;background:#F5F7FA;text-align:left}
.box{border:1px solid #E0E5EA;border-radius:6px;padding:10px 13px;margin:7px 0}
.sig-row{display:grid;grid-template-columns:130px 1fr;gap:10px;padding:7px 0;border-bottom:1px solid #EEF0F3;font-size:9.5pt}
.q{background:#F5F7FA;border-left:3px solid #1B2733;padding:7px 11px;margin-bottom:6px;font-size:9pt}
.tag{display:inline-block;border-radius:10px;padding:2px 9px;font-size:8pt;font-weight:700;color:#fff;margin-right:4px}
.no-print-btn{display:block;text-align:center;margin:20px auto;padding:12px 32px;background:#1B2733;color:#fff;border:none;border-radius:8px;font-size:13pt;font-family:inherit;cursor:pointer;font-weight:700}
</style>
</head>
<body>
<div class="wrap">

<button class="no-print no-print-btn" onclick="window.print()">📄 PDF로 저장 (인쇄 → PDF)</button>

<!-- 표지 -->
<div style="text-align:center;padding:40px 0 32px">
  <div style="font-size:9pt;font-weight:700;letter-spacing:3px;color:#3E8E6E;margin-bottom:8px">INTEGRATED TALENT PROFILE</div>
  <h1 style="font-size:26pt;font-weight:900;line-height:1.3">강점 × Facet5<br>통합 프로파일</h1>
  <p style="margin-top:10px;font-size:11pt;color:#555">CliftonStrengths® × Facet5® 교차 검증 리포트</p>
  <table style="margin:24px auto;width:70%;font-size:9.5pt" class="tbl">
    <tr><td style="width:30%;font-weight:700">대상자</td><td>${name}${role?" / "+role:""}</td></tr>
    <tr><td style="font-weight:700">목적</td><td>${purpose}</td></tr>
    <tr><td style="font-weight:700">Facet5 패밀리</td><td>${family}</td></tr>
    <tr><td style="font-weight:700">작성일</td><td>${today}</td></tr>
  </table>
  <p style="font-size:8pt;color:#999;margin-top:8px">본 리포트는 인증 퍼실리테이터의 디브리핑 보조 자료이며, 모든 해석은 검증이 필요한 가설입니다.</p>
</div>

<!-- Page 1: 하이라이트 -->
<div class="page-break">
<h2>1. 프로파일 하이라이트</h2>
<div class="callout"><b>${analysis.tagline || ""}</b><br><span style="font-size:9.5pt;opacity:.9">${analysis.summary || ""}</span></div>

<h3>CS 영역 분포 (Top ${top10.length})</h3>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
${Object.entries(cnt).map(([dk,n])=>`
  <div style="text-align:center;padding:10px 4px;background:${n>0?DOM_COLORS[dk]+"18":"#F5F7FA"};border-radius:8px;border:1px solid ${n>0?DOM_COLORS[dk]+"50":"#E0E5EA"}">
    <div style="font-size:22pt;font-weight:900;color:${n>0?DOM_COLORS[dk]:"#BBB"}">${n}</div>
    <div style="font-size:8pt;color:${n>0?DOM_COLORS[dk]:"#AAA"}">${DOM_NAMES[dk]}</div>
  </div>`).join("")}
</div>
<p style="font-size:9pt;color:#555;margin-bottom:12px">${analysis.dominant_reason||""}</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
  <div class="box" style="border-top:3px solid #3E8E6E">
    <div style="font-size:9pt;font-weight:700;color:#3E8E6E;margin-bottom:6px">빛나는 장면</div>
    <div style="font-size:9pt">${(analysis.best_context||"").split(",").map(x=>`• ${x.trim()}`).join("<br>")}</div>
  </div>
  <div class="box" style="border-top:3px solid #C84B31">
    <div style="font-size:9pt;font-weight:700;color:#C84B31;margin-bottom:6px">탐색할 긴장</div>
    ${(analysis.tensions||[]).map(t=>`<div style="margin-bottom:5px"><b style="font-size:9pt">${t.title}</b><br><span style="font-size:8.5pt;color:#555">${t.desc}</span></div>`).join("")}
  </div>
</div>

<h3>핵심 시그니처</h3>
<div>${(analysis.signatures||[]).map(s=>`<div class="sig-row"><div style="font-weight:700">${s.label}</div><div><div style="font-size:8.5pt;color:#555">CS: ${s.cs}</div><div style="font-size:8.5pt;color:#555">F5: ${s.f5}</div></div></div>`).join("")}</div>
</div>

<!-- Page 2: CS 분석 -->
<div class="page-break">
<h2>2. CliftonStrengths 분석</h2>
<h3>Top ${top10.length} 테마 서열</h3>
<table class="tbl" style="margin-bottom:12px">
  <tr><th style="width:6%">순위</th><th style="width:18%">테마</th><th style="width:14%">영역</th><th>특성</th></tr>
  ${top10.map((en,i)=>{const t=THEMES.find(x=>x.en===en)||{ko:en,d:"executing"};return`<tr><td style="text-align:center;font-weight:700">${i+1}</td><td><b>${t.ko}</b><br><span style="font-size:8pt;color:#888">${en}</span></td><td><span class="tag" style="background:${DOM_COLORS[t.d]}">${DOM_NAMES[t.d]}</span></td><td style="font-size:8.5pt;color:#444">—</td></tr>`;}).join("")}
</table>
<h3>영역별 특성</h3>
${Object.entries(cnt).filter(([,n])=>n>0).map(([dk,n])=>`
<div class="box" style="border-left:3px solid ${DOM_COLORS[dk]}">
  <b style="color:${DOM_COLORS[dk]}">${DOM_NAMES[dk]}</b> <span style="font-size:8.5pt;color:#888">${n}개 테마</span>
  <p style="font-size:9pt;margin-top:4px">${top10.filter(en=>{const t=THEMES.find(x=>x.en===en);return t&&t.d===dk;}).map(en=>{const t=THEMES.find(x=>x.en===en);return t?t.ko:en;}).join("·")} — 해석 내용은 디브리핑 시 보완</p>
</div>`).join("")}
</div>

<!-- Page 3: Facet5 분석 -->
<div class="page-break">
<h2>3. Facet5 분석</h2>
<h3>5요인 프로파일</h3>
<table style="margin-bottom:6px">${f5Rows}</table>
${subfRows ? `<h3 style="margin-top:12px">하위 요인 상세</h3><table>${subfRows}</table>` : ""}
<div class="box" style="margin-top:10px">
  <b>판정 패밀리: ${family}</b>
  <p style="font-size:9pt;margin-top:4px;color:#555">패밀리는 W·E·A·C 4요인 기반 약칭이며 Emotionality와 전체 프로파일 해석을 대신하지 않습니다.</p>
</div>
</div>

<!-- Page 4: 교차 검증 -->
<div class="page-break">
<h2>4. 교차 검증 및 디브리핑 가이드</h2>
<h3>탐색 질문</h3>
${(analysis.debrief_questions||[]).map((q,i)=>`<div class="q"><b>Q${i+1}.</b> ${q}</div>`).join("")}
<h3 style="margin-top:14px">세션 흐름 제안 (60–90분)</h3>
<table class="tbl">
  <tr><th style="width:18%">단계</th><th style="width:14%">시간</th><th>내용</th></tr>
  <tr><td>오프닝</td><td>10분</td><td>하이라이트 핵심 한 줄 제시 → 자기 인식과의 공명 확인</td></tr>
  <tr><td>탐색</td><td>30분</td><td>긴장 포인트 2개 중심 탐색 질문 → 행동 증거 수집</td></tr>
  <tr><td>통합</td><td>20분</td><td>핵심 시그니처 3가지를 함께 수정·확인 → 작동 모델 합의</td></tr>
  <tr><td>액션</td><td>10분</td><td>개발 실험 1–2개 선정, 점검 주기 합의</td></tr>
</table>
<div class="box" style="margin-top:14px;border-top:3px solid #1B2733">
  <p style="font-size:8.5pt;color:#666">본 리포트의 모든 해석은 가설이며, 본인의 언어로 검증·수정될 때 비로소 유효합니다.<br>CliftonStrengths® Gallup, Inc. / Facet5® NL Buckley</p>
</div>
</div>

</div><!-- /wrap -->
</body>
</html>`;

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ ok: true, html });
}
