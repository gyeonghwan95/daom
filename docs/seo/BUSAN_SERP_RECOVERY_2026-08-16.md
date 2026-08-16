# 「부산 법무사」 SERP Recovery — 2026-08-16

LIVE_NAVER_SERP_UNAVAILABLE. 가짜 순위 없음. CREATE_NEW = 0. Title/H1/canonical/URL 자동변경 = 0.

이번 실행은 **감사 + 보고**다. Phase 1 duplicate TOC는 이미 production HTML(스크립트 제외)에서 `data-page-toc` 1회다. 추가 공개 HTML 수정은 하지 않았다.

## SEO REGRESSION SAFETY

| 항목 | 값 |
|------|-----|
| Existing URLs Before | 1653 (sitemap) |
| Existing URLs After | 1653 |
| Removed URLs | 0 |
| Changed URLs | 0 |
| Protected Title Changes | 0 |
| Protected H1 Changes | 0 |
| Protected Canonical Changes | 0 |
| Noindex Added | 0 |
| Unexpected Redirects | 0 |
| Sitemap URLs Removed | 0 |
| **PASS / FAIL** | **PASS** |

스냅샷: `reports/seo/busan-serp/current-state.json`  
HTML: `reports/seo/busan-serp/html-before/`  
Known-good: `e064454` (2026-08-07)

전체 1653 URL의 title/H1/bodyHash 전수 crawl은 하지 않았다. Sitemap 인벤토리 + Priority 7 URL live HTML.

## Champion

**BUSAN_GENERAL_CHAMPION = `/부산법무사`**

Historical observation URL은 계속 **null**. 추측으로 노출 URL을 확정하지 않는다.

Query roles (유지, rewrite 없음):

| Query | URL | Role |
|-------|-----|------|
| 부산 법무사 | `/부산법무사` | General Champion |
| 부산 법무사 추천 | Primary `/부산법무사`, Spoke `/부산법무사추천` | Selection |
| 부산 법무사 비교 | `/부산법무사비교` | Comparison |
| 부산 법무사 비용 | `/부산법무사비용` | Cost |
| 부산 법무사 상담 | `/부산법무사상담` | Consultation prep |
| 부산 등기 법무사 | `/부산등기법무사` | Registration service |

Homepage `/` title `부산법무사 | …` vs Champion title `부산 법무사｜…` → **CHAMPION_AMBIGUITY** (REPORT). canonical 합치기·redirect·noindex **금지**.

## Live YES/NO (production HTML, script 제외)

| ID | 질문 | 답 | 조치 |
|----|------|----|------|
| A | 상담 상태 문구 중복? | **YES** — `현재 카카오·네이버톡톡만 가능` Champion 5회 / Home 4회 (헤더·상태바) | REPORT. Header는 sitewide (>50 URL). 자동 병합 금지 |
| B | Hero/CTA DOM 중복? | **YES (홈)** `HomeHero` mobile `lg:hidden` + desktop `hidden lg:block` 각각 `HeroContactBlock` | REPORT. UI HIGH RISK. Phase 1 미적용 |
| C | Review 중복? | **미확인 HIGH** — 홈 후기는 컴포넌트 구조상 별도 섹션. 동일 후기 ID 2회는 이번 raw 카운트에서 확정하지 않음 | REPORT |
| D | 첫 설명/요약 중복? | **NO (exact body dump)** — `ArticleSummary`가 `introParagraphs[0]`을 핵심요약에 쓰고 본문은 `slice(1)` | KEEP 구조 |
| E | TOC 중복? | **NO (live, minus scripts)** toc=1, details=1 | 이전 Phase 1 유지 |
| F | Keyword variant list? | **YES** Champion badges 4개. known-good에도 존재 | 삭제 금지 |
| G | 검색엔진용 query 문장? | **YES** Flagship `problemStatement`에 어색한 검색어 설명 | REPORT MEDIUM. 핵심 문단 자동삭제 금지 |
| H | Station links 과다? | **YES on Champion** `stationSections` 도시철도 안내 (expansion builder) | REPORT. Region Hub로 옮기는 안은 HIGH-RISK 추천만 |
| I | Related links 과다? | **YES** Flagship `relatedServiceLinks` 20+ | 명백한 동일 URL 이중렌더만 수정 가능. 대량삭제 금지. 이번 0 |
| J | Homepage SEO hub 과다? | **YES** `HomePopularSearches` + `HomeHubGuide` (~100 href in `home-sections.ts`) | ROLLBACK_CANDIDATE 보고. 홈은 2016-07부터 검색 카드 존재. 자동삭제 금지 |
| K | Broad query URL 다수? | **YES** 추천/비교/상담/비용/등기 + 홈 | 역할 문서화만. URL 유지 |
| L | H1 중복? | **NO** Priority live h1Count=1 | — |
| M | Placeholder SSR? | **YES** `페이지를 불러오는 중입니다` Home 1 / Champion 2 (loading/nav) | REPORT. `loading.tsx` sitewide. 자동제거 금지 |

## `/부산법무사` 영역 분류

| 영역 | 분류 |
|------|------|
| Title / H1 / 첫 문단 | CORE (보호) |
| 핵심 요약 (ArticleSummary) | USEFUL (첫 문단을 요약 슬롯에 배치, 본문 미반복) |
| Keyword badges | SEO_ONLY / KEYWORD_LIST_RISK but **known-good** |
| TOC | USEFUL (1 DOM) |
| 업무 선택·서류·비용·관할 | CORE |
| 추천 검색 시 기준 | USEFUL (Spoke로도 존재 → 겹침 REVIEW) |
| 도시철도 섹션 | TOPIC_DILUTION / station directory | REPORT |
| Related pages | MIXED ESSENTIAL+WEAK | 대량삭제 금지 |
| CTA | CORE |

## 다옴 강점 (KEEP)

확인 가능한 자산: 안윤정 법무사 실명, 해운대·센텀 실주소, 전화, 자격·강의·언론·업무사례·후기 모듈. SEO 때문에 삭제하지 않는다. Homepage에서 이력 반복 축소는 Phase 3 HIGH RISK.

## Naver 정책 분류 (코드)

| 패턴 | 분류 |
|------|------|
| KeywordBadges / primaryKeywords | REVIEW (legacy, Champion known-good) |
| capHubLinks filler | REVIEW |
| HomeHubGuide exact-ish anchors | RISK 보고, 삭제 금지 this phase |
| Mass local/station templates | RISK — 신규 생성 freeze. 기존 URL 유지 |
| Hidden alias | 이번 Champion HTML에서 별도 hidden keyword dump 없음 (badges는 노출 UI) |
| Automated mass lastmod | sitemap lastmod 홈 `2026-08-03` 등 — 전수 조작 실험 금지 |

## Root cause (단정 아님)

| Issue | Evidence | Introduced | vs drop | Confidence |
|-------|----------|------------|---------|------------|
| 08-10 Champion extra modules | forensic / unmerge | 70f45a2 | 시간 근접 | HIGH historically; already reverted |
| 08-01~12 유사 랜딩 급증 | git a106143, eba1030 | 08-01~12 | 가능 | MEDIUM |
| Homepage+Champion 동시 `부산법무사` title | live titles | 기존 브랜드 타이틀 | 가능 | MEDIUM — **title 변경 금지** |
| Champion 역 링크 블록 | live H2 + builder-expansion | expansion | 가능 | MEDIUM — 자동삭제 금지 |
| Keyword badges | e064454에도 있음 | known-good | 낮음 | LOW |
| 헤더 상담상태 반복 | live first500 | chrome | 낮음 | LOW as ranking cause |
| 실제 상위 경쟁 URL | SERP 미수집 | — | — | **없음** |

## Phase

| Phase | 이번 실행 |
|-------|-----------|
| 1 SAFE DOM | 이미 적용됨 (TOC). **추가 수정 0. STOP.** |
| 2 Over-SEO rollback | 미실행. 역 블록·허브·배지·어색한 문장 = 승인 후 |
| 3 Intent clarification | 미실행. Title/H1 실험 금지 |

## 사용자에게 필요한 입력

네이버에서 **광고 제외** 웹사이트/웹문서 중 다옴보다 위에 있는 URL을 알려 주시면 `competitor-analysis.json`을 채운다. 지금은 Rank=UNKNOWN.

순위 기록: query, 날짜, 위치, **어느 URL이 노출됐는지**.
