# ④ 이미지·네이버 캐러셀 (2026-10-13, 조사만, 소스·이미지 수정 없음)

산출물: `image-inventory.csv`(191행: public/image 174 + derived 17, og/ 제외), `contact-sheet.jpg`(번호 1~174, derived 제외, 12열).
csv 열: no, path, width, height, format, bytes, sha1, refs_src_data(src/·data/ 안의 `image/<경로>` 문자열 수, src/generated/image-dimensions.json 포함이라 기본 1~2), dup_of(sha1 동일).

## 1. 인벤토리 판단 (contact sheet 육안)
- 사진 구성: 강의 #2~22, 관공서 외관 #23~28·#91·#94~99·#121·#125~129·#139·#153, 사무소 #31~42, 상담 #43~46, 서류 #47~90·#148(대부분 모자이크 처리됨, 세로·흰 종이라 썸네일 가독성 낮음), 인물 업무 사진 #37·#106·#110~124·#130~138, 언론 캡처 #140~147, 활동 #162~174, 인포그래픽 #155·#156.
- 완전 중복(sha1): #37 사무소-전경 = #134 썸네일-정면, #110 썸네일-사무실 = #138 썸네일_사무실_여름 (5), #109 = #152(진구청).
- 모바일 대표용으로 적합(얼굴·배경 선명, 글자 없음, 가로 4:3): #37/#134, #44 상담-메인, #93 썸네일-계약임원, #106 썸네일-법원절차, #110, #117 썸네일-사무실_겨울 (4)(인감함·서류), #119 사무실_전화중, #120 사무실_정면(로고 앞 전신), #122 썸네일-상담협의(로고+명패 '안윤정'), #124 썸네일-서류확인, #136.
- 대표용 부적합: 인포그래픽 #155·#156(세로·잔글씨, 추천·상담·상속전문 본문 2~3번째 이미지로 노출), 상담 안내 PNG #43·#45·#46(글자 박힌 저해상 1039×519), 언론 캡처, 서류 사진(세로·개인정보 위험), 하늘/역광 외관 #27·#91·#96.

## 2. 대표 이미지 매핑 (out/ HTML 기준, 확정)
| 페이지 | og:image = primaryImageOfPage | 본문 첫 이미지 | 판단 / 후보 |
|---|---|---|---|
| / | `_img/image/사무소-전경.og.jpg`(#37) | 썸네일-정면.1280(#134=#37 동일) | 정상. 유지. 대안 #122(로고·명패로 사무소 식별 강함) |
| /부산법무사추천 | `image/og/priority-busan-recommend.jpg`(로고 앞 전신, #120 계열) | 같은 사진 4x3 → 인포그래픽 #155·#156 | OG 유지. 인포그래픽 2장은 모바일 판독 불가 → 아래 텍스트 카드(선택 기준)로 대체 검토 |
| /부산법무사상담 | `og/priority-busan-consult.jpg`(전화 상담, #119 계열) | 같은 사진 → #155·#156 | OG 유지(의도 일치). 본문에 상담 준비 카드 추가 검토 |
| /부산상속법무사 | `generated/serp/inheritance/busan-inheritance-hub.jpg`(서류 검토, 1200²) | 같은 사진, derived/doc-review-desk, inheritance-reg-cert | 정상. 유지 |
| /부산상속전문법무사 | `.../busan-inheritance-specialist.jpg`(스튜디오 프로필 #161 계열) | 같은 사진 → #155·#156 | 인물 의도엔 맞음. 상속 맥락 약함 → 대안 #136/#124(서류 검토) — 단 /부산상속법무사와 겹치지 않게 #124 권장(가설) |
| /부산등기법무사 | `.../realestate/busan-registry-attorney.jpg`(등기국 표지+인물, #107 계열) | 썸네일-정면.1920(#134) | 정상. 유지 |
| /부산법인법무사 | `.../corporate/busan-corporate-hub.jpg`(#93 크롭) | #134 → busan-corporate-hub | 아래 2개 페이지와 **같은 사진 #93** |
| /부산법인등기 | `.../corporate/busan-corporate-registration.jpg`(#93 크롭) | #134 → 같은 사진 | 후보 #117(인감함·서류 작성 = 법인 변경등기 연상) |
| /법인등기 | `_img/image/썸네일-계약임원.og.jpg`(#93) | #134 → #93 | 후보 #100 썸네일-등기운영과('법인·부동산 등기부 열람' 안내, 인물 없음) 또는 #76 신청서_법인설립(모자이크 확인됨, 사무소 양식) |

- 확정: 법인 3페이지 대표 이미지가 동일 원본(#93)의 크롭 → 썸네일만으로는 세 페이지 구분 불가. 상속은 hub/specialist가 서로 다른 사진.
- 인물 사진은 크롭·리사이즈만. 얼굴 보정·AI 재생성 금지.

## 3. 텍스트 카드(1200×630, 본문용) 제안
기존 `public/images/generated/carousel/*`(1:1 '센터 훅' 텍스트 카드, 사이트 카드 전용)가 상속·부동산·법인 세부 업무는 이미 덮고 있음. 빠진 의도: 상담 준비, 선택 기준, 사무소, 등기 전 확인, 법인 담당/변경. 검색 대표(OG·primaryImageOfPage)는 글자 없는 사진(2절) 그대로 두고, 카드는 **본문·섹션 이미지**로만 사용.
스펙: 1200×630, navy #1b3354 오버레이(불투명 70~80%) 또는 beige #f4efe8 바탕, 제목 Noto Sans KR Bold 64~72px 1~2줄, 보조 1줄 28px, gold #c4b7a3 구분선, 하단 '다옴법무사사무소'. 인물 사진 배경 시 얼굴은 가리지 않는 쪽(좌/우 1/3)에 글자.

| 파일명(제안) | 제목 | 배경 | 페이지·위치 |
|---|---|---|---|
| card-consult-prep.jpg | 상담 전 준비할 자료 | #44 상담-메인 | /부산법무사상담 본문 '준비서류' 섹션 상단 |
| card-selection-criteria.jpg | 법무사 선택, 확인할 기준 | #120 사무실_정면 | /부산법무사추천 본문(인포그래픽 #155 자리 앞) |
| card-office-visit.jpg | 센텀 사무소, 예약 후 방문 | #122 상담협의 | / 오시는 길·사무소 소개 섹션 |
| card-inheritance-first.jpg | 상속, 어떤 절차부터? | #136 서류검토 | /부산상속법무사·/부산상속전문법무사 본문 첫 절차 섹션 |
| card-registry-check.jpg | 등기 전에 확인할 것 | #100 등기운영과(인물 없음) | /부산등기법무사 본문 체크리스트 |
| card-corporate-change.jpg | 법인등기, 변경 사항부터 | #117 겨울(4) | /부산법인등기·/법인등기 본문 '변경 유형' 섹션 |
| card-corporate-deadline.jpg | 임원 변경, 2주 안에 | #93 계약임원 | /부산법인법무사 본문(기한 안내) |
| (선택) card-docs-beige.jpg | 서류부터 차근차근 | 사진 없음, beige 단색 | 사진이 없는 허브 공용 |

문구는 효과 보장·순위 표현 없음(광고 규정). 생성은 기존 `scripts/generate-carousel-images.ts` 방식(sharp+SVG) 재사용 가능 — 단 그 스크립트의 COLORS(#1e3a5f)·FONT(Malgun Gothic 우선)는 지정 브랜드값과 다름.

## 4. ItemList 점검
- 실제 사용처(git grep): `SeoCarouselJsonLd` 호출 4곳 — HomePopularSearches:122, PageDataTemplate:422, RegistrationChoiceCards:27(부동산·법인 2변형), ServicePages:49 (import 포함 grep 10줄).
- out/에서 ItemList 있는 html 1,197개, **한 페이지 2개: /부산법인법무사(7개+8개), /부산부동산등기, /services** (확정). 원인: PageDataTemplate의 CorporateRegistrationChoiceCards(`getRelatedContentCarousel(hub,7)`) + 하단 related carousel(8) — 화면 캐러셀도 두 번 노출.
- 이름·순서·URL: 홈(6개)·/부산상속법무사(4)·/부산법인등기(8)·/법인등기(8) 모두 화면 카드와 일치(같은 items 배열 사용, 확정).
- image: 화면 = 1:1 텍스트 카드 webp(`images/generated/carousel/...`, 1200²), JSON-LD = `representativeImage` 1200² 사진 jpg(`generated/serp/...`). 작은 썸네일 아님. 화면과 다른 파일이지만 설계 의도(SERP엔 글자 없는 사진)와 일치. 단 법인 계열은 모두 #93 크롭이라 항목 간 구분 약함.
- `@id`·`name` 없음. ListItem은 name/url/image/position 4필드.
- 네이버 문서(searchadvisor 캐러셀 가이드): WebFetch 차단 → **미확인**. 필수 필드 기록 못 함.

### 최소 개선안
1. `SeoCarouselJsonLd`에 `pageUrl`·`heading` prop 추가 → `"@id": pageUrl+"#featured-pages"`, `name: heading`. 호출 4곳에서 이미 heading 보유.
2. 중복 제거: PageDataTemplate에서 Corporate/RealEstate ChoiceCards를 렌더한 경우 하단 related의 `<SeoCarouselJsonLd>`(또는 캐러셀 전체) 생략 — 한 페이지 ItemList 1개.
3. registry: 화면·JSON-LD가 이미 같은 `RelatedCardItem[]`에서 나오므로 추가 registry 불필요. 법인 3페이지 representativeImage만 서로 다른 원본(#93/#117/#100)으로 manifest 교체.
보호 대상: items≥4 조건, url=canonical, 홈 6개 순서, 1:1 훅 카드(화면 전용) 분리 원칙, 상속 4개 페이지 이미지.
검증: 빌드 후 `grep -c '"@type":"ItemList"'` = 페이지당 ≤1, @id 고유, 화면 href 순서 = itemListElement url 순서, image URL 200·1200px 이상.
