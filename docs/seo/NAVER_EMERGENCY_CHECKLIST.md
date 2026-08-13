# 네이버 Search Advisor 긴급 확인 목록

출처: [SEO 기본 가이드](https://searchadvisor.naver.com/guide/seo-help), [최적화 목적](https://searchadvisor.naver.com/guide/seo-basic-intro), [콘텐츠 마크업](https://searchadvisor.naver.com/guide/markup-content), [선호 URL·robots meta](https://searchadvisor.naver.com/guide/markup-structure), [사이트맵](https://searchadvisor.naver.com/guide/request-feed), [Breadcrumb](https://searchadvisor.naver.com/guide/structured-data-breadcrumb), [구조화 데이터](https://searchadvisor.naver.com/guide/structured-data-intro).

코드로 Search Advisor에 로그인하지 않는다. 아래는 대시보드에서 **즉시 수동 확인**할 항목이다.

## 1. 수집현황

- Yeti가 `/`, `/부산법무사`, `/부산법인법무사`를 최근 방문했는지
- 수집 오류·타임아웃·robots 차단 여부

## 2. 색인

- 위 3 URL이 색인 상태인지
- 중복 URL(http/https, www, encoded)로 쪼개지지 않았는지

## 3. 수집제한

- WAF / Bot Fight / IP 차단이 Yeti를 막는지 (IP 기반 차단 금지 — 공식 가이드)
- `robots.txt`: Yeti `Allow: /`, Disallow는 `/admin` `/api/` `/search` `/blog/external/`만

## 4. 색인제외

- Champion `noindex` 여부 → 있으면 HIGH CRITICAL
- 사이트 진단 SEO 항목의 title/description 중복 경고

## 5. SEO (사이트 진단)

- title 고유성, H1 1개, description 고유성
- JS-only 본문 여부 (Champion은 SSG HTML)

## 6. robots

- `https://xn--2j1br1na42lvxja38mk8r.kr/robots.txt`
- meta robots: Champion `index,follow`

## 7. sitemap

- 제출된 sitemap/index가 살아 있는지
- Champion loc이 포함되는지
- lastmod가 전 URL 오늘 날짜로 폭주하지 않는지 (생성기는 경로별 lastmod, `Date.now()` 일괄 아님)

## 재수집 대상 (소수만)

1. `https://xn--2j1br1na42lvxja38mk8r.kr/`
2. `https://xn--2j1br1na42lvxja38mk8r.kr/부산법무사`
3. `https://xn--2j1br1na42lvxja38mk8r.kr/부산법인법무사`

변경된 로컬 overlay 페이지는 선택:

4. `/민락동법무사` `/양정동법무사` `/동래구법무사`

수백 URL IndexNow 반복 제출 금지. IndexNow 성공 ≠ 색인 성공.
