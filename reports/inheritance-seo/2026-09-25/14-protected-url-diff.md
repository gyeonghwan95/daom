# 14 — Protected URL diff (inheritance SEO)

## Method

1. Build static export → `out/`
2. `node scripts/inheritance-seo-snapshot.mjs --phase=before|after`
3. Compare protected URLs (all indexable minus TARGET_URLS)

## Identity fields compared

- title
- description
- canonical
- h1
- body

Raw HTML hash는 Next chunk ID 때문에 매 빌드 변동 → protected 비교에서 제외.

## Result

**NON_TARGET_CHANGED_URLS = 0**

No protected URL identity drift detected.


Generated: 2026-09-25T15:31:15.247Z
