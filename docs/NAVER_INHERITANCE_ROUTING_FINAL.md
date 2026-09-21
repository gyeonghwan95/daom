# 네이버 상속 쿼리 라우팅 복구 최종 보고

날짜: 2026-09-21  
대상: 다옴법무사사무소.kr  
검색 1위 보장은 하지 않습니다. 저장소에서 제어 가능한 QUERY → OWNER 신호만 복구했습니다.

## USER OBSERVED ISSUE

- OBSERVED_OWNER_MISMATCH: 「부산 상속 법무사」 검색에서 `/부산상속포기` 등 다른 상속 URL이 보임.
- 「부산 상속전문 법무사」에서 `/부산상속법무사` 신호가 약함.
- 「부산 상속포기 법무사」에서 `/부산상속포기` 노출이 기대에 못 미침.

네이버 실제 rank 자동화 값은 없습니다. **SERP_UNVERIFIED**.  
Search Advisor API/export도 저장소에 없습니다. 검사 CSV는 `UNKNOWN`으로 기록했습니다.

## QUERY → EXPECTED OWNER

| Query | Expected owner |
| --- | --- |
| 부산 상속 법무사 | `/부산상속법무사` |
| 부산 상속전문 법무사 / 부산상속전문법무사 / 부산 법무사 상속 | `/부산상속법무사` |
| 부산 상속포기 법무사 / 부산 상속포기 | `/부산상속포기` |
| 부산 상속등기 법무사 | `/부산상속등기` |
| 부산 한정승인 법무사 | `/부산한정승인` |

## ROOT CAUSE

1. **의도 혼선**: 종합 owner와 포기 owner가 서로 exact 앵커·브레드크림·관련링크로 같은 상업 쿼리를 나눠 가짐.
2. **역할 중복**: 종합 페이지가 포기 백과사전처럼, 포기 페이지가 종합 상담 owner처럼 읽힐 여지.
3. **신선도/색인 실측 부재**: 네이버가 최신 HTML을 읽는지 저장소만으로는 확인 불가. `OWNER_FRESHNESS_IMBALANCE`는 미확인.
4. **키워드 부족이 1차 원인이 아님.** title/H1은 이미 intent에 맞아 **FREEZE**.

## 5 Agent findings

### AGENT 1 Crawl / freshness

- 두 owner: indexable, self-canonical 유지, URL 삭제·301·noindex 변경 없음.
- schema `dateModified`: `/부산상속법무사`·`/부산상속포기` 모두 검토일 `2026-09-20`로 맞춤.
- Search Advisor URL 검사: `seo/inheritance-routing/naver-url-inspection.csv` — source 없음, SERP_UNVERIFIED.
- 배포 직후 title/H1/본문 재수정 금지. 먼저 최신 수집 여부 확인.

### AGENT 2 Cannibalization / architecture

- `/부산상속법무사`: 등기·포기·한정 의사결정 허브.
- `/부산상속포기`: 3개월·후순위·가정법원 신고.
- `/상속`: 정보형 종합. 상업 owner 아님.
- 포기 페이지 관련 링크에서 exact 「부산 상속 법무사」 제거 → 「등기·포기·한정승인 중 무엇부터 볼지」.
- 구·군 포기 페이지 parent를 `/부산상속포기`(부산 전체 상속포기 안내)로 모음.
- 브레드크림: 홈 > 상속 > 상속 절차 선택 > 부산 상속포기. URL 계층은 불변.

### AGENT 3 Content purity

- title/H1 유지 (FREEZE).
- 의사결정 매트릭스·상담 전 체크표·상속인·재산·채무 확인표를 종합 owner에만 강화.
- 포기 owner에 3개월 일정표·미성년/해외 준비표. 「무조건 부모에게 간다」류 문장은 상황별 문장으로 유지(2020그42 반영).
- 재송동 상담은 `src/content/cases/jaesong-inheritance-renunciation-consultation.mdx` 근거가 있어 유지.
- 상속포기 비용 모듈은 취득세·국민주택채권 템플릿이 아님을 재확인.

### AGENT 4 Trust / entity

- NAP: `src` 공식 전화 `010-4277-1279`. `070-4172-8056`는 src에 없음. **NAP_CONFLICT 없음**.
- 「톡톡톡톡」 src 0건.
- 외부 채널은 코드로 수정하지 않음. `docs/INHERITANCE_EXTERNAL_AUTHORITY.md`.

### AGENT 5 Zero regression

- URL·canonical·noindex·title/H1 major rewrite 없음 (RED 제외).
- keyword ownership: PRIMARY 충돌 없음. 「부산 상속 법무사」 owner=`/부산상속법무사`, 「부산 상속포기 법무사」 owner=`/부산상속포기`.
- 상속 유사도: champion vs 브리지 body 2.3, cannibalizationRisk 낮음.
- 내부 QUERY ROUTING QA: `npm run audit:inheritance-query-owner` **OK**.

## INTERNAL TOP10 AFTER

「부산 상속 법무사」  
1 `/부산상속법무사` · 2 상속등기필요서류 · 3 상속등기기간 · 4 부산상속법무사추천 · 7 `/부산상속포기`

「부산 상속전문 법무사」  
1 `/부산상속법무사` · 2 부산소유권이전전문법무사 · 7 `/부산상속포기`

「부산 상속포기 법무사」  
1 `/부산상속포기` · 2 상속포기비용 · 3 상속포기필요서류

BEFORE(내부 1차 감사, 오점수 포함): 종합 쿼리에서 추천/전문 랜딩이 상단, 포기 페이지가 종합 쿼리와 점수 경합.  
사용자 관측 BEFORE: 종합 쿼리에 포기 URL 노출 — OBSERVED_OWNER_MISMATCH.

## 배포 후 확인 순서

1. `/부산상속법무사` 서치어드바이저 URL 검사  
2. `/부산상속포기` URL 검사  
3. 두 문서 최신 수집 비교  
4. 「부산 상속 법무사」 노출 URL  
5. 「부산 상속포기 법무사」 노출 URL  
6. 「부산 상속전문 법무사」 노출 URL  

수집이 안 바뀌었다고 title/H1/본문을 바로 다시 고치지 않습니다.

트래커: `seo/inheritance-routing/tracker.csv` — 실제 값만 채움.

## RELEASE

INTERNAL QA 기준 **SEO_RELEASE_BLOCKED 아님**.  
네이버 실측 rank는 SERP_UNVERIFIED이므로 배포 후 URL 검사로 수집 여부를 확인합니다.
