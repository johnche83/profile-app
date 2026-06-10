# 강점 × Facet5 통합 프로파일 도구

CliftonStrengths + Facet5 교차 분석 → 하이라이트 카드 + 상세 PDF 리포트 생성 앱

---

## 배포 방법 (30분 소요)

### 1단계: GitHub 업로드

1. github.com 접속 → "New repository" → `profile-app` 이름으로 생성
2. 이 폴더 전체를 업로드 (Add file → Upload files)

폴더 구조:
```
profile-app/
├── api/
│   ├── analyze.js        ← Claude 분석 API
│   ├── parse-file.js     ← PDF/이미지 파싱 API  
│   └── generate-pdf.js   ← PDF HTML 생성 API
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── vercel.json
```

### 2단계: Vercel 배포

1. vercel.com 접속 → GitHub 계정으로 로그인
2. "Add New Project" → 위에서 만든 GitHub 저장소 선택
3. "Deploy" 클릭 (설정 변경 없이 바로)
4. 배포 완료 후 URL 발급됨 (예: `https://profile-app-xxx.vercel.app`)

### 3단계: Anthropic API 키 설정

1. platform.anthropic.com → API Keys → "Create Key"
2. 키 복사 후 Vercel 대시보드로 이동
3. 프로젝트 → Settings → Environment Variables
4. 다음 추가:
   - Name: `ANTHROPIC_API_KEY`
   - Value: 복사한 API 키 (`sk-ant-...`)
5. "Save" 후 Vercel 대시보드에서 "Redeploy" 클릭

---

## API 비용 (Anthropic)

| 작업 | 사용 모델 | 예상 비용/회 |
|------|-----------|-------------|
| 분석 (analyze) | claude-opus-4-5 | ~$0.03–0.05 |
| 파일 파싱 (parse-file) | claude-opus-4-5 | ~$0.05–0.10 |
| PDF 생성 (generate-pdf) | claude-opus-4-5 | ~$0.02–0.03 |

월 50회 사용 기준 약 $5–10 수준.
더 저렴하게 하려면 api/analyze.js에서 `claude-opus-4-5` → `claude-haiku-4-5-20251001`로 변경.

---

## 로컬 개발 (선택사항)

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 루트에서
vercel dev

# .env.local 파일 생성
echo "ANTHROPIC_API_KEY=sk-ant-여기에키입력" > .env.local
```

---

## 파일 업로드 기능 제한

- PDF: 텍스트 레이어가 있는 PDF만 파싱 가능 (스캔 이미지 PDF는 정확도 낮음)
- 이미지: PNG, JPG 지원, 리포트 화면 캡처도 가능
- Facet5 한국어 리포트 ✓ / CliftonStrengths 한국어 리포트 ✓

---

## 보안 참고

- API 키는 Vercel 환경변수에만 저장 (코드에 포함 금지)
- 사용자 진단 데이터는 서버에 저장되지 않음 (요청당 처리 후 즉시 폐기)
- 접근 제한이 필요하면 Vercel Password Protection 설정 (Pro 플랜 필요) 또는
  간단한 패스워드 체크를 `index.html`에 추가 가능

---

CliftonStrengths® Gallup, Inc. / Facet5® NL Buckley
