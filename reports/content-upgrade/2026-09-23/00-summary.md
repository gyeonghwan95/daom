# Content Upgrade Audit — 2026-09-23

## Scope
- Indexable PageData pages audited: **1639**
- Method: registry inventory + Jaccard + SimHash prefilter + region-normalized similarity
- **No URL / canonical / noindex / redirect changes**

## Problem counts
| Issue | Count |
|------|------:|
| Thin (<2000 chars) | 1234 |
| Long intro / late answer | 1353 |
| CRITICAL_DUPLICATE pairs | 422 |
| HIGH_SIMILARITY pairs | 631 |
| Region-normalized CRITICAL pairs | 448 |
| First700 problems (sample) | 0 |
| Vertical wall readability | 1 |
| Metadata problems | 14 |
| Low outgoing links (<3) | 0 |
| CRITICAL grade pages | 0 |
| WEAK grade pages | 69 |

## Priority actions (no auto-merge)
1. **P0** — CRITICAL_DUPLICATE / cannibalization pairs → REPOSITION or MERGE_CANDIDATE (approval)
2. **P1** — Important hubs/details that are thin + low first700 score
3. **P2** — Long intro / promotional openings
4. **P3** — Vertical wall readability (TOC/summary/steps)
5. **P4** — Metadata + internal links

## Top cannibalization pairs (norm)
- /법무사상담전준비 ↔ /법무사방문전준비 (norm 0.996, raw 0.996)
- /부산개인회생상담 ↔ /부산회생상담 (norm 0.996, raw 0.996)
- /아파트집단등기 ↔ /오피스텔집단등기 (norm 0.993, raw 0.993)
- /아파트집단등기 ↔ /신축집단등기 (norm 0.993, raw 0.993)
- /오피스텔집단등기 ↔ /신축집단등기 (norm 0.993, raw 0.993)
- /신축보존등기 ↔ /건물보존등기 (norm 0.993, raw 0.993)
- /신축보존등기 ↔ /집합건물보존등기 (norm 0.993, raw 0.993)
- /신축보존등기 ↔ /오피스텔보존등기 (norm 0.993, raw 0.993)
- /신축보존등기 ↔ /상가보존등기 (norm 0.993, raw 0.993)
- /건물보존등기 ↔ /오피스텔보존등기 (norm 0.993, raw 0.993)
- /건물보존등기 ↔ /상가보존등기 (norm 0.993, raw 0.993)
- /집합건물보존등기 ↔ /상가보존등기 (norm 0.993, raw 0.993)
- /오피스텔보존등기 ↔ /상가보존등기 (norm 0.993, raw 0.993)
- /수영구개인회생 ↔ /북구개인회생 (norm 0.991, raw 0.975)
- /수영구개인회생 ↔ /사상구개인회생 (norm 0.991, raw 0.975)

## Top thin important pages
- /경남재단법인설립 (559 chars, IMPROVE)
- /공익법인임원변경등기 (565 chars, IMPROVE)
- /환경단체사단법인설립 (568 chars, IMPROVE)
- /노무법인설립등기 (573 chars, IMPROVE)
- /부산학교법인등기 (582 chars, IMPROVE)
- /학교법인임원변경등기 (585 chars, IMPROVE)
- /관세법인설립등기 (587 chars, IMPROVE)
- /영농조합법인설립 (589 chars, IMPROVE)
- /세무법인설립등기 (590 chars, IMPROVE)
- /창원비영리법인설립 (592 chars, IMPROVE)
- /부산체육단체법인설립 (593 chars, IMPROVE)
- /부산의료법인등기 (611 chars, IMPROVE)
- /경남사단법인설립 (611 chars, IMPROVE)
- /의료법인임원변경등기 (614 chars, IMPROVE)
- /영어조합법인설립 (615 chars, IMPROVE)

## Approval needed
- MERGE_CANDIDATE: see 06-cannibalization.csv (do not auto-redirect)
- CREATE_CANDIDATE: deferred — strengthen existing pages first

## Batch 1 improvements (2026-09-23)
Repositioned **10** near-duplicate pairs via search-intent overrides (URL unchanged):

- `/법무사상담전준비` ↔ `/법무사방문전준비`
- `/부산개인회생상담` ↔ `/부산회생상담`
- `/전자등기` ↔ `/전자신청`
- `/등기완료기간` ↔ `/등기얼마나걸리나요`
- `/부산개인파산법무사` ↔ `/부산파산법무사`

Source: `src/lib/local-landing/search-intent/overrides/content-upgrade-reposition-batch1.ts`

IndexNow list: `15-indexnow-targets.txt`
