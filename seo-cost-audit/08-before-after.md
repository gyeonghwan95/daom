# Cost SEO — before / after (2026-08-26)

## Safety

- 기존 URL 변경: 0
- 기존 URL 삭제: 0
- 의도하지 않은 redirect: 0
- 신규 비용 URL: 0 (1차 wave — 기존 URL만 강화)
- 가짜 고정가격·최저가·무료상담 SEO·schema price: 0

## Strategy

동일 Cost Intent Family는 하나의 PRIMARY URL.
수수료·수임료·비용·보수·얼마·가격·견적은 별도 페이지로 쪼개지 않음.

TYPE A Broad Cost → `/부산법무사비용`
TYPE B Service Cost → 기존 비용 URL 또는 서비스 페이지 비용 섹션
TYPE C Transactional → 결정요인 + 견적에 필요한 정보 (계산기 신설 없음)

## What changed

- General Cost Hub `/부산법무사비용`: 상황별 navigator, 견적 비교 시 확인 항목
- Conversion cost pages: 고유 intro·FAQ·저당권 말소 예시 제거(해당 없는 업무)
- 핵심 서비스 페이지: 고유 비용 H2 (title/H1 유지)
- Thin seo-landing 비용 URL: slug overlay로 고유화, PRIMARY는 유지
- 기존 `/근저당말소비용`·`/임차권등기명령비용`은 1차에서 빠졌던 overlay를 보완 (신규 URL 아님)
- 동의어 search-intent URL 보존, 허브 보조 문서로 역할 고정
- `/왜*비용이다를까` 3페이지·`/등기비용`은 PRIMARY로 보내는 보조 섹션 보강
- Topic hub `costHref` 오연결 수정 (부동산등기→`/부동산등기비용`, 회생파산→`/개인회생비용`, 법인등기→`/법인등기비용`)

## Naver SERP

Query `부산 법무사 비용`: 광고 영역 확인. 유기적 순위·검색량은 자동 파싱 불가로 기록하지 않음.
다옴 홈 스니펫이 변환 문서에 보였으나 순위로 단정하지 않음.

## Build

- `npx tsc --noEmit` — OK
- eslint on changed files — OK
- `npm run build` — OK, 1829 static pages, `[seo-dom] all samples OK`
- sitemap `totalUrls`: 1665 (unchanged)
- validate-page-data: 1805 paths
- 신규 비용 URL: 0

정적 HTML 확인: `/부산법무사비용` navigator H2, `/상속등기비용` 고유 비용 H2, `/부산상속포기` 비용 섹션, `/개인회생비용` overlay H2 포함.
모바일 표: `/개인회생파산` 비교표를 `ComparisonTable`(카드+가로스크롤)로 교체. 체크리스트는 줄바꿈·`min-w-0` 처리.
뷰포트 라이브 브라우저는 이 환경에서 390/1920 실측을 완료하지 못했으므로, 배포 후 한 번 확인하는 것이 안전합니다.
