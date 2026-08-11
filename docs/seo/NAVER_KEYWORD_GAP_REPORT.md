# NAVER KEYWORD GAP REPORT

생성: 2026-08-11  
트렌드 상태: **TREND_DATA_UNAVAILABLE** (`NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` 미설정 — 월간 검색량 추정 없음)  
인벤토리: `reports/seo/content-inventory.json` (1639 pages)  
Intent SSOT: `src/data/seo/search-intent-registry.ts`  
관찰 데이터: `data/seo/ranking-observations.json` (URL 미확정 다수)

> 본 보고서의 Opportunity 점수는 내부 의사결정용이며 네이버 공식 SEO 점수가 아닙니다.  
> 상위노출을 보장한다고 표현하지 않습니다.

---

## Q&A (필수)

| Q | A |
|---|---|
| Q1 가장 잘 커버하는 업무 | 상속(등기·포기·한정) Champion + 지역 허브 + 상황형 search-intent. 법인·부동산 매매/근저당도 두껍다. |
| Q2 과도 중복 위험 | 지역명×동일업무 로컬 랜딩, 추천/전문 표방형 검색어, 임원변경 aliases. `EXISTING_CANNIBALIZATION_RISK`로만 기록(삭제·리다이렉트 없음). |
| Q3 사이트에 거의 없던 분야 | 특별한정승인·대습등기·유류분(등기 전)·채무조정 경로 비교·법무사/변호사 역할·전세사기 **피해** 대응·분양권 단계 — 용어사전만 있거나 예방교육만 있던 축. |
| Q4 데이터랩 상승군 | **TREND_DATA_UNAVAILABLE**. 보조: ranking observations상 상속 계열 쿼리 강세. |
| Q5 페이지는 있으나 약한 Intent | `/사망후3개월지난상속`(특별한정 약함), `/전세사기예방교육`(피해 대응 약함), `/부산입주등기`(분양권 전 단계 약함), `/취득세`(상속 순서 약함), glossary 용어 페이지. |
| Q6 새 페이지 TOP | 아래 Batch1 8개 CREATE_NEW. |
| Q7 보강만으로 충분 | 임원변경 aliases, 부산 상속/법인 Champion, 추천 검색, 일반 한정=부산한정승인 등. |
| Q8 Long-tail 고가치 | 뒤늦은 보증채무·대습+미성년·분양권 전매 제한·신용회복 중 회생 전환 등(별도 URL 남발 없이 본문 모듈로 흡수). |
| Q9 Cannibalization | Batch1은 glossary/예방/입주와 **의도 분리** + 상호링크. Champion URL·title·H1 미변경. |
| Q10 상위노출 보호 | 보호 자산 URL/title/H1/canonical 변경 0 목표. `npm run seo:regression`으로 확인. |

---

## 1. 현재 Coverage (요약)

| Category | Intent | Primary Keyword | Current URL | Coverage | Cannibalization |
|----------|--------|-----------------|-------------|----------|-----------------|
| inheritance | 상속 hub | 부산 상속 법무사 | `/부산상속법무사` | strong | low (KEEP) |
| inheritance | 상속등기 | 부산 상속등기 | `/부산상속등기` | strong | low |
| inheritance | 상속포기 | 부산 상속포기 | `/부산상속포기` | strong | low |
| inheritance | 한정승인 | 부산 한정승인 | `/부산한정승인` | strong | low |
| inheritance | 3개월 기한 | 사망 후 3개월 | `/사망후3개월지난상속` | partial | med → STRENGTHEN |
| inheritance | 특별한정승인 | 특별한정승인 | `/특별한정승인` | was weak → **published** | med vs 3개월·glossary |
| inheritance | 대습등기 | 대습상속 등기 | `/대습상속등기` | was weak → **published** | low vs glossary |
| corporate | 임원변경 | 임원변경등기 | `/부산법인등기` 등 | strong | **high** — DO_NOT_CREATE |
| rehab | 개인회생 | 부산 개인회생 | `/부산개인회생법무사` | strong | low |
| real-estate | 입주등기 | 부산 입주등기 | `/부산입주등기` | strong(입주) | med vs 분양권 |
| education | 전세사기 예방 | 전세사기 예방교육 | `/전세사기예방교육` | strong(예방) | med vs 피해대응 |

---

## 2. Keyword Gap TOP 20

Trend 열: API 없으면 `N/A`.

| Rank | Keyword Cluster | Intent | Trend | Existing | Coverage | Commercial | Urgency | Cannibal | Opp | Action |
|-----:|-----------------|--------|-------|----------|----------|------------|---------|----------|-----|--------|
| 1 | 대습상속 등기 | 중간세대 사망 명의이전 | N/A | glossary only | weak | 17 | 11 | 8 | 88 | CREATE_NEW `/대습상속등기` |
| 2 | 특별한정승인 | 기한경과·뒤늦은 채무 | N/A | 3개월·glossary | weak | 18 | 15 | 14 | 86 | CREATE_NEW `/특별한정승인` |
| 3 | 전세사기 피해 대응 | 피해 후 임차권·서류 | N/A | 예방교육 | weak | 18 | 15 | 11 | 85 | CREATE_NEW `/전세사기피해대응절차` |
| 4 | 신용회복 vs 회생 | 채무조정 경로 | N/A | 회생 페이지 일부 | missing | 17 | 12 | 8 | 84 | CREATE_NEW `/신용회복과개인회생차이` |
| 5 | 법무사 vs 변호사 | 역할 선택 | N/A | — | missing | 16 | 6 | 6 | 82 | CREATE_NEW `/법무사와변호사차이` |
| 6 | 유류분×등기 | 등기 전 확인 | N/A | glossary | weak | 14 | 10 | 10 | 81 | CREATE_NEW `/유류분과상속등기` |
| 7 | 상속 취득세 순서 | 세금·등기 타임라인 | N/A | `/취득세` | weak | 15 | 12 | 9 | 80 | CREATE_NEW `/상속취득세와등기순서` |
| 8 | 분양권 명의이전 | 입주 전 승계 | N/A | 입주등기 | partial | 17 | 11 | 16 | 78 | CREATE_NEW `/분양권명의이전등기` |
| 9 | 3개월 경과 심화 | 기한 전·후 | N/A | `/사망후3개월지난상속` | partial | 16 | 15 | 12 | 72 | STRENGTHEN (+링크) |
| 10 | 법인 과태료·임기 | 임원 기한 | N/A | 법인등기 hub | partial | 16 | 14 | 18 | 68 | ADD_SECTION (보류) |
| 11 | 해산간주·계속등기 | 휴면법인 | N/A | 일부 remote | partial | 15 | 12 | 15 | 66 | STRENGTHEN 기존 |
| 12 | 공매 낙찰등기 심화 | 공매 후 등기 | N/A | `/부산공매낙찰등기` | partial | 14 | 10 | 12 | 64 | FAQ_ONLY |
| 13 | 상속재산파산 | 채무초과 청산 | N/A | — | missing | 12 | 11 | 10 | 63 | P3 보류(범위) |
| 14 | 대표이사 주소변경 | 법인등기 | N/A | 법인등기 | partial | 14 | 9 | 22 | 58 | DO_NOT_CREATE |
| 15 | 부산 법무사 추천 | provider | N/A | `/부산법무사` | strong | 18 | 5 | 20 | 55 | KEEP |
| 16 | 이사 변경=임원변경 | aliases | N/A | 법인 Champion | strong | 17 | 10 | 28 | 40 | DO_NOT_CREATE |
| 17 | 지역×상속 복제 | geo doorway | N/A | local 다수 | strong | — | — | 30 | — | DO_NOT_CREATE |
| 18 | 전문 법무사 표방 | expertise claim | N/A | specialist pages | partial | — | — | 25 | — | KEEP/윤리 |
| 19 | 유류분 소송 대행 | litigation | N/A | — | — | — | — | — | — | OUT_OF_SCOPE |
| 20 | 세액 확정 계산 | tax calc | N/A | — | — | — | — | — | — | OUT_OF_SCOPE |

---

## 3. 빠진 업무 (법무사 범위)

| 업무 | 검색 가능성 | Coverage | 적합성 | 신규 필요 | Hub |
|------|-------------|----------|--------|-----------|-----|
| 특별한정승인 | 높음(긴급) | was weak | DIRECT | **구현** | 한정승인 |
| 대습상속 등기 | 중~고 | was weak | DIRECT | **구현** | 상속등기 |
| 유류분(등기 전) | 중 | weak | RELATED | **구현** | 상속 |
| 신용회복 비교 | 중~고 | missing | RELATED | **구현** | 회생 |
| 전세사기 피해 | 고 | weak | RELATED | **구현** | 부동산 |
| 분양권 이전 | 중 | partial | DIRECT | **구현** | 부동산 |
| 상속재산파산 | 중 | missing | RELATED/COLLAB | 보류 | 상속 |
| 유류분 소송 | 중 | — | OUT_OF_SCOPE | 금지 | — |

---

## 4. 신규 콘텐츠 실행계획 (Batch 1 — 구현)

| Intent | Target URL | Title 요지 | Unique Modules | Parent Hub | Related |
|--------|------------|------------|----------------|------------|---------|
| 특별한정승인 | `/특별한정승인` | 기한·뒤늦은 채무 | 결정트리·타임라인·범위 | `/부산한정승인` | 3개월·glossary |
| 대습상속등기 | `/대습상속등기` | 중간세대 사망 등기 | 가족구성표·체크·후속 | `/부산상속등기` | 미성년·해외 |
| 유류분×등기 | `/유류분과상속등기` | 등기 전 확인 | 체크·협업경계·보류기준 | `/부산상속등기` | 증여·변호사차이 |
| 취득세 순서 | `/상속취득세와등기순서` | 세금·등기 타임라인 | 타임라인·비용·기한분리 | `/부산상속등기` | `/취득세` |
| 법무사vs변호사 | `/법무사와변호사차이` | 역할 비교 | 구분표·30초질문·윤리 | `/부산법무사` | 유류분·회생 |
| 신용회복vs회생 | `/신용회복과개인회생차이` | 경로 비교 | 비교축·전환신호·점검표 | 개인회생 | 자가진단 |
| 전세사기 피해 | `/전세사기피해대응절차` | 피해 후 순서 | 48h·경로표·최소세트 | 임차권 | 예방교육 |
| 분양권 이전 | `/분양권명의이전등기` | 입주 전 승계 | 단계플로우·서류매트릭스 | `/부산입주등기` | 집단·근저당 |

---

## 5. 신규 생성하지 않은 키워드

| Keyword | Existing URL | Reason | Action |
|---------|--------------|--------|--------|
| 법인 이사 변경 | `/부산법인등기` 등 | 동일 intent aliases | DO_NOT_CREATE |
| 부산 법무사 추천 | `/부산법무사` | Champion 보호 | KEEP |
| 특별한정승인(뜻) | `/glossary/special-qualified-acceptance` | 정의형 유지 | KEEP + 신규와 링크 |
| 임원변경 과태료 | 법인 hub | 독립 intent 미확정 | ADD_SECTION 후보 |
| 유류분 소송 | — | OUT_OF_SCOPE | 생성 안 함 |
| 지역명만 바꾼 상속 | local 다수 | doorway 위험 | DO_NOT_CREATE |

---

## 6. 실제 구현

| URL | Intent | Unique Modules | Parent | SEO note |
|-----|--------|----------------|--------|----------|
| `/특별한정승인` | 특별한정 | 3+ | 한정승인 hub | glossary 분리 |
| `/대습상속등기` | 대습등기 | 3+ | 상속등기 | |
| `/유류분과상속등기` | 유류분×등기 | 3+ | 상속 | COLLAB 명시 |
| `/상속취득세와등기순서` | 취득세 순서 | 3+ | 상속등기 | 세액 비확정 |
| `/법무사와변호사차이` | 역할비교 | 3+ | 부산법무사 | 우열 비표방 |
| `/신용회복과개인회생차이` | 채무경로 | 3+ | 회생 | |
| `/전세사기피해대응절차` | 피해대응 | 3+ | 임차권 | 예방과 분리 |
| `/분양권명의이전등기` | 분양권 | 3+ | 입주등기 | |

보강: `/사망후3개월지난상속` → `/특별한정승인` related link 추가(본문 대량 rewrite 없음).

---

## 7. EXISTING_CANNIBALIZATION_RISK (삭제 없음)

- 로컬×상속/법인 대량 페이지 유사도 위험 — 별도 감사 과제.
- glossary vs 신규 transactional — 의도 분리로 완화, 상호링크.
- `/부산입주등기` vs `/분양권명의이전등기` — 단계 분리.

---

## 8. 재실행

```bash
npm run seo:keyword-gap
npm run seo:regression
```

Naver DataLab 연결 시 `.env.local`에 `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`만 설정(절대 `NEXT_PUBLIC_*` 금지).
