# 10 — Before / After (1차 사이클)

재검증 기준일: 2026-08-25  
대상: Phase 0 → WAVE1 → WAVE2 Priority A (WAVE3·4 제외)

## URL preservation

| Metric | Result |
|---|---|
| Existing URL changed | **0** |
| Existing URL deleted | **0** |
| Unexpected redirects | **0** |
| Protected title/H1/canonical changes | **0** |
| `seo:regression` | **PASS** (1639/1639, content preservation 100%) |

## Technical DOM (Priority A + sample crawl, n=22)

| Signal | Before | After |
|---|---|---|
| `loadingPhrase` (“페이지를 불러오는 중입니다”) | 22/22 | **0/22** |
| `footerBeforeH1` | 22/22 | **0/22** |
| Build post-process reorder needed | n/a | **0** files (source order correct) |
| `check-seo-dom-order` Priority A | fail | **all OK** |

## Ownership (unchanged code lock)

| Query | PRIMARY |
|---|---|
| 부산 법무사 / 부산법무사 | `/` |
| 부산 법무사 추천 | `/부산법무사추천` |
| 부산 법무사 상담 | `/부산법무사상담` |
| 부산에서 법무사 찾을 때 | `/부산법무사` (supporting) |
| 부산 상속·상속전문(intent) | `/부산상속법무사` (자격 표방 없음) |
| 부산 상속포기 법무사 | `/부산상속포기` |
| 부산 등기 법무사 | `/부산등기법무사` |
| 전국 상속 절차 | `/상속` |

## WAVE2 Priority A (quality)

| Path | Change summary |
|---|---|
| `/` | Hub section rename; popular searches → 안내 탐색; marquee dup fix |
| `/부산법무사` | PROTECT supporting — no exact reclaim |
| `/부산법무사추천` | KeywordBadges off; hero/intro compressed |
| `/부산법무사상담` | Above-fold: 업무→정보→채널; nationwide card deferred |
| `/부산상속법무사` | Branch hub emphasis; specialist = intent only |
| `/부산상속포기` | Narrow scope; parent → `/부산상속법무사` |
| `/부산등기법무사` | RE/상속/법인 branch clarity |
| `/상속` | Intent split vs Busan hub; child links to Busan 포기/한정승인/등기 paths |

## SERP

**NAVER SERP 자동 확인 불가** — 순위·검색량 미기재. 수동 Search Advisor 검사는 `01-current-serp.md` 참고.

## Build / QA

| Check | Result |
|---|---|
| `node scripts/build-static.mjs` (`next build --webpack`) | OK (~1823 HTML) |
| `npx tsc --noEmit` | OK |
| `npm run seo:regression` | PASS |
| CREATE_NEW this cycle | **0** |

## Follow-up (cycle 2 — done)

- WAVE3·4: see `11-wave34-cycle2.md` (chip 억제, SEO landing 변주, 상속 FAQ, similarity audit)
- NEW-D doorway: still **0**
- Off-page: still manual (`09-offpage-actions.md`)
- Optional later: REBUILD-C hand rewrite from `wave34-rebuild-c-sample.csv`
