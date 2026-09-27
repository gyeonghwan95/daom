# 21 Build validation — 2026-09-27

| 항목 | 결과 |
|---|---|
| npm run build (최종) | UNKNOWN — prebuild 검증(sitemap, seo-validate, keyword-ownership, region-boilerplate) 포함 |
| npx tsc --noEmit | 신규 오류 0. 기존 오류 1건: src/data/seoExperiments/reserved-inheritance-intents.ts(42) — 이번 변경과 무관(커밋된 파일, 미수정) |
| eslint (변경 파일) | 오류 0, 경고 0 (content.ts 미사용 import 1건 제거) |
| 보호 URL 해시 게이트 | NON_TARGET_CHANGED_URLS = 0 (protected 1649) |
| sitemap | 추가 /부산대학교특강 · 삭제 0 · 비target lastmod 변경 0 |
| 이웃 강의 페이지 head(JSON-LD·og·robots) vs 라이브 | 14/14 동일 |
| target QA | 8/8 OK (H1 1개, desc 80~120, 관련링크 5~8, 강의 문의폼·기관명 필수, 강사료 기준 문구, 60/90/120/3h+ 커리큘럼, 상담 CTA 없음, 금지 표현 없음, FAQ schema, og:image 고유) |
| 유사도 | 84쌍, FAIL 0. 최대 first700 0.2887, body 0.5086, [REGION] first700 0.3008, [REGION] body 0.4934 |
| 모바일 375/390/430 | 24건 · 가로 넘침 0 · 강의 CTA 24/24 (hero CTA + mobile bottom bar '출강 문의서 작성') |
| 키워드 커버리지 | P0 GAP=0, P1 GAP=0 |

## 참고
- 유사도: TF-IDF cosine(대상 15개 문서 기준)과 3-gram shingle Jaccard 중 큰 값. [REGION] 비교는 지역명·형식어(특강/강연/강의/세미나/교육/출강)를 shingle에서는 placeholder로, cosine에서는 제거 후 계산.
- meta keywords 태그는 사이트 전역에 이미 존재(라이브 동일)하며 이번에 추가하지 않음.
- 헤더 상담 상태바·푸터 '상담 안내'는 전역 요소라 변경하지 않음(보호 원칙). target 페이지에서는 사이드바 상담 패널을 숨기고 모바일 하단 바를 강의 문의용으로 교체.
