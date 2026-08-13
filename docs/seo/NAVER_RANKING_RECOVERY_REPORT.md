# NAVER RANKING RECOVERY REPORT

날짜: 2026-08-13  
Baseline: `e064454`  
Freeze: `docs/seo/SEO_CHANGE_FREEZE.md`

네이버 검색 순위는 엔진이 결정한다. 이 보고서는 **기술적·콘텐츠 복구**만 주장한다.

## A. 최근 72시간 변경사항

Aug 10 `70f45a2` Champion 모듈 + station SEO → Aug 11 SmartPlace CTA → Aug 11–12 keyword/situation 대량 보강 → Aug 13 notices + local overlays.  
상세 커밋표: `docs/seo/NAVER_RANKING_DROP_FORENSIC.md`.

## B. 순위하락 위험 TOP 10

Forensic 문서 B절. 최상위: Champion extra-module 병합(90), 대량 유사 랜딩(85), 홈 추천 exact-anchor 분산(80).

## C. General Champion

- URL: `/부산법무사` (BUSAN_GENERAL_CHAMPION)
- Title/H1/description/canonical: baseline과 **동일** (변경하지 않음)
- 복구: Aug 10 extra summary·FAQ·situation-map **언머지**
- 「부산 법무사 추천」 Primary = 이 페이지. `/부산법무사추천`은 Spoke.

## D. Corporate Champion

- URL: `/부산법인법무사` (BUSAN_CORPORATE_CHAMPION)
- Title/H1/description: keyword-topic 원문 유지
- 복구: corporate extra modules **언머지**
- 세부: `/부산법인설립등기` `/부산임원변경등기` `/부산본점이전등기` `/부산사업목적변경등기` `/부산유상증자등기` `/부산법인해산청산등기` — long-tail only.

## E. Cannibalization

| Query | Primary | Competing | Action |
|-------|---------|-----------|--------|
| 부산 법무사 | `/부산법무사` | 지역 허브, `/부산법무사무소` | Local → Champion link |
| 부산 법무사 추천 | `/부산법무사` | `/부산법무사추천` | Spoke relabel, no delete |
| 부산 법인 법무사 | `/부산법인법무사` | `/부산법인등기`, `/부산법인전문법무사` | Hub vs detail split |
| 부산 법인 법무사 추천 | `/부산법인법무사` | 동일 + 추천 Spoke | Champion |

## F. Title / H1 / Canonical Diff

모두 **unchanged** vs `e064454`. REVERT title/H1 불필요.

## G. Internal Link Diff

- Extra Champion related links 제거 (모듈 언머지)
- Home selection-guides: Champion-first
- Local overlay: additive Champion hub links
- Footer: 공지/FAQ만 추가 (KEEP)

## H. 신규 페이지 영향

eba1030 / 0f9e605 intent 보강은 URL 삭제 없이 **FREEZE**. TEMPLATE_CONTENT_RISK 후보는 `reports/seo/new-content-similarity.json`, `situation-content-similarity.json` 기존 감사 참고.

## I. Crawl / Index Technical

- robots: Yeti allow, Champion index,follow
- sitemap: Champion 포함, lastmod 일괄 now 아님
- SSR/SSG: landing HTML에 title/H1/본문
- Cloudflare Functions: admin/inquiry only — public HTML 분기 없음

## J. 실제 복구사항

1. Flagship extra modules off  
2. Corporate extra modules off  
3. Home authority to Champions  
4. Local overlay hub links  
5. Protected registry roles + 추천 queries  
6. Freeze / change log / regression guard / snapshots  

## K. 유지한 변경사항

Admin 관제, 공지 모달·`/공지사항`, SmartPlace CTA(페이지당 1–2), 메일 HTML, 입찰 브리핑, inheritance champion modules, 기존 전 URL.

## L. 검토만 한 사항

keyword-gap/situation 대량 페이지 본문 슬림화, `/부산법무사추천` title 변경(HIGH RISK — 안 함), schema keyword dump(없음), NAP(중앙 config 유지).

## M. 재수집 URL

`/`, `/부산법무사`, `/부산법인법무사` (+ 선택: `/민락동법무사` `/양정동법무사` `/동래구법무사`)  
Search Advisor 체크리스트: `docs/seo/NAVER_EMERGENCY_CHECKLIST.md`

## N. SEO Freeze 대상

두 Champion + Homepage authority + 신규 랜딩 생성 전면.  
`docs/seo/SEO_CHANGE_FREEZE.md`

## Recovery score (internal, not Naver)

| Axis | /20 or /15 or /10 | Note |
|------|-------------------|------|
| Technical Health | 18/20 | robots/sitemap/SSR OK |
| Page Identity Stability | 18/20 | title/H1 kept, first-500 reverted |
| Cannibalization Control | 16/20 | Spoke remain; home/local adjusted |
| Internal Authority | 13/15 | Champion-first home |
| Content Uniqueness | 11/15 | mass pages frozen, not rewritten |
| Crawlability | 9/10 | Yeti allow |
| **Total** | **85/100** | |

## Q1–Q20

| Q | A |
|---|---|
| 1 General Champion? | `/부산법무사` (내부 레지스트리·Flagship). 관측 URL은 null. |
| 2 추천도 같은 Champion? | **예.** `/부산법무사추천`은 Spoke. |
| 3 Corporate Champion? | `/부산법인법무사` |
| 4 법인 추천 별도 경쟁? | Spoke·등기 Hub와 경쟁 가능했음 → Champion 1개 원칙으로 정리. 삭제 없음. |
| 5 Page Identity 흔들림? | Title/H1/canonical 아님. **첫 문단·FAQ·절차 모듈**이 흔들림. |
| 6 Title 변경? | **아니오** (baseline=current) |
| 7 H1 변경? | **아니오** |
| 8 첫 문단 변경? | **예** (extra paragraphs) → **복구** |
| 9 Canonical 변경? | **아니오** |
| 10 Inbound 감소? | 모듈 extra outlinks·홈 exact-anchor로 **분산**. Champion inbound 삭제는 없음. |
| 11 Exact anchor 급증? | 홈 `부산 법무사 추천` → `/부산법무사추천` **ADJUST** |
| 12 Local vs General? | 민락·양정·동래 overlay가 종합 나열 → hub link **ADJUST** |
| 13 Corporate detail vs Champion? | `/부산법인등기` 등과 역할 분리. extra keyword dump **REVERT** |
| 14 Indexable 급증? | 08-12 safety: URL count 1639=1639. Intent 본문 보강은 급증. |
| 15 Duplicate title/desc? | 기존 감사 경고 1건 FAQ. Champion unique 유지. |
| 16 Sitemap 변함? | Champion 누락 없음. lastmod 폭주 정책 아님. |
| 17 robots/noindex? | **없음** (Champion) |
| 18 SSR 본문? | SSG landing HTML에 핵심 유지 |
| 19 URL 보존? | **removed=0, changed=0** |
| 20 Known Good 회복 + 신규 실험 없음? | **예** (모듈 언머지 + freeze) |
