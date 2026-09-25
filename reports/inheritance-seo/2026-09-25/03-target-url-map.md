# 03 — Target URL map

## GROUP A — 상속 허브
| Query (primary) | Champion URL | Notes |
|-----------------|--------------|-------|
| 부산 상속 법무사 | `/부산상속법무사` | 등기·포기·한정승인 분기 허브 |
| 부산 상속전문 법무사 | `/부산상속법무사` | 「전문」= 복합 상황·절차 깊이 (공인 전문자격 표방 금지) |

## GROUP B — 상속포기
| Query | Champion URL | Notes |
|-------|--------------|-------|
| 부산 상속포기 법무사 | `/부산상속포기` | exact-match title/H1은 이 URL만 |

## CANNIBALIZATION_CANDIDATE (유지)
| URL | Policy | Action |
|-----|--------|--------|
| `/부산상속전문법무사` | noindex + canonical → `/부산상속법무사` | **삭제·301 금지** — SERP 흡수·링크 equity 보존 |

## Spoke (참고, 이번 수술 비타깃)
- `/부산상속등기` — 등기 intent
- `/한정승인` 계열 — 별도 ownership

## IndexNow (이번 배치)
- `https://다옴법무사사무소.kr/부산상속법무사`
- `https://다옴법무사사무소.kr/부산상속포기`
