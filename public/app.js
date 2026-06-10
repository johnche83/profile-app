/* ── 데이터 정의 ── */
const DOMAINS = {
  executing:  { l:"실행력",     c:"#7B5EA7" },
  influencing:{ l:"영향력",     c:"#D88C2A" },
  relationship:{ l:"대인관계",  c:"#3B6EA8" },
  strategic:  { l:"전략적 사고",c:"#3E8E6E" }
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
  {k:"W", n:"Will",         ko:"의지",   c:"#2E9E5B", sub:"결단성·직면·독립성"},
  {k:"E", n:"Energy",       ko:"활력",   c:"#C79A00", sub:"생동력·사교성·적응성"},
  {k:"A", n:"Affection",    ko:"친화성", c:"#DD3F3F", sub:"이타심·도움·신뢰"},
  {k:"C", n:"Control",      ko:"통제력", c:"#3A66B0", sub:"규율·책임감"},
  {k:"Em",n:"Emotionality", ko:"정서",   c:"#A04070", sub:"긴장·이해도 (해석 요인)"}
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
let currentTab = "manual";

// API 엔드포인트 — 개발 시 localhost, 배포 후 자동으로 /api/* 경로 사용
const API_BASE = "";  // Vercel에서는 같은 origin이므로 비워둡니다

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
  if(!name){ document.getElementById("err1").textContent="이름을 입력해주세요."; return; }
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

/* ── 파일에서 점수 추출 (Claude Vision API) ── */
async function parseFiles() {
  if(!files.cs && !files.f5) return;
  showLoading("파일에서 점수를 추출하는 중...");
  document.getElementById("parse_err").textContent = "";
  try {
    const messages = [];
    const fileContents = [];

    for(const [type, file] of Object.entries(files)) {
      if(!file) continue;
      const b64 = await fileToBase64(file);
      const mediaType = file.type || "application/pdf";
      fileContents.push({
        type: file.type.startsWith("image") ? "image" : "document",
        source: { type:"base64", media_type: mediaType, data: b64 },
        label: type === "cs" ? "CliftonStrengths 리포트" : "Facet5 리포트"
      });
    }

    const contentArr = fileContents.map(f => ({
      type: f.type,
      source: f.source
    }));
    contentArr.push({
      type: "text",
      text: `위 파일들은 ${fileContents.map(f=>f.label).join("과 ")}입니다. 아래 JSON 형식으로만 추출하세요. 마크다운 없이.
{
  "cs_top10": ["테마 영어 이름 순서대로, 예: Context, Ideation, ..."],
  "sten": {"W":숫자,"E":숫자,"A":숫자,"C":숫자,"Em":숫자},
  "substen": {"W1":숫자,"W2":숫자,"W3":숫자,"E1":숫자,"E2":숫자,"E3":숫자,"A1":숫자,"A2":숫자,"A3":숫자,"C1":숫자,"C2":숫자,"Em1":숫자,"Em2":숫자},
  "confidence": "high|medium|low"
}
점수를 찾을 수 없는 항목은 5.5로 설정. cs_top10은 찾을 수 없으면 빈 배열.`
    });

    const resp = await fetch(API_BASE + "/api/parse-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: contentArr })
    });
    const data = await resp.json();
    if(!data.ok) throw new Error(data.error || "추출 실패");

    const r = data.result;
    // 추출 결과를 UI에 반영
    if(r.cs_top10 && r.cs_top10.length > 0) {
      top10 = r.cs_top10.filter(en => THEMES.find(t=>t.en===en)).slice(0,10);
      updateCS();
    }
    Object.assign(sten, r.sten || {});
    Object.assign(substen, r.substen || {});
    syncSlidersFromState();
    renderFamily();
    showExtracted(r);
  } catch(e) {
    document.getElementById("parse_err").textContent = "추출 중 오류: " + e.message;
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
    "<b>CS Top 10:</b> " + (r.cs_top10 && r.cs_top10.length ? r.cs_top10.map((en,i)=>`${i+1}.${en}`).join(", ") : "추출 불가 — 직접 입력 탭 이용");
  document.getElementById("extracted_f5").innerHTML =
    "<b>Facet5:</b> " +
    Object.entries(r.sten||{}).map(([k,v])=>`${k}:${parseFloat(v).toFixed(1)}`).join(" · ");
}

/* ── CS 선택 ── */
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
    const t = THEMES.find(x=>x.en===en);
    if(!t) return;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.style.background = DOMAINS[t.d].c;
    chip.innerHTML = `<span style="opacity:.65;font-size:11px">${i+1}</span>${t.ko}<span style="opacity:.6;margin-left:2px">✕</span>`;
    chip.onclick = () => toggleTheme(en);
    chips.appendChild(chip);
  });
  THEMES.forEach(t => {
    const btn = document.getElementById("tb_"+t.en);
    if(!btn) return;
    const sel = top10.includes(t.en);
    btn.className = "tbtn" + (sel?" sel":"");
    btn.style.background = sel ? DOMAINS[t.d].c : "";
    btn.disabled = !sel && top10.length>=10;
  });
}

/* ── 패밀리 판정 ── */
function detectFamily() {
  const {W:w,E:e,A:a,C:c} = sten;
  return FAMILIES.map(f=>({...f,dsq:(w-f.p[0])**2+(e-f.p[1])**2+(a-f.p[2])**2+(c-f.p[3])**2})).sort((x,y)=>x.dsq-y.dsq)[0];
}
function renderFamily() {
  const f = detectFamily();
  document.getElementById("fam_box").innerHTML =
    `<span style="font-size:12px;color:#6B7A6E">판정 패밀리</span>  <b style="font-size:16px">${f.ko}</b>  <span style="font-size:12px;color:#8A9388">${f.n}</span>`;
}

/* ── 분석 실행 ── */
async function runAnalysis() {
  document.getElementById("err2").textContent = "";
  if(top10.length < 5) {
    document.getElementById("err2").textContent = "CS 테마를 최소 5개 선택해주세요.";
    return;
  }
  showLoading("두 진단을 교차 분석하는 중...");
  const family = detectFamily();
  const payload = {
    name: document.getElementById("p_name").value,
    role: document.getElementById("p_role").value,
    purpose: document.getElementById("p_purpose").value,
    top10, sten: {...sten}, substen: {...substen},
    family: family.ko
  };
  try {
    const r = await fetch(API_BASE + "/api/analyze", {
      method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)
    });
    const data = await r.json();
    if(!data.ok) throw new Error(data.error || "분석 오류");
    lastAnalysis = data.result;
    renderHighlight(data.result, payload, family);

    // PDF HTML도 미리 생성
    const pr = await fetch(API_BASE + "/api/generate-pdf", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({...payload, analysis: data.result})
    });
    const pd = await pr.json();
    if(pd.ok) lastPdfHtml = pd.html;

    goPage(4);
  } catch(e) {
    document.getElementById("err2").textContent = "오류: " + e.message;
  } finally { hideLoading(); }
}

/* ── 하이라이트 렌더링 ── */
function renderHighlight(r, payload, family) {
  const cnt = {executing:0,influencing:0,relationship:0,strategic:0};
  top10.forEach(en => { const t=THEMES.find(x=>x.en===en); if(t) cnt[t.d]++; });
  const F5C = {W:"#2E9E5B",E:"#C79A00",A:"#DD3F3F",C:"#3A66B0",Em:"#A04070"};
  const F5N = {W:"의지",E:"활력",A:"친화성",C:"통제력",Em:"정서"};

  const barHtml = (val, color) => {
    const pct = Math.round(parseFloat(val)*10);
    return `<div class="bar-wrap">
      <div class="bar-mid-line"></div>
      <div class="bar-fill" style="width:${pct}%;background:${color}35"></div>
      <div class="bar-dot" style="left:calc(${pct}% - 7px);background:${color}"></div>
    </div>`;
  };

  document.getElementById("result_area").innerHTML = `
<div class="hl-tagline-box">
  <div class="hl-tagline">${r.tagline||""}</div>
  <div class="hl-summary">${r.summary||""}</div>
  <div style="margin-top:8px;font-size:12px;opacity:.7">${payload.name}${payload.role?" · "+payload.role:""} · 패밀리: ${family.ko}</div>
</div>

<div class="hl-grid">
  <div class="hl-card">
    <div class="hl-card-title" style="color:#3E8E6E">CS 영역 분포 (Top ${top10.length})</div>
    <div class="dom-grid">
      ${["strategic","relationship","influencing","executing"].map(dk=>`
        <div class="dom-cell" style="background:${cnt[dk]>0?DOMAINS[dk].c+"18":"#F5F7FA"};border:1px solid ${cnt[dk]>0?DOMAINS[dk].c+"50":"#E3E7E0"}">
          <div class="dom-num" style="color:${cnt[dk]>0?DOMAINS[dk].c:"#CCC"}">${cnt[dk]}</div>
          <div class="dom-lbl" style="color:${cnt[dk]>0?DOMAINS[dk].c:"#AAA"}">${DOMAINS[dk].l}</div>
        </div>`).join("")}
    </div>
    <p style="font-size:11px;color:#8A9388;margin-top:6px">${r.dominant_reason||""}</p>
  </div>
  <div class="hl-card">
    <div class="hl-card-title" style="color:#3A66B0">Facet5 프로파일</div>
    ${Object.entries(sten).map(([k,v])=>`
      <div style="margin-bottom:7px">
        <div style="display:flex;justify-content:space-between;font-size:12px">
          <span><span style="color:${F5C[k]}">●</span> ${F5N[k]}</span>
          <b style="color:${F5C[k]}">${parseFloat(v).toFixed(1)}</b>
        </div>
        ${barHtml(v, F5C[k])}
      </div>`).join("")}
  </div>
</div>

<div class="hl-grid">
  <div class="hl-card" style="border-top:3px solid #3E8E6E;border-radius:0 0 10px 10px">
    <div class="hl-card-title" style="color:#3E8E6E">빛나는 장면</div>
    <div style="font-size:13px;line-height:1.7">${(r.best_context||"").split(",").map(x=>`• ${x.trim()}`).join("<br>")}</div>
  </div>
  <div class="hl-card" style="border-top:3px solid #C84B31;border-radius:0 0 10px 10px">
    <div class="hl-card-title" style="color:#C84B31">탐색할 긴장 포인트</div>
    ${(r.tensions||[]).map(t=>`<div class="tension-item"><div class="tension-title">${t.title}</div><div class="tension-desc">${t.desc}</div></div>`).join("")}
  </div>
</div>

<div class="hl-card" style="border-top:3px solid #7B5EA7;border-radius:0 0 10px 10px;margin-bottom:12px">
  <div class="hl-card-title" style="color:#7B5EA7">핵심 시그니처</div>
  <div class="sig-grid">
    ${(r.signatures||[]).map(s=>`
      <div class="sig-row">
        <div style="font-weight:600">${s.label}</div>
        <div><div style="font-size:11.5px;color:#5B6A5E">CS: ${s.cs}</div><div style="font-size:11.5px;color:#5B6A5E">F5: ${s.f5}</div></div>
      </div>`).join("")}
  </div>
</div>

<div class="hl-card">
  <div class="hl-card-title">디브리핑 탐색 질문</div>
  ${(r.debrief_questions||[]).map((q,i)=>`<div class="q-item"><b>Q${i+1}.</b> ${q}</div>`).join("")}
</div>`;
}

/* ── PDF 열기 ── */
function openPdf() { saveSession();
  if(!lastPdfHtml) { alert("PDF 데이터가 없습니다. 다시 분석해주세요."); return; }
  const w = window.open("", "_blank");
  w.document.write(lastPdfHtml);
  w.document.close();
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
  // inline style for the overlay (added here since it's dynamic)
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
    lbl.textContent = dv.l;
    g.appendChild(lbl);
    const row = document.createElement("div");
    row.className = "theme-row";
    THEMES.filter(t=>t.d===dk).forEach(t => {
      const btn = document.createElement("button");
      btn.className = "tbtn"; btn.id = "tb_"+t.en; btn.textContent = t.ko;
      btn.onclick = () => toggleTheme(t.en);
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
    const row = document.createElement("div");
    row.className = "srow";
    row.innerHTML = `
      <div class="srow-label">
        <div class="fname"><span style="color:${f.c}">●</span> ${f.n} <span style="color:#8A9388;font-weight:400">${f.ko}</span></div>
        <div class="fsub">${f.sub}</div>
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
    lbl.textContent = f.n + " " + f.ko + " 하위 요인";
    sub.appendChild(lbl);
    grp.forEach(s => {
      const row = document.createElement("div");
      row.className = "srow";
      row.innerHTML = `
        <div class="srow-label">
          <div style="font-size:12.5px;color:#6B7A6E">${s.n} <span style="font-size:11px;opacity:.6">${s.en}</span></div>
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

restoreSession(); buildThemeGrid();
buildF5Sliders();
updateCS();
renderFamily();

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
