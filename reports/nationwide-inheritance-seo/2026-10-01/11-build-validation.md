# 11 · Build validation (2026-10-01)

| 항목 | 결과 |
|---|---|
| typecheck (`tsc --noEmit`) | 신규 오류 0 · 기존 오류 1건 유지(`src/data/seoExperiments/reserved-inheritance-intents.ts(42)`, 이번 작업과 무관) |
| lint (변경 파일: `src/lib/metro-remote/**`, `src/data/regionalSeoIntents.ts`) | 0 errors |
| production build + static export (`npm run build`) | **BUILD PASS** (EXIT=0, 2회 실행 · 마지막 빌드 기준) |
| prebuild validators | sitemap / seo-validate / validate-seo-intent-db / validate-page-data / keyword-ownership("no PRIMARY query owned by two indexable URLs") / region-boilerplate(hits 0) 모두 OK |
| postbuild seo-dom | all samples OK |
| NEW_ROUTES | **PASS** — 신규 route 0 (기존 6개 URL 재작성), 6개 모두 정적 HTML 생성 확인 |
| BROKEN_LINK | **0** (6개 page 전체 내부 링크) |
| CANONICAL_ERRORS | **0** (6개 모두 self canonical) |
| indexable / robots | 6/6 index |
| sitemap | 6/6 포함 · lastmod 2026-10-01 |
| title / H1 | 각 1개 · description 사이트 내 중복 0 |
| og:image | 6개 고유 실사진 crop, 파일 존재 |
| meta keywords | 0 |
| schema | 부산 해운대구 실제 주소만(비부산 address 0) · Review/AggregateRating/Award/Event 0 |
| 중복 ID / alt 누락 이미지 | 0 / 0 |

## 기존 URL 보호

`scripts/ncr-snapshot.mjs` before(편집 전) → after(최종 빌드) 비교, 1,671 URL 대상.

```
protected=1665 new=0 removed=0
sitemap added=- removed=0 nonTargetLastmodChanged=0
NON_TARGET_CHANGED_URLS = 0
PASS: protected URLs unchanged.
```

| 항목 | 값 |
|---|---|
| DELETED_EXISTING_URLS | 0 |
| RENAMED_EXISTING_URLS | 0 (`git diff --diff-filter=DR` 빈 결과) |
| REDIRECTED_EXISTING_URLS | 0 |
| NOINDEXED_EXISTING_URLS | 0 |
| 비대상 page 본문·title·canonical 변경 | 0 |
| sitemap lastmod 변경 | 6건 = 대상 6개 URL만 (tier-3 3건, tier-5 3건) |

상세 diff: `12-protected-url-diff.csv`, 기술 점검 원표: `11b-technical-seo.csv`.

## 중복도 (07-duplicate-check.csv, corpus 641 page, 지역명 정규화)

| URL | main | first700 | exact40 | 판정 |
|---|---|---|---|---|
| 대전 | 0.515 | 0.217 | 0 | PASS |
| 대구 | 0.387 | 0.111 | 0 | PASS |
| 화성 | 0.353 | 0.104 | 0 | PASS |
| 부천 | 0.353 | 0.104 | 0 | PASS |
| 원주 | 0.298 | 0.106 | 0 | PASS |
| 경산 | 0.514 | 0.217 | 0 | PASS |

1차 빌드에서 대전↔경산 0.550(경계값)이 나와 경산의 채권 비율 표를 계산 예시로 바꾸고 재빌드함.
