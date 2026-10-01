# 10. 빌드·기술 검증 (2026-10-01)

## Production build

- `npm run build` 2회 실행. 1회차 후 `/부산법무사` 본문이 허브 하한(2,800자)보다 크게 모자라(2,258자) 업무별 접수기관 표와 FAQ 1개를 추가하고 2회차를 돌렸다.
- 두 번 모두 BUILD_EXIT=0. prebuild 검증(generate-sitemaps, validate-sitemap, seo-validate, validate-seo, validate-seo-intent-db, validate-page-data, check-keyword-ownership, check-region-boilerplate) 통과, seo-dom 샘플 OK.
- BUILD_ERROR = 0.
- tsc: 기존부터 있던 `src/data/seoExperiments/reserved-inheritance-intents.ts(42)` 1건 외 신규 오류 없음. eslint: 신규·수정 파일 오류 0.

## 비대상 보호 (scripts/ncr-snapshot.mjs before/after/compare)

- protected URL 1,659개, NON_TARGET_CHANGED_URLS = 0, PASS.
- sitemap: 추가 6개(신규 공탁 URL), 삭제 0, 비대상 lastmod 변경 0.
- sitemap 파일 URL 단위 diff: 추가 6개 + lastmod 변경 5개(/부산법무사(없음→10-01), /부산법무사상담, /부산법무사추천, /부산상속포기, /부산한정승인). 전부 target.
- 상세: `11-protected-url-diff.csv`.

## 변경 파일 (git)

- 라우트 연결: `src/app/[landingSlug]/page.tsx`(priority 분기 추가), `src/lib/pageData/korean-slugs.ts`, `scripts/lib/published-paths.mjs`, `scripts/lib/sitemap/lastmod.mjs`.
- 콘텐츠: `src/lib/priority-seo/**`(신규), `src/components/priority-seo/PrioritySeoPageView.tsx`(신규), `src/lib/naver-recovery/renunciation.ts`(/부산상속포기 전용 스펙).
- 이미지: `public/image/og/priority-*.jpg` 20개(실사진 크롭, 합성·텍스트 없음), `scripts/priority-make-og.mjs`.
- 빌드 산출물 자동 갱신: sitemap xml, `scripts/output/*`, `src/generated/*`, `public/data/naver-place-reviews.json`(빌드 때 가져오는 데이터).
- 공용 nav·footer·공용 SEO 컴포넌트, 기존 local-landing 공유 파일은 수정하지 않았다.
- NON_TARGET_ROUTE_FILES_CHANGED = 0 (공용 라우트 파일 `[landingSlug]/page.tsx`는 target slug일 때만 타는 분기만 추가).

## Target 기술 검사 (out/ 정적 HTML)

| URL | canonical | robots | sitemap lastmod | og = 본문 이미지 | H1 수 | 깨진 내부링크 |
|---|---|---|---|---|---|---|
| /부산상속포기 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산한정승인 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산상속전문법무사 | self | index | 2026-09-27 (변경 없음) | O | 1 | 0 |
| /부산법무사 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산법무사상담 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산법무사추천 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산공탁 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산변제공탁 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산집행공탁 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산담보공탁 | self | index | 2026-10-01 | O | 1 | 0 |
| /부산형사공탁 | self | index | 2026-10-01 | O | 1 | 0 |
| /공탁금출급회수 | self | index | 2026-10-01 | O | 1 | 0 |

- 구조화 데이터: WebPage, BreadcrumbList, LegalService, Organization만. Review·AggregateRating·Award·Event 없음.
- 전 페이지 전화번호(010-4277-1279)·주소 정적 HTML 포함.
- HTTP 200은 정적 export 파일 존재로 확인했다(배포 후 실제 응답은 배포 뒤 확인 필요).
