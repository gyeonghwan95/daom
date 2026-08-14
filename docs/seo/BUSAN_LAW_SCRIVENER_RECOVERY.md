# BUSAN LAW SCRIVENER SEO ROOT CAUSE

생성: 2026-08-15  
Phase applied: **1 SAFE ONLY** (duplicate TOC)  
CREATE_NEW: 0  
Champion title/H1/canonical: 0 change

## SEO REGRESSION SAFETY

Existing URLs Before: 1655 (snapshot)  
Existing URLs After: (regression guard / seo-paths)

Removed: 0 (목표)  
Changed path: 0  

Protected Title Changes: 0  
Protected H1 Changes: 0  
Protected Canonical Changes: 0  
Noindex Added: 0  
Unexpected Redirects: 0  
Sitemap URLs Removed: 0  

PASS/FAIL: `npm run seo:regression` 결과 기준.

## TOP 10

| Rank | Issue | Affected URL | Evidence | Date Introduced | Risk | Safe Action | Applied? | Rollback |
|------|-------|--------------|----------|-----------------|------|-------------|----------|----------|
| 1 | Champion 첫 화면 extra module 희석 | `/부산법무사` | 08-13 forensic; modules unmerged | 70f45a2 08-10 | 90 | KEEP reverted state. 재적용 금지 | 이전 Recovery | extra modules 파일은 archive |
| 2 | Query cannibalization (추천/상담/비교) | `/부산법무사추천` 등 | registry + landings | 기존+확장 | 75 | 역할 문서화. URL 유지. rewrite 금지 this phase | REPORT + champions json | n/a |
| 3 | Duplicate TOC in HTML | 거의 모든 PageData 페이지 | `PageTableOfContents` hidden+details | 가독성 레이아웃 | 40 | 목록 1회 | **YES Phase 1** | 해당 파일 revert |
| 4 | Homepage contact/marquee duplicate DOM | `/` | HomeHero lg:hidden + hidden lg:block | 홈 리디자인 | 35 | 1 DOM+CSS 후보 | NO (UI 위험) | — |
| 5 | Keyword badges on Champion | `/부산법무사` | primaryKeywords | known-good에도 존재 | 30 | 보호. 삭제 금지 | NO | — |
| 6 | Related link 증가 on Champion | `/부산법무사` | diff vs e064454 +2 links | 08-10~13 | 25 | 추가분 유지(법인 Champion 지지). 대량삭제 금지 | NO | — |
| 7 | Local/situation 유사 랜딩 증가 | many | eba1030, 0f9e605 | 08-11~12 | 80 | freeze 신규. 삭제 금지 | freeze only | — |
| 8 | capHubLinks exact-ish fillers | 링크 부족한 페이지 | `src/lib/hub/links.ts` | 기존 | 40 | REPORT. 전면 문구 실험 금지 | NO | — |
| 9 | Search Advisor 색인 상태 불명 | Champion | 로그인 없음 | — | — | 수동 URL 검사 | NO | — |
| 10 | 관측 노출 URL null | 「부산 법무사」 | ranking-observations.json | 08-07/13 | — | 관리자 수동 기록 | admin panel note | — |

## Competitor

LIVE_NAVER_SERP_UNAVAILABLE. 경쟁사 문장 복사 없음. 내부 관찰: 우리 Champion은 업무 허브+선택 기준이 한 페이지에 있어 **복잡도는 높고, 검색자가 20초에 사무소/업무/다음 페이지를 잡는 구조는 Flagship 문단 1–2가 담당**. 상속 서류 전면 나열은 아님.

## Search Advisor 수동 체크리스트

`/부산법무사` `/` `/부산법무사추천`:

- 수집 / 색인 / Meta / SEO / 대표 URL

프로그램 로그인 우회 없음.

## Phase log

| Phase | before | after | changed URLs | reason |
|-------|--------|-------|--------------|--------|
| 1 | snapshot `busan-law-scrivener-before.json` | TOC 1회 | HTML 구조만 (URL 동일) | DOM_RENDER_DUPLICATION |
| 2 | — | not started | — | intent realignment |
| 3 | — | not started | — | cannibalization copy |

Freeze: Champion Title/H1/Canonical **14일** 대규모 변경 금지 (수집 안정까지).
