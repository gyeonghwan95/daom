# 13 — Technical SEO

| URL | index | canonical | sitemap | static export | notes |
|-----|-------|-----------|---------|---------------|-------|
| `/부산상속법무사` | index,follow | self | Y | Y (post-build) | GROUP A champion |
| `/부산상속포기` | index,follow | self | Y | Y (post-build) | GROUP B champion |
| `/부산상속전문법무사` | noindex,follow | → `/부산상속법무사` | policy | Y | **no redirect** |

## Meta
- keywords meta: 미사용 (site convention)
- title separator: `｜` (fullwidth) on new titles
- description: renunciation hub 80–120자 pre-suffix (`renunciation-hub-identity.ts`)

## Internal linking
- Hub → `/부산상속포기` labeled「3개월·후순위」
- Renunciation → back to hub only where procedure branch needed

## Crawl signals
- IndexNow: 2 URLs (`16-indexnow-targets.txt`)
- Protected URL snapshot: `scripts/inheritance-seo-snapshot.mjs` (targets: hub + renunciation only)

## Not changed
- URL slugs, redirects, robots.txt, global sitemap policy
