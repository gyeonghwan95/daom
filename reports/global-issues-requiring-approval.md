# GLOBAL ISSUES REQUIRING APPROVAL

이 목록은 이번 TARGETED SEO SURGERY에서 **수정하지 않음**.

## GLOBAL_NAP_ISSUE_REQUIRES_APPROVAL

- 공식 SoT: `src/lib/contact.ts` → `010-4277-1279`
- 타 URL/콘텐츠에 제3자 기관 전화(예: 전세피해지원센터 051-888-5101 등)가 안내 목적으로 존재할 수 있음
- 사이트 전역 NAP 통일은 별도 승인 후 진행 권장

## Global template / floating CTA

- 전 페이지 first viewport에 카카오·전화 CTA가 본문보다 앞서 렌더링됨
- 「오늘/내일 9시」 시각 의존 문구로 static body hash가 빌드 시각에 따라 변동
- target first700 품질에 영향 → layout/global CTA 변경은 승인 후

## Thin / bridge cannibalization (미수정 보호)

- `/부산등기전문법무사`, `/부산법인전문법무사`, `/부산상속전문법무사` 등 전문 브리지 URL이 hub와 병존
- 자동 noindex/통합은 이번 범위 밖

## Pre-existing lint debt

- `npm run lint`가 저장소 전역에서 다수 error/warning (이번 변경과 무관한 기존 이슈)
