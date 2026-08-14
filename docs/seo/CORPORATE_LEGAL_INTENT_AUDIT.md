# Corporate Legal Intent Audit

작성일: 2026-08-15  
범위: 기업·법인·회사 법무 **인접 검색의도** (직역명 없이도 회사 문제로 도달)  
보호: `BUSAN_CORPORATE_CHAMPION` = `/부산법인법무사` (title/H1/canonical 불변)  
신규 URL: **0**

## Champion 확정

| Role | URL | 담당 Query |
|------|-----|------------|
| BUSAN_CORPORATE_CHAMPION | `/부산법인법무사` | 부산 법인 법무사, 부산 법인 법무사 추천 |
| CORPORATE_LEGAL_OPERATIONS_CHAMPION | **동일 URL** | 부산 법인법무, 기업법무, 회사법무, 법인/기업/회사 법률업무 |

한 broad Intent에 Champion은 하나. 별도 `/부산법인법무` 생성하지 않음.

General Champion `/부산법무사`는 사무소 전체·업무 선택. Corporate는 기업·법인 업무.

## Inventory (핵심 URL)

| URL | Title (보호) | H1 (보호) | Primary Intent | Secondary | Target Query | Parent Hub | Indexable | Ranking Protection |
|-----|--------------|-----------|----------------|-----------|--------------|------------|-----------|--------------------|
| `/부산법인법무사` | 부산 법무사 법인 업무 | 부산 법인 업무, 설립부터 변경·해산까지 한 번에 확인하기 | 제공자+법인 업무 허브 | 기업법무·회사법무 실무 진입 | 부산 법인 법무사 / 법인법무 aliases | `/부산법무사` | yes, self canonical | FULLY_PROTECTED |
| `/부산법인등기` | (기존) | (기존) | 법인등기 실무 hub | 변경 유형 라우팅 | 부산 법인등기 | `/부산법인법무사` | yes | supporting |
| `/법인변경등기` | (기존) | (기존) | 변경등기 유형 | — | 법인 변경등기 | `/부산법인법무사` | yes | supporting |
| `/부산법인설립등기` | (기존) | (기존) | 설립등기 | 회사 만들기 | 부산 법인설립 | `/부산법인법무사` | yes | supporting |
| `/부산임원변경등기` | (기존) | (기존) | 임원변경등기 | 이사 사임·등기부 잔존 | 부산 임원변경등기 | `/부산법인등기` | yes | supporting |
| `/부산대표이사변경등기` | (기존) | (기존) | 대표이사 변경 | — | 대표이사 변경등기 | `/부산임원변경등기` | yes | supporting |
| `/부산임원임기만료등기` | (기존) | (기존) | 임기만료·중임 | 과태료 | 임원 임기만료 | `/부산임원변경등기` | yes | supporting |
| `/부산본점이전등기` | (기존) | (기존) | 본점이전 | 회사 주소 변경 | 부산 본점이전등기 | `/부산법인등기` | yes | supporting |
| `/부산사업목적변경등기` | (기존) | (기존) | 목적변경 | 사업 추가 | 목적변경등기 | `/부산법인등기` | yes | supporting |
| `/부산유상증자등기` | (기존) | (기존) | 유상증자 | 투자 후 등기 | 유상증자 | `/부산법인등기` | yes | supporting |
| `/부산법인해산청산등기` | (기존) | (기존) | 해산·청산 | 폐업과 구분 | 해산청산 | `/부산법인법무사` | yes | supporting |
| `/부산법인해산전확인사항` | (기존) | (기존) | 해산 전 체크 | 휴면·오래된 법인 | — | `/부산법인해산청산등기` | yes | supporting |
| `/법인정관업무` | (기존) | (기존) | 정관 | 공증 연결(수행 아님) | 법인 정관 | `/부산법인법무사` | yes | supporting |
| `/법인정관변경` `/법인공증준비` `/법인정관인증확인` `/법인의사록공증준비` | (기존) | (기존) | 정관변경·공증 **준비** | — | 정관 공증 필요 | `/법인정관업무` | yes | supporting |
| `/부산기업법률자문` | 부산 기업 법률실무 지원 | (기존 H1) | 기업 실무 유형 hub | 법무팀 없는 회사 | 기업 법률실무 | `/부산법인법무사` | yes | spoke — 기업법무 Champion 아님 |
| `/부산기업법무사` | 부산 기업 법무사 | (기존 H1) | 기업 법무사 **선택** | — | 부산 기업 법무사 | `/부산법인법무사` | yes | spoke — 기업법무 operations와 분리 |
| `/부산기업채권관리` | (기존) | (기존) | 미수금 서류·지급명령 | 공탁 연결 | 기업 지급명령 | `/부산기업법률자문` | yes | supporting |
| `/부산부동산등기` | (기존) | (기존) | 부동산 Champion | 법인 명의 교차 | 부동산등기 | `/부산법무사` | yes | REAL_ESTATE_CHAMPION |
| `/부산법인등기과태료` `/부산법인정기점검` | (기존) | (기존) | 기한·점검 | — | 과태료 | `/부산법인등기` | yes | supporting |
| `/협업문의` | (기존) | (기존) | B2B/B2G 협업 | 기업법무와 별개 | — | `/partners` | yes | 공공/복대리 — 이번 Cluster Target 아님 |

Canonical: 각 페이지 self. Indexability: indexable. 기존 sitemap URL 유지.

Inbound: Champion ← General, 기업법률자문, 기업법무사, 홈, 지역 overlay. Champion → 설립/임원/본점/목적/증자/해산/부동산/채권.

FAQ: Champion은 기존 11 + unique 6(사업자vs등기, 정관≠항상등기, 퇴사 이사, 법인 부동산, 외주 범위, 미수금≠회수대행). Detail FAQ 복제 금지.

## Cannibalization (Broad TOP 후보)

| Query | Candidate | Title match | Relevance | Conflict |
|-------|-----------|-------------|-----------|----------|
| 부산 법인법무 | `/부산법인법무사` | 법인 업무 | 높음 | Champion |
| | `/부산법인등기` | 등기 실무 | 중 | Secondary |
| | `/부산기업법률자문` | 법률실무 | 중 | Spoke |
| | `/부산기업법무사` | 기업 법무사 | 중(선택) | 선택 의도만 |
| 부산 기업법무 | 동일 Champion | — | 높음 | 기업법무사 페이지와 역할 분리 |
| 부산 회사법무 | 동일 Champion | 회사 법무 keyword 기존 | 높음 | 신규 URL 불필요 |
| 부산 법인 법률업무 | Champion | 법률업무 문맥 | 중~고 | ADD_MODULE |
| 부산 기업 법률업무 | Champion + `/부산기업법률자문` | 실무 hub | 중 | 실무 허브는 spoke |

**Primary Champion은 `/부산법인법무사` 하나.**

## 유사도

신규 모듈 카피 vs 기존 Champion/기업허브/기업법무사: 공통명사 제거 후 HIGH 금지 (`seo:audit:corporate-legal-similarity`).

## 네이버 공식 (재확인 2026-08-15)

- [콘텐츠 작성 권장사항](https://searchadvisor.naver.com/guide/content-basic): 핵심 정보는 텍스트, 키워드 반복·무관 인기검색어 삽입 금지, 고유 경험, 제목은 내용 예측 가능.
- [웹 콘텐츠 스팸](https://searchadvisor.naver.com/guide/content-abusing): 숨김·클로킹·스팸 링크 금지.
- [사이트 최적화](https://searchadvisor.naver.com/guide/report-seo): title/description 고유·간결, 동일 제목 반복 불리.

이번 Cluster는 alias dump·hidden keyword·title 반복 삽입 없음. 기존 자동화와 충돌하는 우회 코드 없음.

레지스트리: `src/data/seo/corporate-legal-intents.ts`
