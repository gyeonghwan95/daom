# Public Sector Current Coverage

기준일: 2026-08-13  
보호 원칙: URL/slug/canonical/sitemap 삭제·변경 0, 상위노출 title/H1 변경 0.  
UNKNOWN_PERFORMANCE 페이지도 보호.

## Champion 역할 분리

| Role | URL | Primary Intent | 비고 |
|------|-----|----------------|------|
| **PUBLIC_SECTOR_CHAMPION** | `/공공기관등기업무` | 공공기관·단체 등기·법무 업무 안내 | 정보 Hub. title/H1 불변 |
| Conversion | `/협업문의` | 협업·기관 문의서 작성 | `?partner=public` |
| Collaboration explore | `/partners` | 협업 분야 탐색 | GNB 「협업문의」 |
| Lecture Hub | `/공공기관법률교육` | 공공기관·공무원·직원 법률교육 | 등기 Hub와 분리 |
| Lecture special | `/부산기관법률특강` | 기관·단체 특강 | 기존 강의 Cluster |
| Corporate Champion | `/부산법인법무사` | 일반 법인 법무사 | 기관 페이지와 경쟁 금지 |
| General Champion | `/부산법무사` | 부산 법무사 / 추천 | 기관 Hub Primary 금지 |

신규 종합 Hub URL **생성하지 않음**. 기존 `/공공기관등기업무`가 PUBLIC_SECTOR_CHAMPION.

---

## URL Inventory

### A. 정보 Hub (Champion)

| Field | Value |
|-------|--------|
| URL | `/공공기관등기업무` |
| Title | 공공기관 등기업무｜공기업·공공기관 법인등기·부동산등기·촉탁등기 안내 |
| H1 | 동일 (title = H1 패턴) |
| Primary Intent | 공공기관·공기업·출자출연 등 등기업무 안내 |
| Institution Intent | 강함 (기관유형·법인·부동산·촉탁·조달 섹션) |
| Services | 법인변경, 부동산 취득·보존·처분·담보, 촉탁 vs 신청 비교, 용역 검토 |
| Current Keywords | 공공기관 등기업무, 법인등기, 부동산등기, 촉탁등기, 지방공기업, 부산 공공기관 등기 |
| Inbound Links | Home popular-registration, `/partners` public card, collaboration mega, lecture hub, practice hubs, footer |
| CTA | 기존 `/contact/inquiry` → Cluster에서 `/협업문의?partner=public`로 정합 (title/H1 불변) |
| Content Depth | 깊음 (기관유형, task cards, 비교표, 체크리스트, FAQ 12+) |
| Canonical | self |
| Indexability | indexable |
| Ranking Protection | UNKNOWN_PERFORMANCE → **PROTECTED** (title/H1/canonical/URL 불변) |

### B. Conversion / B2B

| URL | Title (요약) | H1 (요약) | Primary Intent | Institution Intent | CTA | Depth | Protection |
|-----|--------------|-----------|----------------|--------------------|-----|-------|------------|
| `/협업문의` | 협업·복대리·프로젝트 문의서 | 문의서 작성 | 전환 폼 | partner=public, org/dept/quote 필드 | 문의서 | 중 | PROTECTED |
| `/partners` | 부산 법무사 협업문의 | 협업 방식 확인 | 분야 탐색 Hub | 공기업·공공기관 카드 → Champion | 문의서 | 중 | PROTECTED |
| `/법무사협업` | (기존 B2B) | — | 전문직 협업 안내 | 약함 | 협업문의 | 중 | UNKNOWN_PERFORMANCE |
| `/부산법인등기아웃소싱` | 기업 반복 등기 | — | 기업 아웃소싱 | 기업 중심, 기관 일부 | 협업문의 company | 중 | UNKNOWN_PERFORMANCE |
| `/부산기업법률자문` | 기업 등기 실무 | — | 기업 담당자 | 기관과 인접, Corporate/B2B | 문의 | 중 | UNKNOWN_PERFORMANCE |

폼 optional: 기관/단체명, 담당부서, 업무유형, 희망일정, 예상건수, 문의내용. 민감자료 기본 업로드 없음.

### C. 공공 Search-Intent Spokes (이미 sitemap에 존재 — 신규 복제 금지)

| URL | Label / H1 패턴 | Primary Intent | Institution Intent | Depth | Action |
|-----|-----------------|----------------|--------------------|-------|--------|
| `/공공기관법인등기` | 공공기관 법인등기 — 상담 전 확인 가이드 | 기관 법인등기 | 중 (템플릿 기반 thin) | 낮~중 | STRENGTHEN prose, title/H1 불변 |
| `/공공기관부동산등기` | 공공기관 부동산등기 — … | 기관 부동산등기 | 중 | 낮~중 | STRENGTHEN |
| `/공공기관촉탁등기` | 공공기관 촉탁등기 — … | 촉탁 안내 | 중, **INFORMATION_ONLY** | 낮~중 | ADD_SECTION (범위 명확화) |
| `/공공기관이전등기` | 공공기관 이전등기 — … | 이전·보상 이전 | 중 | 낮~중 | ADD_SECTION |
| `/공기업등기` | 공기업 등기 — … | 공기업 등기 | 중 | 낮 | KEEP + Hub 링크 (유형별 신규 금지) |
| `/지방공기업등기` | 지방공기업 등기 — … | 지방공기업 | 중 | 낮 | KEEP |
| `/촉탁등기` | 촉탁등기 — … | 촉탁 일반 | INFORMATION_ONLY | 낮 | KEEP, Hub와 역할 공유 |

Factory title/H1: `{label}｜다옴법무사사무소` / `{label} — 상담 전 확인 가이드`. **변경 금지.**

### D. 강의 Cluster (등기와 수입·유입 분리)

| URL | Intent | Institution Intent | CTA | Protection |
|-----|--------|--------------------|-----|------------|
| `/공공기관법률교육` | 공공기관 강사·직원교육 | 강함 | `/강의문의` | UNKNOWN → PROTECTED title/H1 |
| `/부산기관법률특강` | 기관·단체 특강 | 강함 | 강의문의 | PROTECTED |
| `/전세사기예방교육` | 전세사기 예방교육 | 교육담당 | 강의문의 | PROTECTED (고의도) |
| `/청년생활법률특강` | 청년 법률교육 | 기관·센터 | 강의문의 | UNKNOWN |
| `/창업법률교육` | 창업 법률교육 | 기관·센터 | 강의문의 | UNKNOWN |
| `/기업법률교육` | 기업 직원교육 | 기업·기관 인접 | 강의문의 | UNKNOWN |
| `/강의문의` | 강의 전환 | — | 폼 | PROTECTED |
| `/강의이력` | 확인된 이력 | 신뢰요소 | — | 사실만 |

확인된 공공 협업 예: LH·부산창조경제혁신센터 등 **콘텐츠에 이미 기재된 사실만**. 「다수 공공기관 수행」 추가 금지.

### E. 관련 Service Champions (기관 Hub가 가로채지 않음)

| URL | Role |
|-----|------|
| `/부산법인등기` `/부산임원변경등기` `/임원변경등기과태료` | 일반 법인 절차 |
| `/부산부동산등기` `/부산소유권이전등기` `/부산신축건물보존등기` | 일반 부동산 |
| `/부산근저당설정등기` `/부산근저당말소등기` | 담보 |
| `/부산재개발등기` | 정비사업 (보상과 인접, 별도) |
| `/faq/public-agency-registration-faq` | FAQ spoke |

---

## GNB / Internal link 현황

- Header: 「협업문의」 mega → `/공공기관등기업무` 1개만 기관 정보 노출. **세부 공공 페이지 전부 넣지 않음.**
- 강의 메뉴: `/공공기관법률교육`, `/부산기관법률특강` 기존 유지.
- Home: popular-registration에 `/공공기관등기업무` 이미 존재. `/부산법무사` exact-anchor 덤프 추가 안 함.

---

## 법적 범위 메모 (실행 시점 공식 기준)

- **부동산등기법** 등기 신청 vs 관공서 **촉탁**은 주체가 다름. 촉탁 자체는 기관 행정행위일 수 있음.
- **법무사법** 업무: 등기신청 대리, 신청서·첨부서류 작성 등. 관공서 촉탁 **대행** 광고 ≠ 가능 범위.
- 분류: DIRECT(신청등기 수임) / SUPPORT(서류·요건 검토 지원) / INFORMATION_ONLY(촉탁 설명) / OUT_OF_SCOPE(지정교육·소송 본안·기관명 전담 사칭).

조달 표현: 나라장터·수의계약·여성기업 우대는 **광고 자동삽입 금지**. 여성기업·중소기업·창업기업 확인서 보유는 기존 credential 슬롯에 「공고·법령별 별도 확인」으로만.

---

## Coverage 요약

이미 강하게 커버: 공공기관 등기 Hub, 협업 전환, 공공 강의 Hub, 법인/부동산/촉탁/이전 Spoke(URL만, 본문은 thin).  
빠진 P1: **신규 URL이 아니라** Hub의 담당자 역할 선택·1분 체크·견적 모듈·촉탁 범위 문구·Spoke prose.  
CREATE_NEW = **0**.
