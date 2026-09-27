# 16 — Global issues requiring approval (NOT changed)

Fixing any item below changes the final HTML of protected URLs, so each needs your explicit approval.

## G1. Sitewide og:image 404 (double-encoded URL) — HIGH
- 1,611 of 1,657 exported pages output an og:image like `/image/%25EC%2582%25AC…jpg` (a Korean file name percent-encoded twice). Live check: `/`, `/about`, and (before) `/해운대법무사` → **404 text/html**.
- Cause: `encodePublicSrc()` already percent-encodes the path, then `getAbsoluteAssetUrl()` (`src/lib/seo/metadata.ts`) encodes it again.
- Effect: link previews (Naver, Kakao, social) show no image; image-based signals are lost.
- Fix option: decode-then-encode once in `getAbsoluteAssetUrl`, or rename public images to ASCII. Changes og tags on ~1,611 URLs.
- Targets avoid it via ASCII og paths.

## G2. `isReservedInheritancePath` compares an encoded pathname — MEDIUM
- `PageSectionNavLayout`/`SectionNavigator` decide the "lean" (no consult panel) mode with `usePathname()`, which returns the percent-encoded path during static render, so the Korean-path check never matches.
- Effect: `/부산상속법무사` (and other reserved inheritance pages) still render the consult panel before H1.
- Fix: decode the pathname before comparing. Changes HTML of every page that uses the reserved list.

## G3. GLOBAL_NAP_CONFLICT — access text
- Official record (`src/lib/office-location.ts`, Naver Place): 부산광역시 해운대구 센텀동로 200 D동 1층 LAB9호 · 동해선 재송역, 센텀역 도보 5분 · 주차 가능 · 평일 09:00–18:00 (12–13 점심).
- 7 exported pages instead say "센텀시티역·벡스코 인근": `/센텀법무사`, `/센텀시티역법무사`, `/센텀시티역법인등기`, `/부산법무사무소`, `/부산법무사방문상담`, 2 blog posts. Not wrong geographically, but it is a second access description for the same entity.
- `/location` and `/office` mention "창조관" (building name not in the official address string).
- Fix: use `officeLocation.subway` on those pages; confirm whether "창조관" is the building's official name. Changes body text of 7–9 protected pages.

## G4. Person structured data — confirm only
- `Person` JSON-LD with `award` ("대한법무사협회장 표창", 2026.05.28) and `hasCredential` is output on `/about` only. It matches what `/about` displays, so it is not a false award. Please confirm the record; nothing was added to the targets.

## G5. Old target titles still held in secondary data sources — LOW
- `src/data/seoExperiments/inheritance.ts`, `src/lib/local-landing/region-hub-identity.ts`, `src/lib/local-landing/search-intent/overrides/busan-inheritance-specialist-lawyer.ts`, `scripts/output/seo-pages-manifest.json` still carry the old specialist/해운대 titles. The live `<title>`/H1/description come from `src/data/seoIntentOwners.ts`.
- These feed related-card labels, the site search index and admin tools; syncing them may change link text on protected pages.
- Fix: sync after approval (one source of truth = `seoIntentOwners.ts`).

## G6. CANNIBALIZATION_APPROVAL_REQUIRED
- Candidates listed in `03-internal-competition.csv` (top 5 per query). None outranks its representative after the change. No canonical / noindex / redirect / title change proposed.

## G7. Hosting redirect header (CLOUDFLARE_APPROVAL_REQUIRED, optional)
- 308 `Location` for `/X/` and `/X.html` is raw UTF-8 instead of percent-encoded (see 12). Optional Cloudflare redirect rule. Do not lower any security setting.

## G8. Prior report mislabels (documentation only)
- `reports/inheritance-seo/2026-09-25/11-legal-validation.md`: 민법 제1026조 labelled "한정승인" (it is 법정단순승인); 대법원 2020그42 labelled "한정승인 관련" (it is 자녀 전원 포기 시 배우자 단독상속).

## G9. Pre-existing TypeScript error
- `reserved-inheritance-intents.ts(42)` fails `tsc --noEmit` (pre-existing, unrelated to this work; Next build passes).
