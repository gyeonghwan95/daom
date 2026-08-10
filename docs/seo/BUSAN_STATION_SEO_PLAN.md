# 부산 역세권 법무사 SEO Entity System — Plan & Phase1

**일자:** 2026-08-10  
**원칙:** 역마다 신규 URL 금지 · 기존 Host에 고유 섹션 · 가짜 지역통계 금지 · title/H1 보호

---

## A. Entity 데이터

| 항목 | 수 |
|------|-----|
| verified stations (레지스트리) | Phase1 22 + Additional 8 = **30** (확장 가능 구조) |
| Phase1 섹션 구현 | **22** |
| 미구현(매핑만) | 8 → Phase2 |
| 신규 Station URL | **0** |

출처: 부산교통공사 역정보(humetro), 동해선·BGL은 노선 표기된 역만.

---

## 표 1 — Station → Host (Phase1)

| Station | Line | District | Existing Host | Priority | Action |
|---------|------|----------|---------------|----------|--------|
| 서면역 | 1·2 | 부산진구 | `/서면법무사` | critical | ADD-SECTION |
| 연산역 | 1·3 | 연제구 | `/연산동법무사` | critical | ADD-SECTION |
| 동래역 | 1·4 | 동래구 | `/동래역법무사` | critical | ADD-SECTION |
| 부산역 | 1 | 동구 | `/부산역법무사` | critical | ADD-SECTION |
| 수영역 | 2·3 | 수영구 | `/수영구법무사` | critical | ADD-SECTION |
| 센텀시티역 | 2 | 해운대 | `/센텀법무사` | critical | ADD-SECTION |
| 해운대역 | 2 | 해운대 | `/해운대법무사` | high | ADD-SECTION |
| 장산역 | 2 | 해운대 | `/좌동법무사` | high | ADD-SECTION |
| 사상역 | 2·BGL | 사상구 | `/사상법무사` | high | ADD-SECTION |
| 교대역 | 1·동해 | 연제구 | `/거제동법무사` | high | ADD-SECTION |
| 재송역 | 동해선 | 해운대 | `/재송동법무사` | high | ADD-SECTION |
| 벡스코역 | 2·동해 | 해운대 | `/센텀법무사` | high | ADD-SECTION |
| 광안역 | 2 | 수영구 | `/광안리법무사` | high | ADD-SECTION |
| 전포역 | 2 | 부산진구 | `/전포동법무사` | high | ADD-SECTION |
| 남포역 | 1 | 중구 | `/중구법무사` | high | ADD-SECTION |
| 자갈치역 | 1 | 중구 | `/중구법무사` | medium | ADD-SECTION |
| 미남역 | 3·4 | 동래구 | `/동래구법무사` | high | ADD-SECTION |
| 시청역 | 1 | 연제구 | `/연제구법무사` | high | ADD-SECTION |
| 부전역 | 1·동해 | 부산진구 | `/부산진구법무사` | high | ADD-SECTION |
| 중앙역 | 1 | 중구 | `/중구법무사` | medium | ADD-SECTION |
| 동백역 | 2 | 해운대 | `/해운대법무사` | medium | ADD-SECTION |
| 민락역 | 2 | 수영구 | `/수영구법무사` | medium | ADD-SECTION |

센텀역 = 센텀시티역 alias (별도 페이지 없음).

---

## 표 2 — Host 배정 수

| Host URL | Assigned (Phase1) | Risk |
|----------|-------------------|------|
| `/중구법무사` | 남포·자갈치·중앙 (3) | OK |
| `/센텀법무사` | 센텀시티·벡스코 (2) | OK |
| `/해운대법무사` | 해운대·동백 (2) | OK |
| `/수영구법무사` | 수영·민락 (2) | OK |
| 기타 Host | 1씩 | OK |

한 페이지 12개 초과 없음.

---

## 표 3 — 기존 얇은 station URL

| URL | Action |
|-----|--------|
| `/서면역법무사` 등 | **KEEP** (삭제 금지). Primary는 동네/구 허브. DOORWAY-RISK 관찰. 신규 생성 중단 |

---

## 구현 파일

- `src/data/geo/busan-rail-stations.ts`
- `src/data/seo/station-host-map.ts`
- `src/data/seo/station-section-content.ts`
- `src/data/seo/regional-champions.ts`
- `src/lib/seo/station-sections.ts`
- `src/components/seo/StationServiceSection.tsx`
- `src/components/seo/StationCluster.tsx`
- builders: neighborhood-hub / region-hub + `PageSection.id`
- `npm run seo:audit:stations`

---

## Q1–Q10 (요지)

| Q | 답 |
|---|-----|
| Q1 문맥 없는 역 | 레지스트리 밖 전 노선 잔여는 Phase2+ (매핑만 일부) |
| Q2 Host | 표 1 |
| Q3 몰림 | 중구 3개 최대 — OK |
| Q4 유사도 | `seo:audit:stations` — REWRITE REQUIRED 0 목표 |
| Q5 기존 thin | DOORWAY-RISK 표시, 미삭제 |
| Q6 강한 페이지 훼손 | title/H1/URL 미변경 |
| Q7 SSR | PageData sections로 HTML 포함 |
| Q8 링크 | Station → Regional/Service Champion |
| Q9 신규 URL | 0 |
| Q10 독립 페이지 필요 | 승인 전 자동생성 없음. NEW-PAGE-CANDIDATE 없음 |

---

## Phase2+

Additional 역(노포·부산대·구포·덕천·하단·망미·거제·중동 등) 섹션 배치, 1–4호선 전역 Entity 보강(공식 CSV 동기화).
