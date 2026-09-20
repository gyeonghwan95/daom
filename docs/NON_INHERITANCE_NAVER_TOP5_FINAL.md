# 비상속 네이버 TOP-5 복구 — 2026-09-20

**FINAL STATUS:** `SEO_RELEASE_READY_WITH_WARNINGS`

네이버 웹문서 순위를 공식 관측으로 확정하지 않았다. 대량 SERP 수집·CAPTCHA 우회는 하지 않는다.  
모든 seed는 **SERP_UNVERIFIED / PX**. 가짜 1~5위는 기록하지 않는다.

따라서 **title/H1/본문 대규모 최적화는 적용하지 않았다.** (PX = GREEN만)

상속·포기·한정승인·대습·유류분·유언 query와 해당 페이지 CONTENT SEO는 이번 배치에서 제외했다.

---

## 5 Agent

1. **Rank** — Search Advisor impressions 파일 없음. `seo/rank-input.csv`에 수동 입력 칸만 생성. 한 차례 `where=web` 조회에서 홈이 결과에 보이긴 했으나 웹탭 순번을 확정하지 않음.
2. **Local** — owner map 확정. `/busan-legal-map`을 생활권 클러스터로 정돈(기존 구 카드 URL 유지).
3. **Service** — 부동산 `/부산부동산등기`·등기허브 `/부산등기법무사`·법인 `/부산법인등기`·`/부산법인법무사` 분리. `/부산법인등기` vs `/부산법인등기전문`은 **CONSOLIDATION_CANDIDATE** (redirect/noindex 안 함).
4. **Quality** — NAP SSOT `010-4277-1279`. 소스에 `070-4172-8056` 없음. 조사 `은(는)`/`을(를)` 생성 오류를 `josa()`로 교정.
5. **Governor** — TOP5 freeze 유지(순위 미확인이므로 콘텐츠 미개입). 신규 doorway 없음.

---

## 핵심 표 (전부 SERP_UNVERIFIED)

| KEYWORD | CURRENT RANK | OWNER | STATUS | PROBLEM | IMPLEMENTED CHANGE | REGRESSION RISK | FINAL QA |
|---|---|---|---|---|---|---|---|
| 부산 법무사 | SERP_UNVERIFIED | `/` | PX | 웹순위 미확정 | 없음 (freeze) | 낮음 | 내부 owner QA |
| 해운대 법무사 | SERP_UNVERIFIED | `/해운대법무사` | PX | 동일 | 지도 클러스터 링크만 | 낮음 | 동일 |
| 센텀 법무사 | SERP_UNVERIFIED | `/센텀법무사` | PX | 동일 | 지도 클러스터 | 낮음 | 동일 |
| 부산 부동산등기 법무사 | SERP_UNVERIFIED | `/부산부동산등기` | PX | `/부산부동산등기전문` 근접 URL | report only | 중 | consolidation 보류 |
| 부산 법인등기 | SERP_UNVERIFIED | `/부산법인등기` | PX | `/부산법인등기전문` 근접 | report only | 중 | 보류 |
| 부산 개인회생 법무사 | SERP_UNVERIFIED | `/부산개인회생법무사` | PX | 미확정 | 없음 | 낮음 | 내부 QA |
| 부산 법무사 상담 | SERP_UNVERIFIED | `/부산법무사상담` | PX | 미확정 | 없음 | 낮음 | 내부 QA |

전체 seed: `seo/non-inheritance/owner-map.json`

---

## 상태 버킷

| 버킷 | 내용 |
|---|---|
| TOP5 보호 | **비어 있음** — 관측 없음. 추정으로 채우지 않음 |
| 6~10 opportunity | 비어 있음 |
| 11~20 weak | 비어 있음 |
| 21+ critical | 비어 있음 |
| SERP_UNVERIFIED | **전체 seed** |

`seo/rank-input.csv`에 `observed_rank`를 채우면 다음 iteration에서 P2만 YELLOW 적용.

---

## 지역별 owner (요약)

- 해운대권: `/해운대법무사` `/센텀법무사` `/재송동법무사` `/반여동법무사` `/우동법무사` `/좌동법무사`
- 수영권: `/수영구법무사` 및 광안·민락·망미·남천
- 연제권: `/연제구법무사` `/연산동법무사` `/거제동법무사` `/부산지방법원법무사`
- 동래권: `/동래구법무사` `/사직동법무사` `/온천동법무사` `/동래역법무사`
- 부산진/서면: `/부산진구법무사` `/서면법무사` `/부전동법무사` `/전포동법무사`
- 남구: `/남구법무사` `/대연동법무사` `/문현동법무사`
- 북구: `/북구법무사` `/화명동법무사` `/덕천동법무사` (만덕동 → 북구)
- 서부산: 강서·명지·사상·사하·하단·서구
- 동부산: 기장·정관·일광·금정·부곡·구서

양정동·범천동·엄궁동·장산·시청 등은 **신규 URL 없이** 기존 구 허브.

---

## 업무 owner

- 부동산: `/부산부동산등기` (등기 허브는 `/부산등기법무사`)
- 법인: `/부산법인법무사` vs 절차 `/부산법인등기`
- 회생/파산: `/부산개인회생법무사` `/부산개인파산법무사`
- 민사: 지급명령 `/부산지방법원지급명령`, 내용증명 `/내용증명작성준비`
- 상담/비용: `/` `/부산법무사상담` `/부산법무사추천` `/부산법무사비용` `/부산법무사무소` `/부산여성법무사`

---

## NAP

- 공식: `src/lib/contact.ts` `010-4277-1279`
- `070-4172-8056` 소스 없음. 구 캐시면 Search Advisor에서 확인.

---

## 구현한 GREEN/YELLOW

- 조사 생성기 `josa()` (문법 아티팩트)
- `/busan-legal-map` 생활권 클러스터 + 허브 3~6링크 (기존 카드 유지)
- scripts: `non-inheritance-owner-qa.ts`, `local-content-similarity.ts`
- `seo/rank-input.csv`, `seo/non-inheritance-rank-tracker.csv`

적용하지 않음: TOP5/미확인 페이지 title·H1·본문 재작성, 301, noindex, 신규 doorway.

---

## 다음 작업 (사용자)

1. 네이버 **웹문서**에서 로그아웃 후 `seo/rank-input.csv` 기입  
2. 6~10위만 알려 주면 그때 YELLOW(고유 지역 정보·내부링크) 적용  
3. Search Advisor 쿼리 성과 export가 있으면 `PERFORMANCE` 열 채움
