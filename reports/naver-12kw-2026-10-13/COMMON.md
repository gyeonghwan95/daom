# 공통 증거 (루트, 2026-10-13 22:10 KST)

## 저장소·배포
- HEAD = origin/main = `ca55849` (사용자 커밋). 운영 = `ca55849` (Cloudflare Pages 성공 10-13 21:52 KST). 작업 트리 깨끗함.
- 즉 10-12~13 작업(본문 hidden 해소, /부산법무사 앵커, 홈 패널, 상속 factory 분기, 추천 FAQ, 본문 상단 링크 UI)은 **이미 운영 반영**. 그 이전 관측 순위를 이 변경의 결과로 해석 금지(재수집 전).
- 이전 보고서(재조사 금지 항목): `reports/naver-recovery-2026-10-12/NAVER_RECOVERY_REPORT.md`(기술 정상: robots·sitemap·리디렉션·soft404·UA 응답), `reports/naver-inheritance-2026-10-12/NAVER_INHERITANCE_REPORT.md`(상속 4개 대표 법률 쟁점 정상, factory 상속 분기 완료).
- 관측 기록: `reports/naver-recovery-2026-10-12/serp-observations.csv`(10-12 22시, 31개), `reports/naver-inheritance-2026-10-12/serp-observations.csv`(10-12 23시, 상속 7개). 네이버 성과 내보내기 없음.

## 로컬 빌드
- out/ = ca55849와 같은 소스. 1,893 html, sitemap 1,635. 파서 `scripts/lib/seo-recovery/scan-out.mjs` parsePage. 스냅샷 `reports/google-index-2026-10-11/protect/12kw-before.json`. 다시 빌드 금지.
- 라우트 존재: /부산등기전문법무사(noindex→/부산등기법무사 기존 정책), /부산법인전문법무사(noindex→/부산법인등기 기존 정책), /법인등기(토픽 허브). /부산법무사사무소 없음.

## 루트가 확인한 확정 결함
1. `src/lib/pageData/builders.ts:715` 토픽 허브 공통 '상담 예시' 본문이 모든 허브에 "상속인 구성·채무·부동산 유무에 따라…" → /법인등기·/부동산등기·/개인회생파산·/민사소송 등에 상속 문장 혼입.
2. /법인등기 준비서류 = 공통 기본값(`src/lib/pageData/template-helpers.ts:28` "가족관계증명서·재산 목록(상속·가사 해당 시)", "등기부등본·계약서·협의서"). 회생 허브는 10-11에 별도 documents로 교체됨(`topic-hubs/config.ts:350`).
3. `src/lib/local-landing/keyword-builder.ts:36` lawyerOpinion 공통 문장 "등기부·계약서·가족관계를 함께 보며" → /부산법인법무사 등 법인 키워드 페이지에도 출력. (`selection-builder.ts:12`도 유사)

## 이미지·목록 현황
- 기존 ItemList: `src/components/carousel/SeoCarouselJsonLd.tsx`(items≥4일 때, image=representativeImage 1200 우선, url=canonical) — 사용처 10곳(HomePopularSearches '상황별로 찾는 법무사 업무', PageDataTemplate 등). 데이터: `src/lib/seo/carousel-images.ts`, `src/lib/seo/page-visuals.ts`, `src/data/seo/carousel-image-manifest.ts`, `page-image-manifest.ts`.
- 이미지: public/image/ 132개(사무소·상담·강의·구청·썸네일·서류 등), 변환 `/_img/<path>.<w>.webp`(scripts/optimize-images.mjs, `src/generated/image-dimensions.json`), OG 해석 `src/lib/seo/share-image.ts`.
- 폰트: 사이트 = Noto Sans KR(OFL). 로컬 C:/Windows/Fonts/NotoSansKR-VF.ttf 존재. sharp 있음. 이미지 생성 AI 도구 없음 → 코드 합성.

## 규칙
- 조사만, 소스 수정 금지. 결과는 이 폴더 agentN-*.md / csv. 네트워크 동시성 ≤4, 재시도 1회. 네이버 검색은 ②만.
- 확정/가설/정상/접근 불가 구분. 최종 응답 600~800토큰, 제안 최대 3개: 증거 → 확정·가설 → 최소 수정 → 보호 대상 → 검증.
