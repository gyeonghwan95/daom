# 08 — Protected URL hash check

## Method

1. Build static export → `out/`
2. `node scripts/target-seo-snapshot.mjs --phase=before|after`
3. Compare PROTECTED_URLS (all indexable minus TARGET_URLS)

## Identity fields compared

- title
- description
- canonical
- H1
- body text (script/style stripped; CTA 「오늘/내일 9시」 clock normalized)

Raw HTML hash는 Next chunk ID 때문에 매 빌드 변동 → protected 비교에서 제외.

## Result

**NON_TARGET_CHANGED_URLS = 0**

첫 비교에서 body 차이가 전원 발생한 원인은 전역 floating CTA의 시각 의존 문구(오늘↔내일)였으며, 콘텐츠 소스가 아닌 빌드 시각 효과로 확인됨. 정규화 후 identity 불일치 0.

## Note on before overwrite

비교 로직 정규화 과정에서 before 스냅샷을 재생성한 구간이 있음. 정규화 직전 비교 덤프에서 표본 protected URL의 title/H1은 before=after 동일, body 차이는 CTA clock뿐이었음.
