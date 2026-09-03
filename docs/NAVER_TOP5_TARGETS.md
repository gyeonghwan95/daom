# NAVER TOP5 개선 타깃 (Internal Prioritization)

> 네이버 TOP5 보장 아님. `seo/master/top5-gap.csv` 기반 내부 우선순위.

## P1 — 내부 owner 약함 (SERP 미확인)

| KEYWORD | OWNER | STATUS | PROBLEM | CHANGE | REGRESSION RISK |
|---------|-------|--------|---------|--------|-----------------|
| 부산 법무사 수수료/보수 | `/부산법무사비용` | SERP_UNVERIFIED | 내부 1위가 `/`, `/부산법무사보수표` | 비용 페이지 본문·FAQ에 수수료·보수 문맥 (title freeze) | LOW |
| 부산 등기전문 법무사 | `/부산등기법무사` | SERP_UNVERIFIED | noindex bridge가 title 소유 | bridge→허브 canonical 유지, 허브 authority 강화 | LOW |
| 부산 부동산등기 | `/부산부동산등기` | SERP_UNVERIFIED | `/부산부동산등기법무사`와 경쟁 | 허브 vs bridge 역할 분리, 내부링크 | MEDIUM |
| 부산 매매등기 법무사 | `/부산소유권이전등기` | SERP_UNVERIFIED | `/부산매매등기법무사` title 충돌 | specialist noindex 유지, owner 본문 강화 | LOW |
| 해운대구 법무사 | `/해운대법무사` | SERP_UNVERIFIED | `/해운대구*` subpage가 분산 | 구 허브→생활권 child 구조 정리 | MEDIUM |
| 부산 북구/만덕동 | `/북구법무사` | SERP_UNVERIFIED | 업무사례가 1위 | 북구 허브 고유 접근·관할 정보 | LOW |
| 부산 목적/증자/해산/청산 | corporate owners | SERP_UNVERIFIED | corporate intent 페이지 relevance 낮음 | 절차·서류 본문 강화 (title freeze) | LOW |
| 부산 회생파산 법무사 | `/개인회생파산` | SERP_UNVERIFIED | 허브 relevance 낮음 | `/부산개인회생법무사` inbound 강화 | LOW |

## 이번 사이클 적용 완료 (GREEN/YELLOW)

| KEYWORD | OWNER | CHANGE |
|---------|-------|--------|
| 부산 법무사 상속 | `/부산상속법무사` | hub summary·primaryKeywords, `/상속` pillar 위임 문구 |
| 부산 특별한정승인 법무사 | `/특별한정승인` | hero·primaryKeywords |
| 부산 법인 (meta SEO) | `/부산법인법무사` | 「로 검색한 경우」 제거 |
| specialist bridges | noindex | 「검색어 연결」→「업무 선택 안내」 |
| unresolved owners 8건 | — | `keyword-map.json` + audit EXTRA_OWNERS |

## P0 보존 (title/H1/canonical freeze)

`/`, `/부산법무사상담`, `/부산법무사추천`, `/부산법무사비용`, `/부산상속법무사`, `/부산상속등기`, `/부산상속포기`, `/부산한정승인`, `/부산등기법무사`, `/부산법인법무사`, `/부산법인등기`, `/부산개인회생법무사`, `/연제구법무사`, `/센텀법무사`, `/해운대법무사`

## RED — 자동 적용 금지

- URL/slug 변경, 301, noindex 추가, canonical owner 변경
- P0 title/H1 일괄 변경
- 지역 페이지 통합·삭제

## Post-deploy

`seo/master/naver-ranking-tracker.csv` — Search Advisor 수집 후 day14/30/60/90 기록
