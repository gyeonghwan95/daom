# SEO HIGH-RISK DEFERRED (ZERO-REGRESSION SAFE MODE)

생성일: 2026-09-01  
정책: **PRESERVE FIRST** — 아래 항목은 이번 실행에서 **코드 적용 금지**. 관찰·보고만.

Search Advisor / GSC 실적 데이터가 없으면 `NO PERFORMANCE`가 아니라 **`PERFORMANCE UNKNOWN`** 으로 간주한다.

---

## 1. 상속 URL consolidation

| 항목 | 내용 |
|------|------|
| 왜 문제인가 | `/상속`, `/부산상속등기`, `/전국상속등기`, `/services/inheritance-registration` 등 intent 중복 후보 |
| URL | `/상속`, `/부산상속등기`, `/전국상속등기`, `/부산상속법무사`, (서비스 영문 slug 존재 시) |
| 현재 데이터 | `seo/cannibalization-observation.csv`, `seo-master-2026-08/04-cannibalization.csv` — PRIMARY는 `/부산상속법무사`(선택)·`/부산상속등기`(명의이전)로 분리 가능 |
| 예상 장점 | 권위 집중 |
| 검색자산 위험 | **HIGH** — 301/canonical/noindex 시 기존 색인·내부링크 권위 손실 |
| 추가 필요 데이터 | Naver Search Advisor impressions/clicks per URL |
| 이번 실행 | **DEFERRED** |

---

## 2. 법인 URL consolidation

| 항목 | 내용 |
|------|------|
| URL | `/법인등기`, `/부산법인등기`, `/부산법인법무사`, `/services/corporate-registration` |
| 위험 | HIGH |
| 이번 실행 | **DEFERRED** — intent 차별화(업무 허브 vs 부산 commercial vs 법인 선택) 관찰만 |

---

## 3. 개인회생 URL consolidation

| 항목 | 내용 |
|------|------|
| URL | `/개인회생파산`, `/부산개인회생`, `/부산개인회생법무사`, `/services/personal-rehabilitation` |
| 위험 | HIGH |
| 이번 실행 | **DEFERRED** |

---

## 4. 지역 thin page consolidation / noindex

| 항목 | 내용 |
|------|------|
| URL | `/연제구법무사` 등 구·군 페이지 전반 |
| 위험 | HIGH — UNKNOWN performance URL noindex/삭제 금지 |
| 이번 실행 | **DEFERRED** — 잘못된 지역명·주소 오류만 GREEN로 수정 가능(발견 시) |

---

## 5. Glossary pruning / 대량 noindex

| 항목 | 내용 |
|------|------|
| 위험 | HIGH |
| 이번 실행 | **DEFERRED** |

---

## 6. Canonical / 301 architecture 재설계

| 항목 | 내용 |
|------|------|
| 위험 | CRITICAL |
| 이번 실행 | **DEFERRED** — self-canonical 404·잘못된 도메인 등 CONFIRMED INDEXING DEFECT만 복구 허용(이번 freeze crawl에서 P0/P1 전수 200 + self/관련 canonical, 신규 architecture 없음) |

---

## 7. 대량 title / H1 / description rewrite

| 항목 | 내용 |
|------|------|
| 위험 | HIGH |
| 이번 실행 | **DEFERRED** — 오타·placeholder·이중 title 태그만 허용(미발견) |

---

## 8. Navigation / footer 대량 링크 삭제

| 항목 | 내용 |
|------|------|
| 위험 | HIGH — sitewide incoming link 감소 |
| 이번 실행 | **DEFERRED** — visual grouping만 허용하되 href 집합 유지(미적용) |

---

## 다음 단계 조건

1. Search Advisor URL별 clicks/impressions export  
2. 후보 쌍 semantic similarity + anchor overlap 재측정  
3. 인간 SEO GOVERNOR 승인 후에만 YELLOW/RED 별도 PR
