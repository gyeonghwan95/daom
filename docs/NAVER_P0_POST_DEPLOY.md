# 네이버 배포 후 확인 — 상속 P0/P1

1. Search Advisor URL 검사: `/부산상속포기` → `/부산상속법무사` → `/`
2. 수집된 title/H1이 최신인지
3. robots / canonical
4. 최근 90일 query별 노출 URL
   - `부산 상속포기 법무사`에 `/부산상속포기` 외 URL이 보이면 OWNER_FRAGMENTATION
   - `부산 상속 법무사`에 `/부산상속법무사` 외 URL이 보이면 P1_OWNER_FRAGMENTATION
5. 외부 글(네이버 블로그·티스토리)에서 공식 owner 링크
   - 상속포기 글 → `/부산상속포기`
   - 상속 종합 글 → `/부산상속법무사`
6. 숫자는 `seo/inheritance-p0/naver-tracker.csv`에만 실제 값 기록

배포 직후 순위가 그대로여도 title/H1/본문을 며칠마다 바꾸지 않는다.
