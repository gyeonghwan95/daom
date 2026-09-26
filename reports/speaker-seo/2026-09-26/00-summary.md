# Speaker SEO — 2026-09-26

## Verdict
사이트에 이미 **22개 강의 랜딩 + /강의이력 + 검증 이력 상세**가 있다.
이번 라운드는 **신규 URL 생성 없이(CREATE_NEW=0)** 검색 표현을 기존 owner에 연결하고,
직업인·현직자·지역무검색(generic) 의도를 콘텐츠로 보강하는 방향이다.

## Architecture (reuse)
| Role | URL |
|---|---|
| Generic / pillar | /법률강의 |
| Busan hiring | /부산법률강사 |
| High school / career | /법무사진로특강 (+ /학교법률교육) |
| University | /학교법률교육 + /청년생활법률특강 |
| Public | /공공기관법률교육 |
| Corporate | /기업법률교육 |
| Jeonse | /전세사기예방교육 |
| Startup | /창업법률교육 |
| Youth/welfare | /청년생활법률특강 · /부산사회복지기관강사 |
| Hiring logistics | /부산강사섭외체크리스트 · /부산강사섭외비용 |
| Profile / inquiry / evidence | /강사소개 · /강의문의 · /강의이력 |

## Discovery
- Seed + discovered phrases → `05-keyword-to-url.csv`
- SERP 자동완성 대량 수집은 CAPTCHA 위험으로 생략. 기관 공고형 자연어(직업인 초청 특강 등)를 DISCOVERED로 반영.

## Next code patches
1. /법무사진로특강 — 직업인·현직자·법조인 H2/FAQ
2. /학교법률교육 — 고등/대학 분기
3. /법률강의 — 지역명 없는 검색 대응 intro
4. lecture-keyword-to-url-map.ts — EXTRA_SEEDS 반영
