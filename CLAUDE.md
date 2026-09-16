# CLAUDE.md — 강점 × Facet5 통합 프로파일 도구

이 파일은 AI 코파일럿이 이 프로젝트를 이해하고 작업할 수 있도록 작성된 컨텍스트 문서입니다.

---

## 프로젝트 개요

**목적**: 퍼실리테이터가 CliftonStrengths(CS)와 Facet5 두 진단 데이터를 입력하면, Claude AI가 교차 분석하여 하이라이트 카드(화면)와 10페이지 분량의 상세 PDF 리포트를 생성하는 웹앱.

**배포 URL**: Vercel (GitHub 연동 자동 배포)  
**스택**: 순수 HTML/CSS/JS (프레임워크 없음) + Vercel Serverless Functions (Node.js ES Module)  
**AI**: Anthropic Claude API (`claude-sonnet-4-5`)

---

## 파일 구조

```
profile-app/
├── public/
│   ├── index.html      — 단일 페이지 앱 (4개 스텝 페이지)
│   ├── style.css       — 앱 전용 스타일 (PDF 오버레이 제외)
│   └── app.js          — 모든 클라이언트 로직
├── api/
│   ├── analyze.js      — Claude 호출: 두 진단 교차 분석 → JSON 반환
│   ├── generate-pdf.js — PDF용 HTML 템플릿 생성 → HTML 문자열 반환
│   └── parse-file.js   — PDF/이미지 업로드 → Claude Vision으로 점수 추출
└── vercel.json         — Vercel 라우팅 설정
```

---

## 앱 흐름 (4 스텝)

```
Step 0 (랜딩) → Step 1 (기본 정보) → Step 2 (진단 데이터 입력) → Step 3 (분석 결과)
```

### Step 1: 기본 정보
- 이름/이니셜, 역할/직무, 세션 목적 입력
- `p_name`, `p_role`, `p_purpose` (DOM id)

### Step 2: 진단 데이터 입력 (두 가지 방식)
**직접 입력 탭**: 
- CS: 테마 버튼 클릭으로 Top 5~10 선택 (순서 = 순위)
- Facet5: 5개 주요인 슬라이더 (스텐 1~10), 하위 요인 13개 선택 입력

**파일 업로드 탭**:
- CS 리포트 + Facet5 리포트 PDF/이미지 업로드
- `/api/parse-file` 호출 → Claude Vision이 점수 자동 추출

### Step 3: 분석 결과
- `/api/analyze` 호출 → `renderHighlight()` 로 화면에 하이라이트 카드 표시
- "상세 PDF 리포트 열기" 버튼 → `/api/generate-pdf` 호출 → 오버레이로 표시 → `window.print()`

---

## 핵심 데이터 구조

### CS 테마 데이터 (`top10` 배열)
```js
top10 = ["Context", "Ideation", "Intellection", ...]  // 영어 테마명, 순서 = 순위
```

34개 테마, 4개 영역:
- `executing`: Achiever, Arranger, Belief, Consistency, Deliberative, Discipline, Focus, Responsibility, Restorative
- `influencing`: Activator, Command, Communication, Competition, Maximizer, Self-Assurance, Significance, Woo
- `relationship`: Adaptability, Connectedness, Developer, Empathy, Harmony, Includer, Individualization, Positivity, Relator
- `strategic`: Analytical, Context, Futuristic, Ideation, Input, Intellection, Learner, Strategic

한국어 이름 매핑은 `THEMES` 배열 (app.js, analyze.js, generate-pdf.js 각각 동일하게 정의됨).

### Facet5 데이터 (`sten`, `substen`)
```js
sten = { W: 5.4, E: 1.0, A: 2.6, C: 6.0, Em: 8.9 }   // 5개 주요인 스텐 점수
substen = { W1: 6.2, W2: 4.1, E1: 2.9, ... }           // 13개 하위 요인 (선택)
```

**주요인 (5개)**:
| 코드 | 한국어 | 영어 | 색상 |
|------|--------|------|------|
| W | 의지 | Will | #2E9E5B |
| E | 활력 | Energy | #C79A00 |
| A | 친화성 | Affection | #DD3F3F |
| C | 통제력 | Control | #3A66B0 |
| Em | 정서 | Emotionality | #A04070 |

**하위 요인 (13개)**:
| 코드 | 주요인 | 한국어 | 영어 |
|------|--------|--------|------|
| W1 | W | 결의 | Determination |
| W2 | W | 정면대응 | Confrontation |
| W3 | W | 독립심 | Independence |
| E1 | E | 생동력 | Vitality |
| E2 | E | 사교성 | Sociability |
| E3 | E | 적응성 | Adaptability |
| A1 | A | 이타심 | Altruism |
| A2 | A | 도움 | Support |
| A3 | A | 신뢰 | Trust |
| C1 | C | 규율 | Discipline |
| C2 | C | 책임감 | Responsibility |
| Em1 | Em | 긴장 | Tension |
| Em2 | Em | 이해도 | Apprehension |

**Facet5 패밀리**: W·E·A·C 4요인 조합으로 판정 (16가지 유형, 한국어/영어 이름 있음)

---

## API 엔드포인트

### POST `/api/analyze`

**입력**:
```json
{
  "name": "SW KIM",
  "role": "HRBP",
  "purpose": "개인 디브리핑",
  "top10": ["Context", "Ideation", "Intellection", ...],
  "sten": { "W": 5.4, "E": 1.0, "A": 2.6, "C": 6.0, "Em": 8.9 },
  "substen": { "W1": 6.2, "E2": 2.9 },
  "family": "통제자",
  "lang": "ko"
}
```

**출력**: `{ ok: true, result: { ...분석 JSON... } }`

**분석 JSON 스키마** (Claude가 생성하는 필드들):

*하이라이트 카드용 (기존 호환)*:
- `tagline`: 핵심 한 줄 (15자 이내)
- `summary`: 핵심 작동 방식 2문장
- `dominant_domain`: 주도 영역명
- `dominant_reason`: 주도 영역 이유 1문장
- `best_context`: 빛나는 장면 2개 (쉼표 구분)
- `signatures`: [{label, cs, f5}, ...] × 3
- `tensions`: [{title, desc}, ...] × 2
- `debrief_questions`: ["질문1", "질문2", "질문3"]

*10페이지 PDF용 (상세)*:
- `highlight_narrative`: 통합 서술 2~3문장
- `cs_domain_narratives`: {executing, influencing, relationship, strategic} — 각 영역별 서술
- `theme_dynamics`: [{combo, hypothesis}, ...] × 4 — 테마 조합 가설
- `lower_themes_inferred`: [{name, rank_hint, implication}, ...] × 4 — 추정 하위 테마
- `blind_spots`: [{title, desc}, ...] × 3 — 상위 테마의 그림자
- `f5_factor_analysis`: {W, E, A, C, Em} — 각 요인별 서술
- `convergence_signals`: [{title, cs_evidence, f5_evidence}, ...] × 5 — 수렴 신호
- `facilitator_note_convergence`: 퍼실리테이터 노트
- `tension_points_detailed`: [{title, desc, verify_q}, ...] × 4 — 상세 긴장 포인트
- `operating_model`: {name, narrative, best_scenes[], energizers[], drainers[], partner_note}
- `debrief_questions_detailed`: [{q, context}, ...] × 6
- `session_flow`: [{phase, duration, content}, ...] × 4
- `development_experiments`: [{title, desc}, ...] × 3

**max_tokens**: 8000 (한국어 풀 리포트 기준)

---

### POST `/api/generate-pdf`

**입력**: analyze와 동일한 입력 + `analysis` 필드 (위 분석 JSON)

**출력**: `{ ok: true, html: "<!DOCTYPE html>...</html>" }`

반환된 HTML은 완전한 독립 문서 (구글 폰트 임포트 포함). 클라이언트가 오버레이에 주입 후 `window.print()`로 PDF 저장.

**PDF 10페이지 구조**:
1. 표지 (Cover)
2. §1 프로파일 하이라이트
3. §2 CS 분석 — 재능의 방향
4. §3 CS 하위 테마와 맹점 관리
5. §4 Facet5 분석 ① — 의지·활력
6. §5 Facet5 분석 ② — 친화성·통제력·정서
7. §6 교차 검증 ① — 일치 시그널
8. §7 교차 검증 ② — 긴장 포인트
9. §8 시너지 분석 — 통합 작동 모델
10. §9 디브리핑 가이드 — 질문과 세션 흐름

---

### POST `/api/parse-file`

**입력**: multipart/form-data — `cs` 파일, `f5` 파일 (PDF 또는 이미지)

**출력**:
```json
{
  "ok": true,
  "top10": ["Context", "Ideation", ...],
  "sten": { "W": 5.4, "E": 1.0, ... },
  "substen": { "W1": 6.2 }
}
```

Claude Vision API로 파일 내용을 읽어 점수 추출.

---

## 클라이언트 (app.js) 주요 함수

| 함수 | 역할 |
|------|------|
| `goPage(n)` | 페이지 전환 (0~3), progress bar 업데이트 |
| `step1Next()` | Step1 → Step2, 유효성 검사 |
| `runAnalysis()` | `/api/analyze` 호출 → `renderHighlight()` |
| `renderHighlight(r, payload, family)` | 하이라이트 카드 HTML 생성 및 DOM 주입 |
| `openPdf()` | `/api/generate-pdf` 호출 → 오버레이 생성 |
| `printPdf()` | `document.fonts.ready.then(()=>window.print())` |
| `closePdfOverlay()` | 오버레이 DOM 제거 |
| `buildThemeGrid()` | CS 테마 선택 UI 생성 |
| `buildF5Sliders()` | Facet5 슬라이더 UI 생성 |
| `toggleLang()` / `setLang(lang)` | 언어 전환 (ko ↔ en) |
| `applyLang()` | `data-i18n` 속성 기반 전체 UI 텍스트 교체 |
| `saveSession()` / `restoreSession()` | sessionStorage 기반 상태 유지 |
| `parseFiles()` | 파일 업로드 → `/api/parse-file` → 슬라이더 자동 설정 |

---

## 다국어 (i18n) 구조

```js
const LANG = {
  ko: { heroTitle: "강점 × Facet5...", start: "시작하기 →", ... },
  en: { heroTitle: "Strengths × Facet5...", start: "Get Started →", ... }
};

let currentLang = sessionStorage.getItem("lang") || "ko";
function t(key, ...args) { /* LANG[currentLang][key] 반환 */ }
```

HTML에서 `data-i18n="key"` 속성이 있는 요소는 `applyLang()` 호출 시 자동 교체됨.  
`data-i18n-ph="key"` 속성은 input placeholder에 적용.

API 호출 시 `lang: currentLang` 파라미터를 함께 전송 → Claude가 해당 언어로 분석 결과 반환.

---

## PDF 오버레이 방식 (Safari 백지 버그 우회)

기존 `window.open()` + `document.write()` 방식은 Safari에서 프린터 드라이버 없을 시 1KB 백지 PDF 생성 버그 있음.

**현재 방식**:
1. 서버에서 HTML 문자열 수신
2. `DOMParser`로 파싱 → `.wrap` 내용 추출
3. 현재 페이지에 `#pdf-overlay` div 생성 (fixed, z-index:9000)
4. `@media print { body > *:not(#pdf-overlay) { display:none } }` → 오버레이만 인쇄
5. `document.fonts.ready.then(() => window.print())` → 폰트 로드 완료 후 프린트

---

## 바 차트 렌더링 (Facet5 그래프)

generate-pdf.js의 `barHtml()` 함수:

```js
const barHtml = (val, color) => {
  const pct = Math.round(parseFloat(val) * 10);
  // linear-gradient로 트랙+채움을 단일 배경으로 처리 (position:absolute 방식 대비 print 안정적)
  return `<div style="print-color-adjust:exact;...
    background:linear-gradient(to right, ${color}55 ${pct}%, #E8EBE8 ${pct}%)">
    <div style="position:absolute;left:50%;...">  <!-- 중간선 -->
    <div style="position:absolute;left:calc(${pct}% - 8px);...background:${color}">  <!-- 도트 -->
  </div>`;
};
```

`linear-gradient` 사용 이유: `position:absolute` 자식 요소로 배경색을 채우면 오버레이/프린트 컨텍스트에서 배경이 사라지는 버그 있음.

---

## 상태 관리

`sessionStorage` 키:
- `lang`: 현재 언어 ("ko" | "en")
- `lastAnalysis`: 마지막 분석 결과 JSON (문자열)
- `lastPayload`: 마지막 분석에 사용한 입력 데이터 JSON
- `top10`: CS 선택 테마 배열
- `sten`: Facet5 주요인 점수
- `substen`: Facet5 하위 요인 점수
- `p_name`, `p_role`, `p_purpose`: Step1 입력값

페이지 이동 시 `saveSession()` / `restoreSession()` 으로 상태 복원.

---

## 환경 변수

| 변수명 | 설명 | 설정 위치 |
|--------|------|-----------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API 키 | Vercel 환경변수 |

로컬 개발 시 `.env.local` 파일에 설정.

---

## 자주 발생하는 이슈 & 해결책

| 이슈 | 원인 | 해결 |
|------|------|------|
| JSON parse 오류 | Claude 응답이 max_tokens에서 잘림 | analyze.js의 max_tokens 값 증가 (현재 8000) |
| PDF 바 차트 미출력 | print-color-adjust 미적용 | `@media print { * { print-color-adjust: exact !important } }` |
| 언어 전환 후 PDF 한국어 고정 | PDF HTML이 분석 시점에 캐시됨 | openPdf()에서 매번 generate-pdf 재호출 (현재 구현됨) |
| Safari 백지 PDF | blob URL + 프린터 미설정 | 오버레이 방식으로 교체 (현재 구현됨) |
| Vercel 함수 타임아웃 | Claude API 응답 지연 | Vercel Pro에서 maxDuration 설정 가능 |

---

## 코드 수정 시 주의사항

1. **THEMES 배열**: `app.js`, `analyze.js`, `generate-pdf.js` 세 곳에 동일하게 정의됨. 수정 시 세 파일 모두 반영.
2. **SUBFACTORS 배열**: `app.js`, `generate-pdf.js` 두 곳에 정의됨.
3. **L 객체 (라벨)**: `generate-pdf.js` 내부에 `isKo` 조건으로 한/영 분기. PDF 섹션 제목 등 변경 시 두 버전 모두 수정.
4. **분석 JSON 필드 추가 시**: `analyze.js` 프롬프트 스키마 → `generate-pdf.js` 렌더링 → `app.js`의 `renderHighlight()` (하이라이트 카드) 순서로 반영.
5. **max_tokens**: 현재 8000 (claude-sonnet-4-5 최대치). 더 줄이면 JSON 잘림 오류 발생.

---

## 개발 환경

```bash
# 의존성 없음 (순수 HTML/JS)
# 정적 파일 로컬 서버
npx serve public

# Vercel 로컬 (API 포함)
npm install -g vercel
vercel dev
```

---

CliftonStrengths® Gallup, Inc. / Facet5® NL Buckley  
개발: run2sh@gmail.com
