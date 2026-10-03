# 17. 최종 검증

실행일 2026-10-04 (KST). 모든 결과는 로컬 빌드(out/) 기준이며 배포 전이다.

| 항목 | 명령 / 방법 | 결과 | 비고 |
|---|---|---|---|
| Build | `npm run build` (prebuild 검증기 포함) | PASS (exit 0) | keyword ownership, region boilerplate, sitemap/seo validators 포함 |
| Keyword ownership | `npm run check:keyword-ownership` | PASS, 164 queries, 충돌 0 | 신규 15개 owner 등록 |
| Lint (변경 파일) | ESLint API로 변경 23개 파일 | 오류 0, 경고 2 | 경고 2는 `scripts/` 일부가 ignore 대상이라는 안내 |
| Lint (전체) | `npm run lint` | FAIL (176 errors) | 기존 오류. 대부분 번들·생성 파일. 이번 변경 파일에는 오류 없음 |
| Typecheck | `npx tsc --noEmit` | 1 error | 기존 오류: `src/data/seoExperiments/reserved-inheritance-intents.ts:42` (미수정 파일). `next.config`가 `ignoreBuildErrors: true` |
| SEO Audit | `npm run seo:audit` | PASS | universe audit + high-competition + master-2026-08 |
| Crawl (전수) | `node scripts/seo-universe-audit.mjs --label after` | 1,871 HTML, 회귀 0 | before 대비 퇴보 지표 없음 |
| Broken Links | 같은 audit | 0 (before 33) | |
| Structured Data | 같은 audit | JSON-LD 파싱 오류 0, 가짜 schema 0 | rating·reviewCount·price 추가 없음 |
| Sitemap | `validate-sitemap.mjs` | PASS | 신규 6 포함, 제거 0, noindex 0 |
| URL Preservation | `16-url-preservation.csv` | 기존 1,865 PRESERVED, 삭제 0, 변경 0 | 신규 6 ADDED_WAVE1 |
| Redirect | `_redirects`, next.config, middleware 변경 여부 | 변경 없음 | 의도하지 않은 redirect 0 |
| Canonical | audit sitemapNonCanonical | 0 | canonical 변경 없음 |
| Similarity | `quick-seo-duplicate-check.mjs --targets/--pairs` | 19/19 PASS | `wave1-duplicate-check.csv` |
| Responsive | 헤드리스 Chrome으로 8페이지 × 7해상도 = 56장 | 가로 넘침 0, H1 1개 | `responsive-qa.csv`, `screenshots/` |
| lastmod | 빌드 전후 sitemap 비교 | 의도한 3개만 변경 | 60개는 이전 날짜로 고정 |

## Responsive 상세

해상도: 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080.
대상 페이지:
- 신규 6개
- /부산시행사등기
- /부산근저당설정등기

- scrollWidth는 모든 경우 viewport와 같다.
- 뷰포트를 넘는 요소로 잡힌 것은 두 가지이고, 둘 다 부모가 잘라내는 의도된 레이아웃이다.
  - 장식용 `div.pointer-events-none`
  - 사례 가로 캐러셀 `li.w-[78%]`
- 모바일에서 높이 24px 미만 탭 대상 3개는 공통 브레드크럼 링크다. 기존 템플릿이다.

## 품질 점수 (신규 6페이지, 10점 만점)

| 기준 | 점수 | 근거 |
|---|---:|---|
| 검색 의도 일치 | 9 | 질문형 H1, 첫 문단에서 절차 정의 |
| 법적 정확성 | 9 | 조문 번호를 본문에 인용하고 국가법령정보센터 링크 |
| 업무범위 안전성 | 9 | 소송대리·기일 출석 제외를 FAQ에 명시 |
| 독창성 | 8 | 형제 페이지 대비 본문 유사도 0.28~0.57 |
| 부산 관련성 | 8 | 관할 법원·등기소·가정법원 안내. 지역 고정관념 없음 |
| 실행 가능성 | 9 | 체크리스트, 준비자료, 기간 |
| 내부 링크 | 8 | 허브와 문맥 링크 3~8개. 푸터 단독 아님 |
| 기술 SEO | 9 | title·description·H1 고유, canonical, sitemap |
| 모바일 | 9 | 7해상도 넘침 0 |
| CTA 구체성 | 8 | 상담 시 필요한 정보 목록 |
