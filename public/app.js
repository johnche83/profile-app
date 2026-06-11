/* ── i18n ── */
let currentLang = sessionStorage.getItem("lang") || "ko";

const LANG = {
  ko: {
    step1: "1 기본 정보", step2: "2 진단 입력", step3: "3 분석 결과",
    heroTitle: "강점 × Facet5<br>통합 프로파일 도구",
    heroSub: "CliftonStrengths와 Facet5 두 진단을 교차 분석해<br>퍼실리테이터용 하이라이트 카드와 상세 PDF 리포트를 생성합니다.",
    start: "시작하기 →", noStore: "진단 데이터는 서버에 저장되지 않습니다.",
    step1Title: "대상자 기본 정보", nameLabel: "이름 또는 이니셜",
    namePh: "예: Sang-Wook K.", roleLabel: "역할 / 직무", rolePh: "예: HRBP · 팀장",
    purposeLabel: "세션 목적",
    purposeOpts: ["개인 디브리핑", "리더십 코칭", "팀 워크숍 준비", "온보딩 면담"],
    step1Next: "다음 — 진단 입력 →", nameRequired: "이름을 입력해주세요.",
    step2Title: "진단 데이터 입력",
    tabManual: "직접 입력 (슬라이드 선택)", tabUpload: "파일 업로드 (PDF/이미지)",
    csTitle: "CliftonStrengths Top 5–10", f5Title: "Facet5 스텐 점수 (1–10, 평균 5.5)",
    subSummary: "하위 요인 상세 입력 (선택 — PDF 품질 향상)",
    uploadTitle: "리포트 파일 업로드",
    uploadHint: "CliftonStrengths 리포트와 Facet5 리포트 PDF 또는 이미지를 올려주세요.<br>파일에서 점수와 테마를 자동으로 추출합니다.",
    csReportLabel: "CliftonStrengths 리포트", dropHint: "PDF 또는 이미지 드래그 · 클릭하여 선택",
    f5ReportLabel: "Facet5 리포트", parseBtn: "파일에서 점수 추출하기",
    extractedTitle: "추출된 데이터 확인",
    extractedHint: "추출 결과가 정확한지 확인 후 분석하세요. 수정이 필요하면 직접 입력 탭으로 전환하세요.",
    selectFile: "파일 선택", prevBtn: "← 이전", analyzeBtn: "분석 시작 →",
    editBtn: "← 입력 수정", pdfBtn: "상세 PDF 리포트 열기 ↗",
    pdfNote: "PDF 미리보기에서 저장 버튼 클릭 → 인쇄 대화상자에서 PDF로 저장",
    csMin: "CS 테마를 최소 5개 선택해주세요.",
    analyzingMsg: "두 진단을 교차 분석하는 중...", extractingMsg: "파일에서 점수를 추출하는 중...",
    noPdfAlert: "PDF 데이터가 없습니다. 다시 분석해주세요.",
    csDist: n => `CS 영역 분포 (Top ${n})`, f5Profile: "Facet5 프로파일",
    bestContext: "빛나는 장면", tensionsTitle: "탐색할 긴장 포인트",
    signaturesTitle: "핵심 시그니처", debriefQ: "디브리핑 탐색 질문",
    familyLabel: "패밀리", familyDetect: "판정 패밀리",
    domExecuting: "실행력", domInfluencing: "영향력", domRelationship: "대인관계", domStrategic: "전략적 사고",
    f5Will: "의지", f5Energy: "활력", f5Affection: "친화성", f5Control: "통제력", f5Emotionality: "정서",
    subfactorLabel: (name, ko) => `${name} ${ko} 하위 요인`,
    extractedCS: "CS Top 10:", extractedF5: "Facet5:",
    extractNotAvail: "추출 불가 — 직접 입력 탭 이용",
    extractErr: "추출 중 오류: ", analysisErr: "오류: ",
    analysisApiErr: "분석 오류", extractApiErr: "추출 실패",
  },
  en: {
    step1: "1 Basic Info", step2: "2 Input Data", step3: "3 Results",
    heroTitle: "Strengths × Facet5<br>Integrated Profile Tool",
    heroSub: "Cross-analyze CliftonStrengths and Facet5 diagnostics<br>to generate facilitator highlight cards and detailed PDF reports.",
    start: "Get Started →", noStore: "Diagnostic data is not stored on the server.",
    step1Title: "Basic Information", nameLabel: "Name or Initials",
    namePh: "e.g. Sang-Wook K.", roleLabel: "Role / Position", rolePh: "e.g. HRBP · Team Lead",
    purposeLabel: "Session Purpose",
    purposeOpts: ["Individual Debriefing", "Leadership Coaching", "Team Workshop Prep", "Onboarding Interview"],
    step1Next: "Next — Input Data →", nameRequired: "Please enter a name.",
    step2Title: "Input Diagnostic Data",
    tabManual: "Manual Input (Slide Selection)", tabUpload: "File Upload (PDF/Image)",
    csTitle: "CliftonStrengths Top 5–10", f5Title: "Facet5 Sten Score (1–10, avg 5.5)",
    subSummary: "Sub-factor Detail (Optional — improves PDF quality)",
    uploadTitle: "Upload Report Files",
    uploadHint: "Upload your CliftonStrengths and Facet5 report PDFs or images.<br>Scores and themes will be automatically extracted from the files.",
    csReportLabel: "CliftonStrengths Report", dropHint: "Drag PDF or image · Click to select",
    f5ReportLabel: "Facet5 Report", parseBtn: "Extract Scores from Files",
    extractedTitle: "Review Extracted Data",
    extractedHint: "Verify the extracted results before analyzing. If corrections are needed, switch to the manual input tab.",
    selectFile: "Select File", prevBtn: "← Back", analyzeBtn: "Run Analysis →",
    editBtn: "← Edit Input", pdfBtn: "Open Detailed PDF Report ↗",
    pdfNote: "Click Save in the PDF preview → Save as PDF in the print dialog",
    csMin: "Please select at least 5 CS themes.",
    analyzingMsg: "Cross-analyzing both diagnostics...", extractingMsg: "Extracting scores from files...",
    noPdfAlert: "No PDF data available. Please run analysis again.",
    csDist: n => `CS Domain Distribution (Top ${n})`, f5Profile: "Facet5 Profile",
    bestContext: "Shining Moments", tensionsTitle: "Tension Points to Explore",
    signaturesTitle: "Core Signatures", debriefQ: "Debrief Exploration Questions",
    familyLabel: "Family", familyDetect: "Detected Family",
    domExecuting: "Executing", domInfluencing: "Influencing", domRelationship: "Relationship", domStrategic: "Strategic Thinking",
    f5Will: "Will", f5Energy: "Energy", f5Affection: "Affection", f5Control: "Control", f5Emotionality: "Emotionality",
    subfactorLabel: (name) => `${name} Sub-factors`,
    extractedCS: "CS Top 10:", extractedF5: "Facet5:",
    extractNotAvail: "Not extractable — use manual input tab",
    extractErr: "Extraction error: ", analysisErr: "Error: ",
    analysisApiErr: "Analysis error", extractApiErr: "Extraction failed",
  }
};

function t(key, ...args) {
  const val = LANG[currentLang][key];
  if (typeof val === "function") return val(...args);
  return val ?? key;
}

function toggleLang() {
  setLang(currentLang === "ko" ? "en" : "ko");
}

function setLang(lang) {
  currentLang = lang;
  sessionStorage.setItem("lang", lang);
  applyLang();
}

function applyLang() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  const langBtn = document.getElementById("lang_btn");
  if (langBtn) langBtn.textContent = currentLang === "ko" ? "English" : "한국어";

  const sel = document.getElementById("p_purpose");
  if (sel) {
    const opts = t("purposeOpts");
    sel.innerHTML = opts.map(o => `<option>${o}</option>`).join("");
  }

  buildThemeGrid();
  buildF5Sliders();
  updateCS();
  renderFamily();
}

/* ── 데이터 정의 ── */
const DOMAINS = {
  executing:   { c:"#7B5EA7" },
  influencing: { c:"#D88C2A" },
  relationship:{ c:"#3B6EA8" },
  strategic:   { c:"#3E8E6E" }
};
const DOMAIN_LABEL = {
  executing:   () => t("domExecuting"),
  influencing: () => t("domInfluencing"),
  relationship:() => t("domRelationship"),
  strategic:   () => t("domStrategic"),
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
const FACTORS = [
  {k:"W", n:"Will",        ko:"의지",   c:"#2E9E5B", sub:"결단성·직면·독립성",      subEn:"Decisiveness·Confrontation·Independence"},
  {k:"E", n:"Energy",      ko:"활력",   c:"#C79A00", sub:"생동력·사교성·적응성",      subEn:"Vitality·Sociability·Adaptability"},
  {k:"A", n:"Affection",   ko:"친화성", c:"#DD3F3F", sub:"이타심·도움·신뢰",         subEn:"Altruism·Support·Trust"},
  {k:"C", n:"Control",     ko:"통제력", c:"#3A66B0", sub:"규율·책임감",               subEn:"Discipline·Responsibility"},
  {k:"Em",n:"Emotionality",ko:"정서",   c:"#A04070", sub:"긴장·이해도 (해석 요인)",   subEn:"Tension·Apprehension (interpretation factor)"}
];
const SUBFACTORS = [
  {k:"W1",pk:"W",n:"결의",en:"Determination"},{k:"W2",pk:"W",n:"정면대응",en:"Confrontation"},{k:"W3",pk:"W",n:"독립심",en:"Independence"},
  {k:"E1",pk:"E",n:"생동력",en:"Vitality"},{k:"E2",pk:"E",n:"사교성",en:"Sociability"},{k:"E3",pk:"E",n:"적응성",en:"Adaptability"},
  {k:"A1",pk:"A",n:"이타심",en:"Altruism"},{k:"A2",pk:"A",n:"도움",en:"Support"},{k:"A3",pk:"A",n:"신뢰",en:"Trust"},
  {k:"C1",pk:"C",n:"규율",en:"Discipline"},{k:"C2",pk:"C",n:"책임감",en:"Responsibility"},
  {k:"Em1",pk:"Em",n:"긴장",en:"Tension"},{k:"Em2",pk:"Em",n:"이해도",en:"Apprehension"}
];
const FAMILIES = [
  {n:"Promoter",ko:"프로모터",p:[7.5,7.5,3.5,3.5]},
  {n:"Entrepreneur",ko:"앙트러프러너",p:[7.5,7.5,3.5,7.5]},
  {n:"Advocate",ko:"애드보킷",p:[7.5,7.5,7.5,3.5]},
  {n:"Generalist",ko:"제너럴리스트",p:[7.5,7.5,7.5,7.5]},
  {n:"Architect",ko:"건축가",p:[7.5,3.5,3.5,3.5]},
  {n:"Producer",ko:"프로듀서",p:[7.5,3.5,3.5,7.5]},
  {n:"Idealist",ko:"아이디얼리스트",p:[7.5,3.5,7.5,3.5]},
  {n:"Traditionalist",ko:"전통주의자",p:[7.5,3.5,7.5,7.5]},
  {n:"Presenter",ko:"진행자",p:[3.5,7.5,3.5,7.5]},
  {n:"Explorer",ko:"탐험가",p:[3.5,7.5,3.5,3.5]},
  {n:"Developer",ko:"개발자",p:[3.5,7.5,7.5,7.5]},
  {n:"Facilitator",ko:"조력자",p:[3.5,7.5,7.5,3.5]},
  {n:"Controller",ko:"통제자",p:[3.5,3.5,3.5,7.5]},
  {n:"Specialist",ko:"전문가",p:[3.5,3.5,3.5,3.5]},
  {n:"Coach",ko:"지도",p:[3.5,3.5,7.5,7.5]},
  {n:"Supporter",ko:"지지자",p:[3.5,3.5,7.5,3.5]},
  {n:"Chameleon",ko:"카멜레온",p:[5.5,5.5,5.5,5.5]}
];

/* ── 앱 상태 ── */
let top10 = [];
const sten = {W:5.5,E:5.5,A:5.5,C:5.5,Em:5.5};
const substen = {W1:5.5,W2:5.5,W3:5.5,E1:5.5,E2:5.5,E3:5.5,A1:5.5,A2:5.5,A3:5.5,C1:5.5,C2:5.5,Em1:5.5,Em2:5.5};
let files = {cs:null, f5:null};
let lastAnalysis = null;
let lastPdfHtml = null;
let lastPayload = null;
let currentTab = "manual";

const API_BASE = "";

/* ── 페이지 전환 ── */
function goPage(n) {
  document.querySelectorAll(".page").forEach((p,i) => p.classList.toggle("active", i+1===n || (n===0&&i===0)));
  const pw = document.getElementById("prog_wrap");
  pw.style.display = n > 0 ? "flex" : "none";
  for(let i=1;i<=3;i++){
    const ps = document.getElementById("ps"+i);
    if(ps) { ps.classList.toggle("active", i===n); }
  }
  window.scrollTo(0,0);
}

/* ── Step 1 ── */
function step1Next() {
  const name = document.getElementById("p_name").value.trim();
  if(!name){ document.getElementById("err1").textContent = t("nameRequired"); return; }
  document.getElementById("err1").textContent="";
  goPage(3);
}

/* ── 탭 전환 ── */
function switchTab(tab) {
  currentTab = tab;
  document.getElementById("tab_manual").classList.toggle("active", tab==="manual");
  document.getElementById("tab_upload").classList.toggle("active", tab==="upload");
  document.getElementById("panel_manual").style.display = tab==="manual" ? "block" : "none";
  document.getElementById("panel_upload").style.display = tab==="upload" ? "block" : "none";
}

/* ── 드래그&드롭 ── */
function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }
function dragLeave(e) { e.currentTarget.classList.remove("drag-over"); }
function dropFile(e, type) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if(file) handleFile(file, type);
}
function fileSelect(e, type) {
  const file = e.target.files[0];
  if(file) handleFile(file, type);
}
function handleFile(file, type) {
  files[type] = file;
  const ds = document.getElementById("ds_"+type);
  const zone = document.getElementById("drop_"+type);
  ds.textContent = "✓ " + file.name;
  zone.classList.add("loaded");
  updateParseBtn();
}
function updateParseBtn() {
  const btn = document.getElementById("parse_btn");
  btn.disabled = !(files.cs || files.f5);
}

/* ── 파일에서 점수 추출 ── */
async function parseFiles() {
  if(!files.cs && !files.f5) return;
  showLoading(t("extractingMsg"));
  document.getElementById("parse_err").textContent = "";
  try {
    const fileContents = [];
    for(const [type, file] of Object.entries(files)) {
      if(!file) continue;
      const b64 = await fileToBase64(file);
      const mediaType = file.type || "application/pdf";
      fileContents.push({
        type: file.type.startsWith("image") ? "image" : "document",
        source: { type:"base64", media_type: mediaType, data: b64 },
        label: type === "cs" ? "CliftonStrengths Report" : "Facet5 Report"
      });
    }

    const contentArr = fileContents.map(f => ({ type: f.type, source: f.source }));
    contentArr.push({
      type: "text",
      text: `These files are ${fileContents.map(f=>f.label).join(" and ")}. Extract only the following JSON. No markdown.
{
  "cs_top10": ["theme English names in order, e.g.: Context, Ideation, ..."],
  "sten": {"W":number,"E":number,"A":number,"C":number,"Em":number},
  "substen": {"W1":number,"W2":number,"W3":number,"E1":number,"E2":number,"E3":number,"A1":number,"A2":number,"A3":number,"C1":number,"C2":number,"Em1":number,"Em2":number},
  "confidence": "high|medium|low"
}
Set 5.5 for any score not found. cs_top10 should be empty array if not found.`
    });

    const resp = await fetch(API_BASE + "/api/parse-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: contentArr })
    });
    const data = await resp.json();
    if(!data.ok) throw new Error(data.error || t("extractApiErr"));

    const r = data.result;
    if(r.cs_top10 && r.cs_top10.length > 0) {
      top10 = r.cs_top10.filter(en => THEMES.find(x=>x.en===en)).slice(0,10);
      updateCS();
    }
    Object.assign(sten, r.sten || {});
    Object.assign(substen, r.substen || {});
    syncSlidersFromState();
    renderFamily();
    showExtracted(r);
  } catch(e) {
    document.getElementById("parse_err").textContent = t("extractErr") + e.message;
  } finally { hideLoading(); }
}

function fileToBase64(file) {
  return new Promise((res,rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(",")[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function syncSlidersFromState() {
  FACTORS.forEach(f => {
    const el = document.getElementById("ms_"+f.k);
    if(el){ el.value = sten[f.k]; document.getElementById("mv_"+f.k).textContent = parseFloat(sten[f.k]).toFixed(1); }
  });
  SUBFACTORS.forEach(s => {
    const el = document.getElementById("ss_"+s.k);
    if(el){ el.value = substen[s.k]; document.getElementById("sv_"+s.k).textContent = parseFloat(substen[s.k]).toFixed(1); }
  });
}

function showExtracted(r) {
  const prev = document.getElementById("extracted_preview");
  prev.style.display = "block";
  document.getElementById("extracted_cs").innerHTML =
    `<b>${t("extractedCS")}</b> ` + (r.cs_top10 && r.cs_top10.length ? r.cs_top10.map((en,i)=>`${i+1}.${en}`).join(", ") : t("extractNotAvail"));
  document.getElementById("extracted_f5").innerHTML =
    `<b>${t("extractedF5")}</b> ` +
    Object.entries(r.sten||{}).map(([k,v])=>`${k}:${parseFloat(v).toFixed(1)}`).join(" · ");
}

/* ── CS 선택 ── */
function themeLabel(th) { return currentLang === "en" ? th.en : th.ko; }

function toggleTheme(en) {
  if(top10.includes(en)) { top10 = top10.filter(x=>x!==en); }
  else { if(top10.length>=10) return; top10.push(en); }
  updateCS();
}
function updateCS() {
  const cnt = document.getElementById("cs_cnt");
  cnt.textContent = top10.length + " / 10";
  cnt.className = "cnt" + (top10.length>=5 ? " ready" : "");
  const chips = document.getElementById("cs_chips");
  chips.innerHTML = "";
  top10.forEach((en,i) => {
    const th = THEMES.find(x=>x.en===en);
    if(!th) return;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.style.background = DOMAINS[th.d].c;
    chip.innerHTML = `<span style="opacity:.65;font-size:11px">${i+1}</span>${themeLabel(th)}<span style="opacity:.6;margin-left:2px">✕</span>`;
    chip.onclick = () => toggleTheme(en);
    chips.appendChild(chip);
  });
  THEMES.forEach(th => {
    const btn = document.getElementById("tb_"+th.en);
    if(!btn) return;
    const sel = top10.includes(th.en);
    btn.className = "tbtn" + (sel?" sel":"");
    btn.style.background = sel ? DOMAINS[th.d].c : "";
    btn.disabled = !sel && top10.length>=10;
  });
}

/* ── 패밀리 판정 ── */
function detectFamily() {
  const {W:w,E:e,A:a,C:c} = sten;
  return FAMILIES.map(f=>({...f,dsq:(w-f.p[0])**2+(e-f.p[1])**2+(a-f.p[2])**2+(c-f.p[3])**2})).sort((x,y)=>x.dsq-y.dsq)[0];
}
function familyName(f) { return currentLang === "en" ? f.n : f.ko; }

function renderFamily() {
  const f = detectFamily();
  document.getElementById("fam_box").innerHTML =
    `<span style="font-size:12px;color:#6B7A6E">${t("familyDetect")}</span>  <b style="font-size:16px">${familyName(f)}</b>  <span style="font-size:12px;color:#8A9388">${f.n}</span>`;
}

/* ── 분석 실행 ── */
async function runAnalysis() {
  document.getElementById("err2").textContent = "";
  if(top10.length < 5) {
    document.getElementById("err2").textContent = t("csMin");
    return;
  }
  showLoading(t("analyzingMsg"));
  const family = detectFamily();
  const payload = {
    name: document.getElementById("p_name").value,
    role: document.getElementById("p_role").value,
    purpose: document.getElementById("p_purpose").value,
    top10, sten: {...sten}, substen: {...substen},
    family: family.ko,
    lang: currentLang
  };
  try {
    const r = await fetch(API_BASE + "/api/analyze", {
      method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)
    });
    const data = await r.json();
    if(!data.ok) throw new Error(data.error || t("analysisApiErr"));
    lastAnalysis = data.result;
    lastPayload = payload;
    renderHighlight(data.result, payload, family);
    goPage(4);
  } catch(e) {
    document.getElementById("err2").textContent = t("analysisErr") + e.message;
  } finally { hideLoading(); }
}

/* ── 하이라이트 렌더링 ── */
function renderHighlight(r, payload, family) {
  const cnt = {executing:0,influencing:0,relationship:0,strategic:0};
  top10.forEach(en => { const th=THEMES.find(x=>x.en===en); if(th) cnt[th.d]++; });
  const F5C = {W:"#2E9E5B",E:"#C79A00",A:"#DD3F3F",C:"#3A66B0",Em:"#A04070"};
  const F5N = () => ({W:t("f5Will"),E:t("f5Energy"),A:t("f5Affection"),C:t("f5Control"),Em:t("f5Emotionality")});

  const barHtml = (val, color) => {
    const pct = Math.round(parseFloat(val)*10);
    return `<div class="bar-wrap">
      <div class="bar-mid-line"></div>
      <div class="bar-fill" style="width:${pct}%;background:${color}35"></div>
      <div class="bar-dot" style="left:calc(${pct}% - 7px);background:${color}"></div>
    </div>`;
  };

  const f5Names = F5N();
  document.getElementById("result_area").innerHTML = `
<div class="hl-tagline-box">
  <div class="hl-tagline">${r.tagline||""}</div>
  <div class="hl-summary">${r.summary||""}</div>
  <div style="margin-top:8px;font-size:12px;opacity:.7">${payload.name}${payload.role?" · "+payload.role:""} · ${t("familyLabel")}: ${familyName(family)}</div>
</div>

<div class="hl-grid">
  <div class="hl-card">
    <div class="hl-card-title" style="color:#3E8E6E">${t("csDist", top10.length)}</div>
    <div class="dom-grid">
      ${["strategic","relationship","influencing","executing"].map(dk=>`
        <div class="dom-cell" style="background:${cnt[dk]>0?DOMAINS[dk].c+"18":"#F5F7FA"};border:1px solid ${cnt[dk]>0?DOMAINS[dk].c+"50":"#E3E7E0"}">
          <div class="dom-num" style="color:${cnt[dk]>0?DOMAINS[dk].c:"#CCC"}">${cnt[dk]}</div>
          <div class="dom-lbl" style="color:${cnt[dk]>0?DOMAINS[dk].c:"#AAA"}">${DOMAIN_LABEL[dk]()}</div>
        </div>`).join("")}
    </div>
    <p style="font-size:11px;color:#8A9388;margin-top:6px">${r.dominant_reason||""}</p>
  </div>
  <div class="hl-card">
    <div class="hl-card-title" style="color:#3A66B0">${t("f5Profile")}</div>
    ${Object.entries(sten).map(([k,v])=>`
      <div style="margin-bottom:7px">
        <div style="display:flex;justify-content:space-between;font-size:12px">
          <span><span style="color:${F5C[k]}">●</span> ${f5Names[k]}</span>
          <b style="color:${F5C[k]}">${parseFloat(v).toFixed(1)}</b>
        </div>
        ${barHtml(v, F5C[k])}
      </div>`).join("")}
  </div>
</div>

<div class="hl-grid">
  <div class="hl-card" style="border-top:3px solid #3E8E6E;border-radius:0 0 10px 10px">
    <div class="hl-card-title" style="color:#3E8E6E">${t("bestContext")}</div>
    <div style="font-size:13px;line-height:1.7">${(r.best_context||"").split(",").map(x=>`• ${x.trim()}`).join("<br>")}</div>
  </div>
  <div class="hl-card" style="border-top:3px solid #C84B31;border-radius:0 0 10px 10px">
    <div class="hl-card-title" style="color:#C84B31">${t("tensionsTitle")}</div>
    ${(r.tensions||[]).map(ten=>`<div class="tension-item"><div class="tension-title">${ten.title}</div><div class="tension-desc">${ten.desc}</div></div>`).join("")}
  </div>
</div>

<div class="hl-card" style="border-top:3px solid #7B5EA7;border-radius:0 0 10px 10px;margin-bottom:12px">
  <div class="hl-card-title" style="color:#7B5EA7">${t("signaturesTitle")}</div>
  <div class="sig-grid">
    ${(r.signatures||[]).map(s=>`
      <div class="sig-row">
        <div style="font-weight:600">${s.label}</div>
        <div><div style="font-size:11.5px;color:#5B6A5E">CS: ${s.cs}</div><div style="font-size:11.5px;color:#5B6A5E">F5: ${s.f5}</div></div>
      </div>`).join("")}
  </div>
</div>

<div class="hl-card">
  <div class="hl-card-title">${t("debriefQ")}</div>
  ${(r.debrief_questions||[]).map((q,i)=>`<div class="q-item"><b>Q${i+1}.</b> ${q}</div>`).join("")}
</div>`;
}

/* ── PDF 열기 (오버레이 방식 — Safari 백지 버그 우회) ── */
async function openPdf() {
  saveSession();
  if (!lastAnalysis || !lastPayload) { alert(t("noPdfAlert")); return; }

  showLoading(currentLang === "ko" ? "PDF 준비 중..." : "Preparing PDF...");
  try {
    const pr = await fetch(API_BASE + "/api/generate-pdf", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lastPayload, analysis: lastAnalysis, lang: currentLang })
    });
    const pd = await pr.json();
    if (pd.ok) lastPdfHtml = pd.html;
  } catch(e) { /* 캐시된 버전 사용 */ }
  finally { hideLoading(); }

  if (!lastPdfHtml) { alert(t("noPdfAlert")); return; }

  closePdfOverlay();

  const parser = new DOMParser();
  const pdfDoc = parser.parseFromString(lastPdfHtml, "text/html");
  const pdfStyle = pdfDoc.querySelector("style")?.textContent || "";
  const wrapEl = pdfDoc.querySelector(".wrap");
  const pdfContent = wrapEl ? wrapEl.innerHTML : pdfDoc.body.innerHTML;

  const styleEl = document.createElement("style");
  styleEl.id = "pdf-overlay-style";
  styleEl.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
    #pdf-overlay{position:fixed;inset:0;z-index:9000;background:#525659;display:flex;flex-direction:column;overflow:hidden}
    #pdf-overlay-bar{background:#323639;padding:10px 20px;display:flex;align-items:center;gap:10px;flex-shrink:0}
    #pdf-overlay-scroll{flex:1;overflow-y:auto;padding:20px}
    #pdf-overlay-body{max-width:800px;margin:0 auto;background:#fff;border-radius:6px;padding:28px;
      font-family:'Noto Sans KR',sans-serif;font-size:10pt;line-height:1.65;color:#222}
    #pdf-overlay-body .no-print-btn{display:none!important}
    #pdf-overlay-body h2{font-size:14pt;font-weight:900;border-bottom:2px solid #1B2733;padding-bottom:5px;margin:20px 0 12px}
    #pdf-overlay-body h3{font-size:10.5pt;font-weight:700;margin:12px 0 5px}
    #pdf-overlay-body .callout{background:#1B2733;color:#fff;border-radius:8px;padding:12px 16px;margin:10px 0}
    #pdf-overlay-body .callout b{color:#9FE1CB}
    #pdf-overlay-body table{width:100%;border-collapse:collapse}
    #pdf-overlay-body .tbl td,#pdf-overlay-body .tbl th{padding:6px 8px;font-size:9pt;border-bottom:1px solid #E8ECF0;vertical-align:top}
    #pdf-overlay-body .tbl th{font-weight:700;background:#F5F7FA;text-align:left}
    #pdf-overlay-body .box{border:1px solid #E0E5EA;border-radius:6px;padding:10px 13px;margin:7px 0}
    #pdf-overlay-body .sig-row{display:grid;grid-template-columns:130px 1fr;gap:10px;padding:7px 0;border-bottom:1px solid #EEF0F3;font-size:9.5pt}
    #pdf-overlay-body .q{background:#F5F7FA;border-left:3px solid #1B2733;padding:7px 11px;margin-bottom:6px;font-size:9pt}
    #pdf-overlay-body .tag{display:inline-block;border-radius:10px;padding:2px 9px;font-size:8pt;font-weight:700;color:#fff;margin-right:4px}
    @media print{
      #pdf-overlay-bar{display:none!important}
      body>*:not(#pdf-overlay){display:none!important}
      #pdf-overlay{position:static!important;overflow:visible!important;background:white!important}
      #pdf-overlay-scroll{overflow:visible!important;padding:0!important}
      #pdf-overlay-body{border-radius:0!important;box-shadow:none!important}
      *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
      @page{size:A4;margin:15mm 14mm 18mm}
      .page-break{page-break-before:always}
    }
  `;
  document.head.appendChild(styleEl);

  const btnLabel = currentLang === "ko" ? "📄 PDF로 저장 (인쇄 → PDF)" : "📄 Save as PDF (Print → PDF)";
  const closeLabel = currentLang === "ko" ? "✕ 닫기" : "✕ Close";
  const overlay = document.createElement("div");
  overlay.id = "pdf-overlay";
  overlay.innerHTML = `
    <div id="pdf-overlay-bar">
      <button onclick="printPdf()" style="padding:8px 20px;background:#3E8E6E;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-family:inherit">${btnLabel}</button>
      <button onclick="closePdfOverlay()" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-family:inherit">${closeLabel}</button>
    </div>
    <div id="pdf-overlay-scroll">
      <div id="pdf-overlay-body">${pdfContent}</div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function printPdf() {
  document.fonts.ready.then(() => window.print());
}

function closePdfOverlay() {
  document.getElementById("pdf-overlay")?.remove();
  document.getElementById("pdf-overlay-style")?.remove();
}

/* ── 로딩 ── */
function showLoading(msg) {
  let ov = document.getElementById("loading");
  if(!ov) {
    ov = document.createElement("div");
    ov.id = "loading";
    ov.innerHTML = `<div class="spinner"></div><div class="loading-msg" id="loading_msg"></div>`;
    document.body.appendChild(ov);
  }
  document.getElementById("loading_msg").textContent = msg;
  ov.className = "show";
  ov.style.cssText = "display:flex;position:fixed;inset:0;background:rgba(27,39,51,.6);z-index:999;align-items:center;justify-content:center;flex-direction:column;gap:14px;";
}
function hideLoading() {
  const ov = document.getElementById("loading");
  if(ov) ov.style.display = "none";
}

/* ── 초기화 ── */
function buildThemeGrid() {
  const g = document.getElementById("theme_grid");
  if(!g) return;
  g.innerHTML = "";
  Object.entries(DOMAINS).forEach(([dk, dv]) => {
    const lbl = document.createElement("div");
    lbl.className = "domain-label";
    lbl.style.color = dv.c;
    lbl.textContent = DOMAIN_LABEL[dk]();
    g.appendChild(lbl);
    const row = document.createElement("div");
    row.className = "theme-row";
    THEMES.filter(th=>th.d===dk).forEach(th => {
      const btn = document.createElement("button");
      btn.className = "tbtn"; btn.id = "tb_"+th.en; btn.textContent = themeLabel(th);
      btn.onclick = () => toggleTheme(th.en);
      row.appendChild(btn);
    });
    g.appendChild(row);
  });
}

function buildF5Sliders() {
  const main = document.getElementById("f5_main");
  if(!main) return;
  main.innerHTML = "";
  FACTORS.forEach(f => {
    const subLabel = currentLang === "en" ? f.subEn : f.sub;
    const koLabel = currentLang === "en" ? "" : f.ko;
    const row = document.createElement("div");
    row.className = "srow";
    row.innerHTML = `
      <div class="srow-label">
        <div class="fname"><span style="color:${f.c}">●</span> ${f.n}${koLabel ? ` <span style="color:#8A9388;font-weight:400">${koLabel}</span>` : ""}</div>
        <div class="fsub">${subLabel}</div>
      </div>
      <input type="range" min="1" max="10" step="0.1" value="${sten[f.k]}" id="ms_${f.k}" style="accent-color:${f.c}">
      <div class="sval" id="mv_${f.k}" style="color:${f.c}">${sten[f.k].toFixed(1)}</div>`;
    main.appendChild(row);
    row.querySelector("input").addEventListener("input", e => {
      sten[f.k] = parseFloat(e.target.value);
      document.getElementById("mv_"+f.k).textContent = sten[f.k].toFixed(1);
      renderFamily();
    });
  });

  const sub = document.getElementById("f5_sub");
  if(!sub) return;
  sub.innerHTML = "";
  FACTORS.forEach(f => {
    const grp = SUBFACTORS.filter(s=>s.pk===f.k);
    if(!grp.length) return;
    const lbl = document.createElement("div");
    lbl.className = "domain-label";
    lbl.style.color = f.c;
    lbl.textContent = currentLang === "en" ? t("subfactorLabel", f.n) : t("subfactorLabel", f.n, f.ko);
    sub.appendChild(lbl);
    grp.forEach(s => {
      const row = document.createElement("div");
      row.className = "srow";
      const sfName = currentLang === "en" ? s.en : `${s.n} <span style="font-size:11px;opacity:.6">${s.en}</span>`;
      row.innerHTML = `
        <div class="srow-label">
          <div style="font-size:12.5px;color:#6B7A6E">${sfName}</div>
        </div>
        <input type="range" min="1" max="10" step="0.1" value="${substen[s.k]}" id="ss_${s.k}" style="accent-color:${f.c}">
        <div class="sval" id="sv_${s.k}" style="color:${f.c};font-size:13px">${substen[s.k].toFixed(1)}</div>`;
      sub.appendChild(row);
      row.querySelector("input").addEventListener("input", e => {
        substen[s.k] = parseFloat(e.target.value);
        document.getElementById("sv_"+s.k).textContent = substen[s.k].toFixed(1);
      });
    });
  });
}

/* ── 세션 복원 ── */
function saveSession() {
  sessionStorage.setItem("lastAnalysis", JSON.stringify(lastAnalysis));
  sessionStorage.setItem("lastPdfHtml", lastPdfHtml || "");
  sessionStorage.setItem("payload", JSON.stringify({
    name: document.getElementById("p_name")?.value || "",
    role: document.getElementById("p_role")?.value || ""
  }));
}
function restoreSession() {
  const a = sessionStorage.getItem("lastAnalysis");
  const h = sessionStorage.getItem("lastPdfHtml");
  if(a && h) {
    lastAnalysis = JSON.parse(a);
    lastPdfHtml = h;
    const p = JSON.parse(sessionStorage.getItem("payload") || "{}");
    const family = detectFamily();
    renderHighlight(lastAnalysis, p, family);
    goPage(4);
  }
}

/* ── 초기 실행 ── */
applyLang();
restoreSession();
