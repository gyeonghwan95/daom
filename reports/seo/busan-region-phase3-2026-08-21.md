# Phase 3 — 흡수·station IMPROVE + 동결 (2026-08-21)

제약: 기존 URL 변경·삭제·redirect **0**. CREATE_NEW 동·역 URL **0**.

## Station overlay (KEEP URL, 본문만)

신규 역 URL 금지(`docs/seo/station-seo-before.md`). 기존 얇은 역 페이지만 Host로 분기.

| Slug | Primary Host |
|---|---|
| `/센텀시티역법무사` | `/센텀법무사` |
| `/서면역법무사` | `/서면법무사` |
| `/해운대역법무사` | `/중동법무사` · `/해운대법무사` |
| `/광안역법무사` | `/광안리법무사` · `/광안동법무사` |
| `/사상역법무사` | `/사상법무사` · `/사상구법무사` |
| `/명지역법무사` | `/명지법무사` · `/명지동법무사` |
| `/연산역법무사` | (Phase2에서 보강됨) |
| `/부산역법무사` | neighborhood-hub — overlay 불필요 |

파일: `src/data/seo/local-champion-overlays-stations.ts`

## 구 허브 흡수 IMPROVE (신규 동 URL 없음)

| Hub | 흡수 강화 |
|---|---|
| `/북구법무사` | 만덕·금곡 FAQ, 북구부동산등기·개인회생 분기 |
| `/기장군법무사` | 철마·장안·기장법무사 분기, 기장군부동산등기 |
| `/강서구법무사` | 녹산·대저·가락 doorway 금지, 명지≠명지동 |
| `/동구법무사` | 수정동 흡수·동구부동산등기 분기 |

## DO_NOT_CREATE (의도적 공백 — 검증됨)

만덕동·수정동·녹산·송도·마린시티·감전동·충무동·당리·장림·철마·장안 등  
→ 구/동 허브 coverage·FAQ로 흡수. seo-paths에 **없음** 확인.

구×개인회생·구×소유권이전 전수 양산도 **비권장** (시티 챔피언·기존 spoke로 흡수).

## 챔피언 충돌 유지

- `부산 법무사` → `/`
- `부산 법무사 추천` → `/부산법무사추천`
- `부산 법무사 상담` → `/부산법무사상담`

## 검증

- `tsc --noEmit` OK  
- station overlay 6+연산 전부  
- DO_NOT_CREATE 경로 미존재 확인  

## Phase 1–3 요약

| Phase | 결과 |
|---|---|
| 1 | 사하·서·영도 `/…부동산등기` NEW 3 + 약한 구 허브 IMPROVE |
| 2 | 얇은 동 overlay 강화 + 생활권 링크 (CREATE_NEW 0) |
| 3 | station overlay + 흡수 FAQ (CREATE_NEW 0) |

배포 후: Phase1 3URL + 보강한 동·역 URL은 서치어드바이저 **필요 시만 1회** 수집. title 대량 변경 금지.
