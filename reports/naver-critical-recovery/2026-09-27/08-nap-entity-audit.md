# 08 — NAP / entity audit

## Official record (source: `src/lib/office-location.ts`, matches Naver Place id 2035745096)
- Name: 다옴법무사사무소 · 대표 안윤정 법무사
- Address: 부산광역시 해운대구 센텀동로 200 D동 1층 LAB9호
- Access: 동해선 재송역, 센텀역 도보 5분 · 주차 가능 · 방문은 사전 예약
- Hours: 평일 09:00–18:00 (점심 12:00–13:00), 토·일·공휴일 휴무
- Phone: from `getContactInfo()` (same values on all three targets)

## Targets (after) — unified
| Page | Address | Access | Hours | Phone | Name/대표 |
|---|---|---|---|---|---|
| /부산상속전문법무사 | official | — (not a visit page) | — | official | official |
| /부산상속포기 | official | — | — | official | official |
| /해운대법무사 | official (facts row) | official | official | official | official |

The 해운대 page uses `officeLocation` / `officeHours` directly, so it cannot drift from the official record.

## GLOBAL_NAP_CONFLICT (other pages — report only, not changed)
Scan of the static export (1,855 HTML files):
| Text | Pages |
|---|---|
| "동해선 재송역, 센텀역 도보 5분" (official) | `/`, `/location`, `/office`, `/부산법무사`, `/해운대법무사` |
| "센텀시티역·벡스코 인근" (alternate) | `/센텀법무사`, `/센텀시티역법무사`, `/센텀시티역법인등기`, `/부산법무사무소`, `/부산법무사방문상담`, `/blog/busan-lawyer-recommend-office-consult`, `/blog/centum-lawyer-visit-day-flow` |
| "창조관" (building name not in official address) | `/location`, `/office` |

Source files with the alternate phrase: 17 (e.g. `selection/topics/busan-office.ts`, `busan-visit.ts`, `region-hub-identity.ts`, `districts.ts`, `site-images.ts`).

## ENTITY_CONFLICT
- None blocking. `Person` JSON-LD (`/about` only) contains `award` = 대한법무사협회장 표창 (2026.05.28) and `hasCredential`; both are displayed on `/about`. Confirm accuracy only.
- Targets add no Person/award/credential/AggregateRating/Review schema.

## Photos
- 해운대 page uses the real office nameplate photo (resize only). No AI office image, no copied map screenshot.
