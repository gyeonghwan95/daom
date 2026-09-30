# PHASE 1 실행 계획 (2026-09-30)

사용자 선택: 서울·용인 2개만 전면 개선, 이미 노출 중인 9개는 PROTECT_WINNER.

| URL | 조치 | 고유 각도 |
|---|---|---|
| /업무사례/서울상속등기법무사 | IMPROVE (URL·canonical 유지) | 등기(부동산 기준)와 상속포기(마지막 주소 기준) 분리, 서울가정법원 단일 관할, 특별시 채권 비율, 서울 거주·부산 부동산 역방향, 해외 상속인 처리 사례 |
| /업무사례/용인상속등기법무사 | IMPROVE (URL·canonical 유지) | 아파트+여러 필지 토지 목록 확정, 농지 요건, 수원가정법원 본원, 그 밖의 지역 채권 비율, 설명용 예시 |

- 신규 URL 생성: 0
- 구현: `src/lib/metro-remote/*`, `src/components/metro-remote/MetroRemoteTargetView.tsx` (대상 2개 전용, 공용 템플릿·전역 네비·푸터 미수정)
- lastmod: 스펙 dateModified(2026-09-30)만 사용, 다른 `/업무사례/*` 영향 없음
- 다음 배치 후보(승인 필요): 화성·부천·남양주·안산 등 CRITICAL 복제 지역 페이지, 인천(TEST)
