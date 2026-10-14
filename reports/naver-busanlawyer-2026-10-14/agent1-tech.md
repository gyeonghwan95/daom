# agent1 — 기술·실제 수집 (2026-10-14 20:22 KST, 운영 b201a0b)

> 모든 측정은 이 PC(KR, ISP 경유)에서 curl/fetch로 UA를 바꿔 보낸 것이다. **UA 위장 성공 ≠ 실제 Yeti 수집 성공.** 실제 수집 여부는 서치어드바이저 수집 로그/웹페이지 수집 요청으로만 확인 가능(접근 불가).

## 1) 15개 경로 (Yeti UA) — 정상
- 15/15 200, 리디렉션 0, X-Robots-Tag 없음, meta robots `index, follow, max-image-preview:large`, canonical 자기 자신(홈은 `https://…kr` 슬래시 없음 — 이전 보고서와 동일), H1 각 1개, 본문 2.3k~8.8k자. 원자료: `live-live.json`, `baseline.json`(운영 실제 응답 표시).
- 홈 브라우저 UA vs Yeti UA: 둘 다 200, 404,214 B 동일. 차이 88 B는 Cloudflare 이메일 난독화(`__cf_email__`) 랜덤 키뿐 → **UA별 클로킹·차단 없음(정상).**

## 2) 홈 초기 HTML (live-home.html) — 정상
- title 1, description 1, canonical 1, robots+googlebot meta 각 1 (중복 없음).
- JSON-LD 8블록 파싱 오류 0, 최상위 @id 14개 충돌 0.
- 본문 `<a>` 194 (내부 162, 고유 내부 94).
- 자산 79개 중 샘플 40(JS 14, /_img 변환 webp·png 22, font 1, CSS 3) + og:image(`/_img/image/사무소-전경.og.jpg`, 200 image/jpeg 114 KB) → 404/오류 0. 동시성 4.

## 3) 공개 HTML의 KV·관리자 의존 — 없음(정상)
- `next.config.ts` `output: "export"` 정적 빌드. `functions/`에 `_middleware*` 없음, 함수는 `functions/api/*`만.
- `public/_routes.json` include `["/api/*"]` → `/` 등 공개 페이지는 Function을 타지 않음 → KV 호출 경로 없음.
- `src/app/layout.tsx`·`page.tsx`에 KV/fetch/동적 API 없음. 클라이언트에서 로드 후 `/api/notices/active`, `/api/turnstile-config` 호출(FloatingNoticeHost 등)만 존재 — 초기 HTML·색인에 무영향.
- `_headers` `/*`: 보안 헤더 + `Cache-Control: public, max-age=0, must-revalidate`만. noindex는 `/admin*`, `/api/admin/*`, `/resources/pdf/*`에 한정. `_redirects`에 `/` 규칙 없음.

## 4) Cloudflare 헤더·지연 — 가설(결함 아님)
- 홈: `cf-cache-status: DYNAMIC`, `age`·`server-timing` 없음, `content-encoding: br`(46.9 KB).
- TTFB 3회(Yeti UA, 비압축): 1.06 / 0.75 / 1.12 s, 총 4.2 / 3.6 / 10.4 s(404 KB 비압축). br 압축 시 TTFB 0.79 s / 총 1.09 s.
- `/cdn-cgi/trace`: `loc=KR`, **`colo=LAX`** (10-12엔 SEA). 한국 클라이언트가 여전히 미국 서부 colo로 라우팅 — 이 PC ISP 경로 특성이며 Yeti(네이버 IDC) 경로와 같다는 증거 없음. 10-12 대비 TTFB는 2~8 s → ~1 s로 개선.
- 판정: 가설(순위 하락 원인으로 확정 불가). 코드 패치 대상 아님.

## 결론
**기술 정상.** 운영 15개 URL 상태·메타·canonical·JSON-LD·자산·UA 동일성 모두 이상 없음. 공개 HTML은 KV·관리자 통계와 무관. 남은 항목은 비한국 colo 라우팅(가설)과, 실제 Yeti 수집 확인(서치어드바이저, 수동 과제)뿐.
