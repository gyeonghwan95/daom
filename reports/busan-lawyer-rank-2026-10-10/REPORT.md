# '부산 법무사' 노출 하락 조사 — 2026-10-10

## 기준 SHA
| 구분 | SHA | 시각(KST) | 확실성 |
|---|---|---|---|
| GOOD_SHA | `16f9ffb` | 커밋 10-01 00:31, Cloudflare Pages 배포 10-01 00:44 | **임시 기준**. 순위 기록이 아니라 `reports/seo-priority-reset/2026-10-01/00-summary.md:27`의 "이전 샘플: 홈이 '부산 법무사'에 노출" 기록과, 그 보고서를 담은 `50d0315`(22:15 배포) 직전의 운영 배포라는 점에 근거 |
| DEPLOY_SHA | `3005d28` | 커밋 10-10 00:08, 배포 00:14 | 확정. 운영 HTML에 이 커밋에서만 생긴 문구 2개 확인, 대상 title·H1 운영=빌드 일치 |
| WORK_SHA | `3005d28` + 미커밋 1파일(`busan-lawyer.ts`) + 빌드 산출물·lastmod 핀 | — | — |

GitHub: 공개 API check-runs로 커밋별 Cloudflare Pages success 시각 확인(`gh` 미설치). GitHub Actions `build` 체크는 확인한 6개 커밋에서 모두 failure(배포와 별개, 원인 미조사).

## GOOD vs DEPLOY 비교 (같은 빌드 설정, detached worktree)
`compare.json`:
- 전체 1,863→1,883 route, 삭제 0, canonical 변화 0, robots 변화 27(10-05 과태료·보수표 noindex 정책), 사이트맵 제외 27·추가 22
- 홈 `/`: title·description·H1·canonical·robots **동일**, 링크 +1(언론 기사), 본문 소폭
- `/부산법무사`: title·description·H1 변경, 링크 76→56(구·군 허브 등 27개 제외)
- `/부산법무사추천`·`/부산법무사상담`: 본문 축소·재구성, title 유지
- 구·군 허브의 사이트 전체 inbound는 각 1개 감소뿐(`hub-inbound.txt`)
- 환경 차이: GOOD 빌드의 lastmod는 worktree 체크아웃 mtime, 네이버 리뷰 데이터는 빌드 당일 값

## 확인된 결함
- `src/data/seo/page-relations.ts:32,34-35,425`: '부산 법무사' 담당 = 홈, `/부산법무사` = "Supporting guide … Broad query champion is HOME"
- `src/lib/priority-seo/existing/busan-lawyer.ts:13,16`(커밋 `50d0315`, 10-01 22:15 배포): `/부산법무사` title·H1이 '부산 법무사'로 시작 → 홈 title '부산 법무사 안윤정'과 같은 검색어를 두 페이지가 첫 문구로 겨냥. 같은 보고서가 밝힌 의도("홈과 겹치지 않게")와도 반대
- 이것이 순위 하락의 원인이라는 증거는 없다(**가설**). 시점 일치만으로 확정하지 않는다.

## 미확인 가설
- 네이버 결과 구성 변화: 2026-10-10 00:45 KST(PC UA·비로그인) '부산 법무사' 웹 영역은 법원·LH·부산시 등 기관 사이트, 다옴은 웹 영역 미검출, **플레이스 7개 중 5번째**(JSON 순서, 요청 위치 영향 가능). '부산법무사'(붙여쓰기)는 홈이 사이트링크(about·contact·office·services·tools)와 함께 노출.
- 10-05 사이트 전체 정리(27개 noindex 등)의 사이트 평가 영향 — 근거 없음
- 재수집·색인 상태 — 서치어드바이저 자료 없음

## 수정
`busan-lawyer.ts`: title "다옴법무사사무소 업무 안내｜부산 상속·부동산등기·법인등기·공탁", H1 "다옴법무사사무소는 부산에서 어떤 일을 맡나요?". URL·description·본문·링크·breadcrumb('부산 법무사') 유지. GOOD 시점 title("…상담 기준")은 현 /부산법무사추천 역할과 겹쳐 그대로 복원하지 않음.
`lastmod-pins.json`: /부산법무사 2026-10-10.

## 검증
- 같은 시각 DEPLOY 재빌드 vs 수정 빌드(`diff-deploy-vs-fix.json`, 시각 의존 배너 "전화상담은 X요일 9시부터" 정규화): 1,883 route 중 변화는 /부산법무사 title·H1·본문(H1) 1곳, 링크 문구 변화 0, 삭제·추가 0
- og:title·JSON-LD headline 일치, 사이트맵 변경 3파일 각 1줄
- `npm run build` 성공, `npm test` 17/17, eslint 통과, tsc는 기존 오류 1(`reserved-inheritance-intents.ts`, 이번 diff 밖)
- 배포 안 함 → 운영 HTML 미반영

## 복구
`git checkout 3005d28 -- src/lib/priority-seo/existing/busan-lawyer.ts scripts/lib/sitemap/lastmod-pins.json` 후 빌드.

## 이후 관측
배포 후 운영 /부산법무사 title 확인 → /부산법무사 수집 요청 → 같은 조건(PC·비로그인)으로 '부산 법무사'·'부산법무사' 관측: 웹 영역 노출 URL(홈 여부), 플레이스 순서. 7/14/28일은 관측 일정이며 회복 기한이 아니다.
