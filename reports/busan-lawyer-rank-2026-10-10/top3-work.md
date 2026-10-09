# 주요 키워드 상위 노출 작업 — 2026-10-10

## 관측 재사용(41개 검색어, 10-09 22:57·10-10 00:4x KST, PC·비로그인 1회)
- 상위 5개 외부 도메인 등장 빈도: cafe.naver.com 32, blog.naver.com 27, **우리 사이트 18**, kin.naver.com 16, 부산시 7 …
- 우리 사이트 1위 등장: 부산 법인등기·부산 부동산등기·부산 선박등기·부산 법무사 비용·센텀 법무사
- 미등장·약세: 상속포기·한정승인(법무사 없는 검색), 개인회생·파산, 소유권이전·증여, 임원변경·본점이전(결과가 지식iN·블로그·클립 위주), 부산 법무사(기관 사이트+플레이스)
- 경쟁 2곳 구조: 법무사허성엽사무소.com(검색어 일치 title, 초기 HTML 본문 거의 없음, 플레이스 리뷰 58·예약), greeda.co.kr(변호사, FAQ·LegalService 구조화). 본문 복제 없음.

## 확인된 결함과 수정
1. RSS 연결 누락: `src/app/layout.tsx:38` alternates.types(RSS)가 `src/lib/seo/metadata.ts:112` 페이지 alternates로 덮여 사라짐(Next 메타데이터 얕은 병합, `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md:1326`). 수정 후 1,881/1,883 페이지 head에 RSS link(중복 0). `[childSlug]` 일부 경로는 자체 alternates로 미포함(보류).
2. JSON-LD sameAs에 자기 사이트 URL(/contact·/location): `src/lib/seo/social.ts` 수정, 해당 0건.

## 비교
직전 빌드 대비 title·H1·description·본문·링크·canonical·robots·사이트맵 변화 0. `npm test` 17/17, eslint 통과, tsc 기존 오류 1(대상 외).

## 보장하지 않음
순위·3위 이내·1위. 순위는 네이버 알고리즘·플레이스·블로그·카페 등 사이트 밖 요소가 함께 결정한다.
