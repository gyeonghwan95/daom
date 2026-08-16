# SEO Change Freeze — 2026-08-13 Recovery

신규 SEO 확장·실험은 **원인 분석·재수집 안정화 전까지 중단**한다.

## Protected Champions (FULLY_PROTECTED)

| Role | URL | Queries |
|------|-----|---------|
| BUSAN_GENERAL_CHAMPION | `/부산법무사` | 부산 법무사, 부산 법무사 추천 |
| BUSAN_CORPORATE_CHAMPION | `/부산법인법무사` | 부산 법인 법무사, 부산 법인 법무사 추천 |

Homepage `/`는 Champion으로의 authority flow를 지원한다. URL 변경 금지.

### High-intent Champions (2026-08-13, UNKNOWN_PERFORMANCE → FULLY_PROTECTED)

| Role | URL | Queries (aliases, 1 URL) |
|------|-----|--------------------------|
| LEGAL_CONSULTATION | `/부산법무사상담` | 부산 법무사 상담, 부산 법률 상담, 부산 법무사 법률 상담 |
| JEONSE_DAMAGE | `/전세사기피해대응절차` | 부산 전세사기, 부산 전세사기 법무사, 부산 전세사기 상담 |
| INSOLVENCY | `/개인회생파산` | 부산회생파산, 부산 회생 파산 |
| PERSONAL_REHABILITATION | `/부산개인회생` | 부산개인회생, 부산 개인회생 |
| PERSONAL_BANKRUPTCY | `/부산개인파산` | 부산 개인파산, 부산 파산 (Hub와 역할 분리) |

Supporting (title/H1 자동변경 금지): `/부산법률상담`, `/부산임차권등기명령`, `/부산전세보증금반환법무사`, `/전세사기예방교육`, `/부산개인회생법무사`.

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
- 승인된 Cluster의 **기존 URL 모듈 보강** (title/H1/canonical 불변, 신규 URL 0)
- 2026-08-13 B2G/공공기관 Cluster: `/공공기관등기업무` Champion STRENGTHEN + 기존 spoke prose. **CREATE_NEW = 0** (기관명 doorway·유형별 thin 랜딩 금지)
- 2026-08-13 Lecture B2B/B2G Cluster: `/법률강의` Hub + `/부산법률강사` Hiring STRENGTHEN. 워크숍/워크샵/세미나 **신규 URL 0**. title/H1 불변.
- 2026-08-15 「부산 법무사」 Recovery Phase 1: duplicate TOC DOM only. Title/H1/canonical/URL **0**. Freeze 14일 유지. CREATE_NEW local-provider **0**.
- 2026-08-16 「부산 법무사」 SERP 재감사: live HTML + known-good diff. **공개 HTML 추가 변경 0**. 역 블록·홈 검색허브·keyword badges·홈 title 모호성은 REPORT ONLY. 신규 지역/랜딩 **0**.

## Baseline

- `SEO_BASELINE_COMMIT`: `e064454` (2026-08-07 22:56 「추가」)
- Known-good snapshot: `reports/seo/known-good-baseline.json`

## 해제 조건

Search Advisor 수집/색인 안정 + 수동 ranking observation 기록 후에만,
Change Log(`docs/seo/SEO_CHANGE_LOG.md`)에 before/after/reason을 남기고 해제한다.
