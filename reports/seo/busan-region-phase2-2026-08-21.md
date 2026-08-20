# Phase 2 — 얇은 동 overlay·생활권 링크 (2026-08-21)

제약: 기존 URL 변경·삭제·redirect **0**. CREATE_NEW URL **0**.

## Overlay IMPROVE

| Slug | 조치 |
|---|---|
| `/명지동법무사` | **신규 overlay** — 기존 명지동 ≠ 신도시/에코델타 |
| `/광안동법무사` | 약→강 — 행정동 실거주 ≠ 광안리 해변·전세 |
| `/부전동법무사` | 약→강 — 부전 지번 ≠ 서면 상권 허브 |
| `/송정동법무사` | 약→강 — 송정·청사포·숙박 ≠ 중동·우동 |
| `/중동법무사` | 약→강 — 해운대 중동 ≠ 중구 |
| `/장전동법무사` | 약→강 — 원룸 매매 ≠ 부곡 한정승인 |
| `/온천동법무사` | 보강 — 온천장 ≠ 사직 재건축 |
| `/연산역법무사` | 보강 — 역 ≠ 연산동 허브 |
| `/기장법무사` | **마이크로 overlay** — 기장읍·기장군으로 분기 (URL 유지) |

등급: intro 3 + sections ≥2~3 + FAQ 2+ (민락/양정 수준).  
`millak`/`yangjeong` entity id alias 추가.

## Living hub 링크 IMPROVE

| Hub | 추가 링크 |
|---|---|
| `/서면법무사` | 부산진구부동산등기·부전동·전포동 |
| `/광안리법무사` | 민락동 + 광안동 각도 문구 분리 |
| `/명지법무사` | 강서구부동산등기 + 명지동 각도 분리 |
| `/정관법무사` | 기장군부동산등기·기장읍·일광읍 |
| `/센텀법무사` | coverage FAQ + linked `중동법무사` |
| `/에코델타시티법인등기` | linkedNeighborhoodSlugs → 명지·강서구·명지국제신도시 |

business-zone 빌더가 `linkedNeighborhoodSlugs`를 relatedRegionLinks에 반영하도록 수정.

## 검증

- `tsc --noEmit` OK  
- overlay resolve: gwangan/myeongji/bujeon/… OK  
- URL rename/redirect/delete 없음  

## 다음 (Phase 3)

신규 동 URL 기본 거부. 수요·고유 각도 입증된 경우만 예외. station 신규 금지.
