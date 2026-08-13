# Naver Target Recrawl — High-intent cluster (2026-08-13)

IndexNow 전수 제출 금지. Search Advisor에서 **실제 수정된 URL만** 재수집.

## Must recrawl

1. `/부산법무사상담`
2. `/전세사기피해대응절차`
3. `/개인회생파산`
4. `/부산개인회생`

## Optional (내부링크·역할 문구만 조정)

5. `/`
6. `/부산법률상담`
7. `/부산임차권등기명령`
8. `/부산전세보증금반환법무사`
9. `/부산개인파산`
10. `/부산개인회생법무사`

## Do not recrawl

- `/부산법무사`, `/부산법인법무사` (이번 작업에서 Page Identity 미변경)
- 수백 개 지역·keyword-gap URL
- sitemap 전체 lastmod 일괄 갱신 대상

재수집 성공 ≠ 색인 성공. 수집/색인/사이트 진단은 [NAVER_EMERGENCY_CHECKLIST.md](./NAVER_EMERGENCY_CHECKLIST.md)를 따름.
