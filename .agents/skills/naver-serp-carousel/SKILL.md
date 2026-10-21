---
name: naver-serp-carousel
description: Restores and expands Naver SERP image carousels (여러 페이지 제안, 사이트링크 썸네일, 티스토리형 카드) for 다옴법무사사무소. Use when the user mentions 캐러셀, 케러셀, 여러 페이지 제안, sitelinks, 사이트링크, 썸네일 카드, 유입 극대화, law-yoon.tistory, or missing related-page images in Naver search.
---

# Naver SERP 이미지 캐러셀

네이버가 한 결과 아래에 **서로 다른 URL 4–7장**을 이미지 카드로 보여주는 모듈을 복구·확대한다. 스크린샷 기준은 `law-yoon.tistory.com`의 구·군·공탁 카드다. 목표 호스트는 `다옴법무사사무소.kr`.

네이버 노출을 보장하거나 1위를 단정하지 않는다. 자격(고유 이미지 + 화면과 같은 ItemList + 내부링크)만 만든다.

## 성공 정의

- 홈·챔피언·16개 구·군 허브 HTML에 **같은 순서의 카드와 ItemList**가 있다.
- 팩 안 이미지가 **서로 다른 파일**이다.
- 기존 랭킹 URL의 title/H1/canonical을 바꾸지 않는다.
- 신규 얇은 지역 클론을 만들지 않는다.

## 금지

- 티스토리 글 복사, 가짜 후기, 키워드 스터핑
- 같은 사진을 한 팩에 반복
- 구·군 페이지에 다른 구청 사진을 연결
- 분사무소가 있다는 암시
- 대량 301·noindex·URL 삭제
- HOME·`/부산상속포기` 본문 장문 추가
- 보호 랭킹 URL 리타이틀 (`/`, `/부산상속포기`, `/부산상속재산분할법무사`, `/업무사례/울산동구상속등기법무사`, `/부산등기법무사` 등)

## 사이클 (이 순서를 지킨다)

1. **진단** — 라이브 SERP가 티스토리인지 `.kr`인지, 홈 HTML에 `ItemList`·`#featured-pages`·고유 `og:image`가 있는지 확인한다.
2. **감사** — `npm run audit:serp-carousel`. FAIL이면 코드부터 고친다.
3. **이미지 소유** — `src/data/seo/serp-carousel-images.ts`에만 고유 사진을 넣는다. 규칙은 [reference.md](reference.md).
4. **팩** — `src/data/seo/serp-carousel-packs.ts`. 기존 URL만. 의도 갈래(등기/포기/설립)를 섞어 잠식하지 않는다.
5. **렌더** — 화면은 `PageSerpCarousel`, JSON-LD는 `SeoCarouselJsonLd`. 둘의 순서·href·image가 같아야 한다.
6. **OG** — `resolveSerpImage`가 소유 사진을 쓰므로 별도 title 변경 없이 구·군 OG가 달라진다.
7. **검증** — 홈·사상구·기장·강서·북구·공탁·`/상속` 정적 HTML에서 ItemList 4장 이상, 이미지 경로 200.
8. **배포 후** — Search Advisor 수집은 사용자가 요청한 뒤에만. 캐러셀 등장은 D+7/14/28에 관측한다.

## 핵심 파일

| 역할 | 경로 |
|------|------|
| 고유 사진 | `src/data/seo/serp-carousel-images.ts` |
| 명시 팩 | `src/data/seo/serp-carousel-packs.ts` |
| 리졸버 | `src/lib/seo/serp-carousel-pack.ts` |
| UI+JSON-LD | `src/components/carousel/PageSerpCarousel.tsx` |
| 홈 | `src/components/home/HomePopularSearches.tsx` |
| 기본 랜딩 | `src/components/page-data/PageDataTemplate.tsx` |
| 검사 | `scripts/audit-serp-carousel.ts` |

리졸버 순서: 명시 팩 → 구·군 회전+공탁 → 생활권 이웃 → `page-relations` → PAGE_VISUALS. 이미지 없는 URL은 카드에서 뺀다. 4장 미만이면 팩 자체를 숨긴다.

## 홈 팩 (스크린샷 대응)

`/부산공탁` · `/사상구법무사` · `/기장군법무사` · `/강서구법무사` · `/북구법무사` · `/해운대법무사` · `/부산진구법무사`

카드 제목은 페이지명, 이미지 속 장소는 실제와 같거나 장소를 단정하지 않는 사무소 사진.

## 검색어를 거의 다 커버하는 방법

새 키워드마다 페이지를 만들지 않는다.

- 구·군 검색 → 해당 `{구}법무사`가 팩 주인이 되고, 이웃 구·공탁이 카드가 된다.
- 업무 검색 → 챔피언 URL 명시 팩(갈래 페이지만).
- 브랜드·부산 법무사 사무소 → HOME 팩.

같은 카드를 모든 키워드에 복제하지 않는다. 현재 URL 기준으로 이웃이 달라야 한다.

## 완료 보고

- 필수 팩 통과 수 (`audit:serp-carousel`)
- 라이브에 ItemList가 보이는 URL
- 아직 고유 사진이 없어 팩에서 빠진 URL
- 네이버가 모듈을 달지 않을 수 있다는 한 줄
- 1위 달성 문장 금지
