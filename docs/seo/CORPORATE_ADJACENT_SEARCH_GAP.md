# Corporate Adjacent Search Gap

작성일: 2026-08-15  
CREATE_NEW: **없음** (0 URL)

## Broad

| Query | Intent | Champion | Coverage | Cannibalization | Action |
|-------|--------|----------|----------|-----------------|--------|
| 부산 법인법무 | 회사 운영 법무 실무 (직역 불명) | `/부산법인법무사` | strong (모듈 보강) | 등기 Hub·기업실무 Hub와 중첩 가능 → Champion 1개 | ADD_MODULE, 신규 URL 없음 |
| 부산 기업법무 | 동일 broad | 동일 | strong | `/부산기업법무사`는 선택 spoke | 동일 Champion |
| 부산 회사법무 | 동일 broad | 동일 | strong | 없음 | 신규 페이지 불필요 |
| 부산 법인 법률업무 | 동일 broad | 동일 | partial→strong | 기업법률자문 spoke | ADD_MODULE |
| 부산 기업 법률업무 | 동일 + 실무 유형 | Champion + `/부산기업법률자문` spoke | strong | spoke는 유형 연결만 | ADD_FAQ on spoke |

스페이스 유무(법인법무 / 법인 법무)는 **aliases**. 공개 본문에 나열하지 않음.

## Situation Keyword TOP 30

| Rank | Query | Situation | Actual Legal Task | Existing URL | Coverage | Business Value | Action |
|------|-------|-----------|-------------------|--------------|----------|----------------|--------|
| 1 | 회사 대표 변경 | 대표가 바뀜 | 대표이사 변경등기 | `/부산대표이사변경등기` | strong | 5 | KEEP |
| 2 | 퇴사한 이사가 등기부에 남아있음 | 사임 미등기 | 임원변경등기 | `/부산임원변경등기` | strong | 5 | ADD_FAQ (Champion) |
| 3 | 임원 임기 지남 | 임기만료 방치 | 중임·퇴임등기 | `/부산임원임기만료등기` | strong | 5 | KEEP |
| 4 | 회사 등기 과태료 | 기한 경과 | 과태료 안내 | `/부산법인등기과태료` | strong | 5 | KEEP |
| 5 | 회사 주소 옮겼는데 등기 안함 | 본점 미등기 | 본점이전등기 | `/부산본점이전등기` | strong | 5 | KEEP |
| 6 | 사업목적 추가했는데 등기 안함 | 목적 미등기 | 목적변경등기 | `/부산사업목적변경등기` | strong | 4 | KEEP |
| 7 | 회사 이름 변경 | 상호 | 상호변경등기 | `/부산법인등기` | partial | 3 | KEEP (Hub) |
| 8 | 부산 회사 만들기 | 설립 | 설립등기 | `/부산법인설립등기` | strong | 5 | KEEP |
| 9 | 법인 정관 변경 | 정관 | 정관변경·등기 해당 여부 | `/법인정관변경` | strong | 4 | KEEP |
| 10 | 주주총회 의사록 | 결의 서류 | 첨부서류·공증 준비 | `/법인의사록공증준비` | strong | 4 | KEEP |
| 11 | 정관 공증 필요 | 공증 여부 | 공증인 업무 + 등기 전후 | `/법인공증준비` | strong | 3 | KEEP (수행 주장 금지) |
| 12 | 투자받고 증자 | 자본 증가 | 유상증자등기 | `/부산유상증자등기` | strong | 4 | KEEP |
| 13 | 법인 명의 부동산 매입 | 회사 부동산 | 소유권이전 | `/부산부동산등기` | strong | 5 | ADD_MODULE 링크 |
| 14 | 법인 근저당 | 담보 | 근저당 설정·말소 | `/부산부동산등기` | strong | 4 | KEEP |
| 15 | 폐업신고만 하고 법인 남아있음 | 폐업≠소멸 | 해산·청산등기 | `/부산법인해산청산등기` | strong | 5 | KEEP |
| 16 | 회사 정리 / 법인 없애기 | 종료 | 해산·청산 | `/부산법인해산전확인사항` | strong | 4 | KEEP |
| 17 | 회사 미수금 지급명령 | 대금 미수 | 지급명령 신청서류 | `/부산기업채권관리` | strong | 4 | KEEP |
| 18 | 기업 법무 외주 | 법무팀 없음 | 사건별 등기·서류 | `/부산법인법무사` | partial | 4 | ADD_FAQ |
| 19 | 회사 등기 체크리스트 | 담당자 점검 | 변경사항 확인 | `/부산법인정기점검` | strong | 4 | ADD_MODULE |
| 20 | 임원 임기 관리 | 총무 캘린더 | 정기점검 | `/부산법인정기점검` | strong | 4 | KEEP |
| 21 | 대표이사만 남은 회사 | 기관구성 | 임원 구성·등기 | `/부산임원변경등기` | partial | 4 | KEEP (Detail) |
| 22 | 이사 두명이 동시에 사임 | 특수 사임 | 임원변경 | `/부산임원변경등기` | partial | 3 | KEEP |
| 23 | 사업자등록 변경 vs 등기 | 혼동 | 별개 절차 | `/부산법인법무사` | FAQ | 4 | ADD_FAQ |
| 24 | 정관을 변경하면 항상 등기? | 혼동 | 등기사항만 | `/법인정관변경` | FAQ | 4 | ADD_FAQ |
| 25 | 법인등기 기한 | 기한 | 변경등기 기한 | `/부산임원변경등기` | strong | 5 | KEEP |
| 26 | 회사 자본금 줄이기 | 감자 | 감자등기 | `/부산유상증자등기` (인접) | partial | 2 | KEEP — 전면 확대 금지 |
| 27 | 법원 제출서류 / 공탁 | 법원서류 | 신청서류 작성 | `/부산기업채권관리` 등 | partial | 3 | KEEP |
| 28 | 주주명부 / 발기인 | 설립 준비 | 설립등기 서류 | `/부산법인설립등기` | strong | 3 | KEEP |
| 29 | 1인회사 해산 | 종료 | 해산·청산 | `/부산법인해산청산등기` | strong | 3 | KEEP |
| 30 | 회사 등기 업무 (총무) | 담당자 언어 | 변경등기 허브 | `/법인변경등기` | strong | 4 | KEEP |

## 신규 URL 후보

**없음.**

기존 Broad Champion이 있고, Intent가 독립적이지 않으며, 유사도가 높을 신규 랜딩은 성과 보호에 반한다.

## 생성하지 않은 Query (의도적)

| Query | 판단 |
|-------|------|
| 부산 회사법무 | Corporate Champion이 담당. 신규 URL 없음 |
| 부산 기업법무 | 동일 |
| 부산 법인 법무 / 법인법무 | 동일 (스페이스 alias) |
| 부산 기업 법률업무 | Champion + 기존 `/부산기업법률자문` |
| 주주분쟁·경영권분쟁·소송대리 | DO_NOT_TARGET |
| 지역명만 바꾼 기업법무 페이지 | 금지 |

## 기존 페이지 개선

| URL | Current Intent | Missing Search Intent | Section Added | FAQ Added | Internal Links | Risk |
|-----|----------------|----------------------|---------------|-----------|----------------|------|
| `/부산법인법무사` | 법인 법무사 선택+허브 | 법인법무·기업법무·문제형 진입 | 6영역·상황카드·성장단계·체크리스트·범위표 | 6 unique | 부동산·채권·해산전·목적 | 첫 문단 미변경으로 identity 보호. 모듈은 ArticleSummary **뒤** |
| `/부산기업법률자문` | 실무 허브 | Champion 구분 | — | 기업법무 vs 법인 업무 | Champion 링크 | 낮음 |
| `/부산기업법무사` | 기업 법무사 선택 | 기업법무 실무 라우팅 | — | 실무는 Champion | 기존 Champion 링크 | FAQ 노출 확대(slice 해제) — title/H1 불변 |

## Search Scope

| Intent | Class |
|--------|--------|
| 설립·변경등기·정관서류·증자등기·해산청산·법인 부동산등기·지급명령 서류 | DIRECT |
| 공증 필요 여부, 사업자등록과의 차이, 법무 외주(사건별) | RELATED |
| 주주·경영권 분쟁, 소송대리, 세무·노무·특허 전반, 모든 기업 법률 | OUT_OF_SCOPE |

## Q1–Q13

**Q1.** `/부산법인법무사`  
**Q2.** 예. 동일 Champion.  
**Q3.** 아니오.  
**Q4.** 경쟁하지 않음. 같은 URL이 provider+operations를 담당. title/H1은 provider 성과 문구 유지.  
**Q5.** 6영역·8상황 카드로 커버. 세부 절차는 Detail.  
**Q6.** Detail Primary(임원변경 등) 유지. Broad 키워드를 Detail에 반복 Target하지 않음.  
**Q7.** 범위표 + FAQ로 등기·법원서류로 한정.  
**Q8.** 다옴법무사사무소·안윤정 법무사. 기존 description/본문 유지 + 모듈에 명시.  
**Q9.** 민감 직역 exact keyword를 신규 삽입하지 않음. 문제 언어로 커버.  
**Q10.** alias dump·hidden·schema stuffing 없음.  
**Q11.** 위 TOP 30.  
**Q12.** 법인법무/기업법무/회사법무/법률업무 aliases, 외주·지원, 문제형 long-tail 전부 기존 URL.  
**Q13.** URL/title/H1/canonical/sitemap 삭제 없음. regression 가드 확인.

레지스트리: `src/data/seo/corporate-legal-intents.ts`
