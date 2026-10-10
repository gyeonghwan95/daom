# '부산 법무사' 상위 노출 개선 — 2026-10-10

## 관측 (16:45 KST, PC·비로그인, 1회) — `serp-observe.txt`
- 웹 영역 결과 사이트 12곳: 부산가정법원·부산지법·LH·부산시·부산지방법무사회 등 기관 + 법무법인 홈페이지 3곳(사이트링크) — **다옴 없음**
- 플레이스: 다옴 **12곳 중 4번째**, 방문자 리뷰 13 (1위 276, 2위 192)
- 홈 title·H1은 이미 '부산 법무사 안윤정' → 키워드 부족이 원인 아님

## 확인된 사이트 품질 문제
- 색인·사이트맵 페이지 1,659개 중 **321개(19%)가 내부 링크 0인 고아 페이지**(`orphans.json`)
- 동의어 쌍(기간/기한, 필요서류/준비서류) 36쌍 본문 유사도 평균 0.80~0.85, 다른 업무 기준값 0.56 (`synonym-dup.json`)
- 고아 지역 페이지 61개가 다른 지역 형제와 0.90 이상 동일(지역명만 치환, 최고 0.964) (`orphan-sim.json`)
- '부산 법무사' 순위와의 인과는 미확인(가설). 네이버 콘텐츠 가이드의 유사 문서 대량 생성·검색 노출 목적 문서 기준에 해당할 수 있는 신호

## 사용자 결정에 따른 조치(최대한 연결, 심각한 것만 제외)
- 제외(noindex+follow, URL 200 유지, sitemap 제외) 93개: 지역 치환 복제 61(canonical 자기 유지), 동의어 쌍의 링크가 적은 쪽 32(canonical→강한 쪽) — `seo/index-policy.json`
- 연결 229개: 상위 허브 47곳에 '이어서 볼 수 있는 상세 안내' 섹션(`src/data/seo/hub-child-links.ts`, 생성기 `gen-hub-links.mjs`)
  - PageData 경로: `src/lib/pageData/resolvers.ts` withHubChildLinks
  - 전용 화면 7종: `src/components/seo/HubChildLinks.tsx` 삽입(우선순위·선박·복구·법인·비영리·건축·업무사례 지역별)
- lastmod: 실제 링크가 추가된 상위 46곳 핀 2026-10-10

## 검증
- 직전 빌드 대비: 추가·삭제 route 0, title·H1·description 변화 0, 색인 정책 변화 93(의도), 링크 변화 47(상위 허브), 링크 손실 페이지 0
- 본문 해시 1,857곳 변화는 빌드 시각 의존 상담 배너(앞 보고서에서 확인) — 링크·메타 변화 아님
- 고아 색인 페이지 321 → **0**, 사이트맵 1,659 → 1,566, 제외 페이지 사이트맵 잔존 0
- 링크 라벨 상위별 중복·과장 0, `npm test` 17/17, eslint 통과, tsc 기존 오류 1(대상 외), sitemap 검증 통과

## 보장하지 않음
'부산 법무사' 1위. 웹 영역은 기관·법무법인 사이트, 업체 탐색은 플레이스가 차지한다. 플레이스 리뷰·정보 완성도가 가장 큰 변수다.

## 복구
`git checkout HEAD -- seo/index-policy.json src/lib/pageData/resolvers.ts scripts/lib/sitemap/lastmod-pins.json src/components/{priority-seo,ship-seo,naver-recovery,corporate,special-entity,building,case-regions}` + 새 파일 2개 삭제(`src/data/seo/hub-child-links.ts`, `src/components/seo/HubChildLinks.tsx`) 후 빌드.

## 후속(같은 날): 지역 페이지 61개 색인 복원과 차별화
- 사용자 요청으로 지역 치환 61개를 색인·사이트맵에 복원(`restored-regions.json`), 상위 허브에서 링크 연결(고아 0 유지). 동의어 약한 쪽 32개는 제외 유지.
- 지역별 실제 접수처 섹션 `src/lib/seo-landing/region-jurisdiction.ts`: 등기는 구·군 관할 등기소·주소(busan-registry), 포기·한정승인은 상속개시지 가정법원 원칙(법원명 단정 안 함), 법인은 상업등기 등기국 + 법인 부동산 관할, 구별 '먼저 확인할 사항'·자주 있는 상황
- 지역 랜딩 빌더 `builder.ts`: 업무와 맞지 않던 관할 안내(법인·포기 페이지에 부동산등기 관할) → 업무별 접수처로 정정
- 생성 본문 중복 출력 제거 `content.ts`: 다중 선택 중복(pickDistinct), 도입문·문단 중복, 체크리스트 3회 출력
- 결과: 61개 페이지 내부 반복 문장 157건(56쪽) → 21건(8쪽). 형제 대비 본문 유사도(공통 블록 제외) 평균 0.875 — 같은 업무 설명이 지역과 무관하게 같아 검증된 데이터만으로는 차별화 한계
- 영향: 같은 생성기 지역·업무 페이지 330곳 본문 변화(title·H1·description 변화 0), 실제 변경 257곳 lastmod 2026-10-10
- 추가 차별화에 필요한 것: 구·동별 실제 처리 사례·현장 정보(사무소 자료)
