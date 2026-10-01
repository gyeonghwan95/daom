# 26 · Build validation (2026-10-01, 경북 해안 선박 배치)

| 항목 | 결과 |
|---|---|
| lint (`src/lib/ship-seo/**`) | 0 errors |
| production build + static export | **PASS** (2회차 최종, exit 0 — npm 버전 경고만 stderr) |
| prebuild validators (sitemap·seo-validate·keyword-ownership·region-boilerplate 등) | all checks passed |
| sitemap | 1,668 → 1,672 URL (+4 신규 선박 페이지만) |
| 신규 4개 | HTTP 200 · self canonical · sitemap lastmod 2026-10-01 · title 1 · H1 1 · H1≠title |
| title / description | 사이트 내 중복 0 |
| og:image | 실제 사무소 사진 크롭 4종(1200×630, 1200×900), 파일 존재 |
| alt 없는 이미지 | 0 (공용 헤더 로고 `alt=""` 장식용 1개 — 기존 페이지와 동일) |
| meta keywords / 부산 외 주소 / 허위 schema | 0 / 0 / 0 |
| broken internal links | 0 |
| duplicate DOM id | 0 |
| 모바일 | 300px 폭에서 문서 가로 넘침 없음, 표는 박스 안 가로 스크롤 |

## 기존 URL 보호 (편집 전 스냅샷 대비)

```
protected=1670 new=4 removed=0
sitemap added=/경주선박등기,/영덕선박등기,/울진선박등기,/포항선박등기 removed=0 nonTargetLastmodChanged=0
NON_TARGET_CHANGED_URLS = 0
PASS: protected URLs unchanged.
```

- 수정한 기존 URL은 `/선박등기`(허브) 1개뿐: 지역 목록 4줄 추가, dateModified 2026-10-01.
- 삭제·이름 변경·redirect·noindex·canonical 변경 0.

## 중복도 (선박 페이지 23개, 지역명 정규화 5-gram cosine)

| URL | 최고 유사 페이지 | 정규화 유사도 | first700 최고 | 40자+ 동일 문장 |
|---|---|---|---|---|
| /포항선박등기 | /경주선박등기 | 0.513 | 0.187 | 0 |
| /울진선박등기 | /통영선박등기 | 0.474 | 0.244 | 0 |
| /영덕선박등기 | /통영선박등기 | 0.479 | 0.244 | 0 |
| /경주선박등기 | /포항선박등기 | 0.513 | 0.187 | 0 |

CRITICAL·HIGH·REWRITE_REVIEW(≥0.65) 0건. 1차 빌드에서 영덕·경주 사무소 안내 문장 1개가 지역명만 다른 동일 문장으로 잡혀 3개 페이지 문장을 새로 써서 0건으로 만듦.

본문(공백 제외): 포항 2,291 · 울진 1,960 · 영덕 1,878 · 경주 1,883자.
