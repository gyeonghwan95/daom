# A. 기술 SEO (메인 에이전트 분리 검토)

관측 사실
- App Router 정적 export(`scripts/build-static.mjs` → `out/`). Cloudflare Pages.
- 2026-10-08 HTTPS 호스트 체인: `https://다옴법무사사무소.kr/` 200(추가 hop 없음), `https://xn--2j1br1na42lvxja38mk8r.kr/` 200(추가 hop 없음). HTTP는 둘 다 301 → `https://xn--2j1br1na42lvxja38mk8r.kr/` → 200. 한글·punycode HTTPS를 서로 리다이렉트하지 않으며, 기존 HTTPS 승격만 있다. `_redirects` 미변경.
- 2026-10-08 live HTML: 14개 후보 URL 모두 200, title/H1/canonical 각 1개, `index, follow`, Cache-Control `public, max-age=0, must-revalidate`, CF `DYNAMIC`.
- robots.txt는 기존 코드상 Yeti 허용. JS/CSS 차단 증거 없음.
- `/유언공증준비` live 404.
- `/상속`·`/법인등기` 초기 HTML에 intro 문단 반복.
- 봇 전용 본문 없음(SSG).

원인 가설
- 중복 문단은 수집 품질을 떨어뜨릴 수 있으나 순위 하락의 단독 원인으로 확정할 수 없다.
- 삭제된 공개 URL은 해당 질의의 404/미색인 원인이 될 수 있다.
- Cloudflare HTML 캐시는 DYNAMIC. URL별 HTML 혼합 재현 없음.
- 네이버 로봇 차단 여부는 서버 로그 없어 미확인.

증거
- `.cache/live-seo-baseline.json`
- `src/components/page-data/PageDataTemplate.tsx` ArticleSummary fallback + `introParagraphs.slice(1)`
- `src/lib/pageData/template-helpers.ts` `splitIntroParagraphs`
- `src/lib/topic-hubs/config.ts` 공탁 `primaryServiceSlug`
- `public/_headers`, `src/app/robots.ts` (기존 조사)

영향 URL
- 템플릿을 쓰는 허브 전반. 특히 `/상속`, `/법인등기`.
- `/유언공증준비`
- `/공탁채권회수` 시각·FAQ
- RemoteServicePanel을 쓰는 전국 안내 페이지(alt만)

해결안
- 초기 HTML에서 고유 문단만 출력.
- 삭제된 공개 경로 복구.
- 잘못된 serviceSlug/alt.

효과의 근거
- 네이버 가이드: 중요한 내용은 초기 HTML에. 중복·주제로 맞지 않는 대체텍스트는 콘텐츠 품질 저해.
- 순위 회복은 보장하지 않음.

부작용
- 자세히 알아보기 섹션이 비는 페이지가 생길 수 있음(중복만 있던 경우). 고유 요약으로 보완.

검증법
- out HTML `#article-body` 연속 동일 문단 없음.
- `/유언공증준비` 200·self-canonical·sitemap 포함.
- 보호 URL title/canonical 비교.

미확인
- Yeti 실제 수집 로그, 서치어드바이저 색인 상태, 챌린지/429.
- 한글 호스트 vs punycode 캐시 키 분리(동일 호스트로 관측).

이 관점의 최선안: 재현된 초기 HTML 중복과 공개 URL 404를 고친다.
