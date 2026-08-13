# SEO Change Freeze — 2026-08-13 Recovery

신규 SEO 확장·실험은 **원인 분석·재수집 안정화 전까지 중단**한다.

## Protected Champions (FULLY_PROTECTED)

| Role | URL | Queries |
|------|-----|---------|
| BUSAN_GENERAL_CHAMPION | `/부산법무사` | 부산 법무사, 부산 법무사 추천 |
| BUSAN_CORPORATE_CHAMPION | `/부산법인법무사` | 부산 법인 법무사, 부산 법인 법무사 추천 |

Homepage `/`는 Champion으로의 authority flow를 지원한다. URL 변경 금지.

## Freeze rules

금지 (자동·수동 모두):

- 신규 지역/키워드 랜딩 대량 생성
- Champion title / H1 / canonical / robots 변경
- URL·slug 변경, redirect, noindex, 페이지 병합·삭제
- global internal link / footer keyword dump
- FAQ·지역명·aliases 본문 대량 삽입
- keyword density 목표 (`부산 법무사 N회`)
- 「전문 법무사」「최고」「1위」 공개 삽입
- IndexNow 전수 제출

허용:

- 버그·보안·관리자 UI (공개 HTML 의미 불변)
- Champion 재수집 요청 (변경된 URL만)
- 문서·가드·스냅샷

## Baseline

- `SEO_BASELINE_COMMIT`: `e064454` (2026-08-07 22:56 「추가」)
- Known-good snapshot: `reports/seo/known-good-baseline.json`

## 해제 조건

Search Advisor 수집/색인 안정 + 수동 ranking observation 기록 후에만,
Change Log(`docs/seo/SEO_CHANGE_LOG.md`)에 before/after/reason을 남기고 해제한다.
