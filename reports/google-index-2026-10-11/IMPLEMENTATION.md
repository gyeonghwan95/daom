# Google 색인 가능성 개선 — 구현·검증 기록 (2026-10-11)

진단은 `REPORT.md`에 있습니다. 이번 실행에서는 커밋·push·배포·계정 설정·색인 제출을 하지 않았습니다. 색인 회복, 순위 유지, 네이버 무영향은 보장하지 않습니다.

## 0. 기준점(확인 2026-10-11 22:19 KST)

| 항목 | 값 |
|---|---|
| 로컬 | branch `main`, HEAD `6cb8a32`, 작업 전 트리에는 사용자가 추가한 미추적 이미지 16개만 있었음(그대로 둠) |
| 운영 | `6cb8a32`, Cloudflare Pages check-run 성공 2026-10-11T12:49:08Z(21:49 KST). 로컬 HEAD와 같음 |
| 기준선 | 수정 전 HEAD로 production build를 하고 `protect/baseline.json`에 저장. 페이지 1,893개, 사이트맵 loc 1,635개, 하위 사이트맵 9개 |

## 1. 변경 내용

### 1-1. 업무·관할 문장 정정(상속포기·한정승인·개인회생·개인파산)

- 새 파일 `src/lib/seo-landing/service-intent-fixes.ts`. 확인된 결함 문장만 같은 자리에서 바꾸는 규칙 표(30개)입니다.
  - 대상은 스펙의 명시적 `serviceId`가 `inheritance-renunciation`·`qualified-acceptance`(가정법원) 또는 `personal-rehabilitation`·`bankruptcy`(회생법원)인 페이지입니다.
  - 그중에서도 업무가 지정된 페이지 타입(`region-service`·`service-intent`·`institution-service`·`special`)만, 모두 55개입니다.
  - `region-lawyer`(/사상역법무사), `institution-lawyer`(/부산가정법원법무사)는 여러 업무를 함께 안내하는 일반 페이지입니다. serviceId가 '관련 업무 첫 번째' 값일 뿐이라 제외했습니다.
  - 바꾸는 필드: introParagraphs, procedures, documents, consultationPoints, FAQ 답변, 상담 예시 본문, 섹션 본문·목록.
  - 바꾸지 않는 필드: title, meta, H1, intro, 섹션 제목, 링크, breadcrumb.
- `src/lib/seo-landing/page-data.ts`: 최종 PageData에 위 규칙을 적용하는 한 줄을 추가했습니다.
- `/개인회생파산`(토픽 허브)은 공통 기본 서류 목록의 '등기부등본·계약서·협의서' 항목이 들어가던 문제입니다.
  - `src/lib/topic-hubs/types.ts`에 선택 필드 `documents`를 추가했습니다.
  - `src/lib/pageData/builders.ts`는 그 값이 있을 때만 사용합니다.
  - `src/lib/topic-hubs/config.ts`에서 이 허브만 해당 항목을 '소득·재산·채무를 확인할 수 있는 증빙 서류'로 바꿨습니다. 나머지 3개 항목은 기본값과 같습니다.
- 결과: 본문이 바뀐 URL은 49개입니다(대상 55개 중 결함 문장이 없던 7개는 그대로이고, 허브 1개가 더해짐). URL별로 빠지고 들어간 문장은 `fix/content-changes.csv`에 있습니다.

바꾼 내용의 종류:

| 결함 | 예 | 가정법원 업무 | 회생·파산 |
|---|---|---|---|
| 잘못된 관할 기준 | '부동산·법인 소재지 기준 확인이 우선', '접수 관할은 부동산 소재지·본점 주소 기준' | 피상속인 마지막 주소지(상속 개시지) 가정법원 | 채무자 주소지나 근무지 등을 관할하는 회생법원 |
| 등기 절차 혼입 | 본등기 일정, 등기필 전달, 전자등기, 등기원인 문구, 말소·승계 설계 | 법원 접수 방식, 심판문 전달, 상속채무 자료 | 결정문 전달, 채무 목록 |
| 처분 위험 | '진행 중인 대출·매매가 있으면 연동 순서를 알려 주세요' | 상속재산을 처분하기 전에 상담(처분 시 단순승인 간주) | 대출·재산 처분을 신청 전에 알림 |
| 날짜 혼입 | 잔금·결의·법인 변경일 | 사망일과 사망 사실을 안 날(3개월 기한) | 압류·소송·독촉 일정 |
| 서류 혼입 | 등기부등본·계약서·협의서, 매매계약서·협의분할서 | 신고인 인감증명서·주민등록등본, 피상속인 기본증명서·가족관계증명서·말소자 등본(사망 시기·법원에 따라 다름) | 소득·재산·채무 증빙 |
| 조사 | '상속포기은', '한정승인는', '개인회생는' | 상속포기는, 한정승인은 | 개인회생은 |

남겨 둔 것(정확하지만 업무와 거리가 있는 문장, 이번 범위 밖):
- 지역 소개 문장(예: '대저·명지·녹산 일대 … 법인·부동산 등기 수요')과 지역별 '상담에서 먼저 확인' 항목
- '상속·매매·증여·법인 변경은 출발 서류가 다릅니다', '공동명의·미성년·해외 거주…' 같은 일반 문장
- '법원·등기소 관할과 접수 창구…'(기관 소개 문장)
- 일반 법무사 페이지 2곳(/사상역법무사, /부산가정법원법무사)의 등기 중심 문장
- 다른 생성기(`src/lib/local-landing/builder.ts:476`)의 조사 오류 '상속포기은' 7건: /기장군상속포기, /북구상속포기, /사상구상속포기, /수영구상속포기, /연제구상속포기, /해운대구상속포기, /상속포기비용. 문법 오류일 뿐 법률 오류는 아니고, 이번 본문 변경 허용 범위 밖이라 별도 수정 필요사항으로 남김

### 1-2. 사이트맵 lastmod

- `scripts/lib/sitemap/lastmod.mjs`
  - URL별 manifest(`scripts/lib/sitemap/lastmod-manifest.json`)만 읽고 검증합니다(형식, 실재하는 날짜, 2000년 이후, 오늘 KST 이전).
  - manifest에 없는 URL은 lastmod를 생략합니다.
  - 파일 mtime, Git, 빌드 시각을 읽는 코드를 없앴습니다.
- 새 파일
  - `scripts/lib/sitemap/page-fingerprint.mjs`: 페이지 지문. title·description·H1과 main 안 문장 중 전체 15% 이상에 공통인 문장을 뺀 나머지로 계산합니다.
  - `scripts/update-lastmod-manifest.mjs`: 로컬 갱신. 지문이 바뀐 URL만 갱신하거나 `--paths`로 지정합니다. 바뀐 URL이 25%를 넘으면 중단합니다.
  - `scripts/init-lastmod-manifest.mjs`: 1회용 초기화 기록.
  - `scripts/lib/sitemap/lastmod-fingerprints.json`
  - `docs/sitemap-lastmod.md`: 갱신 절차
- 초기값: 1,635개 중 880개에 lastmod, 755개 생략. 근거별 개수는 아래와 같고, URL별 근거는 `lastmod-init.csv`에 있습니다.

| 근거 | URL 수 |
|---|---|
| 스냅샷 본문 변경 | 765 |
| 이번 정정 | 37 |
| 기존 고정값 | 29 |
| 스펙 dateModified | 21 |
| MDX Git | 17 |
| 제목·설명 변경 | 11 |

- 2025년 등 사이트 생성 전 날짜:
  - MDX 92개의 frontmatter 날짜는 모두 그 파일이 저장소에 생긴 날(2026-06-20 이후)보다 이릅니다. 저장소에 이전 사이트 이관 기록이 없어 날짜를 증명할 수 없으므로 lastmod 근거로 쓰지 않았습니다(인정 3개).
  - 대신 그 파일의 Git 생성일과 본문·제목·설명이 바뀐 커밋일을 썼습니다. 오류로 단정한 것은 아닙니다.
- 한계: 10/9~10/11 스냅샷 근거는 페이지 `<main>` 해시 비교입니다. 전체의 30% 넘게 바뀐 단계 8개는 공통 변경이라 제외했습니다. 남은 단계(예: 10/10 540개)에는 특정 템플릿군의 공통 패널 변경이 섞였을 수 있습니다.
- 날짜 분포: 2026-10-11 672개, 10-10 154개, 나머지는 6~10월 초.

### 1-3. 소개 썸네일(404 정리)

- 새 파일 `src/lib/lawyer-eeat-images-server.ts`의 `resolveEeatThumb()`: 빌드 시점에 `public/image/소개-*.jpg` 드롭인 파일이 실제로 있으면 그것을, 없으면 기존 사진을 src로 확정합니다. fs는 서버 컴포넌트에서만 씁니다.
- `src/components/profile/LawyerEeatProfile.tsx`의 두 호출부에 적용했습니다.
- 결과
  - out/의 HTML·RSC(.txt)에서 `소개-*` 7개 경로 참조가 0건이 됐습니다(이전에는 RSC 데이터와 브라우저 probe 요청에 남아 있었음).
  - /about·홈의 `<img>` src·srcSet·alt·width는 운영과 차이 0입니다(about 166개, 홈 73개 속성).
- 과거 경로 18개와 옛 JS 1개는 현재 src·out·RSS 어디에도 참조가 없어 404를 유지합니다. 복원·리디렉션하지 않았습니다.

### 1-4. 핵심 사이트맵

- `/sitemaps/tier-1-core.xml`은 이미 있어서 새로 만들지 않았습니다(18개, UTF-8, 절대 URL, priority·changefreq 없음).
- 로컬 빌드와 운영 모두 18개 전부 200·index·자기 canonical·H1 1개입니다.
- 이 파일에는 /상속, /부산상속포기, /부산한정승인, /부산법인등기가 들어 있지 않습니다(기존 분류 유지).

## 2. 법률 근거(확인 2026-10-11)

| 사실 | 근거 |
|---|---|
| 상속포기·한정승인은 상속 개시지 가정법원 관할 | 가사소송법 제44조 제1항 제6호(law.go.kr) |
| 상속은 피상속인 주소지에서 개시 | 민법 제998조(law.go.kr) |
| 상속개시 있음을 안 날부터 3개월 | 민법 제1019조 제1항(`reports/resources-2026-10-11/sources/civil1019.txt`) |
| 상속재산 처분 시 단순승인 간주 | 민법 제1026조 제1호(`.../civil1026.txt`) |
| 개인회생·파산: 채무자 보통재판적·근무 사무소·영업소 등 관할 회생법원 전속 | 채무자 회생 및 파산에 관한 법률 제3조 제1항(시행 2026-10-02, law.go.kr) |
| 상속포기 첨부서류: 청구인 인감증명·주민등록등본, 피상속인 기본증명서·가족관계증명서·말소자 등본, 2007.12.31. 이전 사망은 제적등본 | 대법원 전자민원센터 FAQ·가사비송 첨부서류 안내, 인천지방법원 안내(검색으로 확인, 표 원문 페이지는 DNS 오류로 직접 열지 못함). 사이트 문장은 '사망 시기와 법원에 따라 다름'으로 단정하지 않음 |

보호 메타데이터(title·description·H1)에서는 법률 오류를 발견하지 못했습니다.

## 3. 검증 결과

| 검사 | 결과 |
|---|---|
| 보호 필드: title·description·H1·canonical·meta robots·OG 제목/설명/이미지·naver 인증·JSON-LD @id/url·전체 a[href]+앵커·CTA 링크 | 1,893개 페이지 변경 0 |
| 페이지 삭제/추가 | 0 / 0 |
| /sitemap.xml loc 집합 | 1,635 → 1,635(삭제 0·추가 0). 하위 사이트맵 9개 모두 삭제 0·추가 0 |
| rss.xml·robots.txt·_headers·_redirects | 모두 동일 |
| 본문 변경 | 허용 범위(대상 55개 + /개인회생파산) 안 49개, 범위 밖 0 |
| 결함 재검사 `intent-mix.mjs` | 대상 업무 106개 중 결함 0(이전 37) |
| noindex 별칭 2개 | noindex, follow 및 canonical(/부산등기법무사, /부산법인등기) 유지 |
| 대표 페이지(/, /부산법무사, /상속, /부산상속등기, /부산법인등기, /강서구상속포기, /한정승인기간, /부산회생법원개인파산, /개인회생여성법무사, /개인회생파산) | index, follow, 자기 canonical, H1 1개 |
| 렌더링 | /강서구상속포기 모바일 390px, /부산회생법원개인파산 PC 1366px를 헤드리스 Chrome으로 캡처해 확인 |
| `npm test` | 31/31 통과(새 lastmod 테스트 6개 포함) |
| `tsc --noEmit` | 새 오류 0(기존 `reserved-inheritance-intents.ts` 1건만) |
| eslint(변경 src) | 오류·경고 0(scripts·tests는 설정상 제외 대상이라 무시 경고만 출력) |
| `validate-sitemap.mjs` | 통과 |
| 재실행 안정성 | 마지막 조사 규칙 보완 뒤 `update-lastmod-manifest.mjs`가 바뀐 URL을 정확히 1개(/개인파산준비서류)만 감지했고, 갱신 후 재실행하면 0. 테스트로 mtime 변경 시 날짜 유지 확인 |
| production build | 4회(기준선, 1차 수정, 2차 수정, 조사 규칙 보완 후 최종) 모두 성공. 최종 빌드 기준으로 위 비교를 다시 실행 |

실제 Googlebot·Yeti 접근은 검증하지 않았습니다. User-Agent만 바꾼 요청도 하지 않았습니다.

## 4. 커밋할 파일

소스
- `src/lib/seo-landing/service-intent-fixes.ts`(새), `src/lib/seo-landing/page-data.ts`
- `src/lib/topic-hubs/types.ts`, `src/lib/topic-hubs/config.ts`, `src/lib/pageData/builders.ts`
- `src/lib/lawyer-eeat-images-server.ts`(새), `src/components/profile/LawyerEeatProfile.tsx`

lastmod
- `scripts/lib/sitemap/lastmod.mjs`
- `scripts/lib/sitemap/page-fingerprint.mjs`(새)
- `scripts/lib/sitemap/lastmod-manifest.json`(새), `scripts/lib/sitemap/lastmod-fingerprints.json`(새)
- `scripts/update-lastmod-manifest.mjs`(새), `scripts/init-lastmod-manifest.mjs`(새)
- `docs/sitemap-lastmod.md`(새)
- `tests/lastmod-manifest.spec.mjs`(새), `package.json`(test 목록)

생성물(커밋 권장)
- `public/sitemap.xml`, `public/sitemaps/*.xml`: lastmod만 바뀜. loc 동일

빌드가 다시 쓴 파일(이번 변경과 무관, 기존처럼 처리)
- `scripts/output/*`, `src/generated/*`, `public/data/naver-place-reviews.json`
- `src/generated/image-variants.json`이 바뀐 것은 사용자의 미추적 이미지 16개가 빌드에서 처리됐기 때문입니다.

커밋하지 않을 것
- `reports/google-index-2026-10-11/protect/*.json`(기준선·최종 스냅샷, 각 28MB): 검증 기록이므로 필요하면 보관만 하세요.

## 5. 배포와 되돌리기

- 배포: 위 파일을 커밋해 main에 push하면 Cloudflare Pages가 빌드합니다. prebuild가 manifest를 읽어 사이트맵을 다시 만들며, 결과는 커밋한 `public/sitemap.xml`과 같아야 합니다.
- 되돌리기
  - 기술 변경만 되돌릴 때: `scripts/lib/sitemap/lastmod.mjs`(이전 버전), `src/lib/lawyer-eeat-images-server.ts`와 `LawyerEeatProfile.tsx` 두 호출부, manifest·fingerprint 파일을 되돌립니다. 법률 정정(1-1)은 유지합니다.
  - 정정 문장에 문제가 있으면 `service-intent-fixes.ts`의 해당 규칙 한 줄만 고칩니다. 예전 오류 문장으로 되돌리지 않습니다.

## 6. 배포 후 확인

- 직후
  - GitHub check-run으로 배포 commit을 확인합니다.
  - 운영 /sitemap.xml에서 loc 1,635개와 lastmod 880개, 로컬 생성본과의 일치를 확인합니다(`live-check.mjs` 재사용).
  - /강서구상속포기, /한정승인기간, /부산회생법원개인파산, /개인회생파산의 바뀐 문장, /about 이미지, noindex 별칭 2개를 확인합니다.
- Search Console: `https://다옴법무사사무소.kr/sitemaps/tier-1-core.xml`을 사이트맵으로 추가 제출합니다(사용자 작업). 기존 /sitemap.xml은 그대로 두고, 제출이 색인을 보장하지 않습니다.
- 7·14·28일
  - Google: /, /부산법무사, /부산상속등기, /전국상속등기, /services의 URL 검사 '마지막 크롤링'·색인 상태, 크롤링 통계의 HTML 요청 수와 404 비중
  - 네이버: 같은 키워드·같은 결과 영역(웹문서·플레이스·블로그를 섞지 않음)에서 실제 노출 URL. Search Advisor 노출·클릭은 계정에서 수동으로 확인
  - 작은 일시 변동만으로 원인을 확정하거나 전체 롤백하지 않습니다.
- 개별 색인 요청: 이번 변경에서 본문이 바뀐 핵심 페이지가 없으므로(바뀐 것은 지역·의도형 상속포기·한정승인·회생 페이지) 지금 필요한 개별 요청은 없습니다. /상속은 이미 요청됐으므로 다시 요청하지 않습니다. IndexNow는 Google 제출이 아니며, Google Indexing API는 일반 업무 페이지에 쓰지 않습니다.
