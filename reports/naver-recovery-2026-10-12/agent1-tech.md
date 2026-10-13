# 1. 기술·수집 담당 보고 (agent1, 2026-10-12 22:1x KST)

> Yeti UA로 요청해서 성공했다고 실제 Yeti가 수집에 성공했다는 증명은 아니다. 출발지 IP·ASN·속도가 다르기 때문이다. 아래 운영 응답은 모두 이 PC(KT 회선, 175.200.x)에서 curl과 node fetch로 받았다.

## 배포 상태 (판별 표지)
- `/api/turnstile-config`가 `{"siteKey":""}` JSON(200)을 준다. 따라서 현재 운영은 **e231514 배포 완료** 상태다(COMMON 22:00 시점의 in_progress 이후 바뀜).
- 운영 홈과 로컬 `out/index.html`의 title, description, canonical, og, H1, a 수에서 **차이가 없다**.
- 참고: siteKey가 빈 문자열이다. 상담 폼 담당이 확인할 사항이다(색인과는 무관).

## 정상
| 항목 | 결과 |
|---|---|
| robots.txt | 200, text/plain. `*`, Googlebot, Yeti 모두 `Allow: /`이고 `/admin`, `/api/`, `/search`, `/blog/external/`만 막는다. Sitemap 줄이 있다 |
| sitemap.xml | 200, application/xml, urlset loc 1,635개(= out/). `/api` loc 0개 |
| sitemaps/*.xml | index(8개 sitemap) 200. tier1 18, tier2 29, tier3 176, tier4 595, tier5 185, tier6 547, tier7 53, tier8 32. 모두 200, xml |
| check-paths 20개 | sitemap.xml과 하위 sitemap 양쪽에 모두 들어 있다. 예외는 `/부산법인전문법무사` 하나로, noindex 정책에 따라 빠져 있어 정상이다 |
| http→https | 301 1홉 (`http://…/부산상속포기` → https 200) |
| 한글 IDN 호스트 | `https://다옴법무사사무소.kr/` 200(punycode와 같은 호스트), `http://다옴…/부산법무사`는 301 1홉 후 https로 이동 |
| 퍼센트 인코딩 대/소문자 | 둘 다 200, 리디렉션 없음 |
| www | DNS가 없다(fetch failed). 링크가 없으면 문제없다 |
| 홈 head | title 1개 "부산 법무사 안윤정 \| 다옴법무사사무소", description 1개, robots `index, follow`, canonical 1개(`https://xn--…kr`, 절대 URL), og:url이 canonical과 같다. og:image `/_img/image/사무소-전경.og.jpg` 200 image/jpeg |
| 홈 본문 | H1 1개 "부산 법무사 안윤정". HTML 397,009B, 보이는 텍스트 약 9,079자. `<a>` 189개(내부 고유 93), `/api` 링크 0개. 전화, 주소(부산광역시 해운대구 센텀동로), 업무(상속, 법인, 등기, 회생)가 초기 HTML에 있다(단, 아래 hidden 항목 참고) |
| soft 404 | `/존재하지않는-테스트경로-xyz`, `/api/없는것`, `/api/xyz-not-exist`, `/nope.html`, `/sitemaps/none.xml` 모두 **404**이고 meta robots noindex다. COMMON에 적힌 "/api/* HTML 200" 현상은 e231514 배포 뒤 **재현되지 않는다**. `/api/notices/list`는 X-Robots-Tag noindex, `/api/quick-inquiry` GET은 405 JSON이다. robots에서 /api/를 막고 있고 크롤러에 노출된 /api 링크도 없다 |
| 자산 | 홈이 참조하는 자산 74개 중 40개 샘플(_next/static 22, _img 등 17, OG 1)이 **모두 200** |
| Cloudflare 차단 | `/`, `/부산법무사`, `/부산상속포기`, robots, sitemap에 대해 Yeti, Chrome, curl UA 응답 상태와 바이트가 같다. cf-mitigated 헤더 없고, 챌린지 문구 없고, 403/429/5xx 재현 안 됨 |
| _headers/_redirects/functions | X-Robots-Tag는 `/resources/pdf/*`(noindex), `/admin*`, `/api/admin/*`, `functions/_lib/admin-ops/crypto.ts:254`(admin 응답)에만 붙는다. 공개 페이지에 noindex를 붙이는 규칙은 없다. `_routes.json`은 `/api/*`만 Functions로 보낸다 |

## 원인 후보
### A. 거의 모든 페이지에서 본문 `<main>`이 초기 HTML의 `<div hidden id="S:0">` 안에 있다 (확실성: 중, 하락 시점 설명력: 낮음)
- 증거: 홈 초기 HTML에서 `</header><!--$?--><template id="B:0"></template><!--/$-->` 뒤에 `<div hidden id="S:0"><main id="main-content">…`가 이어진다. 인라인 `$RC` 스크립트가 실행돼야 본문이 보인다.
- `out/` 1,893개 중 **1,876개**가 이 구조다. 원인은 `src/app/loading.tsx`(null 반환)와 `[landingSlug]`, contact, services, cases, situations의 `loading.tsx`가 만드는 Suspense 경계다.
- `loading.tsx`는 24924c4(07-31)에 추가됐고 8f2400e(08-26)에 수정됐다. 따라서 10월 GOOD 후보(16f9ffb, 7b42ef4) 시점에도 같은 구조였다. 10월 하락의 직접 원인으로 보기 어렵다. 다만 JS를 실행하지 않는 수집기는 본문 전체를 `hidden` 상태로 보게 되는 구조적 위험이 있다.
- 최소 패치(후보): 루트 `src/app/loading.tsx`와 `src/app/[landingSlug]/loading.tsx`를 지운다(이미 null을 반환하므로 화면 차이는 없다). 그러면 정적 export HTML에서 main이 hidden 밖으로 나온다. 1개 페이지에 먼저 시험한다.

### B. 이 PC(한국, KT) 기준 응답이 매우 느리다: SEA colo로 라우팅됨 (확실성: 중, 이 PC 기준)
- `/cdn-cgi/trace` 결과: 사이트는 `colo=SEA`, 같은 회선의 www.cloudflare.com은 `colo=ICN`이다.
- 사이트 수치: TCP 0.12s, TLS 1.1s, TTFB 2~8s(robots.txt 543B도 2.7~8.2s), 다운로드 약 25KB/s, 홈 397KB 전송에 15~24s. `/about`은 30s에 끊긴 적이 1회 있다.
- 같은 회선의 naver.com은 TTFB 0.1s다.
- Cloudflare 무료 플랜이 한국 트래픽을 해외로 보내는 경우로 추정된다. Yeti의 실제 출발지와 측정 시점에 따라 다를 수 있다. 과거 수치가 없어 '최근 변화'인지는 미확인이다.

### C. 끝 슬래시나 `.html`로 끝나는 한글 경로의 308 Location 헤더에 raw UTF-8 바이트가 들어 있다 (확실성: 높음(사실) / 영향: 낮음)
- 예: `/%EB%B6%80…%AC/` → `Location: /부산법무사`(비 ASCII 원시 바이트). curl은 정상 처리한다(200, 1홉). node fetch(undici)는 latin1로 해석해 `/ë¶…` 404가 된다.
- 내부 링크(out/)에는 끝 슬래시나 `.html` 링크가 0개이고 sitemap에도 없다. 외부 링크로 들어올 때만 해당한다.
- Cloudflare Pages 기본 동작이라 소스로 고치기도 어렵다. 우선순위는 낮다.

## 확정 결함
- 없음(색인을 막는 결함으로 확정된 것은 없다).

## 접근 불가
- 실제 Yeti 수집 로그, Cloudflare 대시보드(WAF/Bot 이벤트, 지역 라우팅), 네이버 서치어드바이저 수집 통계.

## 제안 (최대 3)
1. [out/index.html 및 1,876개 페이지, `src/app/loading.tsx`, `src/app/[landingSlug]/loading.tsx`] → 본문이 hidden div 안에 있음. 원인 후보, 중 → loading.tsx 2개 삭제 → 보호 대상: title, canonical, H1, sitemap(protect-snapshot diff) → 검증: 빌드 후 `grep -c '<div hidden id="S:0"><main' out/index.html`이 0인지, 본문 텍스트 길이가 같은지 확인
2. [cdn-cgi/trace colo=SEA, TTFB 2~8s] → 한국 수집기 응답이 느림. 원인 후보, 중 → 서치어드바이저 수집 통계(응답 시간·오류)와 대조. 우선 HTML 크기를 줄이는 방향만 검토(홈 397KB)하고 WAF·플랜 변경은 범위 밖 → 검증: 시간대별 TTFB 재측정
3. [서치어드바이저] → 접근 불가 → sitemap.xml 재제출, 홈과 /부산법무사 '웹 페이지 수집 요청'·robots 검증 도구로 실제 Yeti 결과 확인
