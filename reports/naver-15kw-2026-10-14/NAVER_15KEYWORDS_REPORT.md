# 네이버 15개 검색어·텍스트 카드·블로그 편집 준비 — 2026-10-14

순위·검색 카드 선택을 보장하지 않는다. 코드·이미지는 로컬 검증까지, 운영 배포·블로그 게시는 하지 않았다.

## 기준
| 구분 | 값 |
|---|---|
| HEAD = origin/main = 운영 | `b201a0b` (Cloudflare Pages 10-13 22:59 KST) |
| 이미 운영 반영(재수정 안 함) | 10-13 12개 검색어 작업 전체(법인 혼입·카드 7종·ItemList·max-image-preview 등), /법인등기 상속 혼입 0건 |
| 이번 작업 | b201a0b + 미커밋 수정(아래) |
| 정상 시점 | 미확인(순위 기록은 10-11~10-14 관측뿐, 과거 1위는 사용자 보고) |

## 15개 검색어 (query-map.csv, 15행 검사 통과)
정상 3(등기 법무사, 상속전문, 법인등기 법무사) · A 다른 URL 9 · B 1(상속등기 스니펫) · C 1(한정승인) · C+D 1(법률 상담 — 공공기관 영역). raw_query는 그대로 기록('부산 상속 법무' 포함).
법인 계열 4개(등기전문·법인전문·법인설립·법인)가 /부산법인설립전문법무사로 몰림 — 1회 관측이라 보류, 48~72시간 뒤 재관측. 상담은 3일간 /부산법무사추천↔/ 교대.

## 확정 결함 → 수정
1. /부산법률상담 og:image·primaryImageOfPage = 상속 사진(counsel-intent의 serviceSlug 고정 경로, 07-26부터) → 상담 사진 `/image/상담-메인.jpg`(og 1200×900) — `src/lib/pageData/builders.ts`.
2. 고객 본문에 백틱 경로 노출(`/법인정관업무` 등 12곳) → 업무명 문장 — `company-establishment-busan.ts`, `keyword-topics.ts`(/부산법인설립등기·/부산법인법무사 FAQ·본문).
3. /부산법인설립등기 meta description 잘림("…확인할 수 있습…") → 83자 문장(접미사 없이 그대로) — `company-establishment-busan.ts`.
4. 전역 LegalService OfferCatalog '법인설립등기' url → `/부산법인설립등기` — `src/lib/seo/json-ld.ts`.
5. /services 대표 ItemList `name` 누락 → 화면 목록 제목 — `ServicePages.tsx`.
6. (경쟁 대비 공백, 가설 근거) /부산한정승인 첫 답변에 업무 범위 1문단: 심판청구서·재산목록·공고·청산 서류는 법무사, 채권자 소송 대리는 변호사 — `qualified-acceptance.ts`.

## 텍스트 이미지 (image-map.csv)
- 신규 4종 × 2형식 = 8파일: 상속등기 준비사항, 상속포기 신청 전 확인, 한정승인 재산과 채무부터, 법인설립 준비자료 — 가로 1200×600(`public/image/cards/`), 1:1 1200×1200(`public/image/cards/square/`).
- 기존 7종 1:1 master 7파일 추가(가로형은 10-13 파일 유지).
- 총 15개 새 이미지 파일. 생성기 `cards/build-cards-v2.mjs`, 데이터 `cards/cards-data.mjs`, 편집 SVG `cards/src/*-{landscape,square}.svg`, 폰트 Noto Sans KR(OFL). 사진은 public/image 원본 크롭·축소만(얼굴 편집·AI 생성 없음). 서류 사진 3장은 1500px로 확인 — 이름·주민번호·상세 주소 흐림, 구·군 단위 주소·날짜만 보임.
- 웹: 4개 페이지 본문 figure + 같은 뜻 figcaption(HTML) — `src/data/seo/page-text-cards.ts`. OG·primaryImageOfPage는 기존 무텍스트 사진 유지. `/_img/image/cards/*.{256..1200}.webp` 파생 생성 확인.
- 긴 제목(8자 이상)은 가로형에서 64px로 자동 축소(패널 밖으로 넘치지 않게).

## 웹 목록(ItemList)
홈 6개(@id·name·1200 원본 JPG·화면 카드와 이름·순서·URL 일치) 정상 유지. /services featured-pages name 추가. 네이버 공식 가이드는 이번에도 접근 차단 — 필수 필드 최신 확인 못 함. 형식 통과 ≠ 검색 캐러셀 표시.

## 블로그 (blog-editor-pack/)
RSS 50건(07-22~10-14) 기준 공백: 한정승인 단독 0, 법인 변경(본점·목적·증자) 0, 법인설립 08-07 이후 갱신 없음.
- A 새 글 한정승인, B 08-07 법인설립 글 보완(새 글 아님), C 새 글 법인 변경등기 — 각 post.md + 대표 1:1 + 본문 가로 이미지.
- 게시·예약 안 함. 07-22 이전 글 중복 확인·조문 재확인(C의 상법 182조 필수) 필요. 블로그 '최신 콘텐츠' 카드는 네이버가 선택.

## 보호 검사
- 스냅샷 15kw-before → 15kw-final: route 1,893·sitemap 1,635 동일. title·H1·canonical·robots 변경 0. 변경: ogImage 1(/부산법률상담), description 1(/부산법인설립등기), JSON-LD 1,726(전역 OfferCatalog url 1곳 + /services name), 본문 5쪽(카드 4 + /부산법인법무사 백틱).
- protected-urls.csv 15개(부산 법무사·추천·사무소·/상속·/법인등기·공탁·지급명령·회생·파산·전세보증금·임차권·전국 상속 등): 메타·링크 변화 없음.
- lastmod: 본문이 바뀐 5쪽만 2026-10-14, 나머지 지문 rebaseline. sitemap:validate 통과.
- `npm test` 31 pass, `tsc` 기존 오류 1(무관), 변경 파일 eslint 0, `npm run build` 성공(파일 잠금 1회 → 재실행).
- 화면: /부산한정승인 1440, /부산상속포기·/부산상속등기 390, /부산법인설립등기 360 — 카드·설명 잘림·가림 없음. 문의 기능은 코드·운영 응답으로만 확인(전송 안 함).

## 보류
'설립총회' 용어(상법 308 원문 미확인), /부산법률상담 title, 법인 4개 검색어 쏠림, 사진 위 '누락된 변경…' 법인 공통 문구, FAQPage schema 누락, 공공 상담 카드 연결, 메타 설명 잘림 40여 쪽(범위 밖).

## 배포·수동 과제
1. 커밋·push → Cloudflare 배포(스냅샷 JSON `reports/google-index-2026-10-11/protect/*.json` 제외 권장).
2. 운영 확인: /부산법률상담 og:image, /image/cards/square/*.jpg 200, 4개 페이지 카드.
3. 서치어드바이저 수집 요청: /부산한정승인, /부산상속포기, /부산상속등기, /부산법인설립등기, /부산법률상담.
4. 블로그: A → C → B 순서로 게시 전 중복·조문 확인 후 직접 게시.
5. 관측 D0/D+7/D+14/D+28: `node reports/naver-15kw-2026-10-14/naver-observe.mjs <label>`(15개, 같은 조건).
6. 회귀 시 해당 파일만 `git checkout b201a0b -- <파일>`.
