# NAVER TOP5 SEO MASTER — Final Report

**Site:** 다옴법무사사무소.kr  
**Generated:** 2026-09-03  
**FINAL STATUS:** `SEO_RELEASE_READY_WITH_WARNINGS`  
(= 검증 가능한 내부 장애요소 축소. **네이버 TOP5 보장 아님**)

---

## 1. Evidence freeze

| Artifact | Path |
|----------|------|
| routes | `seo/master/before/routes.csv` |
| metadata | `seo/master/before/metadata.csv` |
| headings | `seo/master/before/headings.csv` |
| internal-links | `seo/master/before/internal-links.csv` |
| indexability | `seo/master/before/indexability.csv` |
| content-fingerprint | `seo/master/before/content-fingerprint.csv` |
| schema | `seo/master/before/schema.csv` |

- **Pages:** 1803 (indexable 1632)
- **Keyword universe:** 1333 (seed 106)

---

## 2. TOP5 observation (Agent 1)

| Metric | Count |
|--------|------:|
| Keywords surveyed | 106 |
| TOP5_CONFIRMED | 0 |
| NOT_TOP5_CONFIRMED | 0 |
| SERP_UNVERIFIED | 106 |
| Search Advisor WINNER | 0 (export 없음) |

Observation: `seo/master/naver-top5-observation.csv`  
Manual input: `seo/manual-rank-input.csv`  
Tracker: `seo/master/naver-ranking-tracker.csv`

---

## 3. Owner mapping (Agent 2)

| Metric | BEFORE | AFTER |
|--------|--------|-------|
| Unresolved owners | 8 | **0** |
| Cannibalization rows | 6 | 6 (분석만, 301/noindex 미적용) |

`seo/master/keyword-owner-map.json`, `seo/master/cannibalization.csv`

---

## 4. Content quality (Agent 3)

| Signal | BEFORE | AFTER |
|--------|--------|-------|
| quality-flags (rendered body) | 15 | **3** |
| 「검색어 연결」 bridge pages | 12+ | **0** (본문) |
| 「로 검색한 경우」 (owner) | 1 | **0** |

Remaining 3 flags: blog template `부산 부산`, 업무사례 1건 — generator 후속.

`seo/master/content-similarity.csv`, `seo/master/korean-quality.csv`

---

## 5. Internal intent QA

| Metric | BEFORE | AFTER |
|--------|--------|-------|
| Pass (rank1 = owner) | 345 | **355** |
| Fail | 185 | **175** |

**Fixed this cycle:** `부산 법무사 상속` → `/부산상속법무사`, `부산 특별한정승인 법무사` → `/특별한정승인`

`seo/master/internal-intent-top5.csv`

---

## 6. Technical / regression (Agent 5)

| Check | Result |
|-------|--------|
| owner 404 | 0 |
| unresolved owner | 0 |
| tsc --noEmit | PASS (inflow-policy TS2367 수정) |
| KV on public HTML | 분리 유지 (static export) |
| Protected fingerprint | `seo/master/regression.csv` |

check-keyword-ownership: 4 pre-existing specialist title conflicts (등기전문·매매등기·부동산등기) — noindex bridge 설계, RED 변경 아님.

---

## 7. Actual code changes (this cycle)

1. `/부산상속법무사` — 「부산 법무사 상속」 hub 문맥
2. `/특별한정승인` — 부산 특별한정승인 법무사 relevance
3. `/부산법인법무사` — meta-SEO 문장 제거
4. `/상속` pillar — commercial owner 위임
5. Specialist noindex bridges — 「검색어 연결」 제거
6. `seo/keyword-map.json` — 8 owner + alias 추가
7. `scripts/naver-top5-seo-audit.ts` — owner fix, manual-rank-input, release gate

**Not changed (P0):** HOME title/H1, 상속·등기·법인 champion title/H1/canonical

---

## 8. Build / deploy

- Full `npm run build`: **not run** (prebuild chain heavy). `tsc --noEmit` PASS.
- Deploy 전: `npm run build` + production `/robots.txt`, `/sitemap.xml` spot-check 권장.

---

## 9. Post-deploy

1. Search Advisor → `naver-ranking-tracker.csv` baseline
2. `docs/NAVER_TOP5_MANUAL_CHECK.md` — PC/모바일 TOP5 입력
3. `seo/manual-rank-input.csv` 채운 뒤 audit 재실행

---

## 10. User summary tables

### Core keywords

| KEYWORD | STATUS | OWNER | ACTION | QA |
|---------|--------|-------|--------|-----|
| 부산 법무사 | SERP_UNVERIFIED | `/` | freeze | internal #1 |
| 부산 상속 법무사 | SERP_UNVERIFIED | `/부산상속법무사` | freeze | internal #1 |
| 부산 법무사 상속 | SERP_UNVERIFIED | `/부산상속법무사` | **fixed** | internal #1 |
| 부산 등기 법무사 | SERP_UNVERIFIED | `/부산등기법무사` | freeze | internal #1 |
| 연제구 법무사 | SERP_UNVERIFIED | `/연제구법무사` | freeze | internal #1 |
| 센텀 법무사 | SERP_UNVERIFIED | `/센텀법무사` | freeze | internal #1 |

### 가장 부족했던 10 (internal P1)

부산 법무사 수수료 · 부산 등기전문 · 부산 부동산등기 · 부산 매매등기 · 근저당설정/말소 · 해운대구 · 북구/만덕 · 목적/증자/해산등기 · 회생파산 허브 · 센텀시티

### 가장 강했던 10 (internal #1)

부산 법무사 · 부산 상속 법무사 · 부산 상속등기 · 부산 상속포기 · 부산 한정승인 · 부산 법인등기 · 부산 개인회생/파산 · 연제구 · 센텀 · 해운대

### 실제 수정 핵심 10

부산상속법무사 hub · 특별한정승인 · 부산법인법무사 body · 상속 pillar · specialist bridges ×6 · keyword-map · audit script · inflow-policy TS · manual-rank docs

### 수정하지 않은 고위험

P0 title/H1 · URL/slug · 301/noindex · canonical merge · 지역 페이지 대량 rewrite

### 네이버에서 재확인할 query

부산 법무사 · 부산 상속 법무사 · 부산 등기 법무사 · 부산 부동산등기 · 부산 법인등기 · 부산 개인회생 · 해운대구 법무사 · 연제구 법무사 · 센텀 법무사

---

**Principle:** 혼란 제거 > 키워드 반복. 대표 URL 명확화 > 새 페이지. 잘 되는 페이지는 freeze.
