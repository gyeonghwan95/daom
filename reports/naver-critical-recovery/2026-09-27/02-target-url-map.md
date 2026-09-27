# 02 — Target URL map (query → representative URL)

Lock file: `src/data/seoIntentOwners.ts` (`TITLE_FROZEN = true`, internal only — no meta keywords output).

| Query | Intent | Representative URL | Secondary queries (same URL) | Supporting URLs (link only, no primary title) |
|---|---|---|---|---|
| 부산 상속전문 법무사 | PROVIDER_SELECTION | `/부산상속전문법무사` | 부산 상속 법무사 추천·선택 | `/부산상속법무사`, `/부산상속포기`, `/부산한정승인` |
| 부산 상속포기 법무사 | ACTION_PROCEDURE | `/부산상속포기` | 부산 상속포기, 상속포기 3개월, 후순위 | `/상속포기비용`, `/부산가정법원상속포기`, `/상속포기자가진단`, `/부산한정승인` |
| 해운대구 법무사 | LOCAL_PROVIDER | `/해운대법무사` | 해운대 법무사, 센텀·재송동·반여동 법무사 | `/센텀법무사`, `/재송동법무사`, `/해운대구부동산등기`, `/해운대구상속등기`, `/업무사례/해운대구법무사` |

- No new URL created. `/해운대구법무사` not created. No spacing-variant URLs.
- `/부산상속법무사` is **not** a target and was not modified (hub for "which procedure do I need").

## Final role test

| Q | Query | Top internal URL (after, heuristic score) | Distinct? |
|---|---|---|---|
| Q1 | 부산 상속전문 법무사 | `/부산상속전문법무사` (rank 1) | yes |
| Q2 | 부산 상속포기 법무사 | `/부산상속포기` (rank 1) | yes |
| Q3 | 해운대구 법무사 | `/해운대법무사` (rank 1) | yes |

Three queries map to three different URLs; each page's dominant intent matches its role (see `10-intent-entropy.csv`).
