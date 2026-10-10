# 4개 영역 개선 — 2026-10-10 (검증 후속)

기준: 작업 전 빌드 `after15` → 작업 후 `after18` (`reports/busan-lawyer-rank-2026-10-10/diff-after15-after18.json`).
전체: route 추가·삭제 0, title·H1·description·색인 정책 변화 0, 링크 손실 페이지 0. `npm test` 17/17, eslint 통과, tsc 기존 오류 1(대상 외).
**미배포**: 로컬 `5390c93` 미push + 이번 변경 미커밋.

## 1. SEO
- 시·도 상속 페이지 중복: 통과 3/16 → **16/16** (첫 화면 평균 0.85→0.527, 본문 0.89→0.756; `../region-inheritance-2026-10-10/dup-sido-all.csv`)
  - `localPoints`·`localFaqs` 신설(`src/lib/nationwide-cases/types.ts`, `builder.ts`), 13개 시·도 지역 사실 작성(`metro-defs.ts`): 행정구역 변경과 등기부(부동산등기법 제31조), 미등기 건물 보존등기(제65조), 상속 농지(농지법 제7·8조), 취득세 기한(지방세법 제20조), 가정법원·지원 관할(저장소 관할표)
  - 시·도 페이지에서 반복 일반 섹션 2개 생략, 전국 의뢰 안내 간결형, 요약 결론에 지역 포인트, 공용 FAQ 1개로 축소, 강원·충북 공용 시나리오 조합 분리
- 낡은 검사기 교체: `scripts/verify-exported-carousel-images.ts` — 대표 이미지(SERP 우선 규칙)·캐러셀↔ItemList 일치 검사 → OK(대표 17쪽, 캐러셀 1,196개)
- /부산상속전문법무사 대표 visual 중복·카드 누락 해소(`validate-page-visuals`·`validate-page-thumbnails` 오류 0)

## 2. 전환 (네이버 예약 버튼 유지)
- 상단 상담 안내(`src/components/consultation/EarlyConsultCta.tsx`, 문의 폼 from=…-early 추적): 첫 상담 링크까지 /부산상속포기 4,977→992자, /부산상속전문법무사 4,125→909, /해운대법무사 2,457→586, /부산법무사추천 2,764→467(`topCta`)
- 정정: 일반 템플릿 페이지는 H1 아래 '1분만에 문의하기' 버튼이 원래 있었음(이전 측정이 `<button>`을 놓침) → 그 템플릿에는 넣지 않음
- 상담 가능 표시: 초기 HTML은 시각 무관 중립 문구, 마운트 후 실제 시각(`src/hooks/useConsultationAvailability.ts`) — 빌드 요일 노출·hydration 불일치 제거
- **확인 필요**: 상단 상태 표시(평일 09–19, 주말 09–14 '상담가능')와 영업시간 기준값·플레이스·JSON-LD(평일 09–18, 주말 휴무)가 다름

## 3. 가독성·신뢰
- 400자 넘는 문단 페이지 4% → **0%** (`src/lib/readability/split-paragraph.ts`, 본문·요약·FAQ·지역 도입 적용, 내용 불변)
- 핵심 요약 기본값: '진행:/서류:' 단편 → 절차 문장, 권유 문구·중복을 '상담이 필요한 상황'에서 제외(`PageDataTemplate.tsx`)
- 시·도 페이지 지역 사실·근거 조문 표기(위 1)

## 4. 캐러셀 이미지
- 40장 재생성(`scripts/generate-carousel-images.ts`): 분류별 색(상속 청록·부동산 갈색·법인 파랑·회생 보라·강의 녹색·허브 회청), 분류 배지 48px·부제 50px·하단 '다옴법무사사무소 · 안윤정 법무사' 34px(300px 표시에서 판독), 흐림 7→3.5·감광 완화 — `carousel-sheet-after.jpg`, `card-300px-after.png`
- 배치: 주제 무관 동일 카드 1,172쪽 → 787쪽 주제 일치(serviceSlug·경로 업무명 추정, `src/lib/seo/page-visuals.ts`)

## lastmod
실질 변경(시·도 페이지·상단 상담 안내 추가 등) 20쪽만 2026-10-10. 문단 나눔·요약 문구·캐러셀 교체 같은 표현 수준 변경 1,270쪽은 올리지 않음.
