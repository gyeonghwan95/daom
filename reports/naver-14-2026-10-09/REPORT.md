# 네이버 필수 14개 검색어 점검·수정 — 2026-10-09~10

기준: 로컬 HEAD `ca045b8`(직전 작업 커밋, **운영 미배포** — 운영 /부산개인파산 title이 여전히 구버전). 이번 작업 기준표 `before.json` = ca045b8 빌드.
하위 에이전트 미사용. A/B/C 세 관점은 같은 공통 자료로 주 실행자가 **순차** 검토했다.

## 공통 사실 (파일)
- `before.json`/`after.json`: out/ 1,883 route의 title·description·H1·canonical·robots·sitemap·링크·본문 해시
- `tech-scan.json`: 전체 head 태그 중복·canonical 절대 URL·이중 인코딩·깨진 내부링크
- `live-live.json`: 운영 GET 27개(Yeti UA) / `audit-before|after.json`: 담당 URL 문장 반복·카드 반복·alt·역 표기·문자열 출현
- `keyword-map-14.csv`(14행, 정확 문자열·중복·누락 프로그램 검사 통과), `extra-candidates.csv`(13행), `seo-facts.json`
- 네이버 관측: 14개는 `../seo-recovery-2026-10-09/naver-observe-before.json`(10-09 22:57 KST) 재사용, 추가 13개는 `naver-observe-extra13.json`(1회)

## 세 관점 → 채택/보류
| 관점 | 최선안 | 결정 |
|---|---|---|
| A 기술 | 재현 오류 없음: 27개 200·리다이렉트 없음·X-Robots 없음, robots.txt text/plain(Yeti 허용), sitemap XML, HTML `must-revalidate`, Functions는 /api만. head 중복은 noindex 404 페이지의 robots 2개뿐. 깨진 링크·이중 인코딩 0 | 코드 수정 없음(관측 기록만) |
| B 의도·링크 | 14개 담당 확정. 후보와 다른 2건(법인전문→/부산법인등기, 상속전문→/부산상속전문법무사)은 기존 정책·관측 근거. /부산법무사상담 업무 표가 업무명만 있고 링크가 없어 자연 앵커 5개 연결 | 채택 |
| C 품질·중복·신뢰 | /상속·/법인등기 문단 반복은 HEAD에서 이미 해소(재현 0). /부산법무사비용 비용 요인 문장 3회 반복 제거. /센텀법무사 '센텀시티역 인근 법무사' 앵커를 사무소 기록과 일치시킴 | 채택 |

보류: 법인/등기 '전문' 브리지의 noindex+canonical(2026-09-22 정책, 오류 아님), 본점이전·재송동·센텀의 2회 재진술(요약·공유 템플릿), /404 robots 2개(색인 대상 아님), 보호 허브 slug 라벨 카드(직전 보고 보류 유지).

## 확인 원인 → 수정 → 검증
1. **비용 페이지 필드 재사용 반복**: `src/lib/local-landing/expansion/builder-expansion.ts:442-445`(FAQ 답) · `:516-517`(costGuide)이 `legalIssues`(상담 포인트, `:499`)와 같은 `costFactors` 문장을 다시 출력. out/부산법무사비용에서 3회×2문장·2회×3문장 재현. 영향: 문장형 요인을 쓰는 2개(/부산법무사비용, /부산법무사보수표). 수정: FAQ는 직접 답, costGuide는 보수/공과금 구분 + 기존 timelineNotes. 검증: 재감사에서 반복 0, title·H1·description 불변.
2. **역 표기 불일치**: `src/lib/hub/registry.ts:117` /location 앵커 '센텀시티역 인근 법무사' ↔ `src/lib/office-location.ts:11` '동해선 재송역, 센텀역 도보 5분'. 영향 1곳(/센텀법무사). 수정: '센텀역·재송역 도보권 사무소 위치'.
3. **상담 페이지 업무 연결 부재**: `src/lib/priority-seo/existing/busan-consult.ts:57-73` 표에 업무명만 있음. 표 아래 기존 문장에 /부산상속법무사 /부산소유권이전등기 /부산법인등기 /부산공탁 /부산지방법원지급명령 연결.
4. lastmod: 실제 본문이 바뀐 /부산법무사상담·/센텀법무사만 `scripts/lib/sitemap/lastmod-pins.json`에 2026-10-09. sitemap 변경 URL 2개.

## 전후 비교 (`diff-before-after.json`)
route 삭제·추가 0 / canonical·robots·sitemap 포함 변화 0 / title·H1·description 변화 0 / 본문 변화 4(위 의도 대상) / 링크 변화 1(/부산법무사상담 +5, 손실 0).
전 route tel·/contact 링크·JSON-LD 타입 변화 0. `npm run build` 성공, `npm test` 17/17, sitemap 검증 통과.
`eslint --max-warnings 0`: builder-expansion.ts:37 `defaultRegistryGuide` 미사용 경고 1(기존 코드, 이번 diff 밖). `tsc`: reserved-inheritance-intents.ts 기존 오류 1(이번 diff 밖).
미실행: 모바일/PC 스크린샷(레이아웃 코드 변경 없음), 실제 문의 발송(금지).

## 미확인
서치어드바이저 색인·수집·유입, 실제 Yeti 수집 로그, 검색량. 네이버 관측은 순위가 아닌 외부 도메인 등장 순서이며 영역 구분 불가, 같은 검색어도 몇 분 사이 결과가 달랐다. 공식 가이드(searchadvisor)는 WebFetch 차단·JS 렌더링으로 본문 미확인.

## 복구
파일 단위: `git checkout ca045b8 -- src/lib/local-landing/expansion/builder-expansion.ts src/lib/hub/registry.ts src/lib/priority-seo/existing/busan-consult.ts scripts/lib/sitemap/lastmod-pins.json` 후 `npm run build`.

## 배포 후 점검
수집 요청 목록: `index-request-urls.txt`(10개, 이전 미배포분 포함). 관측: `node reports/naver-14-2026-10-09/naver-observe.mjs <label>`로 같은 조건 재관측. 7/14/28일은 관측 일정이며 회복 기한이 아니다. 하루 변동으로 전체 롤백하지 않는다.
