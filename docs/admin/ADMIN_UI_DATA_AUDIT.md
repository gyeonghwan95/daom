# Admin UI & Data Audit

> Generated: 2026-08-12 · 다옴 운영 관제센터 전수 조사

## Routes

| URL | 화면명 | 기능 | Data Source | R/W | 주요 문제(개선 전) | 개선 |
|-----|--------|------|-------------|-----|-------------------|------|
| `/admin` | 대시보드 | KPI, alerts, hourly, funnel | `buildDashboard()` → ADMIN_KV daily/hourly | R | encoded URL, no hourly chart | ✅ KPI 8개, 시간대 chart, PageIdentity |
| `/admin/analytics` | 유입 분석 | 일별·source·device·SmartPlace | `/api/admin/analytics`, dashboard | R | source/device 미표시 | ✅ source/device/네이버 표 |
| `/admin/pages` | 페이지 성과 | 30일 path stats | `buildPagesReport()` | R | encoded URL, 오늘만 | ✅ 7/30일, 검색, trend badge |
| `/admin/conversions` | 전환 분석 | Funnel·채널·SmartPlace | `buildConversionsReport()` | R | 없음 | ✅ 신규 |
| `/admin/email` | 메일 | 발송 로그 | `email:logs` KV | R | 로그 미기록 | ✅ quick-inquiry 연동 |
| `/admin/notices` | 공지 | CRUD + preview + CTR | `notices:all` + day.notices | R/W | UI 단순 | ✅ split preview, tabs, 7일 CTR |
| `/admin/monitoring` | 모니터링 | health + automation inventory | `buildDashboard().health` | R | 정적 카드 | ✅ analytics stale + job table |
| `/admin/seo` | SEO | build-time audit summary | `admin-seo-summary.json` | R | placeholder only | ✅ KPI/이슈/보호페이지 |
| `/admin/settings` | 설정 | secret 상태 | session API | R | — | 유지 |

**미노출 메뉴** (데이터 없음): `/admin/naver`, `/admin/automation`, `/admin/inquiries` — dashboard/conversions/monitoring에 통합.

## Infrastructure

| Layer | Path | Notes |
|-------|------|-------|
| UI | `src/app/admin/*` | AdminShell, noindex layout |
| API | `functions/api/admin/[[path]].ts` | Cookie session, CSRF on writes |
| Analytics ingest | `functions/api/analytics/collect.ts` | Whitelist events, rate limit |
| Storage | ADMIN_KV | `analytics:day:*`, `analytics:hourly:*`, `analytics:recent`, `email:logs`, `notices:all`, `audit:logs` |
| Auth | `functions/_lib/admin-ops/crypto.ts` | HMAC session, 8h |
| Local dev | `npm run preview:cf` | Functions require wrangler pages dev |

## Analytics Events

| Event | Aggregated | Client emits | Admin label |
|-------|-------------|--------------|-------------|
| `page_view` | ✅ daily, hourly, path, source, device | ✅ | 페이지뷰 |
| `cta_click` | ✅ | ✅ | CTA 클릭 |
| `phone_click` | ✅ (+cta) | ✅ | 전화 |
| `kakao_click` | ✅ | ✅ | 카카오 |
| `naver_click` | ✅ | ✅ | 네이버톡톡 |
| `consultation_start` | ✅ | ✅ | 상담 시작 |
| `consultation_submit` | ✅ | ✅ (via quick-inquiry) | 문의 제출 |
| `naver_place_click` | ✅ + placement | ✅ | 네이버 플레이스 이동 |
| `notice_*` | ❌ | partial | — |
| `search_used` | ❌ | rare | — |

**Unique visitor**: 없음 — UI는 “페이지뷰”로 표기.

## Known Data Issues (addressed)

1. **Encoded vs decoded paths** — `normalizePath()` now decodeURIComponent; `mergePathStats()` on read merges legacy keys.
2. **Email log empty** — `appendEmailLog` wired in quick-inquiry handler.
3. **No hourly** — `analytics:hourly:YYYY-MM-DD` with KST buckets 0–23.
4. **Sources/devices collected but hidden** — exposed in dashboard/analytics.

## Storage Architecture Decision

**B: KV + preaggregated stats** — 현재 트래픽(1인 운영, low traffic)에 적합. D1/Analytics Engine migration 불필요.

## Mobile

- Sidebar → horizontal scroll tabs (short labels)
- Activity list stacks on narrow screens
- Hourly chart: x-axis every 3h

## Auth / SEO Safety

- `/admin/*` noindex (layout)
- Not in sitemap
- Admin chart/components only imported from admin routes
- Public bundle: no chart library added
