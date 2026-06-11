// api/generate-pdf.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { name, role, purpose, top10, sten, substen, family, analysis, lang = "ko" } = req.body;
  const isKo = lang !== "en";
  const a = analysis || {};

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
    {k:"W1",pk:"W",n:"결의",en:"Determination"},{k:"W2",pk:"W",n:"정면대응",en:"Confrontation"},{k:"W3",pk:"W",n:"독립심",en:"Independence"},
    {k:"E1",pk:"E",n:"생동력",en:"Vitality"},{k:"E2",pk:"E",n:"사교성",en:"Sociability"},{k:"E3",pk:"E",n:"적응성",en:"Adaptability"},
    {k:"A1",pk:"A",n:"이타심",en:"Altruism"},{k:"A2",pk:"A",n:"도움",en:"Support"},{k:"A3",pk:"A",n:"신뢰",en:"Trust"},
    {k:"C1",pk:"C",n:"규율",en:"Discipline"},{k:"C2",pk:"C",n:"책임감",en:"Responsibility"},
    {k:"Em1",pk:"Em",n:"긴장",en:"Tension"},{k:"Em2",pk:"Em",n:"이해도",en:"Apprehension"}
  ];
  const F5C = {W:"#2E9E5B",E:"#C79A00",A:"#DD3F3F",C:"#3A66B0",Em:"#A04070"};
  const F5N = isKo ? {W:"의지",E:"활력",A:"친화성",C:"통제력",Em:"정서"} : {W:"Will",E:"Energy",A:"Affection",C:"Control",Em:"Emotionality"};
  const DC = {executing:"#7B5EA7",influencing:"#D88C2A",relationship:"#3B6EA8",strategic:"#3E8E6E"};
  const DN = isKo
    ? {executing:"실행력",influencing:"영향력",relationship:"대인관계",strategic:"전략적 사고"}
    : {executing:"Executing",influencing:"Influencing",relationship:"Relationship Building",strategic:"Strategic Thinking"};

  const cnt = {executing:0,influencing:0,relationship:0,strategic:0};
  top10.forEach(en => { const t=THEMES.find(x=>x.en===en); if(t) cnt[t.d]++; });

  const thLabel = en => { const t=THEMES.find(x=>x.en===en); return isKo?(t?t.ko:en):(t?t.en:en); };
  const thDomain = en => { const t=THEMES.find(x=>x.en===en); return t?t.d:"executing"; };

  const today = new Date().toLocaleDateString(isKo?"ko-KR":"en-US");

  const barHtml = (val, color) => {
    const pct = Math.round(parseFloat(val)*10);
    return `<div style="position:relative;height:8px;background:#EDF0F3;border-radius:4px;margin:2px 0 1px">
      <div style="position:absolute;left:50%;top:-3px;width:1px;height:14px;background:#C5C9CF"></div>
      <div style="position:absolute;left:0;top:0;height:8px;width:${pct}%;background:${color}40;border-radius:4px"></div>
      <div style="position:absolute;left:calc(${pct}% - 7px);top:-3px;width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2)"></div>
    </div>`;
  };

  // ── Labels ──────────────────────────────────────────────────────
  const L = isKo ? {
    cover_title: "강점 × Facet5<br>통합 프로파일",
    cover_sub: "CliftonStrengths® × Facet5® 교차 검증 리포트",
    subject:"대상자", purpose_lbl:"목적", family_lbl:"Facet5 패밀리", date_lbl:"작성일",
    disclaimer:"본 리포트는 인증 퍼실리테이터의 디브리핑 보조 자료이며, 모든 해석은 검증이 필요한 가설입니다.",
    savePdf:"📄 PDF로 저장 (인쇄 대화상자 → PDF 저장)",
    sec1:"1. 프로파일 하이라이트",
    csDist:`CS 영역 분포 (Top ${top10.length})`, csThemes:`Top ${top10.length} 테마 순서`,
    f5Profile:"Facet5 5요인 프로파일", coreSignatures:"핵심 시그니처 3가지",
    sigLabel:"시그니처", sigCS:"CS 근거", sigF5:"Facet5 근거",
    sec2:"2. CliftonStrengths 분석 — 재능의 방향",
    domainNarrative:"영역별 서술", themeDynamics:"테마 다이내믹스",
    comboCol:"테마 조합", hypothesisCol:"발현 가설",
    sec3:"3. CliftonStrengths — 하위 테마와 맹점 관리",
    lowerThemes:"추정 하위 테마와 실무적 의미", themeNameCol:"테마",
    rankHintCol:"추정", implicationCol:"실무적 의미 및 보완 전략",
    blindSpots:"상위 테마의 그림자 (맹점 관리)",
    sec4:"4. Facet5 분석 ① — 의지 · 활력",
    sec5:"5. Facet5 분석 ② — 친화성 · 통제력 · 정서",
    subfactorDetail:"하위 요인 상세", familyNote:`판정 패밀리: ${family}`,
    sec6:"6. 교차 검증 ① — 일치 시그널",
    convergenceTable:"수렴 특성 목록", convergenceTitle:"수렴 특성",
    csEvidenceCol:"CS 근거", f5EvidenceCol:"Facet5 근거",
    facilitatorNote:"퍼실리테이터 활용 노트",
    sec7:"7. 교차 검증 ② — 긴장 포인트",
    verifyQ:"검증 질문",
    sec8:"8. 시너지 분석 — 통합 작동 모델",
    operatingModelTitle:"통합 작동 모델",
    bestScenes:"빛나는 장면", energizersDrainers:"에너지 조건 vs 디모티베이터",
    energizers:"에너지 조건 ↑", drainers:"에너지 소진 ↓",
    partnerNote:"보완 파트너십 제안",
    sec9:"9. 디브리핑 가이드 — 질문과 세션 흐름",
    debriefQ:"탐색 질문 (6개)", qContext:"근거",
    sessionFlow:"90분 세션 흐름",
    phaseCol:"단계", durationCol:"시간", contentCol:"내용",
    devExperiments:"개발 실험 제안 (3가지)",
    footerNote:"본 리포트의 모든 해석은 가설이며, 본인의 언어로 검증·수정될 때 비로소 유효합니다.",
    credits:"CliftonStrengths® Gallup, Inc. / Facet5® NL Buckley",
    inferredNote:"※ 하위 테마는 제공된 상위 테마와 Facet5 프로파일 기반 추정값입니다.",
  } : {
    cover_title: "Strengths × Facet5<br>Integrated Profile",
    cover_sub: "CliftonStrengths® × Facet5® Cross-Validation Report",
    subject:"Subject", purpose_lbl:"Purpose", family_lbl:"Facet5 Family", date_lbl:"Date",
    disclaimer:"This report is a supplementary resource for certified facilitators. All interpretations are hypotheses pending verification.",
    savePdf:"📄 Save as PDF (Print → Save as PDF)",
    sec1:"1. Profile Highlights",
    csDist:`CS Domain Distribution (Top ${top10.length})`, csThemes:`Top ${top10.length} Themes in Order`,
    f5Profile:"Facet5 Five-Factor Profile", coreSignatures:"3 Core Signatures",
    sigLabel:"Signature", sigCS:"CS Evidence", sigF5:"Facet5 Evidence",
    sec2:"2. CliftonStrengths Analysis — Direction of Talent",
    domainNarrative:"Domain Narratives", themeDynamics:"Theme Dynamics",
    comboCol:"Theme Combination", hypothesisCol:"Activation Hypothesis",
    sec3:"3. CliftonStrengths — Lower Themes & Blind Spot Management",
    lowerThemes:"Inferred Lower Themes & Practical Implications", themeNameCol:"Theme",
    rankHintCol:"Estimate", implicationCol:"Practical Meaning & Compensation Strategy",
    blindSpots:"Shadows of Upper Themes (Blind Spot Management)",
    sec4:"4. Facet5 Analysis ① — Will · Energy",
    sec5:"5. Facet5 Analysis ② — Affection · Control · Emotionality",
    subfactorDetail:"Sub-factor Detail", familyNote:`Detected Family: ${family}`,
    sec6:"6. Cross-Validation ① — Convergence Signals",
    convergenceTable:"Convergence Signal List", convergenceTitle:"Convergence Signal",
    csEvidenceCol:"CS Evidence", f5EvidenceCol:"Facet5 Evidence",
    facilitatorNote:"Facilitator Application Note",
    sec7:"7. Cross-Validation ② — Tension Points",
    verifyQ:"Verification Question",
    sec8:"8. Synergy Analysis — Integrated Operating Model",
    operatingModelTitle:"Integrated Operating Model",
    bestScenes:"Shining Scenes", energizersDrainers:"Energizers vs Demotivators",
    energizers:"Energizers ↑", drainers:"Drainers ↓",
    partnerNote:"Complementary Partnership Suggestion",
    sec9:"9. Debrief Guide — Questions & Session Flow",
    debriefQ:"Exploration Questions (6)", qContext:"Evidence",
    sessionFlow:"90-minute Session Flow",
    phaseCol:"Phase", durationCol:"Duration", contentCol:"Content",
    devExperiments:"Development Experiments (3)",
    footerNote:"All interpretations in this report are hypotheses that become valid only when verified and revised in the subject's own words.",
    credits:"CliftonStrengths® Gallup, Inc. / Facet5® NL Buckley",
    inferredNote:"※ Lower themes are inferred from provided upper themes and Facet5 profile.",
  };

  // ── Helpers ─────────────────────────────────────────────────────
  const domTag = dk => `<span style="display:inline-block;background:${DC[dk]};color:#fff;border-radius:10px;padding:1px 8px;font-size:7.5pt;font-weight:700">${DN[dk]}</span>`;

  // CS domain distribution blocks
  const csDomainBlocks = Object.entries(cnt).map(([dk,n]) => `
    <div style="text-align:center;padding:12px 6px;background:${n>0?DC[dk]+"15":"#F5F7FA"};border-radius:8px;border:1.5px solid ${n>0?DC[dk]+"60":"#E0E5EA"}">
      <div style="font-size:20pt;font-weight:900;color:${n>0?DC[dk]:"#CCC"}">${n}</div>
      <div style="font-size:8pt;font-weight:700;color:${n>0?DC[dk]:"#AAA"};margin-top:2px">${DN[dk]}</div>
      <div style="margin-top:5px;font-size:7.5pt;color:#666;line-height:1.6">
        ${top10.map((en,i)=>({en,rank:i+1})).filter(x=>thDomain(x.en)===dk).map(x=>`<span style="font-weight:700">${x.rank}.</span>${thLabel(x.en)}`).join("&nbsp;") || "—"}
      </div>
    </div>`).join("");

  // Build theme list per domain with rank circles
  const domainThemeList = dk => {
    const themes = top10.map((en,i)=>({en,i:i+1})).filter(x=>thDomain(x.en)===dk);
    if(!themes.length) return `<span style="color:#aaa;font-size:8.5pt">—</span>`;
    return themes.map(x=>`<span style="display:inline-block;margin:1px 3px 1px 0;font-size:8.5pt"><span style="display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:${DC[dk]};color:#fff;font-size:7pt;font-weight:700">${x.i}</span> ${thLabel(x.en)}</span>`).join(" ");
  };

  // Facet5 factor rows
  const f5MainRows = (factors) => factors.map(k => `
    <tr>
      <td style="padding:7px 0;font-size:9.5pt;white-space:nowrap"><span style="color:${F5C[k]};font-size:11pt">●</span> <b>${F5N[k]}</b> <span style="color:#999;font-size:8pt">${k}</span></td>
      <td style="padding:7px 10px;width:55%">${barHtml(sten[k], F5C[k])}</td>
      <td style="padding:7px 0;text-align:right;font-weight:900;color:${F5C[k]};font-size:11pt">${parseFloat(sten[k]).toFixed(1)}</td>
    </tr>`).join("");

  const subfactorsFor = (pk) => {
    if(!substen) return "";
    const subs = SUBFACTORS.filter(s=>s.pk===pk && substen[s.k] && substen[s.k]!==5.5);
    if(!subs.length) return "";
    return `<table style="width:100%;margin-top:4px">${subs.map(s=>`
      <tr>
        <td style="padding:3px 0 3px 16px;font-size:8.5pt;color:#666">${isKo?s.n:s.en}</td>
        <td style="padding:3px 10px;width:55%">${barHtml(substen[s.k], F5C[pk])}</td>
        <td style="padding:3px 0;text-align:right;color:${F5C[pk]};font-size:8.5pt">${parseFloat(substen[s.k]).toFixed(1)}</td>
      </tr>`).join("")}</table>`;
  };

  // ── Section helpers ──────────────────────────────────────────────
  const narrativeBox = (dk, text) => {
    if(!text) return "";
    return `<div style="margin-bottom:12px;padding:12px 14px;border-left:4px solid ${DC[dk]};background:${DC[dk]}08;border-radius:0 6px 6px 0">
      <div style="font-weight:700;color:${DC[dk]};font-size:9.5pt;margin-bottom:5px">${DN[dk]} ${domainThemeList(dk)}</div>
      <p style="font-size:9pt;line-height:1.75;color:#333">${text}</p>
    </div>`;
  };

  const f5FactorBlock = (k, text) => `
    <div style="margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:${F5C[k]};color:#fff;font-weight:900;font-size:9pt">${k}</span>
        <span style="font-weight:700;font-size:10.5pt;color:${F5C[k]}">${F5N[k]}</span>
        <span style="font-weight:900;font-size:12pt;color:${F5C[k]}">${parseFloat(sten[k]).toFixed(1)}</span>
        ${barHtml(sten[k], F5C[k]).replace('<div style="position:relative;height:8px', '<div style="flex:1;position:relative;height:8px')}
      </div>
      ${subfactorsFor(k)}
      <p style="font-size:9pt;line-height:1.75;color:#333;margin-top:6px;padding:8px 12px;background:#FAFBF9;border-radius:6px">${text||""}</p>
    </div>`;

  // ── HTML ─────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${isKo?"통합 프로파일":"Integrated Profile"} — ${name}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans KR',sans-serif;color:#222;font-size:10pt;line-height:1.65;background:#fff}
@media print{
  @page{size:A4;margin:14mm 13mm 16mm}
  .no-print{display:none!important}
  .page-break{page-break-before:always}
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
}
.wrap{max-width:780px;margin:0 auto;padding:20px 24px}
h2{font-size:13.5pt;font-weight:900;color:#1B2733;border-bottom:2.5px solid #1B2733;padding-bottom:5px;margin:0 0 12px}
h3{font-size:10pt;font-weight:700;color:#1B2733;margin:12px 0 6px}
.callout{background:#1B2733;color:#fff;border-radius:8px;padding:12px 16px;margin:10px 0 14px}
.callout .tag{color:#9FE1CB;font-size:14pt;font-weight:900;line-height:1.3;display:block;margin-bottom:4px}
.callout .sub{font-size:9.5pt;opacity:.9;line-height:1.7}
table{width:100%;border-collapse:collapse}
.tbl td,.tbl th{padding:6px 8px;font-size:8.5pt;border-bottom:1px solid #E8ECF0;vertical-align:top}
.tbl th{font-weight:700;background:#F5F7FA;text-align:left;font-size:8pt}
.box{border:1px solid #E0E5EA;border-radius:6px;padding:10px 13px;margin:7px 0;font-size:9pt}
.q-item{background:#F5F7FA;border-left:3px solid #1B2733;padding:8px 12px;margin-bottom:7px;font-size:9pt;line-height:1.65}
.tension-card{border:1px solid #E0E5EA;border-radius:8px;padding:12px 14px;margin-bottom:10px;border-left:4px solid #C84B31}
.no-print-btn{display:block;text-align:center;margin:0 auto 20px;padding:11px 32px;background:#1B2733;color:#fff;border:none;border-radius:8px;font-size:12pt;font-family:inherit;cursor:pointer;font-weight:700}
.section{min-height:10px}
</style>
</head>
<body>
<div class="wrap">

<button class="no-print no-print-btn" onclick="document.fonts.ready.then(()=>window.print())">${L.savePdf}</button>

<!-- ═══════════════════════════════════ 표지 ═══ -->
<div class="section" style="text-align:center;padding:50px 0 40px">
  <div style="font-size:8.5pt;font-weight:700;letter-spacing:3px;color:#3E8E6E;margin-bottom:10px">INTEGRATED TALENT PROFILE</div>
  <h1 style="font-size:28pt;font-weight:900;line-height:1.25;margin-bottom:10px">${L.cover_title}</h1>
  <p style="font-size:11pt;color:#555;margin-bottom:28px">${L.cover_sub}</p>
  <table class="tbl" style="max-width:480px;margin:0 auto 20px">
    <tr><td style="width:32%;font-weight:700">${L.subject}</td><td>${name}${role?" / "+role:""}</td></tr>
    <tr><td style="font-weight:700">${L.purpose_lbl}</td><td>${purpose}</td></tr>
    <tr><td style="font-weight:700">${L.family_lbl}</td><td>${family}</td></tr>
    <tr><td style="font-weight:700">${L.date_lbl}</td><td>${today}</td></tr>
  </table>
  <p style="font-size:7.5pt;color:#999;max-width:480px;margin:0 auto">${L.disclaimer}</p>
</div>

<!-- ═══════════════════════════════════ S1: 하이라이트 ═══ -->
<div class="page-break section">
<h2>${L.sec1}</h2>

<div class="callout">
  <span class="tag">"${a.tagline||""}"</span>
  <span class="sub">${a.highlight_narrative||a.summary||""}</span>
</div>

<h3>${L.csDist}</h3>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
${csDomainBlocks}
</div>

<h3>${L.f5Profile}</h3>
<table style="margin-bottom:12px">${f5MainRows(["W","E","A","C","Em"])}</table>

<h3>${L.coreSignatures}</h3>
<table class="tbl">
  <tr><th style="width:22%">${L.sigLabel}</th><th style="width:39%">${L.sigCS}</th><th>${L.sigF5}</th></tr>
  ${(a.signatures||[]).map(s=>`<tr><td><b>${s.label}</b></td><td>${s.cs}</td><td>${s.f5}</td></tr>`).join("")}
</table>
</div>

<!-- ═══════════════════════════════════ S2: CS 분석 ═══ -->
<div class="page-break section">
<h2>${L.sec2}</h2>

<h3>${L.domainNarrative}</h3>
${narrativeBox("executing", a.cs_domain_narratives?.executing)}
${narrativeBox("influencing", a.cs_domain_narratives?.influencing)}
${narrativeBox("relationship", a.cs_domain_narratives?.relationship)}
${narrativeBox("strategic", a.cs_domain_narratives?.strategic)}

<h3 style="margin-top:14px">${L.themeDynamics}</h3>
<table class="tbl">
  <tr><th style="width:35%">${L.comboCol}</th><th>${L.hypothesisCol}</th></tr>
  ${(a.theme_dynamics||[]).map(td=>`<tr><td><b>${td.combo}</b></td><td>${td.hypothesis}</td></tr>`).join("")}
</table>
</div>

<!-- ═══════════════════════════════════ S3: 하위 테마 & 맹점 ═══ -->
<div class="page-break section">
<h2>${L.sec3}</h2>

<h3>${L.lowerThemes}</h3>
<table class="tbl" style="margin-bottom:6px">
  <tr><th style="width:20%">${L.themeNameCol}</th><th style="width:18%">${L.rankHintCol}</th><th>${L.implicationCol}</th></tr>
  ${(a.lower_themes_inferred||[]).map(lt=>`<tr><td><b>${lt.name}</b></td><td style="color:#888;font-size:8pt">${lt.rank_hint}</td><td>${lt.implication}</td></tr>`).join("")}
</table>
<p style="font-size:7.5pt;color:#999;margin-bottom:14px">${L.inferredNote}</p>

<h3>${L.blindSpots}</h3>
${(a.blind_spots||[]).map(bs=>`
  <div class="box" style="border-left:3px solid #C84B31;margin-bottom:8px">
    <b style="color:#C84B31;font-size:9.5pt">${bs.title}</b>
    <p style="font-size:9pt;margin-top:4px;line-height:1.7">${bs.desc}</p>
  </div>`).join("")}
</div>

<!-- ═══════════════════════════════════ S4: Facet5 ① W·E ═══ -->
<div class="page-break section">
<h2>${L.sec4}</h2>
${f5FactorBlock("W", a.f5_factor_analysis?.W)}
${f5FactorBlock("E", a.f5_factor_analysis?.E)}
</div>

<!-- ═══════════════════════════════════ S5: Facet5 ② A·C·Em ═══ -->
<div class="page-break section">
<h2>${L.sec5}</h2>
${f5FactorBlock("A", a.f5_factor_analysis?.A)}
${f5FactorBlock("C", a.f5_factor_analysis?.C)}
${f5FactorBlock("Em", a.f5_factor_analysis?.Em)}
<div class="box" style="margin-top:8px;border-top:2px solid ${F5C["Em"]}">
  <b>${L.familyNote}</b>
</div>
</div>

<!-- ═══════════════════════════════════ S6: 교차검증 ① 수렴 ═══ -->
<div class="page-break section">
<h2>${L.sec6}</h2>

<h3>${L.convergenceTable}</h3>
<table class="tbl" style="margin-bottom:14px">
  <tr><th style="width:22%">${L.convergenceTitle}</th><th style="width:39%">${L.csEvidenceCol}</th><th>${L.f5EvidenceCol}</th></tr>
  ${(a.convergence_signals||[]).map(cs=>`<tr><td><b>${cs.title}</b></td><td>${cs.cs_evidence}</td><td>${cs.f5_evidence}</td></tr>`).join("")}
</table>

<h3>${L.facilitatorNote}</h3>
<div class="box" style="border-left:3px solid #3E8E6E">
  <p style="font-size:9pt;line-height:1.75">${a.facilitator_note_convergence||""}</p>
</div>
</div>

<!-- ═══════════════════════════════════ S7: 교차검증 ② 긴장 ═══ -->
<div class="page-break section">
<h2>${L.sec7}</h2>
${(a.tension_points_detailed||a.tensions||[]).map((tp,i)=>`
  <div class="tension-card">
    <b style="font-size:10pt;color:#1B2733">${tp.title||tp.title}</b>
    <p style="font-size:9pt;line-height:1.75;margin:7px 0">${tp.desc||tp.desc||""}</p>
    <div style="background:#FFF5F3;border-radius:5px;padding:7px 10px;font-size:8.5pt">
      <b style="color:#C84B31">▸ ${L.verifyQ}:</b> ${tp.verify_q||""}
    </div>
  </div>`).join("")}
</div>

<!-- ═══════════════════════════════════ S8: 시너지 분석 ═══ -->
<div class="page-break section">
<h2>${L.sec8}</h2>

${a.operating_model ? `
<div class="callout" style="margin-bottom:14px">
  <span class="tag">${a.operating_model.name||""}</span>
  <span class="sub">${a.operating_model.narrative||""}</span>
</div>

<h3>${L.bestScenes}</h3>
<div style="margin-bottom:12px">
  ${(a.operating_model.best_scenes||[]).map(s=>`<div style="padding:6px 0 6px 14px;border-left:3px solid #3E8E6E;margin-bottom:6px;font-size:9pt;line-height:1.65">▸ ${s}</div>`).join("")}
</div>

<h3>${L.energizersDrainers}</h3>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
  <div class="box" style="border-top:3px solid #3E8E6E">
    <div style="font-weight:700;color:#3E8E6E;margin-bottom:7px;font-size:9pt">${L.energizers}</div>
    ${(a.operating_model.energizers||[]).map(e=>`<div style="font-size:8.5pt;padding:3px 0;border-bottom:1px solid #F0F2EE">• ${e}</div>`).join("")}
  </div>
  <div class="box" style="border-top:3px solid #C84B31">
    <div style="font-weight:700;color:#C84B31;margin-bottom:7px;font-size:9pt">${L.drainers}</div>
    ${(a.operating_model.drainers||[]).map(d=>`<div style="font-size:8.5pt;padding:3px 0;border-bottom:1px solid #F0F2EE">• ${d}</div>`).join("")}
  </div>
</div>

<h3>${L.partnerNote}</h3>
<div class="box" style="border-left:3px solid #3A66B0">
  <p style="font-size:9pt;line-height:1.75">${a.operating_model.partner_note||""}</p>
</div>` : ""}
</div>

<!-- ═══════════════════════════════════ S9: 디브리핑 가이드 ═══ -->
<div class="page-break section">
<h2>${L.sec9}</h2>

<h3>${L.debriefQ}</h3>
${(a.debrief_questions_detailed||[]).map((q,i)=>`
  <div class="q-item">
    <div style="display:flex;gap:8px;align-items:baseline">
      <span style="font-weight:900;color:#1B2733;font-size:10pt">Q${i+1}</span>
      <span>${q.q||q}</span>
    </div>
    ${q.context?`<div style="font-size:8pt;color:#888;margin-top:3px;margin-left:20px">${L.qContext}: ${q.context}</div>`:""}
  </div>`).join("")}

<h3 style="margin-top:14px">${L.sessionFlow}</h3>
<table class="tbl" style="margin-bottom:14px">
  <tr><th style="width:18%">${L.phaseCol}</th><th style="width:14%">${L.durationCol}</th><th>${L.contentCol}</th></tr>
  ${(a.session_flow||[]).map(sf=>`<tr><td><b>${sf.phase}</b></td><td style="color:#888">${sf.duration}</td><td>${sf.content}</td></tr>`).join("")}
</table>

<h3>${L.devExperiments}</h3>
${(a.development_experiments||[]).map((ex,i)=>`
  <div class="box" style="border-left:3px solid #3A66B0;margin-bottom:8px">
    <b style="color:#3A66B0;font-size:9.5pt">실험 ${i+1}: ${ex.title}</b>
    <p style="font-size:9pt;margin-top:5px;line-height:1.75">${ex.desc}</p>
  </div>`).join("")}

<div class="box" style="margin-top:16px;border-top:2px solid #1B2733;text-align:center">
  <p style="font-size:8pt;color:#888;line-height:1.8">${L.footerNote}<br>${L.credits}</p>
</div>
</div>

</div><!-- /wrap -->
</body>
</html>`;

  res.setHeader("Content-Type","application/json");
  return res.status(200).json({ ok:true, html });
}
