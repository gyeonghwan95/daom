# ② Git·배포 회귀 (agent2, 2026-10-14)

범위: 10-11 18:37(웹 15위 관측) 이후 배포. 6f75fa2~e231514는 reports/naver-recovery-2026-10-12/git-regressions.csv에서 이미 다룸 → 새 커밋 4개만(0de4748·83282bc·ca55849·b201a0b). 상세는 git-regressions.csv.

## 1. 배포 커밋 (GitHub check-runs, Cloudflare Pages)
- 0de4748: 자체 check-run 없음 → 83282bc와 함께 push, 10-13 21:07 배포
- 83282bc 21:07 · ca55849 21:52 · b201a0b 22:59 (모두 success. GitHub `build` 체크는 계속 failure, 배포와 별개)
- 이 구간에서 `src/lib/priority-seo/existing/busan-lawyer.ts`, `src/app/page.tsx` 커밋 0건 → 홈 title/desc/H1/canonical 문자열, /부산법무사 title/desc/H1 무변.
- 홈 변경: 첫 화면 CTA 구성(0de4748·ca55849), 바로 찾는 안내 링크 +2, /부산법무사 앵커 문구 교체(전역), loading.tsx 삭제(원래 return null), robots에 max-image-preview:large(b201a0b), ItemList @id/name, 텍스트 카드 1장.
- 시점: 모두 10-13 21시 이후 배포. 10-10에 이미 웹 영역 미검출, 10-12 22시에도 미발견 → **선행 하락의 원인 후보가 될 수 없음**(시간 순서). 이후 영향은 관측 전이라 미확인.

## 2. 빌드 스크립트 덮어쓰기
- build-static.mjs 후처리는 fix-html-dom-order.mjs(footer를 main 뒤로 이동)뿐, title/meta 미수정. prebuild 생성 스크립트는 manifest·sitemap·admin JSON만 씀.
- out/index.html: title '부산 법무사 안윤정 | 다옴법무사사무소', H1 '부산 법무사 안윤정', desc = metadata.ts HOME_* 와 일치. canonical 홈, robots 'index, follow, max-image-preview:large'.
- out/부산법무사.html: title/desc/H1 = busan-lawyer.ts metaTitle/description/h1 와 일치.
- sitemap tier-1: / lastmod 2026-10-13, /부산법무사 2026-10-10 (HEAD=작업트리 동일).
- 판정: **정상**(소스와 다르게 덮어쓰는 단계 없음).

## 3. 운영 live-home.html vs out/index.html
| 항목 | 결과 | 분류 |
|---|---|---|
| title·H1·desc·canonical·robots | 동일 | 정상 |
| a 링크 수 | 194=194. 차이 1개: mailto ↔ /cdn-cgi/l/email-protection | 캐시/CDN(Cloudflare 이메일 난독화) |
| JSON-LD | 16=16. OfferCatalog '법인설립등기' url /부산법인등기(운영)→/부산법인설립등기(out) | 미배포(15kw 미커밋 json-ld.ts) |
| 본문 텍스트 | out에만 '지도를 불러오는 중…'(운영은 OSM iframe) | 빌드 환경 차이(Kakao 키 유무, OfficeMap mode 초기값). 회귀 아님 |
- 회귀: 없음.

## 결론
홈·/부산법무사의 검색 핵심 필드는 GOOD 후보 이후 현재까지 Git·빌드·운영 모두 일치. 이 영역에서 순위 하락을 설명하는 회귀 증거 없음(상관 관계도 시간 순서상 성립 안 함).
