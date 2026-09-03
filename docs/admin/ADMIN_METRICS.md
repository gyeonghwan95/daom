# Admin Metrics

## 페이지뷰 (visits / page_view)

- **정의**: `page_view` 이벤트 1회 = 1 페이지뷰
- **Source**: ADMIN_KV `analytics:day:*` (hourly buckets nested on the day shard; legacy `analytics:hourly:*` still merged on read)
- **Timezone**: Asia/Seoul (KST)
- **주의**: unique visitor 아님

## CTA

- **정의**: `cta_click` + `phone_click` + `kakao_click` + `naver_click` (phone/kakao/naver는 cta에도 포함)
- **Source**: daily aggregate `cta` field

## 문의 제출

- **정의**: `consultation_submit` (quick-inquiry 성공 시 기록)
- **Source**: daily path + funnel

## 네이버 플레이스 이동 클릭

- **정의**: `naver_place_click` outbound 클릭
- **주의**: 네이버 내부 실방문·예약완료 아님
- **Variant**: `reservation` → “예약 CTA 클릭”

## 메일 성공률

- **정의**: `email:logs` 중 success / (success + failed)
- **Source**: quick-inquiry Resend/Telegram delivery

## 시간대별 페이지 방문

- **정의**: KST hour bucket 0–23, `page_view` count
- **비교**: 최근 7일 동일 hour 평균

## Source

- **정의**: `referrerType` on page_view (google, naver, direct, …)
- **주의**: search query 추정 없음

## Device

- **정의**: `deviceType` on page_view (mobile/desktop/unknown)
- **주의**: UA raw 저장 없음

## 공지 노출 / 클릭 / 닫기

- **정의**: `notice_impression` / `notice_click` / `notice_dismiss`
- **Source**: daily `notices[noticeId]` aggregate
- **닫기**: sessionStorage `noticeDismissedSession:{id}` — 다음 방문 시 재노출 가능
- **오늘은 더 이상 보지 않기**: localStorage `noticeDismissedUntil:{id}` = KST YYYY-MM-DD
- **팝업**: priority 최고 1건만 중앙 모달 (`showPopup !== false`)
- **공개 목록**: `/공지사항` — draft/scheduled 제외, expired/archived는 `isPublicArchive !== false`
- **상세**: `/공지사항/보기?id=` — noindex
- **CTR**: click / impression (7일 합산, 표본 작으면 해석 주의)

## SEO Critical / Warning

- **정의**: 빌드 시점 `reports/seo/*` 요약 (`admin-seo-summary.json`)
- **주의**: Search Console 순위/클릭 아님. 실시간 크롤 결과 아님.
