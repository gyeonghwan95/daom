# 담당 2 — Git·배포 회귀 (2026-10-12)

기준: 이전 보고서의 GOOD 후보 `7b42ef4`·`16f9ffb` 비교는 다시 하지 않음(결론 재사용). 이번에는 10-11 12:00 KST 이후 커밋과 30일 범위의 핵심 파일 커밋만 확인함. 표는 `git-regressions.csv` 참고.
도구: `git log --name-only`, `git show`, `git diff 899f9b1 e231514 -- <path>`, `out/index.html` 파싱, GitHub check-runs 8회.

## 배포 시각 (Cloudflare Pages completed_at, KST)
26ab245 10-11 13:43 · 467c84d 14:31 · 6f75fa2 17:01 · 37c2275 21:20 · 6cb8a32 21:49 · 563ade2 23:02 · cd109a8 23:49 · 19635f0 10-12 00:16(COMMON) · **e231514 10-12 22:03 success**(COMMON 작성 시점에는 in_progress였음). Actions `build`는 모두 failure. 배포와는 관계없음.

## 899f9b1(직전 보고서 DEPLOY) → e231514, 대상 4 URL
| URL | title | description | H1 | canonical·robots | 내부 링크·메뉴 |
|---|---|---|---|---|---|
| `/` | 무변 | 무변 | 무변('부산 법무사 안윤정') | 무변 | 6f75fa2: 첫 화면 문단 교체, 칩 6→quickLinks 4(/부산상속법무사·/부산상속등기 빠짐). 섹션 순서 변경 |
| `/부산법무사` | 무변 | 무변 | 무변 | 무변 | 467c84d: 사무소 섹션 문장 2개 말투만 바뀜 |
| `/부산법무사추천` | 무변 | 무변 | 무변 | 무변 | 없음 |
| `/부산법무사상담` | 무변 | 무변 | 무변 | 무변 | 26ab245: '공공기관 무료 법률상담' 섹션 추가(7kw 보고서 수정이 배포된 것) |

- 다음 파일은 이 구간에서 변경 0: page-relations·robots.ts·index-policy·_redirects·layout.tsx·busan-lawyer.ts·busan-recommend.ts.
- `_headers`: `/resources/pdf/*`에만 X-Robots-Tag noindex를 붙임(26ab245). 대상 URL에는 해당 없음.
- metadata/social/json-ld(cd109a8): og:image URL 이중 인코딩 수정과 크기 값만 바뀜. title·canonical·robots 처리 경로는 같음.
- 563ade2: 상속포기·한정승인·회생·파산 49개 route의 문장 정정. 대상 4 URL은 포함되지 않음. **유지**.
- 6cb8a32: 소스 변경 없음(reports, IndexNow 스냅샷).

## 메뉴 순서
- 순서 변경은 e231514가 아니라 **cd109a8**에서 했음. `mainNavigation` 배열에서 servicesNavItem·casesNavItem을 /about 뒤로 옮긴 것뿐임.
- nav href 집합은 37c2275와 cd109a8 모두 57개로 같음. 899f9b1(51개)과 비교하면 37c2275에서 6개가 늘었고 빠진 것은 없음.
- `out/index.html`의 주 메뉴 순서: /about | /services | /업무사례 | /resources | /situations | /partners. 헤더 링크 순서만 바뀌었음.

## 순위 기록(유일한 저장소 내 기록)
`audit/naver-ranks.csv`(37c2275에 포함)는 10-11 18:37 KST에 PC·모바일 where=web로 관측한 값임. 6f75fa2 배포 뒤, 37c2275·563ade2·cd109a8 배포 전 시점.
- '부산 법무사' → `/` web#15
- '부산 법무사 추천' → `/부산법무사추천` web#1
- '부산 법무사 상담' → `/` web#10. champion `/부산법무사상담`이 아님

10-10 00:45 관측에서 이미 웹 영역에 나오지 않았음. 따라서 10-11 이후 커밋을 기존 하락의 원인으로 볼 수 없음. 7b42ef4·16f9ffb 시점 순위는 **미확인**.

## 결론
- 10-11 12:00 이후 커밋 중 대상 4 URL의 title·desc·H1·canonical·robots를 바꾼 것은 **없음**.
- 확정된 회귀는 없음.
- 약한 후보는 6f75fa2 홈 첫 화면 문단 교체 1건. H1·title은 그대로이고 '부산 법무사'도 13회 남아 있음.
- 되돌리기는 권하지 않음. 같은 방법으로 다시 관측해 비교하는 것을 권함.
