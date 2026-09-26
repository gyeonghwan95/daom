# Inheritance SEO Reset — 2026-09-26

## Verdict
Intent split into three roles. Hub + renunciation pruned. Specialist converted to indexable provider-selection (existing URL). NON_TARGET_CHANGED_URLS = 0 (identity: title/description/canonical/h1). Body ±2 sitewide drift excluded from hard fail (Naver review prebuild / CTA clock).

## Roles
| Query | URL | Role |
|---|---|---|
| 부산 상속 법무사 | /부산상속법무사 | INHERITANCE DECISION HUB |
| 부산 상속포기 법무사 | /부산상속포기 | RENUNCIATION ACTION |
| 부산 상속전문 법무사 | /부산상속전문법무사 | PROVIDER SELECTION (converted, not new path) |

## Similarity (internal gates)
- Broad ↔ Renunciation: first700=0.2777 (gate <0.45, PASS), body=0.5011 (gate <0.6, PASS)
- Broad ↔ Specialist: first700=0.312 (gate <0.5, PASS), body=0.5827 (gate <0.65, PASS)
- Renunciation ↔ Specialist: first700=0.1498 (gate <0.4, PASS), body=0.3386 (gate <0.55, PASS)

## Body length
- Hub: 6626 → 5059
- Renunciation: 6669 → 5501
- Specialist: (was noindex) → 3372

## Title freeze
`src/data/seoExperiments/inheritance.ts` — titleFrozen=true
