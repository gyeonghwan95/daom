# 12 — Cycle 3 follow-up (2026-08-26)

WAVE3·4 이후 잔여 과제 중 **즉시 코드로 가능한 것**만 진행. URL 변경·삭제·NEW-D = 0.

## Done

### 1. Exact 「부산 법무사」 ownership 정리
| 위치 | 조치 |
|---|---|
| `seo-landing/combinations.ts` | thin 랜딩 keywords에서 exact 제거 → `다옴법무사사무소` |
| `hub/links.ts` fillers | exact 앵커 → `/` ; guide는 “부산에서 법무사 찾을 때” → `/부산법무사` |
| `hub/registry.ts` spokes | 동일 |
| `BusanLegalMapView` / preservation / keyword-gap | exact → `/` |
| blog·case·FAQ·glossary `primaryKeywords` | exact 제거 (HOME만 보유) |

### 2. REBUILD-C 템플릿 차별화 강화
- `serviceFocusLines` / `intentFocusBlock` (필요서류≠준비서류, 비용≠보수표)
- `exclusiveClusterBody` + seeded checklist로 섹션 본문 변주
- 유사도 감사에 section items·FAQ 포함

### 3. 검증
- `seo:regression` **PASS** (1639/1639)
- `tsc --noEmit` OK
- geo-stripped HIGH pairs: **감소 추세** (잔여 same-service×district는 구조적 한계 — 수기 rewrite 후속)

## Not done (의도적)
- Off-page 네이버 계정 수정 (수동 `09-offpage-actions.md`)
- NEW-D doorway URL
- 구·동 페이지 **수기** 장문 전량 rewrite

## Artifacts
- `seo-audit/12-cycle3-followup.md` (this)
- refreshed `wave34-seo-landing-similarity.json` / `wave34-rebuild-c-sample.csv`
