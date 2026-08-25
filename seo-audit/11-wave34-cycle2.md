# 11 — WAVE3·4 Follow-up Cycle (2026-08-25)

1차 사이클(WAVE1·2) 재검증 이후 후속 사이클. **URL 변경·삭제·NEW-D doorway = 0.**

## Scope

| Wave | Focus | Done |
|---|---|---|
| WAVE3 | thin/district 유사도 감사, KeywordBadges 억제, exact 「부산 법무사」 meta 도배 제거 | Yes |
| WAVE4 | SEO landing 템플릿 intro/FAQ/parent 링크 변주, `/부산상속법무사` FAQ 심화 | Yes |
| Off-page | 외부 계정 수정 | No — `09-offpage-actions.md` 수동 체크리스트만 |
| NEW-D | `/부산상속전문법무사추천` 등 doorway | **CREATE_NEW = 0** |

## WAVE3 changes

1. **`PageDataTemplate`**: `local|cost|court|businessDistrict|realEstate|situation|diagnosis|tool|glossary` — hero KeywordBadges 숨김 (meta keywords 유지)
2. **`SelectionHubPageView`**: 전 selection 허브 chip 제거
3. **`SearchIntentPageView`**: 기본 chip 억제 (`suppressKeywordChips === false`만 표시)
4. **`SituationPageView` / `DiagnosisPageView`**: chip 제거
5. **`seo-landing/page-data.ts`**: thin 랜딩 `primaryKeywords`에서 exact 「부산 법무사」/「부산법무사」 제거 → HOME ownership 보호
6. **유사도 감사**: `scripts/audit-seo-landing-similarity.ts` → `seo-audit/wave34-*.json|csv`  
   - sample 67 pages, residual HIGH pairs flagged as REBUILD-C (지역명 strip 후 동일 업무 템플릿 잔여)
7. **local-similarity**: path 중복 버그 수정 → highRisk **0**

## WAVE4 changes

1. **`seo-landing/content.ts`**: intro/FAQ/상담예시/절차 변주 확대, parent hub 문맥 링크, 「자주 놓치는 점」 고유 각도 섹션
2. **`keyword-topics.ts` `/부산상속법무사`**: 상속전문 검색 intent FAQ 3건 추가 (자격 표방 없음)
3. Parent links: district → `/부산법무사` + `/` + 상담; service → 등기/상속 허브

## URL preservation

| Metric | Result |
|---|---|
| `seo:regression` | **PASS** (1639/1639, 0 removed/changed) |
| CREATE_NEW | **0** |
| Unexpected redirect | **0** |

## Residual risk (honest)

동일 업무×다른 구·동 페이지는 지역명 제거 후 본문 Jaccard가 여전히 높을 수 있다 (`wave34-seo-landing-similarity.json`).  
이번 사이클은 **템플릿 변주·chip/exact-keyword 도배 제거·허브 링크**로 완화했고, 페이지별 수기 장문 rewrite는 추가 배치로 남긴다.

## Artifacts

- `seo-audit/11-wave34-cycle2.md` (this file)
- `seo-audit/wave34-seo-landing-similarity.json`
- `seo-audit/wave34-rebuild-c-sample.csv`
- Updated: `duplicate-content.csv`, `07-content-gaps.md`, `protect-pages` notes
- Cycle 3: `12-cycle3-followup.md`, `reports/seo/index-submit-master-rebuild-2026-08-26.txt`
