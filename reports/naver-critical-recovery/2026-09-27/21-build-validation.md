# 21 — Build validation

| Check | Result |
|---|---|
| `npm run build` (sitemap → search index → next build → static export → seo-dom samples) | EXIT=0, "all samples OK" |
| `npx tsc --noEmit` | 1 pre-existing error only: `src/data/seoExperiments/reserved-inheritance-intents.ts(42)` (not touched) |
| `npx eslint` on changed files | pass (0 problems) |
| Protected diff | NON_TARGET_CHANGED_URLS = 0 |
| QA hard gates (HTTP_200 … TARGET_ROLE_CLEAR, forbidden phrases, no meta keywords, no fake schema) | ALL PASS × 3 targets (`20-after-audit.csv`) |

## Similarity (word 3-gram shingle Jaccard)
| Pair | first700 (gate) | body (gate) |
|---|---|---|
| 상속전문 vs /부산상속법무사 | 0.115 (<0.45) | 0.360 (<0.60) |
| 상속전문 vs /부산상속포기 | 0.076 (<0.35) | 0.260 (<0.50) |
| 해운대 vs nearest (/해운대구부동산등기) | 0.184 | 0.345 |

## Intent (dominant-term counts)
| Page | selection | procedure | local | dominant |
|---|---|---|---|---|
| /부산상속전문법무사 | 29 | 11 | 9 | selection |
| /부산상속포기 | 13 | 73 | 7 | procedure |
| /해운대법무사 | 3 | 3 | 78 | local |

## DOM (after)
| Page | H2 | body chars | contextual links | text before H1 | consult words before H1 | remote note position |
|---|---|---|---|---|---|---|
| 상속전문 | 8 | 2,994 | 7 | breadcrumb + eyebrow | 0 | 0.93 |
| 상속포기 | 9 | 3,460 | 6 | same | 0 | 0.92 |
| 해운대 | 8 | 2,406 | 7 | same | 0 | 0.90 |

## Browser (local static export, Cursor browser)
- 375×812: H1 + first answer within 0.55 / 0.96 / 0.78 screens; no horizontal overflow; body images loaded.
- 1440×900: article width 780px.
- Measured on the first build; the final build changed text only (no layout/CSS change).

## og:image (live fetch of the same paths)
- specialist, renunciation: 200 image/jpeg. 해운대: new ASCII file `/image/og/haeundae-office-nameplate.jpg` (200 after deploy; before = 404).
