# METRO REMOTE SEO — 2026-09-30

## 결론
- 서울·용인 대표 URL 2개만 전면 개선, 신규 URL 0개. 이미 네이버 노출 중인 9개(경기·수원·성남·고양·대전·세종·청주·천안·아산)는 PROTECT_WINNER로 그대로 둠.
- NON_TARGET_CHANGED_URLS = 0 (보호 1663개).

## 기존 구조
- 수도권·충청 지역 상속등기 페이지는 거의 모든 시와 서울 23개 구에 존재. 같은 H2 순서를 쓰는 복제형: CRITICAL 46, HIGH 14, REWRITE 9, REVIEW 1.
- 전국·원격 허브(/전국상속등기 등)는 KEEP.

## PHASE 1 결과
| URL | 유사도(정규화) | 첫 700자 | 정확 문장 | 글자수(공백 제외) |
|---|---|---|---|---|
| /업무사례/서울상속등기법무사 | 0.505 | 0.242 | 0 | 3284 |
| /업무사례/용인상속등기법무사 | 0.376 | 0.159 | 0 | 2657 |

기준: 정규화 < 0.55, 첫 700자 < 0.40, 15자 이상 정확 문장 0 → 모두 통과.

## 기회지역 TOP 15 (임시 점수, 검색량 UNKNOWN)
1. 서울 (104, NEAR_OPPORTUNITY, IMPROVE_NOW (PHASE 1))
2. 용인 (94, ABSENT, IMPROVE_NOW (PHASE 1))
3. 화성 (87, NOT_CHECKED, NEXT_BATCH_CANDIDATE (THIN_REGION / DUPLICATE_RISK))
4. 경기 (85, PROVEN, PROTECT_WINNER)
5. 수원 (79, PROVEN, PROTECT_WINNER)
6. 천안 (79, PROVEN, PROTECT_WINNER)
7. 고양 (77, PROVEN, PROTECT_WINNER)
8. 대전 (77, PROVEN, PROTECT_WINNER)
9. 청주 (77, PROVEN, PROTECT_WINNER)
10. 파주 (68, NOT_CHECKED, NEXT_BATCH_CANDIDATE (THIN_REGION / DUPLICATE_RISK))
11. 남양주 (67, NOT_CHECKED, NEXT_BATCH_CANDIDATE (THIN_REGION / DUPLICATE_RISK))
12. 평택 (67, NOT_CHECKED, NEXT_BATCH_CANDIDATE (THIN_REGION / DUPLICATE_RISK))
13. 안양 (67, NOT_CHECKED, NEXT_BATCH_CANDIDATE (THIN_REGION / DUPLICATE_RISK))
14. 의정부 (67, NOT_CHECKED, NEXT_BATCH_CANDIDATE (THIN_REGION / DUPLICATE_RISK))
15. 부천 (66, NOT_CHECKED, NEXT_BATCH_CANDIDATE (THIN_REGION / DUPLICATE_RISK))

## 승인 필요
- /전국상속등기·경기 허브에서 서울·용인으로 내부 링크 추가(18번 참고) — 보호 URL 수정이라 미적용.
- 보호 9개 페이지의 템플릿 복제 위험(CRITICAL)은 성과 확인 후 다음 배치에서 판단.
- 서울 구 페이지(은평·마포 등)가 서울 쿼리에 노출 중 — 구 페이지 정리는 하지 않음.
- 인천은 감사만(INCHEON_TEST).

## 제출
- IndexNow: 21-indexnow-targets.txt (2개)
- 네이버 수집 요청: 22-naver-url-inspection.md (2개, 사용자 직접)
