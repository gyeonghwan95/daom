# NAVER RANKING DROP FORENSIC

생성: 2026-08-13  
목적: 순위 하락 직후 **신규 SEO 확장 없이** Git diff로 원인을 찾고, Known Good Page Identity를 복구한다.  
네이버 1위 복구를 **보장하지 않는다**.

## SEO_BASELINE_COMMIT

`e064454` — 2026-08-07 22:56 「추가」

이 커밋은 Aug 10 20:43 `70f45a2` 「변경」(+33614/−17962) **직전** 안정 상태다.  
사용자 진술: 2026-08-11 전후 작업 이전에는 아래 query가 최상위권.

## Ranking observations (프로젝트 기록)

`data/seo/ranking-observations.json` (2026-08-07):

- 「부산 법무사」 — 높은 위치 가능, **URL 미확정** (추측 확정 금지)
- 「부산상속법무사」 — 1페이지, URL 미확정

`data/internal/seo-ranking-observations.json` (2026-08-10): 「부산 법무사 추천」「부산 법인 법무사」 등은 poor-or-not-visible, URL 미확정.

내부 Champion 레지스트리(`config/seo-protected-assets.json`, `keyword-to-url-map.md`)로 후보를 정한다. 관측 URL이 null이므로 **추측으로 ranking URL을 확정하지 않고**, 기존 Flagship/Hub를 Champion으로 사용한다.

## Champions

| Cluster | Queries | Champion URL | Role |
|---------|---------|--------------|------|
| A | 부산 법무사, 부산 법무사 추천 | `/부산법무사` | BUSAN_GENERAL_CHAMPION |
| B | 부산 법인 법무사, 부산 법인 법무사 추천 | `/부산법인법무사` | BUSAN_CORPORATE_CHAMPION |

Spoke (삭제 금지): `/부산법무사추천`, `/부산법인등기`, `/부산법인전문법무사` 등.

## A. 최근 72~96시간 커밋 (2026-08-10 ~ 08-13)

| Commit | Time | Subject | SEO relevance | Risk |
|--------|------|---------|---------------|------|
| 70f45a2 | 08-10 20:43 | 변경 | Champion extra modules, station SEO, protected registry, huge landing diff | **90** |
| 1bf4816 | 08-10 21:35 | 수정 | follow-up | 40 |
| 2a8fd83 | 08-10 22:28 | 개선 | follow-up | 40 |
| 92845e3 | 08-10 22:37 | 리 | tiny | 5 |
| 313b7ed | 08-11 20:37 | 관리자 | admin | 0 |
| a022c81 | 08-11 21:35 | 수정내용 반영 | SmartPlace CTA sitewide, footer NAP | **55** |
| 4d79633 | 08-11 21:51 | 어드민 | admin | 0 |
| eba1030 | 08-11 23:29 | 신규추가 | keyword-gap overrides + reports (+120k) | **85** |
| 0f9e605 | 08-12 00:12 | 커밋 | situation/local intent gap (+80k) | **80** |
| 28b3c3e | 08-12 00:24 | 변경 | small delete | 15 |
| ca12fa8 | 08-13 00:59 | 게시 | notices + local overlays + page-relations + footer 공지 (+188k) | **70** |
| bef6182 / 3b8a1b9 | 08-13 01:xx | 커밋/수정 | mail/functions, non-ranking | 5 |

## B. Root Cause TOP 10

| Rank | Change | Affected Query | Affected URL | Evidence | Risk | Action |
|------|--------|----------------|--------------|----------|------|--------|
| 1 | `/부산법무사` extra summary/FAQ/situation-map 병합 | 부산 법무사, 추천 | `/부산법무사` | `busan-lawyer-champion-modules.ts` imported in flagship @70f45a2 | 90 | **REVERT_NOW** |
| 2 | `/부산법인법무사` extra modules 병합 | 법인 법무사, 추천 | `/부산법인법무사` | `keyword-builder.ts` corporate extras @70f45a2 | 90 | **REVERT_NOW** |
| 3 | keyword-gap / situation 대량 유사 랜딩 | general+corporate | many new intents | eba1030, 0f9e605 +119k/+80k | 85 | **REVIEW_ONLY** (URL 유지, 추가 생성 freeze) |
| 4 | Homepage selection-guides exact-anchor → `/부산법무사추천` | 부산 법무사 추천 | `/`, `/부산법무사추천` | `home-sections.ts` | 80 | **ADJUST** |
| 5 | Local overlay(민락·양정·동래)가 종합 업무 나열 | 부산 법무사 | local URLs | `local-champion-overlays.ts` @ca12fa8 | 75 | **ADJUST** (hub link, URL 유지) |
| 6 | page-relations +301 internal graph | all | many | `page-relations.ts` @ca12fa8 | 70 | **KEEP** registry + Champion note |
| 7 | SmartPlace CTA 전면 배치 | all public | many templates | `naver-place-placements.ts` @a022c81 | 40 | **KEEP** (1–2/page rule, visual) |
| 8 | Notice modal + `/공지사항` nav | crawl HTML | layout | ca12fa8 | 25 | **KEEP** (modal ≠ H1, not main copy) |
| 9 | Footer +공지/FAQ | sitewide links | Footer | small | 15 | **KEEP** |
| 10 | Champion title/H1/canonical | — | Champions | diff: **unchanged** vs e064454 | 0 | **KEEP** |

## Page Identity (Champions)

| Field | `/부산법무사` | `/부산법인법무사` |
|-------|---------------|-------------------|
| Title vs baseline | **unchanged** | **unchanged** (source topic) |
| H1 vs baseline | **unchanged** | **unchanged** |
| Description vs baseline | **unchanged** | **unchanged** |
| Canonical | self, HTTPS punycode | self |
| Robots | index,follow | index,follow |
| First 500 chars | extra modules **diluted** → **reverted** | extra modules **diluted** → **reverted** |

OG title/description는 page SEO helper가 title/description과 동일 계열을 사용. Champion metadata mismatch **없음**.

## Cannibalization

- `/부산법무사추천` = SELECTION Spoke. Primary 추천 query는 General Champion.
- `/부산법인등기` = 등기 실무 Hub. `/부산법인법무사` = provider/업무 선택 Champion.
- `/부산법인전문법무사` = 브리지. exact「전문」삽입 금지. URL 유지.
- Local pages must not act as mini `/부산법무사`.

## Internal link / Homepage

- Baseline Champion inbound는 Flagship relatedServiceLinks + hub registry에 존재.
- Aug 10 이후 extra related links·exact 추천 anchor가 **분산**.
- Recovery: home `selection-guides`를 Champion-first로 조정. exact 「부산 법무사 추천」 → Spoke relabel.

## Sitemap / robots / SSR

- robots.ts: Yeti Allow `/`. 신규 Disallow 없음 (`/admin` `/api/` `/search` `/blog/external/`만).
- sitemap lastmod: `scripts/lib/sitemap/lastmod.mjs` — 경로별, 빌드일 일괄 `now` 아님.
- Champion은 SSG `[landingSlug]` — 핵심 title/H1/본문은 초기 HTML.
- Notice modal은 client host. Champion H1을 대체하지 않음.

## Indexable URL 급증

e064454 이후 `seo-paths`/`serp-regression-safety` 스냅샷은 **기존 URL 0 삭제**를 목표로 했고, 08-12 safety 보고는 before=after=1639, added=0.  
다만 eba1030/0f9e605는 **intent override·리포트 대량 추가**로 본문/유사도 위험이 있다. 신규 URL 자동 삭제 없음.

## Naver 공식 가이드 반영

- 고유 title/description, H1 1개, 중복 콘텐츠 주의 ([seo-help](https://searchadvisor.naver.com/guide/seo-help), [markup-content](https://searchadvisor.naver.com/guide/markup-content))
- canonical = 선호 URL, robots index,follow ([markup-structure](https://searchadvisor.naver.com/guide/markup-structure))
- sitemap 제출·도메인 일치 ([request-feed](https://searchadvisor.naver.com/guide/request-feed))
- 표준 `<a href>` ([seo-basic-intro](https://searchadvisor.naver.com/guide/seo-basic-intro) #10)
- 구조화 데이터는 페이지 사실만, 검색 반영 미보장 ([structured-data-intro](https://searchadvisor.naver.com/guide/structured-data-intro))
- title 잦은 변경·키워드 나열 불이익 ([markup-content](https://searchadvisor.naver.com/guide/markup-content))

## 복구 / 유지 / 검토

**REVERT_NOW:** Champion extra module merge.  
**ADJUST:** Homepage 추천 authority, local overlay hub links.  
**KEEP:** Admin, notices, SmartPlace (밀도 규칙), footer 공지, inheritance champion modules, 기존 URL.  
**REVIEW_ONLY:** keyword-gap/situation 대량 페이지 — freeze, 삭제 없음.

## URL inventory

Recovery 전후: **removed = 0, slug changed = 0**.
