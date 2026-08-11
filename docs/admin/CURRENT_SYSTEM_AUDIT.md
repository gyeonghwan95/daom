# 현재 시스템 전수 분석 — Admin Operations Console

작성일: 2026-08-11  
대상: `c:\workspace\daom` (다옴법무사사무소)

## 1. Framework

| 항목 | 결과 |
|------|------|
| Next.js | 16.2.x (App Router) |
| React | 19.x |
| TypeScript | 사용 |
| 기본 빌드 | `STATIC_EXPORT=true` → `out/` 정적 export (`scripts/build-static.mjs`) |
| SSR | 공개 사이트는 SSG/정적. `npm run build:server` 시 Node SSR 가능 |
| API Routes | `src/app/api/**` — **정적 export 시 stash되어 제외** |
| middleware | **없음** |
| MDX | `@next/mdx` 사용 |

## 2. Deployment

| 항목 | 결과 |
|------|------|
| 호스트 | Cloudflare Pages (`out/` + `functions/`) |
| wrangler.toml | 기존 없음 → Admin용으로 추가 예정 |
| Pages Functions | `functions/api/quick-inquiry.ts` (문의) |
| GitHub Actions | CI, IndexNow, 입찰 데일리 브리핑 |
| 환경변수 | `NEXT_PUBLIC_*`(빌드), Function Runtime Secret, Actions Secret |

## 3. Data

| 저장소 | 존재 |
|--------|------|
| D1 / KV / R2 / Supabase / Prisma | **없음** (도입 전) |
| JSON 파일 | 네이버 리뷰·블로그·검색인덱스 |
| 문의 DB | **없음** — Telegram/Resend 전달만 (`docs/QUICK_INQUIRY.md`) |

## 4. Authentication

| 항목 | 결과 |
|------|------|
| 기존 `/admin` | 네이버 리뷰 갱신 UI |
| 인증 | `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` HMAC 쿠키 (`daom_admin_session`) |
| 동작 조건 | **Node 서버** (`build:server`) — CF 정적 배포에서는 API 미포함 |
| OAuth / Access | 없음 |
| RBAC | 없음 (1인 운영에 적합) |

## 5. Analytics

| 항목 | 결과 |
|------|------|
| GA/GTM/CF Web Analytics 스크립트 | layout에 **미설치** |
| `trackCTA` | 개발 시 `console.debug`만 |
| B2B/consult analytics | `gtag`/`dataLayer` optional hook만 |

## 6. Email / Forms

| 항목 | 결과 |
|------|------|
| Provider | Resend + Telegram |
| Endpoint | `/api/quick-inquiry` (CF Function + Next 미러) |
| 로그 저장 | **없음** |
| 폼 | 상담·강의·기업·B2B·위저드 → 동일 API |
| CTA | 전화/카카오/네이버/신청서 (`ConversionActionButtons`, FloatingCTA 등) |

## 7. Automation

| Job | 위치 |
|-----|------|
| Sitemap 생성 | prebuild `generate-sitemaps.mjs` |
| IndexNow | Actions + `submit-indexnow.mjs` |
| SEO audit | npm scripts (로컬/CI) |
| 입찰 브리핑 | `collector/` + daily Actions |
| 네이버 리뷰 fetch | prebuild |

## 8. SEO

| 항목 | 결과 |
|------|------|
| robots | `/admin`, `/api/`, `/search`, `/blog/external/` disallow |
| sitemap | `/admin`·`/api/` BLOCKED_PREFIXES |
| Published paths | ~1777 / sitemap ~1637 |
| Admin metadata | 기존 `/admin` noindex |

## 9. Floating UI 충돌 위험

| UI | 위치 | z |
|----|------|---|
| MobileBottomCTA | 하단 전체 | 50 |
| FloatingCTA | 우하단 (lg+) | 40 |
| 문의 오버레이 | — | 80 |

공지는 **좌하단(데스크톱)** / **하단 CTA 위 오프셋(모바일)** 으로 배치.

## 10. 권장 Admin Architecture

### 선택: **CASE B (변형) — 정적 공개 사이트 + Pages Functions + KV**

이유:
1. 공개 사이트는 SEO 파이프라인(정적 export)을 유지해야 함 → CASE C(전체 SSR) 비권장
2. 문의 API가 이미 Pages Functions → 동일 런타임에 admin/analytics/notices 확장 가능
3. 기존 Node `/api/admin`은 FS 쓰기(리뷰 JSON)에 의존 → CF에서 그대로 불가
4. D1 없이도 KV로 1인·저트래픽 운영 가능 (추후 D1 업그레이드 문서화)
5. 관리자 UI는 정적 `/admin/*` 페이지 + Function API (클라이언트 fetch)

비선택:
- CASE A 순수 Access만: 콘솔 UI·데이터 모델 부재
- CASE C: 정적 SEO 파이프라인·배포 모델과 충돌

### 저장소

`ADMIN_KV` (Cloudflare KV)
- notices, daily analytics aggregates, email_logs, audit_logs, job snapshots

### 인증

기존 개념 재사용: `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`  
Workers Web Crypto HMAC 세션 쿠키 (HttpOnly, Secure, SameSite=Strict)  
프론트엔드 비밀번호 비교·localStorage 토큰 **금지**

### 공개 분리

- `/admin/*` robots + sitemap + noindex + X-Robots-Tag
- 공개 사이트에는 활성 공지 최소 필드만
- analytics collect는 PII 없는 이벤트만
