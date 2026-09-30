# 26. 빌드·검증

## 빌드

| 검사 | 결과 |
|---|---|
| `npm run build` (prebuild 검증 체인 + 정적 export) | EXIT=0 (2회. 2회차는 문구 수정 후 재빌드) |
| `seo:validate` | all checks passed, sitemap manifest 1,662 URL |
| `tsc --noEmit` | 기존 오류 1건만(`reserved-inheritance-intents.ts(42)`). 신규 파일 오류 0 |
| eslint (변경 파일) | 오류 0 |
| 내부 링크 (선박 9개 본문) | 깨진 링크 0 (`19-internal-link-map.csv`) |

## 보호 URL (`22-protected-url-diff.csv`, 2회차 빌드 기준)

- 보호 URL 1,656개: title·description·canonical·robots·H1·본문·내부링크·schema·og·이미지 해시 모두 동일.
- sitemap 추가 8개(신규 URL만), 삭제 0, 대상 외 lastmod 변경 0.
- **NON_TARGET_CHANGED_URLS = 0**
- sitemap 파일 diff: `tier-6-keywords.xml`에 신규 8개, `tier-4-regions.xml`에 `/부산선박등기` lastmod 1줄(이전엔 lastmod 없음), `index.xml`은 해당 두 파일 lastmod.
- `/업무사례`는 `src/app/[landingSlug]/page.tsx`를 감시 파일로 쓰지만 기존 lastmod 핀(2026-09-02)으로 고정되어 변화 없음.
- `public/data/naver-place-reviews.json` 변경은 prebuild의 리뷰 피드 갱신(기존 동작)이며 이번 작업과 무관.

## 기술 SEO (9개, `21-technical-seo.csv`)

| 항목 | 결과 |
|---|---|
| 응답 | 정적 HTML 9개 모두 생성 |
| robots | index, follow |
| canonical | self |
| sitemap | 9개 모두 포함, lastmod 2026-09-30 |
| title / H1 | 각 1개. H1은 질문형으로 title과 다름. title·description 사이트 내 중복 없음 |
| description | 95–122자 |
| og:image | 페이지별 고유 1200×630 + 본문용 1200×900, 실제 사진 크롭만(AI·합성 없음) |
| alt | 본문 이미지 alt는 사진 내용 그대로. alt 빈 값 1개는 전역 헤더 로고(장식) |
| schema | 페이지 전용: WebPage + BreadcrumbList. 나머지 Organization·Person·LegalService·LocalBusiness·WebSite는 전역 레이아웃 기존 출력(부산 주소 1곳) |
| FAQ | 화면에 보이는 아코디언만. FAQPage schema 추가 안 함 |
| meta keywords | 없음 |
| 중복 DOM id | 0 |
| 첫 700자 | "안녕하세요" 시작 없음. 페이지 간 최대 0.509(창원↔부산) |

## 모바일 (375 / 390 / 430)

- 가로 스크롤 없음(`scrollWidth = innerWidth`). 표는 자체 가로 스크롤 컨테이너 안에서만 넓어짐.
- 한국어 단어 중간 줄바꿈을 막기 위해 선박 전용 뷰 article에 `break-keep` 적용(전역 CSS 변경 없음).
- 하단 고정 상담 바는 전역 요소로 변경하지 않음.

## Cloudflare / Yeti (감사만)

- `robots.ts`: Yeti 허용, 선박 경로 차단 없음. `public/_headers`: 선박 경로에 X-Robots-Tag 없음.
- Cloudflare 대시보드(WAF·Bot Fight Mode)는 저장소에서 확인할 수 없음. 배포 후 네이버 서치어드바이저 "웹 페이지 수집" 결과가 200이 아니면 CLOUDFLARE_REVIEW_REQUIRED.

## 변경 파일

- 신규: `src/lib/ship-seo/**`, `src/components/ship-seo/ShipSeoPageView.tsx`, `src/data/seoIntentOwners.ship.ts`, `src/data/seoExperiments/reserved-ship-intents.ts`, `scripts/ship-make-og.mjs`, `public/image/og/ship-*.jpg`(18개)
- 수정: `src/app/[landingSlug]/page.tsx`(선박 slug만 가로채는 분기), `src/lib/pageData/korean-slugs.ts`(신규 slug 등록), `scripts/lib/published-paths.mjs`(선박 slug 읽기), `scripts/lib/sitemap/lastmod.mjs`(선박 dateModified 사용)
- 빌드 산출물: sitemap·manifest·admin 요약·image-variants
