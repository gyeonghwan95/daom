# ② 수집·Git·업무 데이터·회귀 보호 — 2026-10-14 KST

산출물: `baseline.json`(운영 live + 로컬 out/ 병합, og:image 실측), `live-live.json`(live-check.mjs 원본). 소스 수정·checkout·reset·POST 없음. 운영 HTML 사본은 세션 scratchpad에만 보관.
주의: Yeti UA로 curl/fetch 200을 받은 것은 **서버가 그 UA에 정상 응답한다**는 뜻일 뿐, 실제 Yeti 수집 증명이 아님.

## 1. 운영 baseline (18경로, b201a0b)
- 전부 200, 리디렉션 0, X-Robots-Tag 없음, `cf-cache-status: DYNAMIC`(HTML 비캐시 → 캐시 미반영 위험 없음).
- robots 18개 모두 `index, follow, max-image-preview:large`(b201a0b `metadata.ts` +2줄 반영 확인). canonical·og:url = 자기 경로(18/18). JSON-LD 파싱 오류 0.
- og:image 17개 고유 URL 실제 GET: 전부 200·image/jpeg·56~201KB. 크기: priority-seo 1200×630, generated/serp 1200×1200, _img 썸네일 1200×898~900.
- title·H1 중복: 5개 신규 대상 모두 색인 페이지 중 고유(접두어 기준도 단독).
- **운영 vs out/ 차이**: title·description·h1·canonical·robots·og·@type·ItemList·@id·mainLen·img 수 **18/18 동일**. 차이는 `a href` +1(전 경로) 뿐 = Cloudflare Email Obfuscation(`/cdn-cgi/l/email-protection`) → **정상(배포 환경)**. 홈 mainText 12자 차이도 동일 범주. 미반영·회귀 0.

## 2. 신규 대상 5개 경로 일치성
| 경로 | 렌더 경로 | og:image | schema | 판정 |
|---|---|---|---|---|
| /부산한정승인 | priority-seo `qualified-acceptance` | priority-qualified-acceptance.jpg | WebPage·Breadcrumb 자기 URL | 정상 |
| /부산상속포기 | naver-recovery `renunciation` | busan-inheritance-renunciation.jpg | Breadcrumb 홈>상속>부산상속법무사>자기 | 정상 |
| /부산상속등기 | keyword-hub(PageDataTemplate) | busan-inheritance-registration.jpg | Service·FAQPage·ItemList(8) 자기 @id | 정상 |
| /부산법인설립등기 | keyword-hub(company-establishment-busan) | busan-company-establishment.jpg | Service·ItemList(8), **FAQPage 없음** | 경미 결함 2건 |
| /부산법률상담 | counsel-intent | **썸네일-등기필증_상속** | Service·FAQPage 자기 URL | 확정 결함 |

타 업무 혼입 스캔(본문 main): 법인 용어가 상속 3페이지에, 상속 용어(상속인 구성·가족관계·재산 목록·피상속인 등)가 법인설립·법률상담에 0건. 공통 프로필 문구("개인회생·파산 신청…상담을 직접 맡습니다")만 공통 → 정상. 공통 fallback(`template-helpers.ts:26-31` DEFAULT_DOCUMENTS, `keyword-builder.ts:34-36` lawyerOpinion "가족관계") 5개 경로 유입 0.

확정:
- **A. /부산법률상담 OG·primaryImageOfPage = 상속 등기필증 사진** — `src/lib/counsel-intent/landing-config.ts:9` `serviceSlug: "inheritance-registration"` 고정 → `src/lib/pageData/builders.ts:671` `getServiceImage(page.serviceSlug)` → `src/lib/site-images.ts:157`. og:image:alt는 "다옴법무사사무소 - 안윤정 법무사"(사진과 불일치). /상속과 동일 이미지. 도입 413c9ed(07-26), 회귀 아님.
- **B. /부산법인설립등기 FAQ 답변에 원시 마크다운 경로** — 화면·초기 HTML에 "`/법인정관업무`", "`/법인정관인증확인`"이 백틱째 노출. `src/lib/local-landing/company-establishment-busan.ts:47,52`(e064454 08-07). 같은 패턴 `src/lib/local-landing/keyword-topics.ts:420` → /부산법인법무사에 5개 노출.
- **C. 전역 LegalService OfferCatalog "법인설립등기" → /부산법인등기** — `src/lib/seo/json-ld.ts:133`(9b5a989 08-18). 전 페이지 JSON-LD에서 설립 엔티티가 변경 허브를 가리킴. 전용 /부산법인설립등기 존재.
- 경미: /부산법인설립등기 이미지 오버레이 "누락된 변경부터 목록으로 만듭니다"(변경 업무 문구) — `src/lib/article-visuals/resolve.ts:157-160` corporate.beforeProcedures를 해시 선택(:411). 
- 경미: /부산법인설립등기 FAQ 화면 노출(8개+)인데 FAQPage 없음 — `builders.ts:627-644` includeFaqSchema 허용목록에 미포함.
- 경미: /부산법률상담 상황 카드 1번 "공공 법률상담·분야별 상담 창구 먼저 확인"이 /부산법무사상담으로 연결(2번과 같은 href) — `counsel-intent/content.ts:59,64`.

## 3. /법인등기 상속 혼입 재확인
운영·out/ 모두 '상속인 구성' 0, '가족관계증명서·재산 목록' 0, '가족관계' 0(/부산법인등기·/부산법인법무사·/부산법인설립등기도 0). '상속' 59회는 공통 내비·푸터·OfferCatalog. → **정상(운영 반영)**.

## 4. 문의 회귀
- /contact/inquiry 운영 200: `<form>` 1, textarea 1, input 5, submit 1, `quick-inquiry__turnstile` + `-label` + `-host(min-h 65px)` 존재(빌드 키 주입 → SSR "ready" 분기, `TurnstileWidget.tsx:145-150`).
- out/는 같은 자리 "보안 확인 준비 중…"(loading 분기, `TurnstileWidget.tsx:128-134`) — 로컬 빌드에 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 없음 → 런타임 `/api/turnstile-config` 폴백(`turnstile-site-key.ts:25-33`). **환경 차이, 회귀 아님**.
- b201a0b에 `functions/api/quick-inquiry.ts`, `functions/_lib/quick-inquiry/{handler,validate,rate-limit,notify,sanitize}.ts`, `functions/api/turnstile-config.ts` 존재. handler에 siteverify·TURNSTILE_SECRET_KEY 검증 있음. GET /api/quick-inquiry → 405(POST 전용, 정상).
- 운영 /api/turnstile-config: 200, application/json, `Cache-Control: public, max-age=300`, 형태 `{siteKey: string}`(값 존재, 출력 안 함). 정상.

## 5. 최근 3개 배포 — 대상 경로 관련 소스만
| sha | 커밋 | 대상 관련 변경 |
|---|---|---|
| 83282bc | 10-13 20:59 | `HeroContactButtons.tsx`(221), `PageHero.tsx`(16) — 전 페이지 히어로 CTA. 대상 5개 title/메타 무변경 |
| ca55849 | 10-13 21:45 | `globals.css`(494), `HomeHeroChannels.tsx` — 홈만 |
| b201a0b | 10-13 22:50 | `metadata.ts`(+2 max-image-preview, 전 경로), `PageDataTemplate.tsx`(ItemList 중복 제거·@id), `SeoCarouselJsonLd.tsx`, `PageTextCard`(9개 경로, 신규 5개 미포함), `NaverRecoveryTargetView`·`PrioritySeoPageView`(+카드 슬롯, 해당 경로 없으면 무출력), `builders.ts`·`keyword-builder.ts`(법인 lawyerOpinion)·`keyword-topics.ts`(/부산법인법무사 title, 임원 기한), `corporate-registration-busan.ts` |
company-establishment-busan.ts 최종 변경은 0de4748(10-13 20:59). 대상 5개 title·H1·canonical 3개 배포 동안 변경 0(baseline 동일).
