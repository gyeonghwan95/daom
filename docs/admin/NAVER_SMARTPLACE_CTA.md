# Naver SmartPlace conversion — audit & implementation notes

작성일: 2026-08-11  
SSOT: `https://naver.me/58j9SzPA` (`src/config/external-links.ts`)

## A. 기존 네이버 링크 (통합 전)

| Page / Area | Placement | Old Label | Old URL | Action |
|-------------|-----------|-----------|---------|--------|
| Location / Map | map CTA | 네이버 지도에서 보기 | naver.me | **유지 + tracking** |
| Footer | text | 네이버 플레이스 | naver.me | **유지 + tracking** |
| ContactBox | reservation | 네이버 예약 이동 | map.naver…/ticket | **통합 → naver.me**, 문구 명확화 |
| ConversionActions | visit | 방문 상담 안내 | map.naver…/ticket | **네이버 상담 예약** + SSOT |
| MobileBottomCTA | sticky | 예약 | map.naver…/ticket | **SSOT + tracking** |
| Hero | — | (톡톡만) | talk.naver | **톡톡 유지**, 가이드에 예약 chip 추가 |
| FloatingCTA | panel | 톡톡 | talk.naver | **유지** (별도 floating 버튼 추가 안 함) |
| Reviews hub | review | 후기 보기 | map…/review | 후기 전용 URL 유지 (리뷰 탭) |
| Schema sameAs | Organization | — | naver.me | **유지** |

예약 ticket URL과 SmartPlace 단축 URL이 **혼재** → 목적지는 사용자 지정 `naver.me`로 통일.

## B. 예약 명칭

프로젝트 기존 문구·ticket URL이 있어 **플레이스 예약 기능이 있는 것으로 판단**.  
variant=`reservation` 라벨: **「네이버 상담 예약」** 사용.  
톡톡(채팅)과 혼동 방지 문구를 상담 페이지에 추가.

## C. Kill switch

`NEXT_PUBLIC_NAVER_SMARTPLACE_ENABLED=false` → 전체 SmartPlace CTA 숨김.

## D. 상담 CTA 페어 (`InquiryNaverCtaPair`)

「1분 상담 신청」「1분만에 상담 신청하기」및 동일 의도 CTA 옆에
네이버 그린(`#03C75A`) + N 아이콘 **「네이버 예약」**을 붙인다.

| Surface | Component | Layout |
|---------|-----------|--------|
| PageHero / ReadabilityCTA | 자동(상담 href) | row |
| FloatingCTA panel | 상담하기 버튼 아래 | stack |
| ConversionActionButtons | 1분 CTA 옆 | row |
| MobileBottomCTA | 기존 예약 슬롯 | sticky |
| SidebarConsultationPanel | 채널 목록 아래 | fullWidth |
| HomeContactClosing | 1분 링크 옆 | row |
| Nationwide / CaseRegion / Contact / Glossary / Search empty | pair | row/stack |

공통: `src/components/cta/InquiryNaverCtaPair.tsx` + `NaverSmartPlaceCta` tone=`brand`.
URL SSOT만 사용 — 페이지에 naver.me 하드코딩 금지.
