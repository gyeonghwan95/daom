# 부산 상속 SEO — 최종 보고서

날짜: 2026-09-03  
범위: repository 구현 + production HEAD 확인  
검색순위: **보장하지 않음.** Search Advisor 실측 없음 = `PERFORMANCE_UNKNOWN`.

## FINAL STATUS

| 검색어 | owner | 비고 |
|---|---|---|
| 부산 상속 법무사 | `/부산상속법무사` | indexable, self-canonical |
| 부산 상속전문 법무사 | `/부산상속법무사` | 신규 URL 없음. `/부산상속전문법무사`는 noindex 브리지로 유지 |
| 부산 상속포기 법무사 | `/부산상속포기` | title/H1 동결, 본문 전면 재작성 없음 |

보호 query owner는 변경하지 않았다.

| 보호 검색어 | owner |
|---|---|
| 부산 법무사 | `/` |
| 부산 법무사 상담 | `/부산법무사상담` |
| 부산 법무사 추천 | `/부산법무사추천` |
| 부산 법무사 비용 | `/부산법무사비용` |
| 부산 상속등기 법무사 | `/부산상속등기` |
| 부산 한정승인 법무사 | `/부산한정승인` |
| 해운대 / 연제구 / 수영구 / 동래구 법무사 | 기존 지역 owner |
| 부산 법인등기 법무사 | `/부산법인등기` |
| 부산 개인회생 법무사 | `/부산개인회생법무사` |
| 부산 강의 문의 | `/강의문의` |
| 특별한정승인 | `/특별한정승인` (`/부산특별한정승인` URL은 없음) |

## 현재 상속 관련 URL

동결 산출: `seo/inheritance/baseline-routes.csv` 등 (839행). 핵심만 요약.

| URL | status | indexable | canonical | 역할 |
|---|---|---|---|---|
| `/` | 200 | yes | self | 부산 법무사 |
| `/상속` | 200 | yes | self | INFORMATIONAL PILLAR |
| `/부산상속법무사` | 200 | yes | self | LOCAL COMMERCIAL OWNER |
| `/부산상속등기` | 200 | yes | self | 등기 owner |
| `/부산상속포기` | 200 | yes | self | 포기 owner |
| `/부산한정승인` | 200 | yes | self | 한정승인 owner |
| `/부산상속전문법무사` | 200 | **noindex** | `/부산상속법무사` | 브리지. 삭제 금지 |
| `/전국상속등기` | 200 | yes | self | supporting |
| `/services/inheritance-registration` | 200 | yes | self | supporting |
| `/특별한정승인` | 200 | yes | self | 특별한정승인 owner |

Production HEAD(`https://다옴법무사사무소.kr`): `/`, `/상속`, `/부산상속법무사`, `/부산상속등기`, `/부산상속포기`, `/부산한정승인`, `/부산법무사상담`, `/부산법무사추천` 모두 **200**.

## Search Advisor

repository에 impressions/clicks CSV·XLSX 없음.  
`seo/inheritance/naver-tracker.csv`는 칸이 비어 있다.  
임의 순위·CANNIBALIZATION_CONFIRMED를 만들지 않았다. 내부 신호만 `CANNIBALIZATION_SUSPECT`로 기록.

## 5 Agent 핵심 진단

### AGENT 1 — Search intent

- 「부산 상속 법무사」: 등기/포기/한정 미결정 + 부산에서 맡길 곳 → `/부산상속법무사`
- 「부산 상속전문 법무사」: 같은 상업 의도. 별도 URL 불필요
- 「부산 상속포기 법무사」: 거래형 포기 신청 → `/부산상속포기`
- 내부 TOP5 (`seo/inheritance/intent-top5.csv`): 세 PRIMARY 모두 expected owner가 1위. `/상속`은 「부산 상속 법무사」에서 3위(supporting).

### AGENT 2 — Cannibalization / internal authority

- exact-match 「부산 상속전문 법무사」가 noindex `/부산상속전문법무사`를 가리킴
- `/상속` 지역 섹션이 「부산 지역 상속 상담」으로 `/부산상속등기`만 가리킴
- 부산 로컬 오너 H1 위 「전 지역·방문 없이」 chip
- intro와 「자세히 알아보기」가 같은 문단을 공유

### AGENT 3 — Content quality

- `/부산상속법무사` hero가 긴 problemStatement를 쪼개 첫 화면을 채움
- 챔피언 extra summary가 intro 뒤에 붙어 중복
- `/부산상속전문법무사` FAQ에 「검색어 연결 안내」
- 상담 사례는 실제 MDX 사례 URL과 연결됨. 「최근 부산에서 상담한 사례입니다」·「부산 부산」은 src 본문에 없음

### AGENT 4 — E-E-A-T / local entity

- author = 안윤정 법무사. 가짜 reviewedBy/AggregateRating 추가 없음
- 허브 본문에 해운대 센텀 소재 문장을 한 번 넣음
- LegalService는 홈 차원. dateModified를 오늘로 돌리지 않음

### AGENT 5 — Technical / zero regression

- 공개 HTML은 static. Functions는 `/api/*`만. KV 실패가 상속 owner를 500으로 만들지 않음
- TITLE_FREEZE: 이번 프로젝트는 title/H1 유지
- og:title = title. PRIMARY owner collision = 0

충돌 시 선택: 기존 ranking asset(title/H1/URL/canonical)을 지키고 본문·내부링크만 고친다.

## 실제로 수정한 내용 (GREEN/YELLOW)

1. `/부산상속법무사` 첫 화면을 선택 문제로 재작성. title/H1 유지.
2. 상황 선택 카드 `InheritanceChoiceCards` 추가 (새 URL 없음).
3. 부산 로컬 오너 nationwide chip을 H1 앞에서 숨김.
4. intro와 「자세히 알아보기」 중복 제거. extra summary 첨부 중지.
5. 허브 고유 판단 섹션 추가.
6. `/상속` intro에 pillar vs 부산 commercial 역할 분리. 허브 링크 추가. title/H1 유지.
7. exact-match 「부산 상속전문 법무사」 → `/부산상속법무사`.
8. `/부산상속전문법무사`에서 「검색어」 메타 문장 제거. URL 유지.
9. HOME에 「상속 종합」→`/상속` 칩 추가. 기존 상속 칩 유지.
10. 허브/포기 contextual CTA.
11. `/부산상속포기`는 chip·CTA만. 본문 전면 rewrite 없음.

## 수정하지 않은 고위험 (RED)

- 모든 owner URL·slug, title/H1, canonical
- `/부산상속전문법무사` 삭제·index
- FAQ 대량 삭제, footer 링크 삭제, 지역 title/H1, glossary 삭제
- 신규 상속전문 변형 페이지

## /부산상속법무사 BEFORE / AFTER

| | BEFORE | AFTER |
|---|---|---|
| title / H1 | 등기·포기·한정승인 먼저 확인 | 동일 (동결) |
| 첫 화면 | 긴 problemStatement 분할 | 선택 안내 + 상황 카드 |
| 전국 chip | H1 위 | 숨김 (배너는 요약 아래) |
| CTA | 업무 가능 여부 확인하기 | 등기·포기·한정승인 중 무엇이 필요한지 확인 |

## /부산상속포기 BEFORE / AFTER

| | BEFORE | AFTER |
|---|---|---|
| title/H1/본문 골격 | 3개월·후순위·채무 | 동일 |
| 전국 chip | H1 위 | 숨김 |
| CTA | 상속관계와 기한 확인 | 3개월 기한·후순위 먼저 확인 |

## 중복 paragraph BEFORE → AFTER

내부 QA Jaccard (`seo/inheritance/content-similarity.csv`). 네이버 공식 아님.

- `/상속` vs `/부산상속법무사`: 0.16
- 허브 vs 등기/포기/한정: 0.19–0.21
- `/상속` vs `/services/inheritance-registration`: 0.29, repeated_paragraph_count=3 (supporting, 미삭제)

허브 extra summary 3문단 첨부 중지. hero와 자세히 알아보기 문단 겹침 제거.

## Internal authority

PageData incoming (`seo/inheritance/baseline-links.csv`). 구 before-links.csv는 outgoing이라 숫자 직접 비교하지 않음.

| URL | incoming |
|---|---|
| `/부산상속법무사` | 554 |
| `/부산상속포기` | 209 |
| `/부산상속등기` | 1191 |
| `/부산한정승인` | 186 |
| `/상속` | 51 |
| `/` | 55 |
| `/부산법무사상담` | 295 |

법인·회생·강의 owner에서 링크를 빼오지 않음.

## 자동생성 오류

src 본문: `부산 부산` 0, `톡톡톡톡` 0, `최근 부산에서 상담한 사례입니다` 0.  
상속 오너의 「검색어에」 제거. 가압류 등 비상속 페이지 잔존은 이번 범위 밖.

## SEO fingerprint

`seo/inheritance/fingerprint.json` — title/H1/canonical/robots 예상 외 변화 없음.

## Other keyword regression

내부 테스트 PASS. 부산 법무사→`/`, 상담→`/부산법무사상담`, 등기·한정승인 owner 유지. PRIMARY collision 0.

## Cannibalization BEFORE → AFTER

| 이슈 | BEFORE | AFTER |
|---|---|---|
| 「부산 상속전문 법무사」 exact 앵커 | noindex URL | `/부산상속법무사` |
| `/상속` 부산 commercial | 등기만 「지역 상담」 | 허브 링크 선행, 등기 유지 |
| 내부 1위 부산 상속 법무사 | 허브 266 vs `/상속` 132 | 허브 유지 |
| 내부 1위 부산 상속포기 법무사 | `/부산상속포기` | 유지 |

## KV

상속 owner HTML은 static. `_routes.json` include=`/api/*` only.

## Build / test / audit

| 검사 | 결과 |
|---|---|
| eslint (변경 파일) | PASS |
| `check-keyword-ownership` | PASS |
| `inheritance-intent-audit` | PASS |
| similarity / freeze | 산출 완료 |
| production HEAD owners | 200 |
| `tsc --noEmit` | FAIL — 기존 `inflow-policy.ts` TS2367. 이번 상속 파일과 무관 |
| 전체 `npm run build` | 이번 턴에서 정적 전체 export 미실행. 배포 전 필요 |

## Quality gate

PRIMARY owner collision 0, target 404 0, owner noindex 0, canonical error 0, 부산 부산 0, other keyword owner regression 0.

## Red team

「부산 상속 법무사」「부산 상속전문 법무사」는 title/H1/첫 화면/선택 카드/내부 1위가 허브.  
「부산 상속포기 법무사」는 포기 페이지가 exact. `/상속`·등기·한정·지역·glossary·전국은 supporting. footer 상속 exact-match 덤프 없음.
