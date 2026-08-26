# 06 Content quality

점수 근거는 production HTML + 소스. 8 미만만 상세.

스케일: 각 항목 10점. 배포 전 코드 개선은 “조치”로만 표시.

## `/` HOME — PROTECT

| 항목 | 점수 | 근거 |
|---|---|---|
| Intent Match | 9 | TITLE `부산 법무사 \| 다옴법무사사무소 안윤정`, H1 `부산 법무사 안윤정` |
| Unique Information | 8 | 주소·자격·언론 슬롯 존재 |
| Legal Accuracy | 8 | 광역 안내, 과장 없음 |
| Local Relevance | 9 | 해운대·센텀 실주소 |
| Experience Evidence | 8 | 프로필·언론 |
| Internal Authority | 7 | 회생 엔트리를 `/개인회생파산`으로 보강 |
| Conversion UX | 8 | 상담 채널 명확 |
| Boilerplate Ratio | 7 | 허브 링크 다수 |
| Duplicate Ratio | 8 | 선택 가이드와 역할 분리됨 |
| Technical Quality | 8 | H1 1, footer 순서 OK |

TITLE/H1 재수정 없음.

## `/부산개인회생` — 최우선

| 항목 | 점수(전) | 근거 |
|---|---|---|
| Intent Match | 3 | H1이 `부산 개인회생 법무사 상담` → commercial 잠식 |
| Unique Information | 4 | 사상구·엄궁동 나열 |
| Legal Accuracy | 5 | 등기 대리 description |
| Local Relevance | 4 | 등기소/동 이름, 부산회생법원 약함 |
| Experience Evidence | 5 | 회생과 무관한 경력 섞일 여지 |
| Internal Authority | 5 | 허브 역할 불명 |
| Conversion UX | 6 | CTA는 있음 |
| Boilerplate Ratio | 3 | generic service-region |
| Duplicate Ratio | 3 | 법무사 페이지와 H1 충돌 |
| Technical Quality | 7 | DOM 순서는 정상 |

조치: `personal-rehabilitation-busan.ts` 전용 허브. 등기 템플릿 제거.

## `/부산개인회생법무사`

콘텐츠 품질 상대적으로 높음 (가능성 판단). 대규모 rewrite 없음. 브레드크럼 부모를 `/부산개인회생`으로 연결.

## `/개인회생파산`

전: H1 `부산 개인회생·개인파산·면책 상담`, TITLE 키워드 나열.  
후: 비교 H1 + 비교표 + 회생 전용 의견문. generic 인감/등기부 서류 나열을 비교 허브에서 쓰지 않음.

## `/부산등기법무사` — PROTECT

TITLE/H1/상황 내비 이미 적합. 대규모 rewrite 없음.

## `/부산상속법무사`

본문 품질은 강함. production DOM 순서는 이미 정상. 검색어 bullet → 상황 내비. TITLE/H1 대수술 없음.
