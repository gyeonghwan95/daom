# SERP Upgrade — Phase 1 AUDIT + Phase 2 PROTECT

날짜: 2026-08-11  
모드: **AUDIT ONLY + PROTECT** (본문/URL/title/H1/canonical/OG 바인딩 변경 없음)

## 1. URL freeze snapshot

| File | Total |
|------|------:|
| `reports/seo/routes-before-serp-upgrade.json` | 1639 |
| Source | `scripts/output/seo-paths.json` |

## 2. Protected registry

- Updated `config/seo-protected-assets.json` (v2)
- FULL / SEO_PROTECTED pages:  
  `/부산법무사`, `/부산상속법무사`, `/부산상속등기`, `/부산상속포기`, `/부산한정승인`,  
  `/부산법인법무사`, `/부산법인등기`, `/해운대법무사`, `/서면법무사`, `/센텀법무사`
- Ranking observations with `url: null` → `unconfirmedRankingCandidates` (추측 확정 금지)
- Default for unknown performance: treat as protectable (`defaultUnknownPerformance`)

## 3. Image audit (no bind)

From `scripts/output/page-image-audit.json` (2026-07-26):

| Signal | Value |
|--------|------:|
| Manifest pages | 38 |
| status needed | 20 |
| status existing-review | 18 |
| ready (approved/applied) | 0 |
| ogImageMissing (inventory) | 0 |
| Top duplicate | `/image/사무소-전경.jpg` × 477 |

Runtime resolver (`resolvePageSeoImage`) already refuses non-ready manifest images → **broken OG bind risk already mitigated**.

Classification policy for next phase:

| Class | Action |
|-------|--------|
| IMAGE_GOOD / IMAGE_UNKNOWN on FULL | **NO_CHANGE** |
| IMAGE_DUPLICATE (non-protected) | Report only until unique asset approved |
| IMAGE_BAD / IMAGE_MISSING | LEVEL 0–1 fix candidates only |

## 4. Guard

- Script: `scripts/seo-regression-guard.mjs`
- npm: `npm run seo:regression`
- Snapshots: `serp-before-snapshot.json` / `serp-after-snapshot.json`
- Safety report: `reports/seo/serp-regression-safety.json`

## 5. Next phases (not started)

3. IMAGE FIX ONLY — BAD/MISSING only  
4. ADDITIVE STRUCTURE — related/ItemList/internal links  
5. REGRESSION TEST  
6. REPORT (high-risk stays in `HIGH_RISK_SERP_RECOMMENDATIONS.md`)

## 6. Explicit non-actions this phase

- URL/slug/redirect/merge/noindex: **0**
- Protected title/H1/canonical/description/coreContent: **0**
- Bulk OG replace: **0**
- Sitemap URL delete / lastmod mass bump: **0**
