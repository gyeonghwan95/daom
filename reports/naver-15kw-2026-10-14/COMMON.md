# 공통 증거 (루트, 2026-10-14)

## 저장소·배포
- HEAD = origin/main = 운영 = `b201a0b` (커밋 10-13 22:50, Cloudflare Pages 성공 22:59 KST). 작업 트리 깨끗함.
- `b201a0b`에 포함된 직전 작업(재조사·재수정 금지, 이미 운영 반영): reports/naver-12kw-2026-10-13/NAVER_12KEYWORDS_REPORT.md
  - 토픽 허브 상담 예시 상속 문장 혼입 수정, /법인등기 법인 준비 정보, 법인 lawyerOpinion, 범위표 라벨, 내부 메모 제거, '｜' 문자열, 임원 기한 기산점 3곳, /부산법인법무사 title 어순, /부산법인설립전문법무사 description, ItemList @id·name·중복 제거, max-image-preview, 텍스트 카드 7종(public/image/cards/*.jpg 1200×600, 생성기 reports/naver-12kw-2026-10-13/cards/build-cards.mjs, 데이터 src/data/seo/page-text-cards.ts, 컴포넌트 src/components/media/PageTextCard.tsx), /부산법인등기·/법인등기 대표 사진 분리.
- 이전 상속 작업: reports/naver-inheritance-2026-10-12/ (상속 factory 분기, 4개 상속 대표 법률 쟁점 정상).
- 운영 Turnstile 키 정상(/api/turnstile-config). 문의 실제 전송 금지.

## 관측 기록(재사용)
- reports/naver-12kw-2026-10-13/serp-observations.csv (10-13 22:11, 12개), reports/naver-inheritance-2026-10-12/serp-observations.csv (10-12 23시, 상속 7개), reports/naver-recovery-2026-10-12/serp-observations.csv (10-12 22시, 31개). 네이버 성과 내보내기·Yeti 로그 없음.

## 로컬
- out/ = b201a0b. 스냅샷 reports/google-index-2026-10-11/protect/15kw-before.json. 파서 scripts/lib/seo-recovery/scan-out.mjs parsePage. 다시 빌드 금지.
- 이미지: public/image 원본, /_img/<path>.<w>.webp 변환(scripts/optimize-images.mjs), 대표 SERP JPG 생성기 scripts/generate-representative-images.ts + src/data/seo/page-thumbnails.ts + src/data/media/thumbnail-portraits.ts, 1:1 카드 public/generated/thumbnails, field-photo src/data/seo/field-photo-visuals.ts. 인벤토리·contact sheet: reports/naver-12kw-2026-10-13/image-inventory.csv, contact-sheet.jpg(재사용).
- 폰트: Noto Sans KR(OFL), C:/Windows/Fonts/NotoSansKR-VF.ttf, sharp. 이미지 생성 AI 없음.
- 블로그: public/data/naver-blog-posts.json(2026-06-29 캐시 8건, 오래됨), scripts/fetch-naver-blog.mjs. 공개 RSS https://rss.blog.naver.com/law-yoon-91.xml.

## 규칙
조사만, 소스 수정 금지. 결과는 이 폴더 agentN-*.md / csv. 네트워크 동시성 ≤4, 재시도 1회. 네이버 검색은 ①만. 확정/가설/정상/접근 불가. 최종 응답 600~800토큰, 제안 최대 3개(증거 → 판정 → 최소 수정 → 보호 대상 → 검증).
