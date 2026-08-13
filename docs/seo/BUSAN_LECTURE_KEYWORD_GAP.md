# Busan Lecture Keyword Gap

기준일: 2026-08-13  
Trend: **TREND_DATA_UNAVAILABLE** (공고·SERP 표현 관찰. 월간검색량 창작 없음.)  
CREATE_NEW = 0. Action은 KEEP / ADD_* / STRENGTHEN / DO_NOT_TARGET.

---

## Champion routing

| Cluster | Champion |
|---------|----------|
| 워크숍/워크샵 | `/법률강의` + `/부산법률강사` |
| 세미나 | `/부산법률강사` |
| 특강/강연/외부·초청·출강 | `/부산법률강사` |
| 강사섭외/출강 | `/부산법률강사` → `/강의문의` |
| 기업교육 | `/기업법률교육` |
| 공공기관교육 | `/공공기관법률교육` |
| 대상별(청년·신입) | `/청년생활법률특강` / 기업 FAQ |
| 생활법률 | `/법률강의` `/부산도서관법률특강` |
| 전세사기 예방 | `/전세사기예방교육` |
| 창업 | `/창업법률교육` |
| DISCOVERY 주제추천 | `/기관특강주제추천` |

---

## 1. 워크숍/워크샵 TOP

| Query | Searcher | Intent | URL | Coverage | BV | Trend | Cannib. | Action |
|-------|----------|--------|-----|----------|----|-------|---------|--------|
| 부산 워크숍 강사 | 교육담당 | Format+강사 | Hub+Hiring | partial | 높음 | n/a | LOW | ADD_SECTION chooser |
| 부산 워크샵 강사 | 동일 | spelling alias | **동일 URL** | — | 높음 | n/a | — | **신규 X** |
| 부산 워크숍 특강 | 기획 | Format | 동일 | partial | 중 | n/a | LOW | FAQ |
| 부산 워크샵 특강 | alias | alias | 동일 | — | 중 | n/a | — | 신규 X |
| 부산 워크숍 특강 강사 | 섭외 | Hiring | Hiring | partial | 높음 | n/a | LOW | ADD_FAQ |
| 기업 워크숍 강사 부산 | 인사 | 기업+Format | `/기업법률교육` | partial | 높음 | n/a | LOW | ADD_FAQ |
| 공공기관 워크숍 강사 부산 | 공공교육 | 공공+Format | `/공공기관법률교육` | partial | 중 | n/a | LOW | ADD_FAQ |
| 직원교육 프로그램 추천 | 기획 | DISCOVERY | `/기관특강주제추천` | strong | 중 | n/a | LOW | ADD_TOPIC_MODULE |

---

## 2. 세미나

| Query | Searcher | Intent | URL | Coverage | Action |
|-------|----------|--------|-----|----------|--------|
| 부산 세미나 강사 | 섭외 | 세미나 | Hiring | partial | ADD_FAQ |
| 부산 세미나 특강 | 기획 | 세미나 | Hiring | partial | ADD_H2 formats |
| 부산 세미나 초청강사 | 섭외 | 초청 | Hiring | partial | alias FAQ |
| 공공기관 세미나 강사 | 공공 | 세미나 | 공공 Hub | weak | ADD_FAQ |

전용 `/부산세미나강사` **생성하지 않음.**

---

## 3. 특강/강연

| Query | URL | Action |
|-------|-----|--------|
| 부산 특강 강사 | `/부산법률강사` | KEEP |
| 부산 강연 강사 | Hiring | ADD_FAQ alias |
| 부산 외부강사 | Hiring | KEEP |
| 부산 초청강사 | Hiring | ADD_FAQ |
| 부산 출강 강사 / 강사 출강 | Hiring | KEEP |
| 부산 출장강의 | Hiring | ADD_FAQ (출강 협의) |

---

## 4. 강사섭외/출강

| Query | URL | Action |
|-------|-----|--------|
| 부산 강사 섭외·초빙 | `/부산법률강사` | KEEP |
| 부산 외부강사 섭외 | Hiring + `/부산강사섭외체크리스트` | KEEP |
| 부산 기업/공공기관 강사 섭외 | Corporate / Public + Hiring | INTERNAL_LINK |
| 부산 법률강사 섭외 / 법무사 출강 | Hiring + `/부산법무사강의` | KEEP |
| 부산 강사 문의 | `/강의문의` | KEEP |
| 부산 강사료·특강 견적 | `/부산강사섭외비용` | KEEP (단가 비공개) |

---

## 5. 기업교육

| Query | URL | Action |
|-------|-----|--------|
| 부산 기업교육 강사 | `/기업법률교육` | KEEP |
| 부산 기업 특강·강연·세미나 강사 | Corporate | ADD_FAQ Format |
| 부산 사내교육·직원·임직원 특강 | Corporate | ADD_FAQ |
| 부산 신입사원교육 강사 | Corporate | ADD_FAQ (기존 온보딩 FAQ 보강) |
| 부산 기업 법률교육·법률강사 | Corporate | KEEP |

---

## 6. 공공기관교육

| Query | URL | Action |
|-------|-----|--------|
| 부산 공공기관 강사·법률강사·법률교육 | `/공공기관법률교육` | KEEP |
| 부산 공기업 특강·직원교육 | Public | ADD_FAQ |
| 부산 공무원 특강·법률교육 | Public | ADD_FAQ |
| 기관 외부·초청강사 부산 | Public + Hiring | INTERNAL_LINK |

등기 수임은 `/공공기관등기업무` — 강의 Primary 아님.

---

## 7. 대상별

| Query | URL | Action |
|-------|-----|--------|
| 부산 청년 법률특강 | `/청년생활법률특강` | KEEP |
| 신입사원 생활법률 | Corporate + Youth | ADD_FAQ / INTERNAL_LINK |
| 공공기관 직원 법률교육 | Public | KEEP |
| 복지 종사자 | `/부산사회복지기관강사` | KEEP |
| 대학생·학교 | `/학교법률교육` `/법무사진로특강` | KEEP |

---

## 8. 생활법률

| Query | URL | Action |
|-------|-----|--------|
| 부산 생활법률 강사·특강 | Hub / 도서관 | KEEP |
| 직장인 생활법률 | Corporate + Hub | ADD_H2 chooser |
| 일상분쟁·명예훼손·개인정보 생활법률 | 이력 기반 모듈, 전용 thin URL X | Hub/청년/디지털 |

---

## 9. 전세사기 예방

| Query | URL | Action |
|-------|-----|--------|
| 부산 전세사기 예방교육·강사 | `/전세사기예방교육` | KEEP |
| 청년·직원 전세사기 교육 | Jeonse + Youth / Corporate | INTERNAL_LINK |

피해 상담 Query는 `/전세사기피해대응절차`.

---

## 10. 창업 법률교육

| Query | URL | Action |
|-------|-----|--------|
| 부산 창업 법률강의·특강 강사 | `/창업법률교육` | KEEP |
| 스타트업·예비창업자 법률교육 | Startup | KEEP |

---

## 신규 후보 판정 (P1 10 → 구현 0)

| Intent | Similar URL | New? | Why not |
|--------|-------------|------|---------|
| 워크숍·세미나 Format Hub | `/법률강의` `/부산법률강사` | **N** | 동일 Intent, alias |
| 기업 워크숍 전용 | `/기업법률교육` | N | ADD_FAQ |
| 공무원 워크숍 전용 | `/공공기관법률교육` | N | ADD_FAQ |
| 부산 추천 강사 | Hiring + 이력 | N | 자기추천 금지, DISCOVERY는 주제추천 |
| 해운대 강사 등 구 랜딩 | Hiring | N | doorway |
| 연도별 하반기 강사 | Hub evergreen | N | thin |

Suggested new titles는 적용하지 않음(기존 title 보호).

---

## 기존 페이지 보강

| URL | Missing Intent | Added | Risk |
|-----|----------------|-------|------|
| `/법률강의` | 목적/대상/형식 선택, 워크숍 alias | LectureProgramChooser, FAQ | LOW (title/H1 불변) |
| `/부산법률강사` | 워크숍/세미나/초청 비교 | body + FAQ + `#formats` | LOW |
| `/기업법률교육` | 워크숍·신입·임직원 검색어 | FAQ | LOW |
| `/공공기관법률교육` | 워크숍·세미나 | FAQ(기존+보강) | LOW |
| `/기관특강주제추천` | 기업·워크숍 주제 DISCOVERY | body section | LOW |
| `/강의문의` | source/intent analytics | optional format + LECTURE event | LOW |

---

## 만들지 않은 Query

| Query | 처리 |
|-------|------|
| 부산 워크샵 특강 | 워크숍 Champion (동일 URL) |
| 부산 기업 외부강사 | `/기업법률교육` H2/FAQ |
| 부산 세미나 강연 | Hiring formats |
| 부산 최고의 강사 / 추천 강사 1위 | DO_NOT_TARGET |
| 해운대·센텀 강사 | Hiring 출강지역 설명 |
| 청렴교육 강사 | OUT_OF_SCOPE (기존 FAQ) |
