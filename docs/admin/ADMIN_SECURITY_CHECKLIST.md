# Admin Security Checklist

## Authentication

- [ ] `ADMIN_PASSWORD` ≥ 12, 저장소/프론트에 없음
- [ ] `ADMIN_SESSION_SECRET` ≥ 32, `NEXT_PUBLIC_*` 아님
- [ ] 세션 쿠키 HttpOnly + Secure + SameSite=Strict
- [ ] URL 숨김만으로 보안 처리하지 않음
- [ ] 비로그인 `/admin/*` UI는 로그인 게이트
- [ ] 비로그인 `/api/admin/*`(session/login 제외) → 401

## CSRF / XSS

- [ ] Admin write: Origin/Referer same-host 검사
- [ ] 공지 plain text (HTML 입력 없음)
- [ ] CTA URL: `javascript:`/`data:` 거부, `/` 또는 http(s)만
- [ ] React text 노드로 렌더 (XSS escape)

## Privacy

- [ ] analytics에 PII 없음
- [ ] 메일 로그 마스킹, 본문 미저장
- [ ] fingerprint / 장기 정확 IP 없음

## Search exclusion

- [ ] robots disallow `/admin`
- [ ] sitemap에서 `/admin` 제외
- [ ] metadata + `X-Robots-Tag: noindex, nofollow`

## Rate limit

- [ ] login attempts 제한
- [ ] `/api/analytics/collect` IP당 분당 상한

## Audit

- [ ] login / notice create·publish·archive 기록

## Public isolation

- [ ] 공개 메뉴에 admin 링크 없음
- [ ] 공지/analytics 실패 시 공개 사이트 정상
- [ ] 관리자 번들이 홈 LCP를 유의미하게 악화하지 않음
