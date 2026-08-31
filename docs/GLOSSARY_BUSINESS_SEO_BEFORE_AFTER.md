# Glossary business SEO — before / after

내부 QA 기록입니다. 네이버 순위·Search Advisor 수치를 만들어내지 않습니다. Search Advisor 실측 파일은 repository에 없어 **UNKNOWN**입니다.

## 규모

| 항목 | BEFORE | AFTER |
|------|--------|--------|
| glossary URL (허브+용어) | 34 | 34 (slug 유지, 404 없음) |
| 용어 페이지 | 33 | 33 |
| indexable 용어 | 33 | **0** |
| indexable 허브 `/glossary` | yes | yes |
| 순수 definition title (`뜻과 절차｜부산 법무사가 쉽게 설명`) | 33 | **0** |
| 업무/문제 H1 | 0 | **0** (H1 = 용어만. 서비스 H1과 경쟁하지 않음) |
| service owner PRIMARY collision (glossary가 부산 ○○ 등기 title 소유) | 구조적 위험 | **0** (용어 noindex + canonical to owner + forbidden query) |
| duplicate glossary title | 33 identical template | **0** unique titles (`○○ 용어 확인`) |
| HIGH body similarity (template stuffing) | 전 페이지 공통 문장 | audit HIGH pairs **0** |
| noindex 용어 | 0 | 33 (`noindex,follow`, sitemap 제외) |
| 동일 의도 canonical | 없음 (용어 URL이 스스로 canonical) | 설정/말소·약한 owner 제외하고 서비스 URL로 canonical |
| 301 redirect | 0 | **0** (성과·백링크 확인 전 자동 redirect 금지) |
| 허브 정체성 | 법률 용어사전 → (중간) 상황 허브 | **용어 목록** (`/situations`와 역할 분리) |
| 가짜 사례·통계·비용 | 템플릿 전국 수임 반복 | 제거 |

## 판정 요약

- **KEEP_INDEX (용어):** 0 — 고전환 용어마다 더 강한 서비스 URL이 이미 있음
- **UPGRADE_INDEX (용어):** 0 — GATE(BI≥60, SF≥60, cannibalization 없음)를 통과하면서 index를 유지할 용어 없음
- **SUPPORT_NOINDEX:** 24 — URL 유지, 내부 절차 안내, 검색 대표는 서비스 owner
- **REMOVE_FROM_DISCOVERY:** 9 — 허브 기본 목록·자주 찾는 영역에서 숨김 (검색창으로는 가능)
- **MERGE_REDIRECT_CANDIDATE:** 0 — 자동 301 없음

## noindex 한 이유

Search Advisor 클릭이 확인되지 않은 상태에서, glossary가 `부산 상속등기`·`부산 임원변경등기` 등 **돈이 되는 검색어의 대표 페이지가 되지 않도록** 용어 URL을 보조 문서로 내렸습니다. 트래픽이 있다는 이유만으로 유지하지 않았고, 성과 파일이 없어 PRESERVE도 적용하지 않았습니다.

허브 `/glossary`만 index합니다. CORE(`부산 법무사`→`/`)·LOCAL·LECTURE PRIMARY를 쓰지 않습니다.

## 업그레이드한 점 (검색 index와 별개)

용어 페이지는 **정의 + 헷갈리는 점 + 범위 + owner 링크**만 남겼습니다. 기한·서류·비용·절차는 서비스 owner에만 둡니다. 유류분·소장·답변서는 소송대리처럼 안내하지 않습니다.

중간 개편에서 용어 URL을 미니 업무 페이지로 키우면, noindex가 반영되기 전에 owner와 같은 의도로 경쟁합니다. 그래서 본문을 다시 줄이고 canonical을 owner로 보냈습니다.

## 보존

- 모든 `/glossary/{slug}` 유지
- 내부링크·자가진단 연결 유지
- 서비스 champion URL 미변경
