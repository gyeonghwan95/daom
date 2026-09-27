# 18 — Naver Search Advisor checklist (manual — Cursor does not log in)

Do these after deploy. Check the live page first (title/H1 below must show).

## 1. Confirm deploy
| URL | Expected title | Expected H1 |
|---|---|---|
| https://다옴법무사사무소.kr/부산상속전문법무사 | 부산 상속전문 법무사를 찾는다면｜업무범위와 선택 기준 | 부산에서 상속전문 법무사를 찾을 때 무엇을 확인해야 할까요? |
| https://다옴법무사사무소.kr/부산상속포기 | 부산 상속포기 법무사｜3개월·후순위 상속인부터 확인 (unchanged) | 부산 상속포기, 3개월과 다음 상속인부터 확인하세요 (unchanged) |
| https://다옴법무사사무소.kr/해운대법무사 | 해운대구 법무사｜센텀·재송·반여 부동산·상속·법인등기 | 해운대구 법무사, 어떤 업무를 맡길 수 있을까요? |

## 2. Search Advisor (searchadvisor.naver.com → 사이트 선택)
- [ ] 요청 → **웹페이지 수집**: submit the 3 URLs above (1st: `/부산상속전문법무사`).
- [ ] 요청 → **사이트맵 제출**: resubmit `https://xn--2j1br1na42lvxja38mk8r.kr/sitemap.xml` (lastmod for the 3 URLs is 2026-09-27).
- [ ] 검증 → **웹페이지 최적화**: run for each URL; expect title/description/og OK, robots allowed.
- [ ] 검증 → **robots.txt**: Yeti allowed (`Allow: /`).
- [ ] 리포트 → **수집 현황 / 색인 현황**: note whether `/부산상속전문법무사` shows as collected and indexed. If "수집됨·미색인" persists after 2–3 weeks → report back (CRAWLED_NOT_INDEXED).
- [ ] 검색 노출 확인: search `site:다옴법무사사무소.kr 부산상속전문법무사` after a few days.

## 3. IndexNow
- `17-indexnow-targets.txt` (3 URLs). `npm run indexnow` submits its own priority list and has no URL-list option, so submit these 3 once through any IndexNow client (Naver endpoint) or rely on step 2. Do not repeat daily.

## 4. Do not
- Do not request removal / change canonical / add noindex for any other URL.
- Do not change Cloudflare security (WAF, Bot Fight) for Yeti — no challenge was observed.

Rankings depend on Naver's own evaluation; these steps make the pages eligible and easy to crawl, they do not guarantee a position.
