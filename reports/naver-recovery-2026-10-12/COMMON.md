# 공통 증거 요약 (루트 수집, 2026-10-12 22:00 KST)

## 저장소·배포
- HEAD = origin/main = `e231514` (10-12 21:54 KST, 사용자 커밋). 작업 트리 깨끗함.
- 운영 배포: `19635f0` Cloudflare Pages success 10-12 00:16 KST. `e231514`는 22:00 KST 현재 Cloudflare Pages **in_progress**.
  - e231514 배포 판별 표지: `https://xn--2j1br1na42lvxja38mk8r.kr/api/turnstile-config` 가 JSON을 주면 e231514, HTML이면 이전 배포.
- e231514 내용(이전 세션 작업): Turnstile 실행 시점 키 API·상담 실패 대체 채널, 본문 상단 2열 상담 버튼(HeroContactButtons), 이미지·OG 크기, /about·/법률강의 카드 그리드, 메뉴 순서(소개·후기 첫 번째), 현장 사진 10개 페이지 lastmod 10-11.
- 최근 30일 커밋 53개. 커밋 메시지 대부분 무의미("ㄱㄱ","dd") → 파일 목록으로 판단해야 함.
- GitHub check-runs 공개 API: `curl -s https://api.github.com/repos/gyeonghwan95/daom/commits/<sha>/check-runs` (gh 미설치). Actions `build` 체크는 과거부터 failure가 흔함(배포와 별개).

## 운영 응답 baseline (`live-live-yeti.json`, Yeti UA 요청 — 실제 Yeti 수집 증명 아님)
check-paths.json 20개 URL 모두 200, 리디렉션 없음, X-Robots-Tag 없음, 자기 canonical.
예외(기존 정책): `/부산법인전문법무사` = noindex,follow + canonical `/부산법인등기` (seo/index-policy.json).

## 기존 보고서(먼저 읽고 재사용, 덮어쓰지 말 것)
- `reports/busan-lawyer-rank-2026-10-10/REPORT.md` — '부산 법무사' 하락 조사. GOOD 후보 `16f9ffb`, /부산법무사 title 분리 수정. 관측: 웹 영역은 법원·LH·부산시 등 기관, 다옴은 플레이스.
- `reports/naver-7kw-2026-10-11/REPORT.md` — 7개 검색어 관측(10-11 12:3x KST), GOOD 후보 `7b42ef4`, 관련 콘텐츠 캐러셀 `estate` 정규식 결함 수정. 도구: live-check.mjs, naver-observe.mjs, anchors.mjs, compare-focus.mjs. 관측 원본 `naver-observe-before.json`.
- `reports/naver-14-2026-10-09/` — keyword-map-14.csv(검색어→대표 URL), tech-scan.mjs.
- `reports/busan-lawyer-top-2026-10-10/` — 내부링크·유사도(orphan-sim, content-sim).
- `reports/google-index-2026-10-11/` — 전체 route 보호 스냅샷 도구 `protect/protect-snapshot.mjs save|diff <name>` (out/ 기준).
- `src/data/seo/page-relations.ts:412-452` — 검색어별 champion URL 정의. 홈 = '부산 법무사'.
- 네이버 성과 내보내기: 저장소에 실제 데이터 없음(`seo/inheritance-final/naver-performance.csv`는 빈 템플릿). → '미확인'.

## 로컬 빌드
- `out/` = e231514와 같은 소스로 만든 정적 산출물(1,893 html, sitemap 1,635 loc). 다시 빌드하지 말 것(루트가 담당).
- HTML 파서: `scripts/lib/seo-recovery/scan-out.mjs` 의 `parsePage(html)`.

## 규칙(모든 에이전트)
- 조사만. 소스 수정 금지(reports/naver-recovery-2026-10-12/ 안에 결과 파일만 작성).
- 네트워크 동시성 ≤4, 타임아웃, 재시도 1회. 네이버 검색은 담당 4만, 검색어당 1요청·4초 간격, CAPTCHA·차단 우회 금지.
- 확정 결함 / 원인 후보 / 정상 / 접근 불가 구분. 배포 전 코드(e231514)를 기존 하락 원인으로 설명하지 말 것.
- 최종 응답 800토큰 이내, 제안 최대 3개: [증거] → [문제·확실성] → [최소 패치] → [보호 대상] → [검증].
