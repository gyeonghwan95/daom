# 공통 증거 (루트, 2026-10-12 23:10 KST)

## 저장소·배포
- HEAD = origin/main = `e231514`. 운영 = `e231514` (Cloudflare Pages 최종 성공 10-12 22:34 KST 재배포, Turnstile 키 설정됨).
- 작업 트리에 **미커밋 변경 다수**(직전 '부산 법무사' 복구 작업: loading.tsx 7개 삭제로 본문 hidden 해소, /부산법무사 인바운드 앵커 문구, 홈 첫 화면 버튼(HomeHeroChannels), /about 문장, 문의 hint, 사이드바 '후기·사진'). 보존할 것. 운영에는 아직 없음 → **운영 하락 원인으로 설명 금지**.
- 직전 작업 보고서: `reports/naver-recovery-2026-10-12/NAVER_RECOVERY_REPORT.md`, findings.md (기술·수집 정상 항목 재조사 불필요: robots, sitemap, 리디렉션, soft404, UA별 응답, 자산).
- 순위 기록: `audit/naver-ranks.csv`(10-11 18:37), `reports/naver-7kw-2026-10-11/naver-observe-before.json`(10-11 12:3x), `reports/naver-recovery-2026-10-12/naver-observe-now.json`(10-12 22:03, 31개 검색어 — 상속 관련 포함). 네이버 성과 내보내기 없음.
- 이전 상속 보고서: `reports/inheritance-serp/*.csv`, `reports/naver-inheritance-keywords/2026-10-02/`, `reports/inheritance-reset/2026-09-26/`, `reports/region-inheritance-2026-10-10/REPORT.md`. 날짜·범위를 확인하고 현재 상태로 가정하지 말 것.

## 로컬 빌드 (out/ = e231514 + 미커밋 변경)
- 1,893 html, sitemap 1,635 loc. 파서 `scripts/lib/seo-recovery/scan-out.mjs` `parsePage(html)` → title, description, h1s, canonical, robots, mainText, links.
- 스냅샷 `reports/google-index-2026-10-11/protect/inh-before.json` (수정 전 기준). 다시 빌드하지 말 것.
- 운영 응답: `reports/naver-inheritance-2026-10-12/live-live.json` (check-paths.json 18개, Yeti UA 요청 — 실제 Yeti 수집 증명 아님).

## 대상 URL → 소스
| URL | 소스(확인된 위치) |
|---|---|
| /상속 | 전국 종합 허브. `src/lib/topic-hubs/config.ts` 등 (담당이 확인) |
| /부산상속법무사 | `src/lib/local-landing/keyword-topics.ts`, `keyword-builder.ts:207` |
| /부산상속전문법무사 | `src/lib/naver-recovery/specialist.ts`, overrides/busan-inheritance-specialist-lawyer.ts |
| /부산상속포기 | `src/lib/naver-recovery/renunciation.ts` |
| /부산상속법무사추천 | `src/lib/local-landing/search-intent/seeds.ts:40` (category "recommend", serviceSlug inheritance-registration) + 공통 생성기 `search-intent/factory.ts` |
| /부산한정승인 | `src/lib/priority-seo/existing/qualified-acceptance.ts` |
| champion 정의 | `src/data/seo/page-relations.ts:390-452` |

## 루트가 이미 확인한 확정 결함 (out/부산상속법무사추천.html)
`search-intent/factory.ts` 공통 문구가 상속 추천 페이지에 그대로 들어감:
- :27 FAQ "…등기부·계약서·가족관계·**법인 결의서류** 등 핵심 자료"
- :133 절차 "보정 통지가 있으면 … 완료·**등기필정보**를 확인" (포기·한정승인 결과와 혼동)
- :141 실수 "기한(상속 3개월, **임원변경** 등)"
- FAQ "부동산 소재지·법인 본점·사건 유형에 따라 관할 등기소·법원" (포기·한정승인 = 상속개시지 가정법원)
같은 factory를 쓰는 다른 search-intent 페이지(법인·등기 등)의 정상 문구는 지키고, 상속 serviceSlug 분기만 고친다.

## 규칙
- 조사만. 소스 수정 금지(결과는 이 폴더의 agentN-*.md / csv).
- 네트워크 동시성 ≤4, 타임아웃, 재시도 1회. 네이버 검색은 담당 ①만.
- 확정 결함 / 가설 / 정상 / 접근 불가 구분. 최종 응답 600~800토큰, 제안 최대 3개: 증거 → 결함/가설 → 최소 수정 → 보호 범위 → 검증.
