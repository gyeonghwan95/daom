# Before / After SEO — Gap Discovery Wave 1

Generated: 2026-08-26

## Inventory (analysis baseline)

| Metric | Value |
|--------|------:|
| Total pages (registry) | 1797 |
| Indexable | 1664 |
| Local `out/` crawl match | 1664 |
| Missing HTML | 0 |

## URL safety (absolute rules)

```text
기존 URL 변경: 0
기존 URL 삭제: 0
기존 URL redirect: 0
```

## Wave 1 changes

### NEW (3 only — 7-condition gate passed)

| URL | Parent | Why not duplicate |
|-----|--------|-------------------|
| `/부산재산명시` | `/민사소송` | 가압류(보전)·채권압류(대상 확정 집행)과 단계가 다름 |
| `/부산부재자재산관리인` | `/가족후견` | 특정 부재자 vs 상속인 없음·특별대리와 분리 |
| `/부산상속재산관리인` | `/상속` | 상속인 없음/불명확 — 부재자·포기와 분리 |

### UPGRADE (no new URL)

- `/가압류신청서류준비` — 부산 가압류·부동산/채권 가압류 intent 흡수
- `/부산개명허가` — 개명신청 intent 흡수
- `/부산유언검인` — 유언증서 검인 intent 흡수
- `/채권압류추심서류준비` — 통장·급여 압류 keywords + 재산명시 링크
- `/가족후견` · `/민사소송` · `/상속` — parent→child 링크

### Explicitly NOT created

해외상속인, 개명신청, 한정후견, 채권/부동산가압류, 통장압류, 가압류 법무사 전용 URL — 모두 기존 문서 강화.

## Quality fixes

- Title near-dup: 전국유증·전국본점이전 **업무사례** title 차별화

## SERP evidence

`SEARCH_VOLUME: UNKNOWN` (네이버 SERP 자동수집 미수행). 판정은 의도 분리·업무 가치·기존 coverage 중심.

## Tests

- `tsc --noEmit`: pass (Wave1 직후)
- Full production build / static crawl: 배포 전 실행 권장
- Visual QA (390–1920): 주요 3 NEW + 가압류·개명 — 배포 후 확인

## Philosophy check

`NEW PAGE` 비율을 낮춤 (후보 다수 → 구현 3). TRUE GAP만 채움.
