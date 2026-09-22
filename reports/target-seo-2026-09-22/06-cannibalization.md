# 06 — Cannibalization

## 상속 cluster

| Intent | URL | Role |
|--------|-----|------|
| 부산 상속 법무사 / 법무사 상속 / 상속전문 | `/부산상속법무사` | broad hub |
| 부산 상속등기 | `/부산상속등기` | registration only (미수정) |
| 부산상속전문법무사 bridge | `/부산상속전문법무사` | noindex + canonical → hub |

→ 신규 `/부산상속전문법무사` 유사 URL 생성하지 않음.

## 등기 cluster

| Intent | URL | Role |
|--------|-----|------|
| 부산등기전문 / 부산 등기 법무사 | `/부산등기법무사` | hub |
| `/부산등기전문법무사` | thin bridge | noindex + canonical → `/부산등기법무사` |

## 법인 cluster

| Intent | URL | Role |
|--------|-----|------|
| 법인등기 + 법인전문 | `/부산법인등기` | registration hub |
| `/부산법인법무사` | 법인 업무 선택 | 미수정 |
| `/부산법인전문법무사` | thin bridge | noindex + canonical → `/부산법인등기` |

## 해운대

해운대 / 해운대구 → 동일 `/해운대법무사`

## 보상

신규 `/부산보상등기` vs `/공공기관등기업무` — 후자는 기관 담당자·촉탁 종합, 전자는 협의취득·수용 등기 고유.
