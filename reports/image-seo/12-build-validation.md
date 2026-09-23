# Build / SEO protection checklist

## Intentional changes
- Added SERP JPG + card WebP assets
- Added HTML-overlay related carousels
- og:image / body figure prefer pageVisuals when present
- ItemList image uses SERP absolute URL when carousel shown

## Must remain unchanged
- URL
- title
- H1
- meta description
- canonical
- robots / noindex policy
- sitemap URL structure

## Scripts
- `npm run visuals:generate`
- `npm run visuals:validate`

Phase 1 validation: 39 pages, 0 errors (exact duplicate = 0).
