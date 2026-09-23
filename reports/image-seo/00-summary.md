# Image SEO Phase 1 Summary

## Scope
Phase 1: hub + core service/local pages from `PAGE_VISUALS` (~39).

## Architecture
- **SERP representative**: `/generated/serp/**/*.jpg` 1200×1200, **no baked text**
- **Card derivative**: `/generated/cards/**/*.webp` 720×720, no text
- **Card headline**: HTML/CSS overlay (`ContentThumbnailCard`)
- **og:image / body figure / ItemList image**: same SERP JPG (absolute URL)

## SEO protection
URL / title / H1 / description / canonical / robots: intentionally unchanged.

## Commands
- `npm run visuals:generate`
- `npm run visuals:validate`
- `npm run visuals:contact-sheet`

## Notes
Naver SERP thumbnails are not guaranteed; this maximizes analysis-friendly signals only.
