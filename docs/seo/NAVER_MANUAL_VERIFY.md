# Naver Search Advisor — 수동 확인 체크리스트

생성: 2026-08-16  
이 환경은 Search Advisor에 로그인할 수 없다. 프로그램으로 색인 여부를 추정하지 않는다.

공식 문서 (2026-08-16 직접 확인):

| 주제 | URL | 확인 |
|------|-----|------|
| 콘텐츠 작성 권장사항 | https://searchadvisor.naver.com/guide/content-basic | YES |
| 웹 콘텐츠 스팸 | https://searchadvisor.naver.com/guide/content-abusing | YES (검색 결과) |
| 콘텐츠 마크업 | https://searchadvisor.naver.com/guide/markup-content | YES (검색 결과) |
| 사이트 최적화 | https://searchadvisor.naver.com/guide/report-seo | YES (검색 결과) |
| 사이트 간단 체크 | https://searchadvisor.naver.com/guide/diagnose-site | YES (검색 결과) |
| SEO 기본 (`/guide/seo-basic`) | https://searchadvisor.naver.com/guide/seo-basic | **404** — 존재하지 않는 포스트 |
| 검색 미노출 | Search Advisor 웹마스터도구 내 수집/미수집 화면 | 로그인 필요 |

가이드 요지 (기억 아님, content-basic 본문):

- 제목·설명에 무관한 인기검색어·같은 단어 반복 삽입은 불리할 수 있다.
- 핵심 정보는 텍스트.
- 복제·짜깁기 금지. AI는 운영자 경험 없이 올리지 말 것.
- 주제 일관성. 낚시성 제목 금지.

## Priority URL 검사 (관리자)

각 URL에 대해 수집 / 색인 / SEO 진단 / 대표 URL / robots / HTML 을 기록한다.

| URL | 수집 | 색인 | 대표 URL | robots | 메모 |
|-----|------|------|----------|--------|------|
| `/` | | | | index,follow (live) | 홈 title이 `부산법무사` — 노출 URL이 홈인지 Champion인지 기록 |
| `/부산법무사` | | | | index,follow (live) | BUSAN_GENERAL_CHAMPION |
| `/부산법무사추천` | | | | | Spoke. 추천 Intent |
| `/부산법무사비교` | | | | | Spoke |
| `/부산법무사상담` | | | | | Spoke |
| `/부산법무사비용` | | | | | Spoke |
| `/부산등기법무사` | | | | | Spoke |

순위·노출 URL은 `data/seo/ranking-observations.json`에 **수동** 추가한다.  
필드: date, engine=naver, query, observedPosition, **url**(실제 노출 경로, 모르면 null), note.  
네이버 결과 자동 수집 금지.

## 재수집

Title/H1/canonical을 바꾸지 않은 이번 감사에서는 전수 IndexNow를 하지 않는다.
변경된 URL이 생기면 그 URL만 재수집 요청.
