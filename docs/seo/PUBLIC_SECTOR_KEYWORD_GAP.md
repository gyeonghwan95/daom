# Public Sector Keyword Gap

기준일: 2026-08-13  
검색량: **TREND_DATA_UNAVAILABLE** (나라장터·공고·법령 용어 관찰. 수치 창작 없음.)  
Naver DataLab: 본 작업에서 시계열 수치를 확정하지 않음.

출처 우선순위(관찰): 나라장터/공공조달 공고 용어(용역·과업지시서·제안요청서·입찰·견적·선정), 지자체·지방공기업 공고, 국가법령정보센터(부동산등기법 신청·촉탁, 법무사법 업무범위), 네이버 SERP 질의 형태.

---

## Champion map (신규 URL 0)

| Cluster | Champion URL | Conversion |
|---------|--------------|------------|
| 기관 종합 | `/공공기관등기업무` | `/협업문의?partner=public` |
| 기관 등기 | 동일 Hub + spokes | 동일 |
| 법인·변경 | `/공공기관법인등기` → 절차는 `/부산법인법무사` | 협업문의 |
| 부동산·보상 | `/공공기관부동산등기` `/공공기관이전등기` | 협업문의 |
| 촉탁 | `/공공기관촉탁등기` `/촉탁등기` (INFO) | Hub |
| 용역·선정·견적 | Hub 모듈 (신규 금지) | `/협업문의?partner=public&service=quote` |
| 법률교육 | `/공공기관법률교육` | `/강의문의` |

---

## A. 기관 종합 Query TOP 20

| Query | Likely Searcher | Intent | Current URL | Coverage | Legal Fit | Business Value | Cannibalization | Action |
|-------|-----------------|--------|-------------|----------|-----------|----------------|-----------------|--------|
| 부산 공공기관 법무사 | 총무·법무 | 기관 창구 | `/공공기관등기업무` | UNKNOWN | DIRECT | 높음 | MED vs `/부산법무사` | STRENGTHEN Hub, Primary는 기관 Intent만 |
| 부산 공기업 법무사 | 공기업 총무 | 동일 | Hub | partial | DIRECT | 높음 | MED | Hub H2/FAQ, `/공기업등기` 링크 |
| 부산 지자체 법무사 | 구청·시청 담당 | 동일 | Hub | partial | DIRECT | 중 | HIGH if 시청 doorway | DO_NOT_TARGET 기관명 랜딩 |
| 부산 기관 법무사 | 출자출연·재단 | 동일 | Hub | partial | DIRECT | 중 | LOW | ADD_FAQ |
| 공공기관 법무사 | 전국+부산 | 창구 | Hub | strong | DIRECT | 높음 | LOW | KEEP |
| 공기업 법무사 | 공기업 | 창구 | Hub `/공기업등기` | partial | DIRECT | 중 | MED thin spoke | KEEP spoke, 신규 `/공기업법무사` X |
| 지자체 법무사 | 공무원 | 창구 | Hub | partial | DIRECT | 중 | MED | ADD_SECTION 역할선택 |
| 기관 법무사 업무 | 경영지원 | 범위 | Hub | strong | DIRECT | 높음 | LOW | KEEP |
| 출자출연기관 법무사 | 출연 총무 | 창구 | Hub | partial | DIRECT | 중 | LOW | Hub 기관유형 카드 |
| 지방공기업 법무사 | 지방공사 | 창구 | `/지방공기업등기` | partial | DIRECT | 중 | LOW | KEEP |
| 공사 법무사 | 공사 법무 | 창구 | Hub | weak | DIRECT | 중 | HIGH doorway | DO_NOT_TARGET exact 공사명 |
| 공단 법무사 | 공단 | 창구 | Hub | weak | DIRECT | 중 | HIGH | DO_NOT_TARGET |
| 재단 법무사 | 재단 이사 | 창구+법인 | Hub + 법인 spoke | partial | DIRECT | 중 | MED | ADD_FAQ 재단 임원 |
| 센터 법무사 | 센터 총무 | 창구 | Hub | weak | RELATED | 낮음 | HIGH thin | DO_NOT_TARGET `/센터법무사` |
| 협회 법무사 | 협회 | 법인·부동산 | Hub | partial | DIRECT | 중 | LOW | Hub 비영리·협회 유형 |
| 조합 법무사 | 조합 | 법인 | Hub | partial | DIRECT | 중 | LOW | KEEP |
| 학교법인 법무사 | 학교 총무 | 법인·부동산 | Hub + `/학교법률교육` | partial | DIRECT | 중 | MED | 등기는 Hub, 교육은 강의 |
| 공무원 법무사 | 공무원 개인/업무 혼재 | 모호 | Hub vs `/부산법무사` | weak | RELATED | 낮음 | HIGH | DO_NOT_TARGET `/공무원법무사` |
| 부산시청 법무사 | 오인·지정 | doorway | — | — | OUT | 0 | HIGH | DO_NOT_TARGET |
| 해운대구청 법무사 | doorway | doorway | — | — | OUT | 0 | HIGH | DO_NOT_TARGET |

---

## B. 기관 등기 Query TOP 20

| Query | Searcher | Intent | Current URL | Coverage | Legal Fit | BV | Cannib. | Action |
|-------|----------|--------|-------------|----------|-----------|----|---------|--------|
| 부산 공공기관 등기 | 총무 | 등기 의뢰 | Hub | strong | DIRECT | 높음 | LOW | KEEP |
| 부산 공기업 등기 | 공기업 | 등기 | `/공기업등기` | partial | DIRECT | 중 | LOW | STRENGTHEN spoke prose |
| 공공기관 등기업무 | 법무 | 범위 | Hub | strong | DIRECT | 높음 | LOW | KEEP |
| 공공기관 등기 법무사 | 법무 | 수임 | Hub | strong | DIRECT | 높음 | LOW | KEEP |
| 공기업 등기 법무사 | 공기업 | 수임 | Hub | partial | DIRECT | 중 | LOW | INTERNAL_LINK |
| 지자체 등기업무 | 재산/법무 | 등기 | Hub | partial | DIRECT | 중 | LOW | ADD_FAQ |
| 기관 등기대행 | 계약 | 위임 | Hub | partial | DIRECT* | 중 | MED 표현 | FAQ: 신청대리 범위만 |
| 기관 등기업무 위탁 | 계약 | 용역 | Hub + 협업문의 | partial | RELATED | 높음 | MED | ADD_SECTION 견적 |
| 공공기관 등기 위탁 | 계약 | 용역 | 동일 | partial | RELATED | 높음 | MED | 동일 |
| 등기업무 외주 | 경영지원 | 외주 | Hub | weak | RELATED | 중 | MED | FAQ |
| 등기업무 수행업체 | 계약 | 업체 선정 | 협업문의 | weak | RELATED | 중 | HIGH vs 선정 | Hub 과업범위, 신규 X |
| 공공기관 등기 서류 | 실무 | 서류 | Hub documents | strong | DIRECT | 중 | LOW | KEEP |
| 기관 등기 외부 의뢰 | 총무 | 의뢰 | Hub | partial | DIRECT | 중 | LOW | ADD_FAQ 자연어 |
| 공공기관 등기 어디에 맡기나 | 초보 담당 | 창구 | Hub | partial | DIRECT | 중 | LOW | ADD_FAQ |
| 나라장터 등기 용역 | 계약 | 조달 | Hub procurement | partial | INFO | 중 | MED misrep | 정보만, 등록·지정 주장 X |
| 조달청 등기 법무사 | 계약 | 조달 | Hub | weak | INFO | 낮음 | HIGH misrep | DO_NOT_TARGET 광고문구 |
| 전자등기 공공기관 | 실무 | 접수방법 | Hub | partial | DIRECT | 중 | LOW | checklist |
| 등기기한 공공기관 | 총무 | 기한 | Hub + 법인 spoke | partial | DIRECT | 높음 | LOW | FAQ |
| 등기 결과보고 공공기관 | 담당 | 산출물 | Hub | partial | DIRECT | 중 | LOW | KEEP (기존 FAQ) |
| 관할 등기소 기관 | 실무 | 관할 | Hub busan | partial | DIRECT | 중 | LOW | KEEP |

\*「대행」= 등기신청 대리. 행정처분·촉탁 대행 아님.

---

## C. 공공기관 법인 Query TOP 20

| Query | Searcher | Intent | Current URL | Coverage | Legal Fit | BV | Cannib. | Action |
|-------|----------|--------|-------------|----------|-----------|----|---------|--------|
| 공공기관 법인등기 | 총무·이사회 | 법인등기 | `/공공기관법인등기` | partial | DIRECT† | 높음 | MED vs Corporate Champion | STRENGTHEN spoke, 절차는 Champion 링크 |
| 공기업 법인등기 | 공기업 | 동일 | `/공기업등기` | partial | DIRECT† | 중 | LOW | KEEP |
| 재단 법인등기 | 재단 | 형태 확인 | 법인 spoke | weak | DIRECT† | 중 | LOW | ADD_FAQ 법적형태 |
| 공공기관 임원변경등기 | 인사·총무 | 임원 | spoke + `/부산임원변경등기` | partial | DIRECT† | 높음 | MED | ADD_FAQ, 일반절차는 기존 Champion |
| 공기업 임원변경 | 인사 | 임원 | 동일 | partial | DIRECT† | 높음 | MED | 신규 X |
| 재단 임원변경등기 | 재단 | 이사 | 동일 | weak | DIRECT† | 중 | LOW | FAQ |
| 기관 대표자 변경등기 | 총무 | 대표 | 동일 | partial | DIRECT† | 높음 | LOW | FAQ 자연어 |
| 공공기관 본점이전등기 | 총무 | 소재지 | spoke | partial | DIRECT† | 중 | LOW | KEEP |
| 공공기관 목적변경등기 | 사업·총무 | 목적 | spoke | partial | DIRECT† | 중 | LOW | KEEP |
| 공공기관 해산청산 | 법무 | 해산 | Hub task | partial | DIRECT† | 낮~중 | LOW | KEEP Hub card |
| 재단 대표자 변경 등기 | 재단 | 대표 | spoke | weak | DIRECT† | 중 | LOW | FAQ |
| 공기업 주소 변경 등기 | 총무 | 주소 | spoke | weak | DIRECT† | 중 | LOW | FAQ |
| 법인등기 과태료 기관 | 총무 | 기한·과태료 | `/임원변경등기과태료` | strong | DIRECT | 높음 | LOW | INTERNAL_LINK |
| 재단 임원 임기 등기 | 이사회 | 임기만료 | spoke | weak | DIRECT† | 중 | LOW | FAQ |
| 기관 이사 변경 | 재단·사단 | 이사 | spoke | weak | DIRECT† | 중 | LOW | FAQ |
| 출연기관 임원변경 | 출연 | 임원 | Hub | partial | DIRECT† | 중 | LOW | Hub |
| 학교법인 이사 변경 | 학교 | 이사 | Hub + 법인 Champion | weak | DIRECT† | 중 | MED | DO_NOT_CREATE 학교법인 전용 URL |
| 비영리법인 변경등기 | 센터·협회 | 변경 | Hub 비영리 유형 | partial | DIRECT | 중 | LOW | KEEP |
| 협동조합 대표 변경 | 조합 | 대표 | Hub | partial | DIRECT | 중 | LOW | KEEP |
| 부산 법인 법무사 | 기업 일반 | 일반 법인 | `/부산법인법무사` | strong | DIRECT | 최고 | HIGH | **DO_NOT_TARGET from 기관 Hub** |

† 기관 법적 형태(주식회사·재단·특수법인·지자체 자체 등)에 따라 등기 필요 여부가 다름. 페이지에서 일반화 금지.

---

## D. 부동산·보상·재산 Query TOP 20

| Query | Searcher | Intent | Current URL | Coverage | Legal Fit | BV | Cannib. | Action |
|-------|----------|--------|-------------|----------|-----------|----|---------|--------|
| 공공기관 부동산등기 | 재산관리 | 부동산등기 | `/공공기관부동산등기` | partial | DIRECT | 높음 | LOW | STRENGTHEN |
| 기관 부동산등기 | 재산 | 동일 | Hub | partial | DIRECT | 중 | LOW | Hub |
| 공기업 부동산등기 | 공기업 재산 | 동일 | spoke | partial | DIRECT | 중 | LOW | KEEP |
| 공유재산 등기 | 재산관리 | 공유재산 | Hub RE card | partial | DIRECT/INFO | 높음 | LOW | ADD_FAQ |
| 국공유재산 등기 | 재산 | 국·공유 | Hub | partial | DIRECT/INFO | 중 | LOW | FAQ |
| 국유재산 등기 | 재산 | 국유 | Hub | weak | INFO+DIRECT | 중 | LOW | FAQ, 행정절차와 등기 구분 |
| 기관 소유권이전등기 | 재산 | 이전 | `/공공기관이전등기` `/부산소유권이전등기` | partial | DIRECT | 높음 | MED | spoke + service champion |
| 공공기관 소유권이전 | 재산 | 이전 | 동일 | partial | DIRECT | 높음 | LOW | KEEP |
| 공공기관 소유권보존 | 시설 | 보존 | Hub + `/부산신축건물보존등기` | partial | DIRECT | 높음 | LOW | INTERNAL_LINK |
| 기관 토지 등기 | 재산 | 토지 | RE spoke | weak | DIRECT | 중 | LOW | FAQ 자연어 |
| 기관 건물 등기 | 시설 | 건물 | RE spoke | weak | DIRECT | 중 | LOW | FAQ |
| 기관 건물 보존등기 | 시설 | 신축보존 | Hub card | partial | DIRECT | 높음 | LOW | KEEP |
| 기관 토지 소유권이전 | 재산 | 이전 | 이전 spoke | partial | DIRECT | 높음 | LOW | ADD_SECTION |
| 보상 소유권이전등기 | 보상 | 보상이전 | `/공공기관이전등기` | partial | DIRECT | 높음 | LOW | ADD_SECTION |
| 토지보상 등기 법무사 | 보상 | 보상등기 | 동일 | partial | DIRECT | 높음 | LOW | STRENGTHEN prose |
| 협의취득 등기 | 보상·사업 | 협의 | 동일 | weak | DIRECT | 중 | LOW | prose |
| 공익사업 소유권이전 | 사업 | 공익 | 동일 | weak | DIRECT | 중 | LOW | prose |
| 기관 근저당 설정 | 재산·계약 | 담보 | Hub + 근저당 Champion | partial | DIRECT | 중 | LOW | INTERNAL_LINK |
| 기관 근저당 말소 | 재산 | 말소 | `/부산근저당말소등기` | strong | DIRECT | 중 | LOW | INTERNAL_LINK |
| 기관 소유 부동산 정리 | 재산 | 정리 | Hub | weak | DIRECT | 중 | LOW | FAQ |

---

## E. 용역·선정·견적 Query TOP 20

| Query | Searcher | Intent | Current URL | Coverage | Legal Fit | BV | Cannib. | Action |
|-------|----------|--------|-------------|----------|-----------|----|---------|--------|
| 부산 법무사 용역 | 계약 | 용역 | Hub + 협업문의 | partial | RELATED | 높음 | HIGH vs `/부산법무사` | ADD_SECTION Hub only |
| 공공기관 법무사 용역 | 계약 | 용역 | 동일 | partial | RELATED | 높음 | LOW | ADD_SECTION |
| 법무사 용역업체 | 계약 | 업체 | 협업문의 | weak | RELATED | 중 | HIGH thin | DO_NOT_CREATE |
| 공공기관 법무사 선정 | 계약·총무 | 선정 | Hub 과업 | weak | RELATED | 높음 | MED | ADD_SECTION 수행범위 |
| 부산 법무사 선정 | 혼재 | 선정 | `/부산법무사추천` vs Hub | partial | RELATED | 중 | **HIGH** | 개인=추천 Spoke, 기관=Hub. 기관페이지가 이 Query Primary 금지 |
| 법무사 선정 공고 | 계약 | 공고 작성 | Hub | weak | INFO | 중 | MED | 정보만 |
| 법무사 입찰 | 계약 | 입찰 | Hub procurement | weak | INFO | 중 | HIGH misrep | DO_NOT_TARGET 「입찰전문」 |
| 부산 법무사 입찰 | 계약 | 입찰 | 동일 | weak | INFO | 중 | HIGH | 동일 |
| 등기업무 용역 | 계약 | 용역 | Hub | partial | RELATED | 높음 | LOW | KEEP+모듈 |
| 등기 용역 법무사 | 계약 | 용역 | Hub | partial | RELATED | 높음 | LOW | KEEP |
| 등기업무 법무사 선정 | 계약 | 선정 | Hub | partial | RELATED | 높음 | LOW | ADD_SECTION |
| 법무사 견적 | 계약·개인 혼재 | 견적 | 협업문의 quote / `/부산법무사비용` | partial | RELATED | 높음 | HIGH | 기관=Hub 견적모듈, 개인=비용 Champion |
| 법무사 견적서 | 계약 | 견적서 | 협업문의 | partial | RELATED | 중 | MED | 견적 전 확인정보 |
| 등기업무 견적 | 계약 | 견적 | 동일 | partial | RELATED | 높음 | LOW | ADD_SECTION |
| 법무사 과업범위 | 계약 | 과업 | Hub | partial | RELATED | 높음 | LOW | STRENGTHEN |
| 법무사 업무범위 기관 | 법무 | 범위 | Hub | strong | DIRECT | 높음 | LOW | KEEP |
| 수의계약 법무사 | 계약 | 수의 | credential 슬롯 | weak | INFO | 낮음 | HIGH misrep | REVIEW only, 광고 X |
| 나라장터 법무사 | 계약 | 조달 | Hub | weak | INFO | 낮음 | HIGH | 정보, 등록 주장 X |
| 과업지시서 등기 | 계약 | RFP | Hub | weak | INFO | 중 | LOW | 견적 모듈에 산출물 |
| 제안요청서 법무사 | 계약 | RFP | Hub | weak | INFO | 중 | LOW | 동일 |

---

## F. 공무원·기관 법률교육 Query TOP 20

| Query | Searcher | Intent | Current URL | Coverage | Legal Fit | BV | Cannib. | Action |
|-------|----------|--------|-------------|----------|-----------|----|---------|--------|
| 부산 공공기관 법률강사 | 교육 | 강사 | `/공공기관법률교육` | strong | RELATED | 중 | LOW | KEEP |
| 부산 공공기관 법률교육 | 교육 | 교육 | 동일 | strong | RELATED | 중 | LOW | ADD_FAQ |
| 부산 공무원 법률교육 | 교육·총무 | 공무원 | 동일 | partial | RELATED | 중 | LOW | ADD_FAQ |
| 공무원 생활법률 교육 | 교육 | 생활법률 | 동일 | partial | RELATED | 중 | LOW | ADD_FAQ |
| 기관 직원 법률교육 | 교육 | 직원 | `/기업법률교육` + 공공 Hub | partial | RELATED | 중 | LOW | INTERNAL_LINK |
| 공공기관 전세사기 예방교육 | 교육 | 전세 | `/전세사기예방교육` | strong | RELATED | 중 | LOW | KEEP |
| 공공기관 청년 법률교육 | 교육 | 청년 | `/청년생활법률특강` | strong | RELATED | 중 | LOW | KEEP |
| 공공기관 창업 법률교육 | 교육 | 창업 | `/창업법률교육` | strong | RELATED | 중 | LOW | KEEP |
| 부산 법률 특강 강사 | 교육 | 특강 | `/부산기관법률특강` `/부산법률강사` | strong | RELATED | 중 | LOW | KEEP |
| 부산 기관 외부강사 법률 | 교육 | 외부강사 | 공공 강의 Hub | strong | RELATED | 중 | LOW | KEEP |
| 법무사 강사 부산 | 교육 | 강사 | `/부산법무사강의` | strong | RELATED | 중 | LOW | KEEP |
| 기관 법률특강 | 교육 | 특강 | `/부산기관법률특강` | strong | RELATED | 중 | LOW | KEEP |
| 지자체 법률특강 | 교육 | 특강 | 공공 Hub | partial | RELATED | 중 | LOW | FAQ |
| 공사 직원 법률교육 | 교육 | 직원 | 공공 Hub | partial | RELATED | 중 | LOW | FAQ |
| 도서관 법률강좌 | 교육 | 시민 | `/부산도서관법률특강` | strong | RELATED | 중 | LOW | KEEP |
| 강사 섭외 체크리스트 | 교육 | 섭외 | `/부산강사섭외체크리스트` | strong | RELATED | 중 | LOW | KEEP |
| 출강료 법무사 | 교육 | 비용 | `/부산강사섭외비용` | strong | RELATED | 중 | LOW | KEEP |
| 청렴교육 강사 | 교육 | 지정교육 | 공공 Hub FAQ | strong **불가** | OUT | 0 | — | DO_NOT_TARGET 수임 |
| 성희롱예방교육 강사 | 교육 | 지정 | 동일 | OUT | OUT | 0 | — | DO_NOT_TARGET |
| 강의문의 | 교육 | 전환 | `/강의문의` | strong | RELATED | 높음 | LOW | KEEP |

---

## 담당자 상황 → Query (페이지 비생성)

| 상황 | 연결 Intent | URL |
|------|-------------|-----|
| 기관에서 토지를 매입했다 | 소유권이전 | Hub RE + `/공공기관이전등기` |
| 기관 건물을 신축했다 | 보존등기 | Hub + `/부산신축건물보존등기` |
| 공공기관 임원이 바뀌었다 | 변경등기 여부 | `/공공기관법인등기` |
| 기관 주소가 바뀌었다 | 형태별 변경등기 | 법인 spoke |
| 기관이 부동산을 처분했다 | 이전·말소 | Hub RE |
| 보상으로 토지를 취득한다 | 보상 이전 | `/공공기관이전등기` |
| 등기기한이 임박했다 | 변경등기·과태료 | `/임원변경등기과태료` |
| 법무사 견적을 받아야 한다 | 견적 모듈 | Hub + 협업문의 quote |
| 법무사를 선정해야 한다 | 수행범위 | Hub procurement |
| 직원 법률교육 강사를 찾는다 | 강의 | `/공공기관법률교육` |

---

## 신규 페이지 후보 판정 (P1)

| 후보 | 8조건 | 판정 | 이유 |
|------|-------|------|------|
| 공공기관·단체 법무사 종합안내 | 기존 URL 있음 | **CREATE_NEW = N** | `/공공기관등기업무` Champion |
| 공공기관 부동산등기 | 있음 | N | `/공공기관부동산등기` |
| 공공기관 변경등기 | 있음 | N | `/공공기관법인등기` |
| 공공사업 보상 이전 | 있음 | N | `/공공기관이전등기` + ADD_SECTION |
| 법무사 용역·견적 | 독립 Intent이나 전환 Hub와 중복 | **N** | ADD_SECTION + `/협업문의` |
| 공공기관 법률교육 | 있음 | N | `/공공기관법률교육` |
| 촉탁등기 안내 | 있음 | N | `/공공기관촉탁등기` `/촉탁등기` |

**1차 신규 URL 수: 0**  
Phase 3 CREATE_NEW는 성과 확인 후, 유사도·cannibalization HIGH가 아닌 경우에만 재검토.

---

## 생성하지 않은 Keyword (명시)

| Query | 처리 |
|-------|------|
| 공기업 임원변경 법무사 | `/공공기관법인등기` + `/부산임원변경등기` |
| 재단 임원변경 법무사 | 동일 |
| 부산 법무사 입찰 | Hub 정보 + 협업문의. 입찰전문 페이지 X |
| 공유재산 촉탁등기 대행 | INFORMATION_ONLY. 대행 랜딩 X |
| ○○구청 법무사 | doorway 금지 |
| 부산 법무사 / 부산 법인 법무사 | 기존 Champion 유지 |

---

## 기존 페이지 보강 계획 (title/H1/URL 불변)

| URL | Current Intent | Missing Institution Intent | Added | SEO Risk |
|-----|----------------|----------------------------|-------|----------|
| `/공공기관등기업무` | 등기 Hub | 역할선택, 1분체크, 견적, 촉탁 scope, 강의 CTA | ADD_SECTION | LOW if title/H1 불변, `/부산법무사` exact dump 안 함 |
| `/공공기관법인등기` 등 spokes | 템플릿 thin | 기관 특수상황 prose | STRENGTHEN override | MED similarity → script 검사 |
| `/공공기관법률교육` | 강사 | 공무원 생활법률·시간 FAQ | ADD_FAQ | LOW |
| `/협업문의` | 전환 | 기관 필드 이미 있음 | KEEP | 0 |
| `/부산법무사` `/부산법인법무사` | consumer/corporate | — | **변경 없음** | N/A |
