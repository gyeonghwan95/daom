# 12 — Build validation

| Check | Result |
|-------|--------|
| production build (`npm run build`) | PASS (follow-up rebuild 2026-09-22T12:25Z) |
| static export / out routes | PASS |
| sitemap validate | PASS (1636 URLs; noindex excluded=40 incl. 등기전문·법인전문) |
| seo-validate | PASS |
| target QA (`scripts/target-seo-qa.mjs`) | issues=0 |
| specialist bridges robots/canonical | `/부산등기전문법무사`, `/부산법인전문법무사` → `noindex, follow` + hub canonical |
| keyword ownership | OK |
| protected identity changes | **NON_TARGET_CHANGED_URLS = 0** |
| eslint (`npm run lint`) | FAIL (pre-existing repo-wide; not introduced by this surgery) |

## Follow-up (de-cannibalization)

- `seo/index-policy.json`: 등기전문·법인전문 → noindex + canonical to hubs
- `seo/keyword-map.json` + `config/seo-query-champions.json`: 9타깃 + 보상 ownership
- IndexNow: `scripts/submit-indexnow-targets.mjs` → `09-indexnow-targets.txt` (8 URLs)

## Scripts

- `scripts/target-seo-snapshot.mjs`
- `scripts/target-seo-qa.mjs`
- `scripts/check-target-final.mjs`
- `scripts/dump-target-seo.mjs`
- `scripts/check-specialist-meta.mjs`
- `scripts/submit-indexnow-targets.mjs`
