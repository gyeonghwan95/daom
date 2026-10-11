# Google 색인 정체 진단 (2026-10-11)

범위는 Google 색인입니다. 네이버 순위와 같은 원인으로 다루지 않습니다. 조사 중 소스·SEO 설정·배포는 바꾸지 않았고, 이 폴더에 보고서와 임시 검증 스크립트만 추가했습니다.

## 0. 기준점

| 항목 | 값 |
|---|---|
| 프레임워크 | Next.js 16 정적 export(`output: "export"`, `next.config.ts`). 이미지는 custom loader(`src/lib/image-loader.ts`)와 빌드 전 WebP 생성(`scripts/optimize-images.mjs`, `/_img/`) |
| 배포 | Cloudflare Pages. GitHub `main`에 push하면 Pages가 빌드한다(`npm run build` → prebuild에서 사이트맵 생성). Functions는 `/api/*`만 담당(`public/_routes.json`). middleware 없음 |
| 운영 배포 commit | `37c2275`(2026-10-11 21:20 KST 배포 성공, GitHub check-run 기준). `6cb8a32`(로컬 HEAD)는 조사 시점에 배포 진행 중 |
| 로컬 상태 | branch `main`, 작업 트리 깨끗함, 비-shallow, 전체 183 commit(2026-06-20~) |
| 로컬 빌드 out/ | `6cb8a32` 기준. 운영과는 오늘 저녁 변경분만 다름 |

## 1. 원인 후보 (우선순위순)

| # | 원인 후보 | 판정 | 근거 | 최소 수정안 | 영향 범위·네이버 보호 | 검증 방법 |
|---|---|---|---|---|---|---|
| 1 | 지역×업무·업무사례 템플릿 페이지가 사이트의 큰 비중을 차지하고, 본문의 대부분이 다른 페이지와 같은 문장이다. Google이 '발견됨' URL을 수집할 가치를 낮게 보는 요인일 수 있다 | 유력(증명 불가) | `uniqueness.csv`: 공통 문장과 지역명을 뺀 뒤 고유 문장 비율 중앙값은 부산 지역×업무 232개 0.04, 업무사례(지역 상속등기 제외) 358개 0.07. 블로그 0.42, 상황별 안내 0.56, 서비스 0.42. 1,635개 중 521개가 0.2 미만. Google 문서: '발견됨'은 아직 수집 전이며, 수집이 일정에서 미뤄진 상태다(answer/7440203) | 대량 재작성·noindex는 하지 않는다. ① `/sitemaps/tier-1-core.xml`(운영 200, 이미 존재)을 Search Console에 **추가로** 제출해 핵심 페이지 묶음의 색인 추이를 따로 본다(기존 /sitemap.xml 유지). ② #2의 업무 분기 결함부터 바로잡는다 | URL·canonical 변경 없음. 네이버 수집에는 영향 없음 | Search Console 사이트맵별 '색인 생성됨' 수, 핵심 50개의 URL 검사 마지막 크롤링 날짜 |
| 2 | 상속포기·한정승인·개인회생·파산 페이지에 등기·법인용 공통 문장이 섞임. 일부는 법률상 부정확 | **확정 결함**(색인 정체의 원인인지는 미확인) | `intent-mix.csv`: 사이트맵의 해당 업무 106개 중 37개. 계약서 서류 37, 잔금·결의 26, 근저당 체크 22, 대출·매매 22, '부동산·법인 소재지 기준 관할' 12. 상속포기·한정승인 관할은 상속 개시지 가정법원(가사소송법 제44조 제1항 제6호, 민법 제998조, 10/11 law.go.kr 원문 확인). 출처: `src/lib/seo-landing/content.ts` `seededLocalChecklist()`(299~319), `documentVariants`(570~), `localVariants`(577~), 기본 분기의 `consultationExample`(1100~), `procedures`(1112~), `documents`(1125~). 같은 파일 919·1001·1053행의 다른 분기도 같은 확인 필요 | `content.ts`에서 serviceId가 `inheritance-renunciation`·`limited-acceptance`·`personal-rehabilitation`·`bankruptcy`이면 ① 체크리스트·절차·서류·상담 예시를 업무 전용 풀로 대체하고 ② localVariants의 '부동산·법인 소재지' 문장 대신 '피상속인 마지막 주소지 가정법원'(상속), '채무자 주소지 회생법원'(회생·파산) 문장을 쓴다. 등기 업무 분기는 그대로 둔다 | 37개 페이지 본문(H2 이하)만 변경. title·H1·URL·canonical 유지. 보호 질의 /부산상속포기·/부산한정승인은 이 템플릿이 아니므로 직접 영향 없음(빌드 후 diff로 확인) | `node reports/google-index-2026-10-11/intent-mix.mjs` 결과 0건, 스냅샷 diff로 title/H1/canonical 0건 변경 |
| 3 | 운영 사이트맵 lastmod가 실제 수정일이 아니라 배포일 | **확정 결함**(색인 차단 요인은 아님) | 운영 /sitemap.xml과 로컬 빌드를 비교하면 451개 URL의 lastmod가 다름. 예: /services는 운영 2026-10-11, 로컬 2026-06-19. 원인: `scripts/lib/sitemap/lastmod.mjs` `fileMtime()`·`slugFileMtime()`이 파일 mtime을 쓰는데, Cloudflare 빌드는 매번 새로 clone하므로 mtime이 배포 시각이 됨. 10/10~11 이틀에 877개 집중. 별도로 블로그·FAQ·서비스 사례·언론 91개는 사이트 생성(6/20) 이전인 2025년 날짜(frontmatter `date`). Google: lastmod는 '일관되고 검증 가능하게 정확할 때' 사용(build-sitemap) | `lastmod.mjs`: `process.env.CF_PAGES`일 때 fs mtime을 쓰지 않는다. 로컬에서 생성해 커밋된 `scripts/output/sitemap-manifest.json`의 lastmod를 우선 쓰고, 없으면 생략한다. 날짜를 일괄 오늘로 바꾸지 않는다. 2025년 frontmatter는 lastmod 산출에서 최초 공개일(2026-06-20) 이전이면 생략 | 사이트맵 lastmod 값만 변경, URL 목록 동일 | 배포 후 운영과 로컬 사이트맵 lastmod 일치 수(목표 1,635/1,635) |
| 4 | 이미지 404: 존재하지 않는 '드롭인' 이미지 경로가 RSC 데이터에 남아 Google이 수집 | **확정 결함**(색인 정체 원인 아님) | `asset-check.csv`·`asset-refs.csv`: 26개 모두 현재 404(text/html). `/image/소개-*.jpg` 7개는 `src/lib/lawyer-eeat-images.ts` `thumb()`의 `src`가 /about·홈 RSC(.txt와 HTML 내 데이터)에만 있고 `<img>`·preload·OG에는 없음. 화면은 `fallbackSrc ?? src`(`LawyerAtAGlance.tsx:27`, `EeatFactThumb.tsx:22`)로 대체 이미지를 쓰며, /about 이미지 34개는 모두 200 image/webp. 나머지 18개와 JS 1개는 현재 코드·빌드 어디에도 참조가 없는 과거 배포 경로. 크롤링 404 9.31%(약 147회)는 제공 기록의 자산 404 147회(146+1)와 일치 | `thumb()`에서 드롭인 파일이 `public/image/`에 없으면(빌드 시 `fs.existsSync`) `src`를 `fallbackSrc`로 채우고 `fallbackSrc`는 비운다. 과거 경로 18개와 옛 JS는 404 그대로 둔다(복원·리디렉션하지 않음) | /about·홈 썸네일 동작 동일. 네이버 무관 | out/의 .txt·.html에서 `소개-` 경로 0건, 화면 캡처 비교 |
| 5 | 9월 이후 HTML 수집 요청 급감(7월 100 → 9월 12 → 10/1~6 6) | 원인 미확인 | 8/10~9/6 사이 robots·`_headers`·`_redirects`·canonical·사이트맵 구조에서 수집을 막을 변경을 찾지 못함. `_headers`는 캐시·admin noindex만(8/10~11), robots는 8/1 주석, 10/5 `/search` 패턴만 변경. URL 수는 7/20에 이미 1,265개였고 9월에 급증하지 않음. Cloudflare 로그·검증된 Googlebot 기록이 없어 403/429/5xx·challenge 여부는 확인 불가 | 보안 설정 변경 제안 없음. Cloudflare 대시보드에서 검증된 봇(Verified Bot) 필터로 9월 이후 Googlebot의 경로별 응답 코드를 확인할 수 있으면 그 결과로 판단 | — | Cloudflare Security Events·Analytics(접근 권한 필요) |
| 6 | 내부 링크가 1개뿐인 URL이 많음 | 보조 요인 가설 | `inlinks.csv`: 사이트맵 1,635개 모두 유입 링크 1개 이상(고아 0), 474개는 유입 1개 | 새 페이지 없이, 이미 있는 허브(/업무사례/지역별 등)의 초기 HTML 링크를 유지(10/11 수정분 배포 확인) | — | 링크 수 재집계 |
| 7 | noindex 별칭 2개(/부산등기전문법무사, /부산법인전문법무사) | 정상(의도된 정책) | `seo/index-policy.json`(9/22 commit `24c5348`, note에 정책 기록), `reports/target-seo-2026-09-22/13-bridge-followup.md`. 운영에서 noindex,follow + canonical이 대표 페이지 | 변경 없음 | 보호 | — |
| 8 | `daom.pages.dev`가 모든 경로에 빈 본문 200 응답 | 미확인·낮음 | /, /about, /robots.txt 모두 200, 0바이트 | 본 도메인 색인과 직접 관련 근거 없음. 필요하면 Pages 설정에서 기본 도메인 접근 정책을 확인 | — | — |

## 2. 이미 정상인 항목

- 핵심 11개(/, /services, /상속, /부산법무사, /부산상속등기, /부산상속포기, /부산한정승인, /부산법인등기, /전국상속등기, /강서구상속포기, /동래구상속포기): 200 text/html, X-Robots-Tag 없음, meta `index, follow`, 자기 canonical, 사이트맵 포함, H1 1개, 초기 HTML 본문 4,385~7,989자, 본문 내부 링크 12~87개, 로딩 문구 없음(`live-pages.json`).
- robots.txt: Googlebot `Allow: /`, 차단은 /admin·/api·/search·/blog/external뿐. JS·CSS 차단 없음.
- 호스트 정규화: http→https 301, 끝 슬래시·`.html`·`index.html`은 308로 정규 URL.
- 사이트맵: 단일 urlset 1,635개(Search Console '발견 1,636'과 사실상 일치). noindex URL과 다른 곳을 가리키는 canonical URL 0개. 빌드 전체 1,893개 중 noindex 253개는 사이트맵에서 제외.
- 화면 이미지: /about의 `<img>` 34개 모두 200 image/webp.
- 대체 이미지 확인: `활동-기획예산처청년자문단위촉.jpg`(기획예산처 위촉장 수여)와 `활동-부산청년정책위원.jpg`(부산 청년정책 행사)는 각 위원 활동과 맞음. `활동-법무사협회표창.jpg`는 파일명·사용처만 확인(시각 확인 안 함).

## 3. 하지 않은 것(미확인)

- Search Console 계정, 발견됨·크롤링됨 내보내기 전체 목록, Cloudflare 로그, 검증된 Googlebot 응답 기록에는 접근하지 않음.
- Google 렌더러(URL 검사 실시간 테스트)는 실행하지 않음. /상속은 이미 요청됐으므로 다시 요청하지 않음.
- 9월 수집 감소의 직접 원인은 확인하지 못함.

## 4. 수정 시 회귀 확인 범위

- #2: `content.ts`를 쓰는 seo-landing 페이지 전체. 빌드 후 스냅샷 diff로 title/H1/description/canonical/robots/sitemap 0건 변경, 본문 변경은 대상 업무 페이지에만 있는지 확인. 보호 질의 페이지 24개 본문 해시 비교.
- #3: 사이트맵 URL 목록 동일(1,635), lastmod만 변경. `node scripts/validate-sitemap.mjs`.
- #4: /about·홈의 경력·수상·위원 썸네일 화면 비교, out/에서 `소개-` 경로 0건.

## 5. 추적 지표(2~4주)

- 핵심 페이지(/, /services, /상속, /부산법무사, /부산상속등기, /부산상속포기, /부산법인등기, /전국상속등기)의 URL 검사 '마지막 크롤링' 날짜와 색인 상태. /상속은 10/11 요청분이 반영된 뒤 관측.
- Search Console 크롤링 통계의 HTML 요청 수(10/6 이후 데이터)와 404 비중.
- 사이트맵별(전체 / tier-1-core) 색인 수.
- 색인 회복 시점이나 순위는 보장하지 않음.

## 파일

- `live-check.mjs` → `live-pages.json`, `live-sitemap.json`(운영 GET)
- `intent-mix.mjs` → `intent-mix.csv`
- `uniqueness.mjs` → `uniqueness.csv`(내부 비교 지표이며 검색엔진 기준 아님)
- `asset-404.txt`, `asset-check.mjs` → `asset-check.csv`(운영 상태), `asset-refs.mjs` → `asset-refs.csv`(참조 위치. `asset-check.csv`의 참조 열은 rg 호출 실패로 무효이며 `asset-refs.csv`를 기준으로 함)
- `inlinks.mjs` → `inlinks.csv`
