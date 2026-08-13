# Busan High-Intent Query Map

생성일: 2026-08-13  
신규 URL: **0**  
기존 General/Corporate Champion title·H1·canonical: **변경 없음**  
DataLab: **TREND_DATA_UNAVAILABLE** (가짜 검색량 없음)

기계 가독 원본: `src/data/seo/high-intent-query-map.ts`  
캐니벌 감사: `npx --yes tsx scripts/audit-target-query-cannibalization.ts`

네이버 Search Advisor 기준(확인일 2026-08-13):

- [SEO 기본 가이드](https://searchadvisor.naver.com/guide/seo-help) — 고유 title·H1 1개, 고유 description
- [콘텐츠 작성 권장사항](https://searchadvisor.naver.com/guide/content-basic) — 텍스트 본문, 과장 금지, keyword 반복 금지
- [콘텐츠 마크업](https://searchadvisor.naver.com/guide/markup-content) — 주제와 맞는 title/description/og:image

## Champions (Cluster당 1)

| Cluster | Role | Primary URL | Intent |
|---------|------|-------------|--------|
| A 법률상담 | BUSAN_LEGAL_CONSULTATION_CHAMPION | `/부산법무사상담` | 법무사 업무 범위 내 상담·준비 |
| B 전세사기 | BUSAN_JEONSE_DAMAGE_CHAMPION | `/전세사기피해대응절차` | 피해 상황 Navigator |
| C 회생파산 | BUSAN_INSOLVENCY_CHAMPION | `/개인회생파산` | 회생 vs 파산 선택 |
| D 개인회생 | BUSAN_PERSONAL_REHABILITATION_CHAMPION | `/부산개인회생` | 개인회생 신청·서류·상황 |
| (지원) 개인파산 | BUSAN_PERSONAL_BANKRUPTCY_CHAMPION | `/부산개인파산` | 파산·면책 (허브와 경쟁 금지) |

보호 유지: `/부산법무사` (부산 법무사·추천), `/부산법인법무사` (법인).

역할 경계:

- `/부산법무사` = 사무소 + 업무 전체
- `/부산법무사상담` = 문제 선택 + 상담 범위 + 준비
- `/부산법률상담` = 공공 상담 vs 법무사 업무 구분 (Supporting)
- `/전세사기예방교육` = 계약 전 교육 (Damage Champion과 분리)
- `/부산임차권등기명령` = 임차권등기 절차
- `/부산전세보증금반환법무사` = 보증금 반환 절차
- `/개인회생파산` = 비교 Hub
- `/부산개인회생법무사` = 신청 가능성 (Detail)

## 필수 Query 표

| Query | Search Intent | Primary Champion | Supporting | Coverage | Changes | Cannibalization | Status |
|-------|---------------|------------------|------------|----------|---------|-----------------|--------|
| 부산 법무사 법률 상담 | 법무사 업무 상담 | `/부산법무사상담` | `/부산법률상담`, `/상담` | strong | ADD_MODULE (문제 선택기·업무범위) | watch vs `/부산법률상담` | STRENGTHENED |
| 부산 법률 상담 | 문의처 구분 | `/부산법무사상담` | `/부산법률상담` | partial | INTERNAL_LINK, keywords 분리 | watch | ADJUSTED |
| 부산 전세사기 법무사 | 피해 대응+법무사 범위 | `/전세사기피해대응절차` | 임차권·반환 | partial | Decision tree | watch vs 예방교육 | STRENGTHENED |
| 부산 전세사기 상담 법무사 | 피해 상담 | `/전세사기피해대응절차` | `/부산법무사상담` | partial | ADD_MODULE | low | STRENGTHENED |
| 부산 전세사기 | Broad 피해 Navigator | `/전세사기피해대응절차` | 반환·임차권·민사 | partial | 상황 트리·체크·타임라인 | watch | STRENGTHENED |
| 부산회생파산 | 회생 vs 파산 | `/개인회생파산` | `/부산개인회생`, `/부산개인파산` | partial | 비교·상황 선택 | watch | STRENGTHENED |
| 부산개인회생 | 신청·서류·상황 | `/부산개인회생` | 법무사·서류·비용 | strong | H2 모듈 (서류·비용·배우자·투자·압류) | watch vs `/부산개인회생법무사` | STRENGTHENED |

## 추가 발견 Query TOP 30

검색량 숫자는 표시하지 않음. 목록은 `HIGH_INTENT_DISCOVERY_TOP30`.

원칙: 전부 신규 페이지로 만들지 않음. Champion H2/FAQ 또는 기존 Detail URL.

## General Champion 충돌 검사

이번 Cluster 최적화가 `/부산법무사` `/부산법인법무사`의 title/H1/canonical/core를 변경하지 않음.  
상담 Champion은 문제 선택 UI만 추가하고, 사무소 종합 소개를 복제하지 않음.
