# HOME 「부산 법무사」 대표사이트 안정화 — 2026-08-20

## 1. CURRENT SERP
검색일시: 2026-08-20 (작업 시점)
확인 방법: 사용자 직접 확인 + 자동 SERP 수집 미시도(우회 금지)
상태: 네이버 SERP 자동 확인 불가

사용자 제공 PRIMARY 「부산 법무사」:
- 다옴 노출: 있음 (비교적 뒤쪽)
- 노출 URL: HOME `/`로 추정(사용자 확인 기준)
- 노출 TITLE: 다옴법무사사무소 | 해운대·센텀 안윤정 법무사
- 대략 위치: 뒤쪽 (순위 숫자 미확인 → 만들어내지 않음)

기타 Query(부산법무사, 추천, 상담, 등기/상속/법인, 브랜드, site:)는
이번 세션에서 네이버 웹 SERP를 직접 열지 못함 → 순위 미기록.

## 2. PRODUCTION BEFORE (실측 2026-08-20)
URL: https://다옴법무사사무소.kr/
STATUS: 200
TITLE: 다옴법무사사무소 | 부산 법무사 안윤정
DESCRIPTION: 부산 해운대·센텀 다옴법무사사무소 안윤정 법무사…부산 전역 상담 가능.
OG TITLE: 다옴법무사사무소 | 부산 법무사 안윤정
TWITTER TITLE: 동일
H1: 부산 법무사 안윤정
CANONICAL: https://xn--2j1br1na42lvxja38mk8r.kr (HOME self)
ROBOTS: index, follow

## 3. CASE 판정
**CASE B**

Production title은 이미 「다옴법무사사무소 | 부산 법무사 안윤정」인데
네이버 SERP는 과거 「… | 해운대·센텀 안윤정 법무사」를 보여 줌.
→ 코드 실패가 아니라 재수집/재분석 지연 가능성이 큼.
동시에 최종 브랜드 표현을 「부산 다옴법무사사무소 | 안윤정 법무사」로
한 번 더 안정화하고, title/og/schema/H1 관계를 고정함.

네이버 공식 근거:
- searchadvisor.naver.com/guide/markup-content
  · 메인 title은 브랜드·고유명사, 검색노출만으로 자주 변경하지 말 것
  · title과 og:title을 함께 기입 권장
- searchadvisor.naver.com/guide/faq-serpedit
  · title≠og:title이면 색인 시 엔진이 하나를 선택
  · 앵커·본문 텍스트로 제목을 바꿀 수 있음

## 4. 수정 파일
- src/lib/seo/metadata.ts — HOME title/description 최종 확정
- src/lib/seo/brand.ts — defaultDescription 동기화(스키마 공통)
- src/lib/seo/json-ld.ts — WebSite alternateName에 「부산 다옴법무사사무소」
- src/components/home/HomeHero.tsx — 상담 CTA DOM 1회로 통합
- src/app/globals.css — .home-hero__convert
- src/components/layout/Footer.tsx — 푸터 소개 문구에서 broad exact 중복 완화

미수정(의도):
- /부산법무사 title·H1 (이미 supporting intent)
- robots.txt, sitemap priority/lastmod
- 지역 페이지 URL·title 일괄 변경
- HOME H1·첫 문단

## 5. FINAL HOME (기대값)
TITLE: 부산 다옴법무사사무소 | 안윤정 법무사
H1: 부산 법무사 안윤정
DESCRIPTION: 부산 해운대·센텀 다옴법무사사무소입니다. 안윤정 법무사가…
OG/TWITTER TITLE: TITLE과 동일
CANONICAL: HOME self
WebSite.name: 다옴법무사사무소

## 6. Cannibalization
부산 법무사 / 부산법무사 → HOME `/`
부산 법무사 추천 → /부산법무사추천
부산 법무사 상담 → /부산법무사상담
부산 등기/상속/법인 법무사 → 각 업무 허브
해운대/센텀 법무사 → 각 지역 페이지
/부산법무사 → 업무·비용·선택 기준 supporting (title 유지)

## 7. DOM 중복
발견: Hero 상담 문구·채널 블록이 mobile/desktop로 DOM 2회
수정: 단일 .home-hero__convert + responsive note
의도적 유지: Fullpage/마퀴 라이브러리 clone은 indexable 본문 복제로 보지 않음
문의 CTA가 하단 섹션에 별도로 있는 것은 섹션 목적상 유지

## 8. SEO SAFETY
기존 URL 변경: 0
기존 URL 삭제: 0
Redirect: 0
신규 URL: 0

## 9. 네이버에서 다음으로 할 일 (최대 5)
1. 서치어드바이저 URL 검사로 HOME `/` 수집 Meta title 확인
2. 배포 후 1회 수집 요청(매일 반복 금지)
3. 「부산 법무사」 SERP title이 새 값으로 바뀌는지 며칠 뒤 재확인
4. site:다옴법무사사무소.kr 로 HOME 색인 유지 확인
5. 플레이스/블로그 프로필이 「다옴법무사사무소·안윤정·부산」과 일치하는지 수동 점검
