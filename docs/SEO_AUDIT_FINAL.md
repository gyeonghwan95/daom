# SEO_AUDIT_FINAL

작성일: 2026-08-31  
대상: 다옴법무사사무소 (`https://다옴법무사사무소.kr` / canonical host punycode)

## 1. 발견한 핵심 문제

1. **키워드 잠식**: 「부산 법무사」를 홈과 `/부산법무사`·다수 지역 페이지가 동시에 겨냥할 위험이 있었음. 코드 정책은 홈 소유였으나 홈 링크팜·히어로 버튼·브리지 페이지가 신호를 분산함.
2. **홈이 sitemap처럼 동작**: `HomeHubGuide` ~100개 링크 + 16개 구·군 그리드가 홈에 몰려 핵심 허브 신호가 약해짐.
3. **상담 대표 URL 전환 약함**: `/부산법무사상담`에 전화·카카오·톡톡 버튼이 없고 `/contact`로 이탈해야 했음.
4. **상속 「전문」 브리지 색인**: `/부산상속전문법무사` 등이 `/부산상속법무사`와 동일 의도로 색인 가능.
5. **지역 페이지 치환 상용구**: 구명만 바꾼 “등기·상속·법인·채무 문제로 찾으시는 분들이 많습니다” 유형 문장이 반복될 수 있었음.

## 2. 수정한 파일 (핵심)

- `seo/keyword-map.json`, `seo/index-policy.json`, `src/lib/seo/index-policy.ts`, `src/lib/seo/champion-query.ts`, `src/lib/seo/metadata.ts`
- `config/seo-query-champions.json`, `src/lib/pageData/sitemap.ts`, `scripts/lib/sitemap/exclusions.mjs`
- `src/app/page.tsx`, `src/lib/home-content.ts`, `src/lib/home-scroll.ts`, `src/components/home/HomeHero.tsx`, `src/components/home/HomePopularSearches.tsx`
- `src/components/profile/LawyerEeatProfile.tsx`, `src/app/about/page.tsx`
- `src/lib/local-landing/selection/topics/busan-consult.ts`, `busan-recommend.ts`, `busan-compare.ts`
- `src/lib/local-landing/keyword-topics.ts`, `inheritance-champion-modules.ts`, `keyword-builder.ts`
- `src/lib/local-landing/search-intent/overrides/busan-inheritance-specialist-lawyer.ts`
- `src/lib/local-landing/expansion/builder-expansion.ts`
- `src/components/local-landing/SelectionHubPageView.tsx`
- `scripts/check-keyword-ownership.ts`, `scripts/check-region-boilerplate.ts`, `scripts/seo-audit.ts`, `scripts/check-links.ts`
- `docs/SEO_EXTERNAL_ACTIONS.md`, `docs/seo/keyword-to-url-map.md`

## 3. Keyword ownership

| 검색어 | 대표 URL |
|---|---|
| 부산 법무사 | `/` |
| 부산 법무사 상담 | `/부산법무사상담` |
| 부산 법무사 추천 | `/부산법무사추천` |
| 부산 상속 전문 법무사 / 부산 상속 법무사 | `/부산상속법무사` |
| 부산 상속등기 법무사 | `/부산상속등기` |
| 부산 상속포기 법무사 | `/부산상속포기` |
| 부산 한정승인 법무사 | `/부산한정승인` |

`npx tsx scripts/check-keyword-ownership.ts` — **PASS** (동일 PRIMARY를 두 indexable URL이 소유하지 않음)

## 4. Canonical 구조

- 기본: self-canonical, punycode host + percent-encoded path
- 예외(브리지 → 허브):
  - `/부산상속전문법무사` → `/부산상속법무사`
  - `/부산상속등기전문법무사` → `/부산상속등기`
  - `/부산한정승인전문법무사` → `/부산한정승인`
  - `/부산상속포기전문법무사` → `/부산상속포기`

## 5. index / noindex

- sitemap: **1662** URL (excluded 144, 그중 noindex 5)
- URL 삭제 없음. 상속 「전문」 브리지 4곳은 **noindex, follow** + canonical 허브
- `/search` 기존 noindex 유지

## 6. 중복 콘텐츠 수정 결과

- 지역 상용구 3문장 검사: **0 hits** (`scripts/check-region-boilerplate.ts`)
- 가상 “최근 상담 사례” 문구를 지역·키워드 허브에서 절차 안내 문장으로 교체
- 상속 허브의 “가상 예시” 비용 문장 삭제
- `/부산부동산등기법무사`·추천/포기 블로그 title이 대표 쿼리를 가로채지 않도록 조정

## 7. 내부링크 수정 결과

- 홈 바로가기 **12개** (상담·추천·선택기준·상속·등기·법인·회생·해운대·센텀·법률지도·소개)
- 홈에서 16개 구·군 그리드·`HomeHubGuide` 링크팜 제거 → 법률지도·업무 허브로 단계 연결
- 히어로 업무 칩: JS 버튼 → `/부산상속등기` 등 crawlable `<a>`
- exact 「부산 법무사」는 홈, `/부산법무사`는 “찾는 기준” 앵커

## 8. Sitemap 결과

- `public/sitemap.xml` 1662 loc, Yeti 수집용 tier sitemap 유지
- 브리지 4 URL sitemap 제외

## 9. robots 결과

- `src/app/robots.ts`: `*`, Googlebot, **Yeti** allow `/`
- Disallow: `/admin`, `/api/`, `/search`, `/blog/external/`
- CSS/JS 차단 없음

## 10. Structured data 결과

- 전역: Organization + Person + LegalService/LocalBusiness (홈 `mainEntityOfPage=/`)
- 가짜 AggregateRating/별점 schema 없음
- 브리지 noindex 페이지는 색인 신호가 허브 canonical로 모임

## 11. 남아 있는 위험요소

- 지역·키워드 색인 URL이 여전히 약 1,600개. 품질은 상용구 제거로 올렸으나 crawl budget 부담은 남음
- `/contact`와 `/contact/inquiry` title/H1이 유사 (상담 대표는 `/부산법무사상담`)
- 전국/업무사례 일부 H1 중복 (우선 4키워드 밖)
- `npm run lint`는 기존 FloatingCTA·HeroStage 등 react-hooks 규칙으로 실패 (이번 변경 파일은 통과)
- `tsc --noEmit`는 기존 `inflow-policy.ts` 비교 오류 포함. static export는 `ignoreBuildErrors`

## 12. 외부에서 해야 할 작업

`docs/SEO_EXTERNAL_ACTIONS.md` 참고.

- 네이버 서치어드바이저 sitemap 재제출
- `/` `/부산법무사상담` `/부산법무사추천` `/부산상속법무사` 수집 요청
- 플레이스·블로그·톡 채널 NAP·홈페이지 링크 일치 확인
- `/부산상속전문법무사`가 이미 색인되어 있으면 삭제 요청 검토 (사이트 URL은 유지)

## 검증

| 항목 | 결과 |
|---|---|
| `npm run build` | PASS (1832 static pages, seo-dom samples OK) |
| keyword ownership | PASS |
| region boilerplate | PASS |
| `seo-audit.ts` (out HTML) | PASS — 8 핵심 URL title/H1/canonical 1개씩, 브리지 noindex |
| `check:diagnosis` | PASS |
| lint (전체) | FAIL (기존 이슈) |
| lint (변경 파일) | PASS |
