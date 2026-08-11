# Admin Operations Console — Architecture

작성일: 2026-08-11  
관련: [CURRENT_SYSTEM_AUDIT.md](./CURRENT_SYSTEM_AUDIT.md)

## 선택: CASE B (변형)

**정적 공개 사이트 (`out/`) + Cloudflare Pages Functions + `ADMIN_KV`**

### 왜

| 대안 | 기각 사유 |
|------|-----------|
| CASE A (기존 Node API + DB) | 프로덕션은 static export. Node `/api`는 stash되어 배포에 없음 |
| CASE C (완전 정적) | 프론트엔드 비밀번호 비교 금지 |
| 신규 대형 백엔드/D1/Supabase | 1인 운영에 과설계 |

### 핵심 구성

```
브라우저 /admin (SSG HTML)
  → cookie session (HttpOnly)
  → /api/admin/*  (Pages Function, auth 필수)
  → ADMIN_KV      (공지·일별 집계·메일로그·audit)

공개 사이트
  → /api/analytics/collect  (익명 집계, soft-fail)
  → /api/notices/active     (활성 공지만)
  → /api/quick-inquiry      (기존 문의, 메일 로그 append)
```

### 역할

- `OWNER_ADMIN` 1명만 (`ADMIN_COUNT = 1`)
- RBAC / 팀 / 초대 없음

### 인증

- `ADMIN_PASSWORD` (≥12) + `ADMIN_SESSION_SECRET` (≥32)
- HMAC 세션 쿠키 `daom_admin_session`
- HttpOnly / Secure / SameSite=Strict / 8h
- 로그인 rate limit, write API Same-Origin 검사
- `NEXT_PUBLIC_*` / localStorage / 하드코딩 비밀번호 금지

### 검색 제외

- `robots.txt` disallow `/admin`
- sitemap `BLOCKED_PREFIXES`
- metadata `robots: noindex`
- `_headers` `X-Robots-Tag`

### 공개 사이트 영향 최소화

- Admin UI는 `/admin` route만 (별도 번들 청크)
- Floating notice / AnalyticsBeacon은 dynamic import + soft-fail
- 문의·CTA 실패를 analytics가 막지 않음
