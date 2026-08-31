# 네이버 배포 후 확인 (담당자)

코드가 순위를 보장하지 않습니다. Search Advisor에서 직접 확인하세요.
Internal SEO QA Score는 네이버 점수가 아닙니다.

1. 서치어드바이저 사이트 등록·소유 확인
2. https://다옴법무사사무소.kr/robots.txt — 200, text/plain, Yeti 허용, /admin·/api·/search만 제한
3. https://다옴법무사사무소.kr/sitemap.xml 수집 (현재 1662 URL, noindex·redirect 제외)
4. 핵심 owner 수집·색인: `/` `/부산법무사` `/부산법무사상담` `/부산법무사추천` `/부산상속법무사` `/부산상속등기` `/연제구법무사` `/법률강의` `/강의문의` `/부산법률강사`
5. 검색결과 title/description이 위 owner와 맞는지 수동 확인
6. export를 `seo/naver-searchadvisor.csv`로 저장 후 `seo/naver-master-tracker.csv`에 30/60/90일 실측 기입
7. IndexNow는 **변경된 URL만** (`npm run indexnow`). 성공 응답 ≠ 색인 성공
8. 네이버에서 「부산 법무사」「부산 법무사 상담」「부산 상속 전문 법무사」「연제구 법무사」「부산 강의 문의」「부산 강사 섭외」 결과를 직접 확인
9. 기존 클릭 URL이 다른 문서로 바뀌었는지(title 전면 변경·리다이렉트) 이상 징후가 있으면 즉시 롤백 검토
