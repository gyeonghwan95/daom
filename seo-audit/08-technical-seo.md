# 08 — Technical SEO (WAVE1)

## Findings (before)

From local `out/` crawl (`urls.csv`, 22 pages):

- `hasLoadingPhrase=true` on **22/22**
- `footerBeforeH1=true` on **22/22**

Root cause:

1. App Router `loading.tsx` → `PageSkeleton` text in HTML stream
2. Root `layout.tsx` rendered Footer as sibling after `{children}` — page Suspense hole flushed Footer NAP before Main/H1

## Fixes applied

| Issue | Fix |
|---|---|
| Loading phrase in HTML | All public `loading.tsx` return `null` |
| Footer before Main/H1 | Footer moved into page tree (`SiteChromeAfterMain` after `<main>` in `PageContainer` + home); `scripts/fix-html-dom-order.mjs` post-build safety net |
| Marquee duplicate text in SSR | `InfiniteMarquee` clones only after mount |
| Header status text ×3 | Removed measure DOM clone; measure visible node only |
| HOME keyword section title | Renamed to user-centric hub label |
| Recommend KeywordBadges | Suppressed for `/부산법무사추천` |
| Consult nationwide card | Hidden on consult hub above-fold |

## Deploy

`scripts/build-static.mjs` uses `next build --webpack` (Turbopack hang on CF).
`next.config.ts` omits `redirects` when `STATIC_EXPORT=true`.
Build pipeline runs: `fix-html-dom-order` → route/sitemap/seo validate → `check-seo-dom-order`.

## Guard

`node scripts/check-seo-dom-order.mjs` — Priority A samples must have Main/H1 before Footer and no loading phrase.

## Remaining (follow-up cycles)

- Soft-nav UX: rely on `NavigationProgress` (client-only)
- WAVE3: thin district similarity
- WAVE4: long-tail rewrite
