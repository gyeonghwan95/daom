# Phase 1 — 부산 지역 갭 보완 (2026-08-21)

제약: 기존 URL 변경·삭제·redirect 0. 「부산 법무사」 exact는 HOME 유지.

## CREATE (NEW URL 3)

| Path | 각도 (구 허브·동 허브와 분리) |
|---|---|
| `/사하구부동산등기` | 하단·괴정·다대 **잔금일·근저당·전세권** 등기 실무 |
| `/서구부동산등기` | 충무·송도·동대신 **상가·구축주택 매매·담보** (소유권이전 spoke와 구분) |
| `/영도구부동산등기` | 남항·동삼·봉래 **토지·건물** 등기 (**선박등기 제외**) |

구현: `local-landing/config.ts` strong service-region + `districts-extra` RE 전용 context.  
`regions.ts` relatedServices에 `real-estate-registration` 추가(로컬 슬러그 예약으로 thin 중복 없음).

분량 검증: procedures 5 / documents 6 — `/수영구부동산등기`와 동일 등급. intro ≥ sibling.

맵(`busan-legal-map`) 기존 링크 → **데드링크 해소**.

## IMPROVE (URL 유지)

| 대상 | 내용 |
|---|---|
| `/서구법무사` | coverage·FAQ에 부동산등기·소유권이전 spoke 분기 |
| `/영도구법무사` | 선박 vs 부동산 구분 FAQ, RE spoke 링크 문구 |
| `/중구법무사` | 원도심 상가 매매 → 중구 부동산등기 분기 |
| `/사상구법무사` | 공장·상가 매매 → 사상구 부동산등기 분기 |
| `/사하구법무사` | 잔금일 실무 → 사하구 부동산등기 분기 |
| 하단·괴정·다대·동삼 동 허브 | relatedLinks에 신규 RE spoke 추가 |

## 검증

- `tsc --noEmit` OK  
- 3 slug localLandingConfigs 포함, map href 일치  
- 기존 URL rename/redirect 없음  

## 다음 (Phase 2)

얇은 동 overlay·내부링크 정리. 신규 동 URL 기본 0.
