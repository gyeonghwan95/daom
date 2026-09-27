# 11 — Technical SEO (targets only)

## Rendering path
- Targets are matched in `src/app/[landingSlug]/page.tsx` by `getNaverRecoveryTarget()` and rendered by the new target-only `src/components/naver-recovery/NaverRecoveryTargetView.tsx`.
- The view does **not** use `PageContainer` / `PageSectionNavLayout`. That shared layout renders the section-navigator consult panel (카카오·톡톡·전화·1분 문의·예약) before `<main>`, which put 279–300 chars of CTA text before the H1. Shared components were not modified.
- Content is static HTML in the export (no client-only main content, no tabs/accordion hiding the answer; FAQ answers are in the DOM).

## Metadata
- `createPageMetadata()` with owner title/description from `src/data/seoIntentOwners.ts`; no `keywords` meta.
- Self canonical, `index, follow`, og:url = canonical.
- og:image uses ASCII paths to avoid the sitewide double-encoding bug (see 16):
  - specialist `/generated/serp/inheritance/busan-inheritance-specialist.jpg` (1200×1200)
  - renunciation `/generated/serp/inheritance/busan-inheritance-renunciation.jpg` (1200×1200)
  - 해운대 `/image/og/haeundae-office-nameplate.jpg` (1200×630, new)
  Body image = og image subject on each page.

## Structured data (target page level)
- `BreadcrumbList` + `WebPage` (name, description, h1 as headline, primaryImageOfPage, dateModified, about → global LegalService id).
- Global graph from `layout.tsx` (LegalService, Organization, Person, WebSite) is unchanged.
- No Review / AggregateRating / award / specialist certification added at page level.

## DOM / size
| | bytesBeforeH1 before → after | text before H1 (after) | consult words before H1 |
|---|---|---|---|
| specialist | 29,503 → ~26.6K | breadcrumb + eyebrow (12–16 chars) | 0 |
| renunciation | 30,408 → ~27.2K | same | 0 |
| 해운대 | 30,522 → ~26.5K | same | 0 |

Remaining bytes before H1 are the global header/nav (unchanged by rule).

## Sitemap
- lastmod source for targets: `src/lib/local-landing/naver-recovery-targets.ts` (contains `slug: "…"`), so only the 3 targets get 2026-09-27.
- `/업무사례` was pinned to its previous value (`2026-09-02`) in `scripts/lib/sitemap/lastmod-pins.json` because its lastmod is derived from the shared route file — keeps non-target lastmod unchanged.

## Viewport checks (local static export)
- 375px: H1 + first answer within 0.55 (renunciation) / 0.96 (specialist) / 0.78 (해운대) screens; no horizontal overflow; images loaded.
- 1440px: article column 780px.
