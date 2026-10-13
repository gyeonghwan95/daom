# ③ 기술·Git·오노출 경로 — 2026-10-13 22:1x KST

산출물: `baseline.json`(운영+로컬 병합), `live-live.json`(live-check.mjs 원본). 소스 수정·checkout·reset 없음.

## 0. 주의 — 작업 트리 변경 발견
- `git status`: `src/lib/pageData/builders.ts` **미커밋 수정**(TOPIC_HUB_SITUATION 맵 추가, 루트 확정 결함 1 수정). 본 담당이 한 것 아님(다른 담당/루트 추정). 운영·out/에는 **미반영**(out/법인등기.html 21:30 빌드에 상속 문장 그대로).

## 1. 운영 baseline (19경로, Yeti UA, ca55849)
- 전부 200, 리디렉션 없음, X-Robots 없음. robots: 17개 `index, follow`, `/부산등기전문법무사`·`/부산법인전문법무사` `noindex, follow`(canonical → /부산등기법무사, /부산법인등기 — 기존 정책).
- title/description/canonical/robots 각 1개(중복 0). JSON-LD 파싱 오류 0.
- og:image 19개 고유 URL 모두 GET 200·image/jpeg·56~201KB(baseline.json `ogImages`).
- 운영 vs 로컬(out/) 차이: title·desc·h1·canonical·robots·og·JSON-LD **동일**. 차이는 a href +1·본문 몇 글자뿐 = Cloudflare Email Obfuscation이 mailto를 `/cdn-cgi/l/email-protection`·"[email protected]"로 바꿈(JSON-LD email은 그대로) → **정상(경미)**. 홈 mainText 12자 차이(지도 로딩 문구)도 같은 범주.

## 2. 법인·등기·추천·상담·홈 경로 주제 불일치
확정(신규):
- **A. /부산법인법무사 ItemList JSON-LD 2개 중복** — `src/components/page-data/PageDataTemplate.tsx:273-275`(`CorporateRegistrationChoiceCards` → `src/components/registration/RegistrationChoiceCards.tsx:13,27`, 7개)와 `PageDataTemplate.tsx:409-422`(같은 `getRelatedContentCarousel`, 8개). 화면 캐러셀도 2회. /부산부동산등기도 동일 구조(:270-272). 도입 f1ae663(09-21)+86ec3a1(09-23).
- **B. noindex 별칭 페이지 엔티티 충돌** — /부산법인전문법무사·/부산등기전문법무사: og:url·WebPage `@id/url`·breadcrumb 마지막 item = 대표 URL(createPageMetadata `resolveCanonicalPath`, `src/lib/seo/metadata.ts:103`)인데 WebPage name은 별칭 title, og:image(썸네일-계약임원/등기소) ≠ primaryImageOfPage(대표 페이지 이미지). noindex라 영향 제한 → 보류 권장.
- **C. /법인등기 title 원문이 본문·앵커·schema에 삽입** — `topic-hubs/config.ts:156` title "법인설립·임원변경·본점이전｜부산 법인등기"가 breadcrumb·Service name·상담 예시 본문(`builders.ts:732-734`(작업 트리 기준))·내부 앵커 12개에 '｜' 포함 그대로. 경미.
- (루트 확정 1~3 재확인: builders.ts 상담예시[작업 트리 수정 중], template-helpers.ts:26-31 DEFAULT_DOCUMENTS, keyword-builder.ts:34-36·selection-builder.ts:10-12 "가족관계" — 모두 30일 이전 도입(8df0bd3 06-28, 5e82a2b 08-17, 108c37e 09-02).)
- 콘텐츠 오타: /부산법인등기 FAQ "임원변경을 **늦기면**".

정상: og:url=canonical(색인 페이지 전부), primaryImageOfPage=og:image(색인 페이지 전부, 업무 일치), 법인 3개 페이지 Service url 자기 경로, layout.tsx는 robots/title 덮어쓰기 없음(`src/app/layout.tsx:20-53`), 추천·상담·홈 schema url 자기 경로.

## 3. 최근 30일 대상 경로 관련 소스 변경 (상관≠원인)
| sha | 커밋 KST | 배포 KST | 변경 | 대상 |
|---|---|---|---|---|
| f1ae663 | 09-21 14:52 | 09-21 14:57 | 법인 choice 캐러셀+ItemList | /부산법인법무사 |
| 24c5348 | 09-22 22:12 | 09-22 22:18 | 캐러셀 교체, corporate-registration-busan 주석 | /부산법인법무사, /부산법인등기 |
| 86ec3a1 | 09-23 22:12 | 09-23 22:17 | 하단 related 캐러셀+ItemList 추가(중복 시작) | /부산법인법무사 외 PageDataTemplate |
| 50d0315 | 10-01 22:09 | 10-01 22:15 | priority-seo 전환: 본문 전체·OG 이미지 교체(title·H1 유지) | /부산법무사추천, /부산법무사상담, /부산법무사 |
| 3005d28 | 10-09 23:46* | 10-10 00:14 | 상담 본문 링크 5개(/부산법인등기 포함) | /부산법무사상담 |
| 98ba901 | 10-10 01:02 | 10-10 01:10 | /부산법무사 title·H1 '다옴법무사사무소…'로 | /부산법무사 |
| f09cb6d | 10-10 22:52 | (26ab245와) | 추천 topCta | /부산법무사추천 |
| 26ab245 | 10-11 13:38 | – | 상담 문구 | /부산법무사상담 |
| 0de4748/ca55849 | 10-13 20:59/21:45 | 21:52 | topic-hubs config(법인 줄 0) | – |
*3005d28 커밋 10-10 00:08. 법인 3개(/부산법인법무사·/부산법인등기·/법인등기)·/부산등기법무사의 title·H1·canonical·robots는 30일간 변경 0(-S 검색: 07-24~08-20 도입). check-runs 신규 조회 5회(0de4748은 결과 없음).

## 4. max-image-preview
- 현재: `<meta name="robots">`에는 없음. `googlebot` 메타에만 `max-image-preview:large`(`src/lib/seo/metadata.ts:40-49` INDEX_ROBOTS.googleBot). out/ 1,639 index 페이지 동일, noindex 255개(244 `noindex, follow`, 9 `noindex,nofollow,nocache`, 2 `noindex`).
- Yeti 지원 여부는 공식 확인 불가 → 효과는 가설.
- 넣는 법: INDEX_ROBOTS 최상위에 `"max-image-preview": "large"` 한 줄(Next Robots 타입 지원, `node_modules/next/dist/lib/metadata/types/metadata-types.d.ts:53`). noIndex 분기(`metadata.ts:158-160` `{index:false, follow:true}`)와 cases/press/blog/[childSlug]:138 고정 noindex는 건드리지 않음 → noindex 보존. `[childSlug]/page.tsx:235`는 meta.robots 상속이라 자동 반영.
