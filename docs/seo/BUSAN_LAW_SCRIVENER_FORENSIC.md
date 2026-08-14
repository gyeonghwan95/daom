# BUSAN LAW SCRIVENER FORENSIC

생성: 2026-08-15  
Query: 「부산 법무사」  
SEO_KNOWN_GOOD_COMMIT: `e064454` (2026-08-07 22:56 「추가」)  
LIVE_NAVER_SERP: **UNAVAILABLE** (스크래핑·우회 없음)  
Search Advisor 로그인: 이 환경에서 불가 — 색인 여부는 관리자 수동 확인.

순위 1위를 코드가 보장한다고 쓰지 않는다.

## Champion (추측 아님)

점수 (내부 진단, 네이버 공식 점수 아님):

| URL | Historical (35) | Intent (20) | Inbound (15) | Quality (10) | Entity (10) | Tech (10) | Total |
|-----|-----------------|-------------|--------------|--------------|-------------|-----------|-------|
| `/부산법무사` | 30 (관측 URL null이나 Flagship+보호 레지스트리) | 20 | 15 | 8 | 10 | 10 | **93** |
| `/` | 10 (홈 title은 해운대·센텀 상담) | 8 | 15 | 8 | 10 | 8 | 59 |
| `/부산법무사추천` | 5 | 10 (선택 기준) | 8 | 7 | 6 | 10 | 46 |

**BUSAN_LAW_SCRIVENER_CHAMPION = `/부산법무사`**

관측 파일 `data/seo/ranking-observations.json`: 2026-08-07 「높은 위치 가능」, URL **null**. 2026-08-13 「최근 급락」, URL **null**. 노출 URL을 지어내지 않음. 기존 Flagship을 Champion으로 보호.

## Title / H1 / Canonical vs known-good

`git diff e064454 HEAD -- src/lib/local-landing/flagship-busan-lawyer.ts`

- title `부산 법무사` — **unchanged**
- metaTitle `부산 법무사｜상속·부동산·법인등기에서 먼저 확인할 기준` — **unchanged**
- h1 `부산 법무사, 지금 필요한 절차부터 가려 드립니다` — **unchanged**
- description — **unchanged**
- 변경됨: 주석, lawyerOpinion 확인일, CTA 문장, related 링크 2개 추가, FAQ question 공백

Title 반복 구조(`부산 법무사 안내 | 부산 법무사`) **아님**. 신규 제3 title 실험 금지.

## Git 14일 (요약)

| Commit | 내용 | 「부산 법무사」 위험 |
|--------|------|---------------------|
| e064454 08-07 | baseline | known-good |
| 70f45a2 08-10 | Champion extra modules 등 대량 | **최고** — 이후 Recovery에서 unmerge |
| eba1030 / 0f9e605 | keyword-gap·situation 대량 | 유사 랜딩 증가, URL 유지 freeze |
| a022c81 | SmartPlace CTA | 시각, KEEP |
| ca12fa8 | 공지·local overlay | overlay는 Champion 대체 금지 |
| 이후 cluster 보강 | 상담/전세/회생/공공/강의/법인법무 모듈 | Champion title/H1 불변 전제 |

상세 커밋표: `docs/seo/NAVER_RANKING_DROP_FORENSIC.md`

## YES/NO (코드 재검증)

1. `/부산법무사`가 상속등기 template에 **종속**? **NO (PARTIAL)**  
   Flagship 전용 `buildBusanLawyerFlagshipPage`. 절차 1행은 상속·매매·법인·회생 **상황 확인**. 서류에 상속 가족관계증명서가 **포함**되나 제적등본·상속재산분할협의서만으로 핵심 절차가 채워지지는 않음. PageDataTemplate 셸 사용(공통 절차/서류 UI). CASE B에 가깝다: 구조는 ranking 좋던 시점에도 Flagship. **전면 rewrite 금지.**

2. 검색어 나열 block? **YES (badges)**  
   `primaryKeywords`: 부산 법무사, 부산법무사, … → KeywordBadges. UL variant dump는 아님. e064454에도 존재 → **자동 삭제 금지.**

3. 동일 목차 두 번? **YES → Phase 1 수정**  
   `PageTableOfContents`: hidden TocList + details TocList. 좌측 수집용 복제. `lg:hidden` details는 데스크톱에도 DOM에 남으므로 숨김 복제는 불필요.

4. Homepage responsive duplicate? **YES (REPORT)**  
   `HeroContactBlock` 모바일/데스크톱 각각. 이미지 마퀴도 2세트. Swiper는 loop 복제 없음. **Phase 1에서 UI 병합 안 함.**

5. Primary URL 여러 개? **후보 여러 개, Champion 1개** (`/부산법무사`)

6. 추천/비교/상담이 Champion과 경쟁? **역할 겹침 위험 있음. 삭제 금지.** 추천 Primary는 Flagship. Spoke title/H1 이번 Phase 미변경.

7. exact-match anchor 급증? **REVIEW** — `label: "부산 법무사"` 다수 + `capHubLinks` filler. 대량삭제 금지.

8. 지역 페이지 분산? **REVIEW** — 기존 local URL 유지, 신규 generic local-provider **freeze**.

9. Title/H1/Canonical이 known-good 이후 변경? Champion **NO**.

10. Search Advisor 색인? **UNKNOWN** (로그인 없음)

## Snapshot

- Before: `reports/seo/busan-law-scrivener-before.json` (1655 paths)
- HTML identity: `reports/seo/busan-law-scrivener-html-before/`
- 전체 SSG `out/` HTML 덤프는 이 실행에 없음. Manifest + Flagship source + recovered-html.

## Phase 적용

**Phase 1 (이 작업):** duplicate TOC만. Rollback 파일: `src/components/readability/PageTableOfContents.tsx`

**Phase 2+ (하지 않음):** keyword badge 제거, 본문 rewrite, spoke title, homepage contact merge, 내부링크 대량 삭제.

## 네이버 공식 (2026-08-15 재확인)

- [콘텐츠 작성 권장](https://searchadvisor.naver.com/guide/content-basic): 제목·설명에 무관 인기검색어·같은 단어 반복 삽입 불리. 핵심은 텍스트.
- [스팸](https://searchadvisor.naver.com/guide/content-abusing)
- [사이트 최적화](https://searchadvisor.naver.com/guide/report-seo): 고유한 제목.
- 검색어 density 목표 코드는 freeze에 이미 금지. LEGACY: KeywordBadges·capHubLinks filler → **보고, 자동 삭제 아님.**
