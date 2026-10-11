# 사이트맵 lastmod 관리

사이트맵(`/sitemap.xml`, `/sitemaps/*.xml`)의 `<lastmod>`는 저장소에 커밋된 URL별 manifest에서만 나옵니다.

- 값 파일: `scripts/lib/sitemap/lastmod-manifest.json` (`{ "routes": { "/경로": "YYYY-MM-DD" } }`)
- 판단용 지문: `scripts/lib/sitemap/lastmod-fingerprints.json`
- 읽는 코드: `scripts/lib/sitemap/lastmod.mjs`

Cloudflare Pages 빌드는 manifest를 읽기만 합니다. 파일 mtime, Git 로그, 빌드 시각은 읽지 않습니다. 이전에는 mtime을 써서 배포 때마다 lastmod가 배포일로 바뀌었습니다(2026-10-11 진단).

- manifest에 없는 URL은 `<lastmod>`를 생략합니다. `<loc>`는 그대로 남습니다.
- 형식이 틀린 날짜, 미래 날짜, 2000년 이전 날짜는 버리고 생략합니다.

## 본문을 고친 뒤 갱신하는 절차(로컬)

1. 수정을 마친 뒤 `npm run build`
2. `node scripts/update-lastmod-manifest.mjs --dry-run` 실행 후, 바뀐 URL 목록이 의도한 수정 범위와 맞는지 확인합니다.
3. `node scripts/update-lastmod-manifest.mjs` 실행. 날짜를 생략하면 오늘(KST), 지정하려면 `--date YYYY-MM-DD`를 붙입니다.
4. `node scripts/generate-sitemaps.mjs` 실행 후 `public/sitemap.xml`의 lastmod를 확인합니다.
5. 다음 파일을 함께 커밋합니다.
   - `lastmod-manifest.json`
   - `lastmod-fingerprints.json`
   - `public/sitemap.xml`
   - `public/sitemaps/*.xml`

'바뀐 URL'은 지문으로 판단합니다. 지문에 들어가는 것은 title, description, H1, 그리고 `<main>` 안의 문장입니다. 다음은 지문에서 빠지므로 바뀌어도 날짜가 갱신되지 않습니다.
- `<main>` 밖의 메뉴·푸터
- 전체 페이지의 15% 이상에 똑같이 나오는 공통 블록(상담·신뢰 패널, 저작권 연도 등)

바뀐 URL이 사이트맵의 25%를 넘으면 공통 템플릿 변경일 가능성이 커서 스크립트가 중단합니다. 이때는 실제로 본문이 바뀐 URL만 `--paths /a,/b --date YYYY-MM-DD`로 지정합니다.

## 하지 말 것

- 모든 URL을 오늘 날짜로 바꾸기
- 공유 소스 파일 하나의 수정일을 여러 URL에 복사하기
- `priority`·`changefreq`로 수집을 유도하기
- 의미 없는 변경(공백·빌드 해시·메뉴)으로 날짜 갱신하기

## 초기값(2026-10-11)

`scripts/init-lastmod-manifest.mjs`(1회용 기록)로 만들었습니다. URL마다 아래 근거 중 가장 최근 날짜를 썼고, 근거가 없으면 생략했습니다.

1. 기존 고정값 `lastmod-pins.json`
2. 스펙의 `dateModified`
3. MDX 페이지 파일의 Git 생성일과, 본문·제목·설명이 바뀐 커밋일. frontmatter 날짜는 그 파일이 저장소에 생긴 날 이후일 때만 인정했습니다(이전 사이트 이관 기록이 없음).
4. 언론 기사의 `publishedAt`과 등록 커밋일
5. 2026-10-09~10-11 빌드 스냅샷 사이에 바뀐 페이지. 전체의 30% 넘게 바뀐 공통 변경 단계는 제외했습니다.
6. 이번 법률·업무 문장 정정 URL(2026-10-11)

결과: 1,635개 중 880개에 lastmod, 755개는 생략. URL별 근거는 `reports/google-index-2026-10-11/lastmod-init.csv`에 있습니다.

`lastmod-pins.json`은 이제 빌드에서 쓰지 않으며, 초기값의 근거로만 남겨 둡니다.
