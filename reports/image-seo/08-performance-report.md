# Performance notes (Phase 1)

- Next.js `images.unoptimized: true` (Cloudflare static export)
- SERP JPG 1200 used only for og/body figure (one per page)
- Carousel cards use 720 WebP + `loading="lazy"`
- No new carousel library (CSS scroll-snap)
- Autoplay: none
- LCP: hero remains priority; representative figure is not forced priority
- CLS: `aspect-square` wrappers on figure + cards
