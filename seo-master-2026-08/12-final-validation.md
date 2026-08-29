# 12 Final validation

일자: 2026-08-30  
Production: `https://xn--2j1br1na42lvxja38mk8r.kr`  
명령: `npm run seo:audit:master`

순위 보장을 주장하지 않음.

## Query Ownership (최종)

```
부산 법무사                    → /
부산 법무사 상담               → /부산법무사상담
부산 법무사 추천               → /부산법무사추천
부산 법무사 등기
부산 등기 법무사               → /부산등기법무사
부산 상속전문 법무사
부산 상속 법무사
부산 법무사 상속               → /부산상속법무사
부산 상속포기 법무사           → /부산상속포기
부산 한정승인 법무사           → /부산한정승인
부산 부동산 법무사             → /부산부동산등기
```

신규 `/부산부동산법무사` 없음.

## Production HTML 요약 (배포 전 현재 live)

| URL | STATUS | TITLE | H1 | CANONICAL | ROBOTS | loadingBeforeH1 | footerBeforeMain |
|---|---|---|---|---|---|---|---|
| / | 200 | 부산 법무사 안윤정 \| 다옴법무사사무소 | 부산 법무사 안윤정 | self | index,follow | false | false |
| /부산법무사상담 | 200 | 부산 법무사 상담 \| … | 부산 법무사 상담, 현재 상황부터 알려주세요 | self | index,follow | false | false |
| /부산법무사추천 | 200 | 부산 법무사 추천 \| … | 부산 법무사 추천, 검색 전에… (코드에서 맡기기 전으로 변경) | self | index,follow | false | false |
| /부산등기법무사 | 200 | 부산 등기 법무사 \| … | 부산 등기 법무사, 어떤 등기부터… | self | index,follow | false | false |
| /부산상속법무사 | 200 | 부산 상속 법무사｜… | 부산 상속 법무사, 등기·포기·한정승인 중… | self | index,follow | false | false |
| /부산상속포기 | 200 | 부산 상속포기 법무사｜… | 부산 상속포기 법무사, 기한과 후순위부터… | self | index,follow | false | false |
| /부산한정승인 | 200 | 부산 한정승인 법무사｜… | 부산 한정승인 법무사, 상속채무가 불확실할 때… | self | index,follow | false | false |
| /부산부동산등기 | 200 | 부산 부동산등기 법무사｜… | 부산 부동산등기 법무사, 매매·증여 이전 순서 정리 | self | index,follow | false | false |

상세 first300·H2는 `02-production-baseline.csv`.

## 품질 점수 (10점, 임의 만점 없음)

근거: production HTML + 코드 변경 범위. 배포 후 상담/추천은 0.5~1점 상승 여지.

| URL | Intent | Technical | Unique | Legal | Authority | Trust | Local | Snippet | Convert | Mobile | Avg |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| / | 9 | 8 | 8 | 8 | 9 | 8 | 9 | 8 | 8 | 8 | 8.3 |
| /부산법무사상담 | 8 | 8 | 7 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | 7.7 |
| /부산법무사추천 | 8 | 8 | 8 | 8 | 7 | 8 | 8 | 7 | 7 | 8 | 7.7 |
| /부산등기법무사 | 9 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8.1 |
| /부산상속법무사 | 9 | 8 | 9 | 9 | 8 | 8 | 8 | 9 | 8 | 8 | 8.4 |
| /부산상속포기 | 9 | 8 | 8 | 9 | 8 | 8 | 8 | 9 | 8 | 8 | 8.3 |
| /부산한정승인 | 9 | 8 | 8 | 9 | 8 | 8 | 8 | 9 | 8 | 8 | 8.3 |
| /부산부동산등기 | 8 | 8 | 8 | 8 | 7 | 8 | 8 | 8 | 7 | 8 | 7.8 |

8점 미만 페이지(상담·추천·부동산)는 이번 구조/내비/jargon 수정이 2차 조치.  
상담 Technical은 production DOM이 이미 정상이라 8. Unique는 중복 정리 후 배포 시 재평가.

## URL 보존

```
기존 URL 변경: 0
기존 URL 삭제: 0
Redirect: 0
```

스냅샷: `scripts/output/existing-routes-baseline-2026-08-30.json` (1806 paths)

## 네이버 서치어드바이저

접근 권한 없음. 실행했다고 보고하지 않음.  
사용자 확인 목록은 최종 보고 11번.

## 반응형 / 성능

브라우저 MCP 없음. 핵심 5뷰포트 스크린샷은 배포 후 사용자 확인.  
ComparisonTable을 단일 표로 바꿔 모바일은 가로 스크롤. 카드 이중 DOM은 제거.

## 명령

```
npm run seo:audit:master
npm run check:existing-routes
npm run lint
npx tsc --noEmit
```
