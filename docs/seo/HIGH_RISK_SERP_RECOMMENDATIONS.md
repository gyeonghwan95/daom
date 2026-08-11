# HIGH RISK SERP Recommendations (승인 전 실행 금지)

작성일: 2026-08-11  
정책: LEVEL 3 / protected identity 변경은 자동 적용 금지. 본 문서는 제안만.

---

## 1. OG / 대표이미지 중복 (DUPLICATE_RISK)

| URL | Current | Suggested | Reason | Potential Benefit | SEO Risk | Recommendation |
|-----|---------|-----------|--------|-------------------|----------|----------------|
| 다수 long-tail | `/image/사무소-전경.jpg` 등 공통 OG | 페이지별 고유 썸네일 (approved 후만 바인딩) | inventory: 동일 이미지 수백 페이지 공유 → 네이버 SERP 썸네일 혼동 가능 | SERP 식별성↑ | MEDIUM — protected FULL 페이지는 **바인딩 금지** | IMAGE_BAD/MISSING만 LEVEL 0–1. FULLY_PROTECTED는 NO_CHANGE |
| `/부산법무사` 등 FULL | 기존 service/carousel OG | 교체 제안 금지 | known-ranking 후보 + 기존 이미지 유지 | — | HIGH if changed | **NO_CHANGE** |

## 2. Title / H1 (LEVEL 3 — 보고만)

| URL | Current | Suggested | Reason | Potential Benefit | SEO Risk | Recommendation |
|-----|---------|-----------|--------|-------------------|----------|----------------|
| SEO_PROTECTED 전부 | (동결) | — | 형식 통일·키워드 추가 유혹 | 낮음 / 역효과 | CRITICAL | **KEEP** — 자동수정 금지 |

## 3. Canonical / Merge (LEVEL 3)

| URL | Current | Suggested | Reason | Potential Benefit | SEO Risk | Recommendation |
|-----|---------|-----------|--------|-------------------|----------|----------------|
| 세부 랜딩들 | self-canonical | 허브로 canonical 통합 | 유사 페이지 정리 유혹 | 색인 통합 | CRITICAL | **금지** — DUPLICATE_RISK만 기록 |

## 4. 구조 개선 (LEVEL 1 — 승인 후 additive만)

| URL | Current | Suggested | Reason | Potential Benefit | SEO Risk | Recommendation |
|-----|---------|-----------|--------|-------------------|----------|----------------|
| Hub pages | related 일부 | ItemList + related card 3–5개 additive | SERP/내부 탐색 | 낮음 | LOW | protected에서도 기존 링크 삭제 없이 ADD만 |
| UNKNOWN_PERFORMANCE | — | related/ItemList | 비파괴 신호 | 중간 | LOW | 본문 rewrite 금지 |

## 5. Ranking URL 미확정

`data/seo/ranking-observations.json`의 `url: null` 관측은 추측으로 확정하지 않음.  
후보는 `config/seo-protected-assets.json` → `unconfirmedRankingCandidates`에 등록됨.

사용자 확인 시 `confirmedUrl`만 채울 것.
