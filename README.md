# 다옴법무사사무소 웹사이트

부산 해운대구·센텀·재송동 지역 법무사 홈페이지입니다.  
**Next.js 정적 export(SSG)** 로 빌드하며, **Cloudflare Pages 무료 호스팅** + **GitHub** 연동을 전제로 운영합니다.

> Vercel 등 다른 정적 호스팅으로 옮겨도 `output: "export"` 구조는 그대로 유지할 수 있습니다.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Content | MDX (`src/content/`) |
| Build | 정적 export → `out/` 폴더 |
| Hosting | Cloudflare Pages (무료) |
| CI | GitHub Actions (lint + build) |

---

## 1. 로컬 실행 방법

### 요구 사항

- **Node.js 20 이상** (`.nvmrc` 참고)
- npm 10+

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/YOUR_ORG/daom.git
cd daom

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 을 열어 NEXT_PUBLIC_SITE_URL 등을 수정

# 개발 서버 (핫 리로드)
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

### 로컬에서 프로덕션 빌드 확인

```bash
npm run build    # out/ 폴더 생성
npm run preview  # out/ 을 http://localhost:3000 에서 확인
```

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 정적 사이트 빌드 (`out/`) |
| `npm run preview` | 빌드 결과물 로컬 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run start` | Node 서버 모드 (정적 export 운영 시 **사용 안 함**) |

---

## 2. 콘텐츠 추가 방법 (공통)

콘텐츠는 **MDX 파일**로 관리합니다. DB나 CMS 없이 Git으로 버전 관리합니다.

```
src/content/
├── blog/       # 법률칼럼
├── cases/      # 실제사례
├── faq/        # FAQ
├── services/   # (향후 확장)
└── areas/      # (향후 확장)
```

### Frontmatter (공통 필드)

```yaml
---
title: "제목"
description: "요약 설명"
date: "2025-12-01"
category: "상속"
tags:
  - 상속등기
slug: my-article-slug
author: 안윤정 법무사
office: 다옴법무사사무소
relatedServices:
  - inheritance-registration
area: 부산
seoTitle: "SEO 제목 (선택)"
seoDescription: "SEO 설명 (선택)"
---
```

### 주의사항

- `_`로 시작하는 파일(`_template.mdx`)은 **빌드 대상에서 제외**됩니다.
- `slug`는 URL에 사용됩니다. 파일명과 `slug`를 일치시키는 것을 권장합니다.
- 콘텐츠 추가 후 `npm run build`로 로컬 확인 → `main` 브랜치에 push하면 Cloudflare Pages가 자동 배포합니다.

---

## 3. 블로그(법률칼럼) 글 추가 방법

1. `src/content/blog/_template.mdx` 를 복사합니다.
2. `src/content/blog/{slug}.mdx` 로 저장합니다.  
   예: `src/content/blog/busan-inheritance-guide.mdx`
3. frontmatter의 `slug`를 URL과 맞춥니다.
4. 본문 섹션을 작성합니다.

**권장 섹션:** 문제 상황 → 핵심 정리 → 절차 → 준비 서류 → 주의사항 → 자주 묻는 질문 → 관련 업무 → 상담 안내

**노출 URL:** `https://도메인/blog/{slug}`  
**목록 페이지:** `/blog` (날짜 내림차순 자동 정렬)

---

## 4. 사례글 추가 방법

1. `src/content/cases/_template.mdx` 를 복사합니다.
2. `src/content/cases/{slug}.mdx` 로 저장합니다.
3. frontmatter와 본문을 작성합니다.

**권장 섹션:** 사건 개요 → 의뢰인의 고민 → 진행 절차 → 준비 서류 → 결과 → 실무 코멘트 → 관련 업무 → 상담 안내

**노출 URL:** `https://도메인/cases/{slug}`

> 개인정보·실명·과장 표현 없이 사건 유형 위주로 작성하세요.

---

## 5. FAQ 추가 방법

1. `src/content/faq/_template.mdx` 를 복사합니다.
2. `src/content/faq/{slug}.mdx` 로 저장합니다.
3. `title` = 질문, `description` = 요약 답변, 본문 = 추가 설명(선택)

**노출:** `/faq` 페이지 아코디언에 자동 반영 (`getFaqItems()`)

---

## 6. Cloudflare Pages 배포 방법

이 프로젝트는 **`output: "export"`** 로 빌드되므로 서버 없이 `out/` 폴더만 배포하면 됩니다.

### 사전 확인

```bash
npm run build
# out/ 폴더에 HTML, sitemap.xml, robots.txt 가 생성되는지 확인
ls out/sitemap.xml out/robots.txt
```

### Cloudflare Pages 설정 (GitHub 연동)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub 저장소 선택
3. 빌드 설정 입력:

| 항목 | 값 |
|------|-----|
| Production branch | `main` |
| Framework preset | `None` (또는 Next.js Static) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` (기본값) |

4. **Environment variables** (Production) 추가:

```
NEXT_PUBLIC_SITE_URL=https://xn--2j1br1na42lvxja38mk8r.kr
NEXT_PUBLIC_PHONE=051-000-0000
NEXT_PUBLIC_KAKAO_CHANNEL=https://...
NEXT_PUBLIC_NAVER_BOOKING=https://...
NEXT_PUBLIC_INQUIRY_FORM_GOOGLE=https://...
```

5. **Save and Deploy** → `main` push 시 자동 재배포

### IndexNow (Bing·Naver 등 자동 알림)

`main`에 push하면 GitHub Actions **IndexNow** 워크플로가 Cloudflare 배포 완료를 기다린 뒤  
색인 대상 URL 전체를 IndexNow API로 제출합니다.

- 키 파일: `public/dc56e361ff344411bd1493b60a7d1ef7.txt`  
  → `https://다옴법무사사무소.kr/dc56e361ff344411bd1493b60a7d1ef7.txt`
- 수동 실행: `npm run indexnow` / 배포 대기형: `npm run indexnow:deploy`
- 일시 중지: Actions에서 워크플로 disable, 또는 `INDEXNOW_DISABLED=1`

### Node.js 버전

Cloudflare Pages 환경 변수에 추가 (권장):

```
NODE_VERSION=20
```

또는 저장소의 `.nvmrc`(20)를 GitHub Actions와 동일하게 사용합니다.

### 무료 호스팅 운영 참고

- Cloudflare Pages 무료 플랜: 월 빌드·대역폭 한도 내 무제한 정적 호스팅
- 간편 문의는 Pages Function(`/api/quick-inquiry`) + Telegram(선택 Resend) — DB 미저장. 설정: `docs/QUICK_INQUIRY.md`
- 빌드 실패 시 GitHub Actions CI 로그와 Cloudflare Build 로그를 함께 확인

### Vercel로 이전할 때

구조 변경 없이 호스팅 설정만 바꿉니다.

| 항목 | 값 |
|------|-----|
| Build command | `npm run build` |
| Output directory | `out` |
| Install command | `npm install` |

`next.config.ts`의 `output: "export"` 는 유지합니다.

---

## 7. 도메인 연결 방법

### Cloudflare에서 구매한 도메인

1. Pages 프로젝트 → **Custom domains** → **Set up a custom domain**
2. `다옴법무사사무소.kr` (또는 Punycode `xn--2j1br1na42lvxja38mk8r.kr`) 입력 → DNS가 자동 연결됨
3. 배포 완료 후 `NEXT_PUBLIC_SITE_URL` 을 실제 도메인으로 업데이트 → 재배포

### 외부 등록 도메인 (가비아, 후이즈 등)

1. Pages → Custom domains → 도메인 추가
2. Cloudflare가 안내하는 **CNAME** 레코드를 도메인 DNS에 추가  
   - `@` → `your-project.pages.dev` (또는 Cloudflare 안내값)  
   - `www` → 동일 CNAME
3. SSL/TLS는 Cloudflare가 자동 발급 (Full 권장)
4. 환경 변수 `NEXT_PUBLIC_SITE_URL=https://xn--2j1br1na42lvxja38mk8r.kr` 확인 후 재배포

> `NEXT_PUBLIC_SITE_URL` 이 실제 도메인과 다르면 sitemap·canonical·OG URL이 잘못 생성됩니다.

---

## 8. 구글 Search Console 등록

1. [Google Search Console](https://search.google.com/search-console) 접속
2. **속성 추가** → URL 접두어: `https://다옴법무사사무소.kr` (또는 `https://xn--2j1br1na42lvxja38mk8r.kr`)
3. 소유권 확인 (HTML 파일 업로드 또는 DNS TXT 레코드)
   - HTML 파일 방식: `public/` 에 확인 파일 추가 → push → 배포 후 확인
4. **Sitemaps** → `https://xn--2j1br1na42lvxja38mk8r.kr/sitemap.xml` 제출
5. **robots.txt** 확인: `https://xn--2j1br1na42lvxja38mk8r.kr/robots.txt`

빌드 시 `src/app/sitemap.ts`가 모든 정적·동적 경로를 자동 포함합니다.

---

## 9. 네이버 서치어드바이저 등록

1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속
2. **사이트 등록** → `https://다옴법무사사무소.kr`
3. 소유권 확인 (HTML 메타태그 또는 파일 업로드)
   - 메타태그: `src/app/layout.tsx` 의 `metadata` 또는 별도 컴포넌트에 추가
   - 파일 업로드: `public/` 에 네이버 확인 파일 추가 → 배포
4. **사이트맵 제출**: `https://xn--2j1br1na42lvxja38mk8r.kr/sitemap.xml`
5. **robots.txt 수집 요청** (선택)

---

## GitHub 브랜치 운영 가이드

무료 호스팅 + 소규모 운영을 위한 권장 흐름입니다.

```
main          ← 프로덕션 (Cloudflare Pages 자동 배포)
  ↑
  merge (PR)
  ↑
feature/*     ← 콘텐츠·기능 작업 브랜치
```

### 권장 워크플로

1. `main`에서 브랜치 생성  
   `git checkout -b feature/add-blog-post`
2. MDX 콘텐츠·코드 수정
3. 로컬 확인: `npm run lint && npm run build`
4. push 후 **Pull Request** → `main` 으로 merge
5. Cloudflare Pages가 `main` push를 감지해 자동 배포

### 브랜치 정책

| 브랜치 | 용도 | 배포 |
|--------|------|------|
| `main` | 운영(프로덕션) | Cloudflare Pages Production |
| `feature/*` | 글 추가, UI 수정 | PR 시 GitHub Actions CI만 실행 |
| `fix/*` | 버그 수정 | 동일 |

### 스테이징(선택)

Preview URL이 필요하면 Cloudflare Pages **Preview deployments**를 사용합니다.  
`feature/*` 브랜치 push 시 `*.pages.dev` 미리보기 URL이 생성됩니다 (무료).

---

## 환경 변수

`.env.example` 을 복사해 `.env.local`(로컬) 또는 Cloudflare Pages 환경 변수(프로덕션)에 설정합니다.

```env
# 필수 — SEO canonical, sitemap, OG URL
NEXT_PUBLIC_SITE_URL=https://xn--2j1br1na42lvxja38mk8r.kr

# 상담 연락처 (CTA 버튼)
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_KAKAO_CHANNEL=
NEXT_PUBLIC_NAVER_BOOKING=

# 온라인 문의 (외부 링크, DB 저장 없음) — 선택
NEXT_PUBLIC_INQUIRY_FORM_GOOGLE=
NEXT_PUBLIC_INQUIRY_FORM_TALLY=
NEXT_PUBLIC_INQUIRY_FORM_NAVER=
NEXT_PUBLIC_INQUIRY_FORM_PRIMARY=google

# 간편 문의 (Pages Function) — docs/QUICK_INQUIRY.md
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
# Runtime(Functions): TELEGRAM_*, TURNSTILE_SECRET_KEY, RESEND_* …
```

모든 `NEXT_PUBLIC_*` 변수는 **빌드 시점**에 번들에 포함됩니다. 값 변경 후 **재배포**가 필요합니다.

---

## SEO 자동 생성

| 파일 | 생성 위치 | 설명 |
|------|-----------|------|
| `sitemap.xml` | `out/sitemap.xml` | 정적 페이지 + 업무/지역/블로그/사례 slug 자동 포함 |
| `robots.txt` | `out/robots.txt` | 전체 허용 + sitemap URL |

소스: `src/app/sitemap.ts`, `src/app/robots.ts` (`force-static`)

---

## 프로젝트 구조

```
src/
├── app/                 # 페이지, layout, sitemap, robots
├── components/          # UI 컴포넌트
├── content/             # MDX 콘텐츠
│   ├── blog/
│   ├── cases/
│   └── faq/
├── lib/
│   ├── content/         # MDX 로더
│   ├── consultation.ts  # 상담 문구·외부 폼
│   ├── contact.ts       # 연락처 채널
│   └── seo/             # SEO·JSON-LD
└── types/
public/                  # 정적 파일, _headers (Cloudflare)
out/                     # 빌드 결과 (git 제외)
```

---

## 브랜드 정보

- **사무소명**: 다옴법무사사무소
- **대표**: 안윤정 법무사
- **지역**: 부산 해운대구 재송동, 센텀, 반여동
- **주요 업무**: 상속등기, 부동산등기, 법인등기, 개인회생 등

---

## 문제 해결

| 증상 | 확인 사항 |
|------|-----------|
| sitemap URL이 localhost | `NEXT_PUBLIC_SITE_URL` 프로덕션 값 설정 후 재배포 |
| 빌드 실패 | Node 20 사용, `npm ci` 후 로컬 `npm run build` 재현 |
| 404 on refresh | Cloudflare Pages output directory가 `out` 인지 확인 |
| 상담 버튼 미표시 | `NEXT_PUBLIC_PHONE` 등 환경 변수 설정 여부 |
