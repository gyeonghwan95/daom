# 11 · Build validation (2026-10-01, 후속 점검 후 최종 빌드)

| 항목 | 결과 |
|---|---|
| typecheck (`tsc --noEmit`) | 신규 오류 0 · 기존 오류 1건 유지(`src/data/seoExperiments/reserved-inheritance-intents.ts(42)`, 이번 작업과 무관) |
| lint (`src/lib/metro-remote/**`, `src/data/regionalSeoIntents.ts`) | 0 errors |
| production build + static export | **BUILD PASS** (EXIT=0, 최종 3차 빌드) |
| prebuild validators | sitemap / seo-validate / validate-seo-intent-db / validate-page-data / keyword-ownership / region-boilerplate 모두 OK |
| postbuild seo-dom | all samples OK |
| NEW_ROUTES | **PASS** — 신규 route 0, 대상 2개(대전·대구) 정적 HTML 확인 |
| BROKEN_LINK | **0** |
| CANONICAL_ERRORS | **0** (self canonical) |
| indexable / sitemap | 2/2 index · sitemap 포함 · lastmod 2026-10-01 |
| title / H1 | 각 1개 · description 사이트 내 중복 0 |
| og:image | 고유 실사진 crop 2개, 파일 존재 |
| meta keywords / 비부산 address / 허위 schema | 0 / 0 / 0 |

## 기존 URL 보호 (편집 전 스냅샷 대비)

```
protected=1669 new=0 removed=0
sitemap added=- removed=0 nonTargetLastmodChanged=0
NON_TARGET_CHANGED_URLS = 0
PASS: protected URLs unchanged.
```

- 화성·부천·원주·경산은 보호 대상(protected)으로 비교 → 편집 전 HTML·title·canonical·schema·lastmod와 **동일**(되돌림이 정확함을 확인).
- DELETED / RENAMED / REDIRECTED / NOINDEXED_EXISTING_URLS = 0 / 0 / 0 / 0.
- 작업 전 기준 sitemap lastmod 변경은 대전·대구 2건뿐. (커밋 `50d0315` 기준으로 보면 4곳 lastmod가 원래 값으로 돌아감)

## 중복도 (07-duplicate-check.csv, corpus 641, 지역명 정규화)

| URL | main | first700 | exact40 | 판정 |
|---|---|---|---|---|
| 대전 | 0.515 | 0.168 | 0 | PASS |
| 대구 | 0.385 | 0.111 | 0 | PASS |
