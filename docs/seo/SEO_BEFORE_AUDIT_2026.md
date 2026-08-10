# SEO Before Audit Freeze — 2026-08-10

**목적:** 부산 우선 Query 6종 작업 전 URL·메타 상태를 동결한다.  
**스냅샷:** [`generated/seo-before-routes.json`](../../generated/seo-before-routes.json)

## 동결 요약

| 항목 | 값 |
|------|-----|
| frozenAt | 2026-08-10 |
| publishedPaths | **1785** |
| focusRelatedPaths (법인·상속·법무사·추천·전문 등) | **1154** |
| 기존 URL 삭제 허용 | **0** |
| slug/canonical/redirect 변경 | **금지** |

## Champion 후보 (작업 전)

| Intent 묶음 | 후보 URL |
|-------------|----------|
| 법인 업무 | `/부산법인법무사`, `/부산법인등기`, `/부산법인전문법무사`, `/부산법인등기전문`, `/부산기업법무사`, `/법인변경등기` |
| 상속포기 | `/부산상속포기`, `/부산상속법무사`, `/부산한정승인` |
| 상속 추천 | `/부산상속법무사`, `/부산상속법무사추천`, `/부산상속전문법무사` |
| 부산 법무사 추천 | `/부산법무사`, `/부산법무사추천`, `/` |

## 보호 원칙 (작업 중)

- title / H1 / description 대량 수정 금지 (성과 가능 자산)
- 공개 페이지에 「전문 법무사」「법인전문 법무사」 **신규 삽입** 금지
- 신규 URL은 독립 Intent + 판정식 7개 이상일 때만
- SAFE = 모듈 추가·내부링크·작성자 확인일·감사 스크립트

## 세부 페이지 메타

개별 title/H1/description/H2/FAQ/링크는 audit 스크립트 산출물
`reports/seo/priority-query-audit.json` 및 기존
`scripts/output/seo-landing-manifest.json` · `page-manifest.json` 을 참조한다.

작업 후 `generated/seo-after-routes.json` 과 diff하여 **URL 삭제 = 0** 을 확인한다.
