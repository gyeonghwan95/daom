# 네이버 검색 노출 복구 — 2026-10-12

대상: '부산 법무사'·'부산법무사' 웹사이트 자연검색. 순위 회복을 약속하지 않으며, 아래 관측은 한 시점·한 조건의 기록이다.

## 기준
| 구분 | 값 | 근거 |
|---|---|---|
| HEAD = origin/main | `e231514` (10-12 21:54 KST, 사용자 커밋) | git |
| 운영 배포 | `e231514` — Cloudflare Pages 성공 10-12 22:03 KST | GitHub check-runs, 운영 `/api/turnstile-config` JSON 응답 |
| 정상 시점 커밋 | **미확인** (7b42ef4·16f9ffb는 이전 보고서의 후보일 뿐) | 순위 기록이 10-11 18:37 `audit/naver-ranks.csv` 하나뿐 |
| 작업 | `e231514` + 이번 미커밋 수정(아래) | — |

## 결론
### 확정 결함
1. **(검색 외, 최우선) 상담 신청 접수 불가** — 운영 `/api/turnstile-config` = `{"siteKey":""}`. Cloudflare에 Turnstile 사이트 키가 없어 보안 확인을 통과할 수 없고 모든 온라인 신청이 실패한다. e231514부터는 대체 채널(카카오톡·톡톡·전화·예약)이 보인다. **외부 설정 필요(수동 과제 1).**
2. **본문이 초기 HTML의 `hidden` 영역 안** — 1,876/1,893 페이지의 `<main>`이 `<div hidden id="S:0">` 안에 있고 인라인 스크립트(`$RC`)가 실행돼야 보였다. 원인: null을 반환하는 `loading.tsx` 7개가 만든 Suspense 경계(정적 export는 스트리밍 미지원, Next 문서 `loading.md:136`). 07-31부터 있던 구조라 **10월 하락의 원인으로 보지 않는다**. JS를 실행하지 않는 수집기에 불리한 구조라 바로잡음.
3. **의도 혼입(앵커)** — /부산법무사로 들어오는 링크 약 800개의 앵커가 '부산에서 법무사 찾을 때/찾는 기준'(10-10 이전의 선택 기준 역할). 현재 title·H1은 취급업무 안내이고, 선택 기준은 /부산법무사추천 담당.
4. **홈→공탁·한정승인 대표 URL 링크 없음.**
5. **(경미) 빠른 문의 폼이 서버 내부 오류(hint)와 관리자용 문구를 고객 화면에 노출.**
6. **(경미) /about "부산광역시 부산 해운대구·센텀" 지역명 중복.**

### 원인 후보 (확정 아님)
- '부산 법무사' 웹 영역 구성: 10-10·10-11·10-12 모두 기관(법원·LH·법무사회·부산도시공사)·변호사 사무소가 상위, 법무사 사무소는 busanlaw.net 1곳. 다옴은 웹문서 블록 10개 안 미발견, 플레이스 비광고 5/7. 결과 구성 변화일 가능성(중). 사이트 결함 근거 없음.
- 7개 검색어에서 대표 URL 대신 비슷한 우리 페이지가 하루 사이 바뀌어 뽑힘(관측 2회뿐, 낮음) → 7일 뒤 재관측.
- 이 PC(KT)에서 colo=SEA·TTFB 2~8s(과거 값 없음). Cloudflare 대시보드 접근 불가.
- 6f75fa2(10-11) 홈 첫 문단 일반화 — 하락이 먼저 있었으므로 약함 → 보류.

### 정상 (이번에 확인)
robots(Yeti 포함 `/` 허용) · sitemap 1,635 loc·하위 9개 200 · http→https 301 1홉 · 대표 20 URL 200·자기 canonical·X-Robots 없음 · 홈 title/description/canonical/H1 각 1개 · og:image 200 · 자산 40개 200 · soft 404 없음 · UA별 응답 동일·챌린지 없음 · 10-11 이후 커밋의 대표 URL SEO 필드 변경 0 · 홈·/부산법무사·추천·상담 역할 분리(유사도 0.10~0.12) · 사무소 사실·연락 href·JSON-LD 일치, 자체 aggregateRating 없음.

### 접근 불가
네이버 서치어드바이저(수집 통계·성과), 실제 Yeti 로그, Cloudflare 대시보드(WAF/Bot 이벤트·라우팅), 모바일·로그인·다른 위치 검색 결과.

## 적용한 수정 (근거 / 대상 / 기대 효과 / 영향 범위 / 검증 / 복구)
1. `loading.tsx` 7개 삭제(`src/app/`, `[landingSlug]`, cases, contact, contact/inquiry, services, situations) / 1,876쪽 / 본문이 초기 HTML에 바로 보임 / HTML 구조만, 텍스트·메타 동일 / hidden S:0 1,876→0, 대표 URL 본문 길이 동일 / `git checkout e231514 -- <7개 파일>`
2. /부산법무사 인바운드 앵커 '부산에서 법무사 찾을 때/찾는 기준' → '다옴법무사사무소 업무 안내'(19개 소스 파일, href 불변, `src/lib/search/aliases.ts` 검색 별칭과 이미지 메타는 유지) / 약 757쪽 링크 문구 / 앵커가 현재 역할과 일치, '부산 법무사' 정확 앵커를 늘리지 않음 / 링크 수·대상 동일 / 옛 앵커 남은 페이지 0 / 해당 커밋 revert
3. 홈 '바로 찾는 안내'에 /부산한정승인·/부산공탁 2개 추가(`HomePopularSearches.tsx`) / 홈 / 대표 URL 직접 연결 / 홈 링크 +2, 본문 +51자, title·H1 불변 / out/index.html href 확인 / 2항목 삭제
4. `QuickInquiryForm.tsx` hint를 화면 대신 콘솔로, `src/lib/quick-inquiry/core/handler.ts`(빌드 때 `functions/_lib`로 복사, 둘 다 수정) no_channel 문구를 고객용 하나로 / 문의 폼 / 내부 정보 비노출 / code·field 분기·대체 채널 조건 불변 / 타입체크 / revert
5. `LawyerEeatProfile.tsx` 두 문장에서 `region` 중복 제거(officeArea 상수는 다른 페이지 본문에 쓰여 그대로) / /about / 문장 정정 / about 본문 1문장 / "부산광역시 부산 " 0건 / revert
6. PC 좌측 상담 카드 '네이버 후기·사진' 말줄임(1024px에서 102px 글자 / 95px 칸, 측정 확인) → 사이드바만 '후기·사진'(`SidebarConsultationPanel.tsx`, N 아이콘·aria-label '네이버 플레이스 리뷰' 유지) / 1280px은 원래 정상 / revert
7. (사용자 추가 요청) 홈 첫 화면 좌측 패널 버튼 교체 — '업무 의뢰 문의'·'비슷한 업무 사례 보기' → 새 `HomeHeroChannels.tsx`: 상담 6개 3×2 타일(네이버 톡톡·카카오톡·전화상담 / 1분만에 문의하기·네이버예약·네이버 후기·사진) + 안내 3개 목록(안윤정 법무사는 누구일까?·네이버 지도에서 사무소 위치 확인·블로그에서 더 많은 글 보기). 겹치던 연락처 한 줄은 전화번호만 남김. 세로 56rem 이하 PC는 가로형 타일로 압축. 확인: 1440×900·1366×768·1280×720·390·360 캡처. 홈 title·H1 불변, 홈의 /업무사례 링크는 다른 섹션에 남아 있음.
8. lastmod: 실제 본문이 바뀐 `/`·`/about`만 2026-10-12. 앵커만 바뀐 페이지는 날짜 유지, 지문만 `--rebaseline`.

## 보류 (사유)
- /부산법인법무사 title 어순 변경 — 정상 title, 근거 약함.
- 홈 첫 문단 복원(6f75fa2) — 하락이 먼저, 관측 후 판단.
- 한글 경로 308 Location 비인코딩 — 내부 링크·사이트맵에 해당 주소 0개.
- 새 랜딩·키워드 추가·title 일괄 변경 — 하지 않음.

## 보호 검사
- 전체 route 스냅샷 `naver-before` → `naver-after`(`reports/google-index-2026-10-11/protect/diff-naver-before-naver-after.json`): route 1,893 → 1,893 (삭제 0, 추가 0). title·description·H1·canonical·robots·OG 변경 **0**. sitemap loc 1,635 동일, 하위 사이트맵·RSS·robots·headers·redirects 동일(lastmod 값만 `/`·`/about` 10-12). 바뀐 필드는 linksHash 757쪽(앵커 문구)과 홈 ctaHash 1쪽(첫 화면 버튼)뿐. 초기 HTML의 `<div hidden id="S:0">` 0쪽.
- `query-protection.csv`: 31개 검색어(요청 24 + 회생·파산·지급명령·임차권·전세보증금·공탁·전국 비대면 7) × 대표 URL, 10-12 관측, title/H1/canonical/index, 변경 여부.
- 화면: 홈 1440×900, 1366×768, 1280×720(패널 하단 두 줄은 패널 내부 스크롤), 390×844, 360×740. 본문형 페이지 2열 버튼은 이전 작업에서 1440·390 확인.
- 테스트: `npm test` 31 pass. `tsc` 기존 오류 1건(`reserved-inheritance-intents.ts`, 이번 변경 무관). eslint 변경 파일 오류 0(기존 경고 1). `npm run build` 성공, `[seo-dom] all samples OK`.
- 테스트 통과는 코드 회귀 방지 근거일 뿐, 다른 검색어 순위에 영향이 없다는 증명이 아니다.

## 배포 (이 요청에서는 하지 않음)
1. 사용자가 커밋·push(main) → Cloudflare Pages 자동 배포.
2. check-runs에서 Cloudflare Pages success와 SHA 확인 → 운영 홈에서 `<div hidden id="S:0">` 0, '바로 찾는 안내'에 공탁·한정승인, `/about` 문장 확인.
3. 서치어드바이저: 홈(`/`)과 `/부산법무사`만 수집 요청. 사이트맵 재제출·IndexNow 반복 금지.
4. 회귀(403/5xx/noindex/canonical 오류/문의 장애) 발견 시 해당 수정만 revert. 하루 순위 변동으로 전체 롤백 금지.

## 수동 과제
1. **Cloudflare Pages → Settings → Variables and Secrets → Production**에 `NEXT_PUBLIC_TURNSTILE_SITE_KEY`(Turnstile 대시보드의 사이트 키, Text) 추가 후 재배포 → `/api/turnstile-config`에 키가 나오는지 확인 → 직접 테스트 문의 1건.
2. 서치어드바이저: 수집 통계(응답 시간·오류), robots 검증, 홈·/부산법무사 수집 요청 결과 확인.
3. 네이버 플레이스(주 노출 경로): 정보·사진·영업시간 최신화는 운영자가 직접. 리뷰 유도·구매 금지.
4. 관측 계획(같은 조건: PC 비로그인 `naver-observe.mjs <label>` 31개, 가능하면 모바일 수동): D0(배포 직후), D+7, D+14, D+28. 매일 제목을 고치지 않는다.
