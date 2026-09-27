# 19 — Protected URL diff

Method: `scripts/ncr-snapshot.mjs` hashes the final HTML of every exported page (before = build before any change, after = final build) and compares all non-target URLs. It also compares sitemap `<loc>` sets and non-target `lastmod`.

| Item | Result |
|---|---|
| Exported pages | 1,657 |
| Targets (allowed to change) | 3 — `/부산상속전문법무사`, `/부산상속포기`, `/해운대법무사` |
| Protected URLs compared | 1,654 |
| Protected URLs with changed HTML | **0** |
| New pages | 0 |
| Removed pages | 0 |
| Sitemap URLs added / removed | 0 / 0 |
| Non-target sitemap lastmod changed | 0 |

**NON_TARGET_CHANGED_URLS = 0 — PASS**

Per-URL hash list: `19-protected-url-diff.csv`.

Why no spill-over:
- No change to `layout.tsx`, global metadata, header/nav, footer, shared CTA, sitewide SEO components or global CSS.
- Targets branch to a new target-only view inside `src/app/[landingSlug]/page.tsx`; every other slug takes the original path.
- `/업무사례` shares the route file used for lastmod, so its lastmod was pinned to the previous value.
- Links to the targets from other pages were **not** added (see 15).
