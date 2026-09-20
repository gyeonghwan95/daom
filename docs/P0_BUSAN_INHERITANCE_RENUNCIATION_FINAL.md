# P0 부산 상속포기 법무사 — 최종

**FINAL STATUS:** `SEO_RELEASE_READY_WITH_WARNINGS`  
네이버 TOP5 보장 아님. Search Advisor 데이터 없음 → `PERFORMANCE_UNKNOWN`.

## Owners

| Query | Owner |
|-------|-------|
| 부산 상속포기 법무사 / 부산 상속포기 | `/부산상속포기` |
| 부산 상속 법무사 / 부산상속전문법무사 | `/부산상속법무사` |
| 부산법무사 | `/` |

Title/H1 of P0: **frozen**.

## 원인 TOP 10 (코드 기준)

1. 자녀 전원 포기 → 부모·형제 일반화 (2020그42 미반영)
2. `/부산상속포기`에 상속등기 비용 블록(취득세·국민주택채권)
3. 핵심 절차가 타임라인+단계로 중복
4. intro/자세히 알아보기 문장 재사용
5. P1 `primaryKeywords`에 `부산 상속포기` 포함 → 충돌 후보
6. `/상속포기비용`이 parent owner를 약하게 안내
7. 전국 배너가 로컬 오너 상단에 강함 (이미 defer + chip 숨김 유지)
8. P0 고유 판단표 부족
9. 내부 QA에서 2위 후보가 pillar/비용 페이지
10. 네이버 수집 여부는 미확인 (STALE_CRAWL 가능)

## 법률 수정

- 배우자+자녀 공동상속 + 자녀 전원 포기 → **배우자 단독상속** 가능 (대법원 2023. 3. 23.자 2020그42)
- 「무조건 부모·형제·손자녀」 단정 삭제
- 처분행위·3개월 경과를 「무조건 불가」로 쓰지 않음

## NAP

- 공개 소스: `src/lib/contact.ts` → `010-4277-1279`
- 소스 트리에 `070-4172-8056` 없음. 구 캐시 HTML에 남아 있으면 Search Advisor에서 확인.

## 변경하지 않은 RED

URL/slug/301/noindex/canonical, P0 title/H1, HOME title/H1, 신규 doorway 페이지 없음.

## 배포 후

`docs/NAVER_P0_URL_CHECK.md`
