# 22. 빌드·검증

## 빌드

| 검사 | 결과 |
|---|---|
| `npm run build` (정적 export, seo:validate 포함) | EXIT=0 (2회) |
| `tsc --noEmit` | 기존 오류 1건만(`reserved-inheritance-intents.ts(42)`), 신규 0 |
| eslint (변경 파일) | 오류 0 |
| 내부 링크 검증(`rseo-linkcheck.mjs`) | 대상 페이지 링크 59개 모두 존재하는 경로 |

## 보호 URL diff (`protected-url-diff.csv`)

- 보호 URL 1,651개, 대상 외 HTML 변경 0, 신규 0, 삭제 0.
- 대상 외 lastmod 변경 0. NCR 대상 3개 HTML 동일.
- `NaverRecoveryTargetView`는 export만 추가, 출력 HTML 동일.

## sitemap lastmod

2026-09-27로 바뀐 것은 6개뿐: `/전국상속등기`(이전 2026-08-18), 양산·창원·김해·거제(2026-08-07), 대구(2026-09-22). `/업무사례`는 핀 고정(2026-09-02)이라 변화 없음.

## 기술 SEO (6개, `18-technical-seo.csv`)

title 32–39자 · description 105–119자 · H1 1개 · canonical self · index · sitemap 포함 · og:image ASCII 경로 1200×630 200 응답 · meta keywords 없음 · schema WebPage + BreadcrumbList(+기존 공통 Organization/LegalService) · Review/AggregateRating/LocalBusiness 지점 없음 · H1 앞 텍스트는 eyebrow 11–17자뿐.

## 유사도 (정규화 3-gram Jaccard, 지역명 치환 후)

| URL | 본문 전 → 후 | 첫 700자 후 | 본문 글자 |
|---|---|---|---|
| 양산 | 0.7568 → 0.0815 | ≤0.0453 | 3,141 |
| 창원 | 0.7651 → 0.0652 | ≤0.0453 | 2,995 |
| 김해 | 0.7449 → 0.0825 | ≤0.0453 | 2,910 |
| 대구 | 0.7566 → 0.0815 | ≤0.0453 | 3,068 |
| 거제 | 0.7239 → 0.0825 | ≤0.0453 | 2,816 |
| 전국 허브 | 0.3064 → 0.2785 | — | 7,065 |

대상끼리 최대 0.0825.

## 화면 QA

- 375px(거제): H1이 첫 콘텐츠, 상담 패널이 H1 앞에 없음, 문서 폭 375, 표는 래퍼 안에서만 가로 스크롤.
- 1440px(전국 허브): 지역 섹션 링크 12개 렌더링, 가로 넘침 없음.

## 커밋·배포

미커밋·미배포. 이전 NCR 작업도 함께 미커밋 상태입니다.
