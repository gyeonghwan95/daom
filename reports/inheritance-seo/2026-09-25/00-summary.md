# Inheritance SEO Surgery — 2026-09-25

## 관측 시점
- **checkedAt:** 2026-09-25 23:50–00:00 KST
- **엔진:** Naver 웹검색 (`where=web`)

## 핵심 결론
| 쿼리 | Daom 노출 URL | 문제 | 조치 |
|------|---------------|------|------|
| 부산 상속 법무사 | `/부산상속법무사` | 유기적 노출 있음. 변호사·로펌 WEB_SITE 혼재 | 허브 answer-first·타이틀 정교화 |
| 부산 상속포기 법무사 | **`/부산상속법무사` (허브)** | 포기 전용 URL 미노출 — **classic cannibalization** | `/부산상속포기` 신원·첫 화면·FAQ 분리 |
| 부산 상속전문 법무사 | 상단 불명확 | 변호사/로펌 지배. intent=절차·깊이 | 허브 FAQ로 전문자격 오해 해소; `/부산상속전문법무사` 유지(noindex) |

## 타깃 URL (변경 없음)
- **GROUP A:** `부산 상속 법무사` + `부산 상속전문 법무사` → `/부산상속법무사`
- **GROUP B:** `부산 상속포기 법무사` → `/부산상속포기`
- **CANNIBALIZATION_CANDIDATE:** `/부산상속전문법무사` — **삭제·리다이렉트 금지** (noindex/canonical hub)

## 코드 반영 (src — 본 리포트는 기록만)
- `keyword-topics.ts`, `inheritance-champion-modules.ts`, `keyword-builder.ts`, `builders.ts`
- `renunciation-hub-identity.ts`, `renunciation-champion-modules.ts`, `inheritance-renunciation-busan.ts`

## 산출물
- SERP: `reports/inheritance-serp/serp-busan-*.csv`
- 수술 패키지: 본 디렉터리 `00–19` (14번 스크립트 diff는 build 후)
- 타이틀 근거: `reports/title-change-reason.md`
- 수동 SERP: `reports/inheritance-seo/LIVE_SERP_REVIEW_REQUIRED.md`

## 다음 단계
1. `npm run build` → `19-build-validation.md` 갱신
2. `16-indexnow-targets.txt` (2 URL) 제출
3. Naver URL 제출 (`17-naver-submit-checklist.md`)
4. 2–4주 후 동일 3쿼리 재관측
