# 네이버 12개 검색어 의도·오노출 복구 + 이미지·목록 — 2026-10-13

순위·캐러셀 선택을 보장하지 않는다. '검증'은 로컬 빌드 결과이며, 네이버 노출은 배포·재수집 뒤 같은 조건으로 다시 관측해야 한다.

## 기준
| 구분 | 값 |
|---|---|
| HEAD = origin/main = 운영 | `ca55849` (Cloudflare Pages 10-13 21:52 KST) |
| 작업 | `ca55849` + 이번 미커밋 수정(미배포) |
| 정상 시점 | 미확인(순위 기록은 10-11 18:37 `audit/naver-ranks.csv`, 10-12 22·23시, 10-13 22:11 관측뿐) |

## 12개 검색어 (상세: query-map.csv)
| 검색어 | 기대 URL | 10-13 관측 | 분류 | 이번 변경 |
|---|---|---|---|---|
| 부산 법무사 추천 | /부산법무사추천 | 같은 URL 웹4 | 정상 | 텍스트 카드 |
| 부산 법무사 상담 | /부산법무사상담 | / 웹6 | A | 텍스트 카드 |
| 부산 법무사 사무소 | / | / 웹5 | 정상 | 오시는 길 카드, ItemList @id·name |
| 부산 상속 | /부산상속법무사 | 미발견(웹 11) | C | 카드 |
| 부산 상속 법무사 | /부산상속법무사 | 같은 URL 웹3 | 정상(개선) | 카드 |
| 부산 법무사 상속 | /부산상속법무사 | /부산상속재산분할법무사 웹2 | A | 카드(재산분할 페이지는 유일 노출 URL이라 손대지 않음) |
| 부산 상속전문 법무사 | /부산상속전문법무사 | 같은 URL 웹5 | 정상 | 카드 |
| 부산 등기 법무사 | /부산등기법무사 | 같은 URL 웹4 | 정상(개선) | 카드, 임원 기한 문장 |
| 부산 등기전문 법무사 | /부산등기법무사 | /부산부동산등기전문법무사 | A | 없음(/부산등기전문법무사 noindex 정책 유지) |
| 부산 법인전문 법무사 | /부산법인법무사 | /부산법인설립전문법무사 | A | 그 페이지 잘린 description 정정 |
| 부산 법인등기 법무사 | /부산법인등기 | /부산기업법무사 웹2 | A | 대표 사진 분리, FAQ 기한·오타, 카드 |
| 부산 법인 법무사 | /부산법인법무사 | / 웹5('법무법인' 해석) | D | title 어순, 법인 전용 의견, 범위표·메모·중복 목록 정리, 카드 |

## 확정 결함 → 수정 (근거 / 범위 / 복구)
1. 토픽 허브 '상담 예시'에 상속 문장 공통 출력(10개 허브 중 9곳 오출력) → 허브별 상황 문장 `src/lib/pageData/builders.ts` (TOPIC_HUB_SITUATION). /상속은 기존 문장 유지.
2. /법인등기 준비서류 = 공통값(가족관계·협의서) → 법인 상담 준비 정보 4줄(상담 단계 vs 위임 후 서류 구분, 인감·주민등록은 상담 단계 불필요) `topic-hubs/config.ts`.
3. 법인 키워드 페이지 법무사 의견 "등기부·계약서·가족관계…" → 법인 전용(등기사항증명서·정관, 변경이 생긴 날 기한) `keyword-builder.ts`.
4. 고객 본문 노출: 내부 메모 "절차 복제는 부동산 안내에서"(`corporate-legal-operations-modules.ts`), 범위표 `DIRECT/RELATED/OUT_OF_SCOPE`·"Target하지 않음"(`CorporateLegalOperationsModules.tsx` 라벨), 허브 title '｜' 문자열(상담 예시·보충 문단·breadcrumb·Service 이름 → '｜' 앞 업무명, 검색 title은 그대로).
5. 변경등기 기한 기산점: 대표 URL 노출 문장 3곳 '결의일 기준' → "취임·사임 등 변경이 생긴 날부터 본점 소재지에서 2주 안에(상법 제317조 제4항·제183조)" (`keyword-topics.ts`, `registry-hub-content.ts`, `corporate-registration-busan.ts` + "늦기면" 오타). 다른 법인 콘텐츠 20여 곳의 같은 표현은 이번 범위 밖(보류 목록).
6. /부산법인법무사 title 첫머리 '부산 법무사'가 홈과 같음 → "부산 법인 법무사｜비용·절차·준비서류 총정리"(어순만, H1·URL 불변). 인과는 가설.
7. /부산법인설립전문법무사 description 잘림("…정리했습니…") → 길이 안 문장.
8. ItemList: /부산법인법무사·/부산부동산등기 2개 → 하단 중복 캐러셀·ItemList 생략(상단 선택 카드 유지). 모든 SeoCarouselJsonLd에 `@id = 페이지URL#featured-pages`, `name = 화면 목록 제목`.
9. robots: 색인 페이지만 `max-image-preview:large` 추가(noindex 255쪽 불변). 네이버 반영 여부는 미확인.

## 이미지 (image-map.csv)
- 텍스트 카드 7종 실제 제작: `public/image/cards/{consult-prep, select-criteria, office-visit, inheritance-start, registry-check, corporate-change, officer-deadline}.jpg` (1200×600, 72~98KB). 실제 사무소 사진(원본 무수정, 크롭만) + Noto Sans KR(OFL) 합성. 편집 원본 `cards/src/*.svg`, 생성기 `cards/build-cards.mjs`, 검토 `cards/cards-review.jpg`. AI 인물 생성·얼굴 편집 없음.
- 배치: 9개 대표 URL 본문 `<figure><img width height alt> + figcaption(같은 뜻 HTML)` — `src/data/seo/page-text-cards.ts`, `PageTextCardFigure`(PageDataTemplate·PrioritySeoPageView·NaverRecoveryTargetView·RegistryHubPageView·홈 오시는 길). `/_img` WebP 파생(256~1200) 생성 확인. OG·primaryImageOfPage에는 쓰지 않음.
- 검색 대표(무텍스트) 분리: /부산법인등기 → 새 원본 `portrait-corporate-02`(썸네일-사무실_겨울 (4).jpg)로 SERP JPG·1:1 카드 재생성(3파일만 변경), /법인등기 → field-photo `썸네일-등기운영과.jpg`(촬영 장소는 특정하지 않음). 법인 3페이지 대표 이미지가 서로 다름.

## 목록(ItemList) 구현 메모
- 기존 공유 데이터(화면 카드와 JSON-LD가 같은 배열)를 재사용, 새 중복 스크립트 없음. 항목: position(정수)·name·image(1200 원본 JPG 절대 URL)·url(canonical).
- 네이버 공식 문서(searchadvisor.naver.com/guide/structured-data-carousel)는 이번 세션에서 접근 차단 → 필수 필드 최신 확인 못 함. 한 페이지에 대표 목록 하나(@id) 원칙으로 구현. /services는 업무 사례 글 목록(이미지 없는 기존 Article 목록)과 캐러셀 목록 2개 — 용도가 달라 유지.
- 형식 통과 ≠ 캐러셀 표시. Google 법률 캐러셀 자격과 무관.

## 보호 검사
- 스냅샷 `12kw-before` → `12kw-final`: route 1,893 동일(삭제·추가 0), sitemap 1,635 동일. 변경 필드: title 1(/부산법인법무사), description 1(/부산법인설립전문법무사), ogImage 1(/법인등기), linksHash 2(중복 캐러셀 제거), robots 1,639(max-image-preview만), jsonld 1,196(ItemList @id·name). H1·canonical 변경 0.
- protected-urls.csv: 부산 법무사·상속포기·한정승인·상속등기·법인설립·공탁·회생·파산·지급명령·임차권·전세보증금·전국 상속·/상속·/부산법무사 — title·canonical·robots 정책 유지(robots는 max-image-preview 추가만).
- 법인 대표 4쪽 본문 혼입 검사: 상속 문장·공통 가족관계 서류·내부 메모·내부 코드·'｜' 문자열·오타·'결의일 기준 법정' 0건(/부동산등기·/개인회생파산의 "(상속·가사 해당 시)" 조건부 항목은 업무상 유지).
- lastmod: 실제 내용 변경 17쪽만 2026-10-13(상속 3쪽은 이미 10-13).
- `npm test` 31 pass, `tsc` 기존 오류 1건(무관), 변경 파일 eslint 0, `npm run build` 성공, `sitemap:validate` 통과. (빌드 중 Google Fonts 일시 오류·파일 잠금 1회씩 → 재실행 성공)
- 화면: /부산법인법무사 카드 1440·390, /부산법무사상담 카드 360, 범위표 390, 홈 오시는 길 390 — 가림·잘림 없음. 범위표는 390에서 가로로 넘침(기존 레이아웃, 이번 변경 아님).

## 보류
관할 문장 모순(부산 전역 등기국 vs 본점별 관할), '자본금 1원'(상법 329③ 원문 미확인), '설립총회' 용어, 본점이전 서류 '(해당 시)', 다른 법인 콘텐츠의 '결의일 기준' 20여 곳, /부산법인법무사↔/부산법인등기 FAQ 실행 주제 중복, noindex 별칭 og 불일치, 범위표 모바일 가로 넘침.

## 배포·관측 (이 요청에서는 하지 않음)
1. 사용자 커밋·push → Cloudflare. 커밋 제외 권장: `reports/google-index-2026-10-11/protect/*.json` 스냅샷.
2. 배포 후: SHA 확인 → /부산법인법무사 title, /법인등기 '상담 예시', 카드 이미지 `/image/cards/*.jpg` 200 확인.
3. 서치어드바이저 수집 요청: /부산법인법무사, /부산법인등기, /법인등기, /부산법무사상담 정도만.
4. D0/D+7/D+14/D+28: `node reports/naver-12kw-2026-10-13/naver-observe.mjs <label>` 12개 같은 조건(PC 비로그인) + 가능하면 모바일 수동.
5. 회귀(403/5xx/noindex/canonical/문의 장애)만 해당 패치 revert.
