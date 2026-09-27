# 05 — `/부산상속전문법무사` (PROVIDER SELECTION)

## Root-cause classification (query: 부산 상속전문 법무사)

| Cause | Verdict | Evidence |
|---|---|---|
| NO_DEDICATED_REPRESENTATIVE | NO | Dedicated page exists since 2026-09-26 |
| NOT_INDEXED | LIKELY (unconfirmed) | URL is 1 day old; before build had **no sitemap lastmod** (lastmod source file was in a sub-folder not scanned); only 7 internal linking pages. Cursor cannot log in to Search Advisor — confirm with `18-naver-url-check.md` |
| CRAWLED_NOT_INDEXED | UNKNOWN | Needs Search Advisor URL inspection |
| CANONICAL_CONFLICT | NO | Self canonical, `index, follow`, no X-Robots-Tag |
| INTERNAL_CANNIBALIZATION | LOW | Rep ranks #1 internally; next candidates are other "전문법무사" pages with different topics (소유권이전·부동산등기) |
| LOW_INTERNAL_DISCOVERABILITY | **YES** | 7 linking pages vs 153 (`/부산상속포기`) and 1,656 (`/해운대법무사`). Now +1 from `/부산상속포기`. Further links need approval → `15-recommended-inbound-links.md` |
| CONTENT_SIMILARITY | NO | vs `/부산상속법무사` first700 0.118 / body 0.364; vs `/부산상속포기` 0.081 / 0.263 (after) |
| QUERY_INTENT_MISMATCH | PARTIAL (before) → fixed | Before: H1 lacked the query phrase, 300 chars of consult panel before H1, H2 list mixed procedure sections (준비서류·절차·자주 하는 실수) |
| ENTITY/LOCAL_RELEVANCE_WEAK | PARTIAL | Sitewide access-info conflict and og:image 404 on most pages (global, see 16) |
| OTHER_UNKNOWN | — | Naver ranking signals outside the site cannot be verified |

## Changes
- Title (A): `부산 상속전문 법무사를 찾는다면｜업무범위와 선택 기준`
- H1: `부산에서 상속전문 법무사를 찾을 때 무엇을 확인해야 할까요?`
- First answer states that "상속전문" is not a legal qualification and gives the 3 comparison points (scope, verifiable records, review method).
- H2 (6 + FAQ + CTA): 비교 질문 5가지 / 명의이전만 vs 가정법원 서류까지 / 가족 관계가 복잡할 때 / 맡는 일·맡지 않는 일 / 공개된 처리·상담 기록 / 상담 전 정보.
- Procedure detail (포기·한정승인·등기 서류) removed and linked to owners: `/부산상속법무사`, `/부산상속포기`, `/부산한정승인`, `/미성년상속인`.
- Image/og: real studio portrait of 안윤정 법무사 (`/generated/serp/inheritance/busan-inheritance-specialist.jpg`, 1200×1200) — body and og:image are the same image.

## Experience items

| Item | Status | Source |
|---|---|---|
| 해운대구 아파트 공동상속 등기 (해외 거주 상속인) | VERIFIED_HANDLED | `src/content/cases/haeundae-inheritance-registration-case.mdx` (author 안윤정, 진행 절차 기재) |
| 재송동 채무 상속 상담 | VERIFIED_CONSULTED | `src/content/cases/jaesong-inheritance-renunciation-consultation.mdx` |
| 동래구 재산·채무 동시 상속 상담 | VERIFIED_CONSULTED | `src/content/cases/dongnae-qualified-acceptance-consultation.mdx` |

Classification relies on the office's own published case records; no UNVERIFIED item is published. Please confirm the three records are accurate.

## Forbidden phrases
None of "다옴은 부산 상속전문 법무사입니다 / 공인 상속전문 법무사 / 부산 최고의 상속전문 법무사 / 1위 상속 법무사" appear (QA gate FORBIDDEN_PHRASES_0 = PASS).
