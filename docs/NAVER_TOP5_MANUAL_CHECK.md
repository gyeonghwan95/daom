# 네이버 TOP5 수동 확인 가이드

> **상태:** 모든 seed keyword는 `SERP_UNVERIFIED`입니다. 자동 크롤링·순위 추정 없음.  
> Search Advisor export 없음 → `PERFORMANCE_UNKNOWN`

## 확인 방법

1. 시크릿/로그아웃 Chrome에서 [네이버](https://search.naver.com) 검색
2. **WEB** 영역 1~5위 URL 기록 (PC·모바일 각각)
3. `seo/manual-rank-input.csv`에 입력
4. 재분석: `npx --yes tsx scripts/naver-top5-seo-audit.ts`

## 입력 파일

`seo/manual-rank-input.csv`

| column | 설명 |
|--------|------|
| keyword | 검색어 |
| pc_rank | PC WEB 1~5 (없으면 공란) |
| mobile_rank | 모바일 WEB 1~5 |
| observed_date | YYYY-MM-DD |
| owner_url_shown | 다옴 URL이 보이면 전체 경로 |

## 우선 확인 (수임·상담·비용)

| 검색어 | expected owner | 현재 status |
|--------|----------------|-------------|
| 부산 법무사 | `/` | SERP_UNVERIFIED |
| 부산 법무사 상담 | `/부산법무사상담` | SERP_UNVERIFIED |
| 부산 법무사 추천 | `/부산법무사추천` | SERP_UNVERIFIED |
| 부산 법무사 비용 | `/부산법무사비용` | SERP_UNVERIFIED |
| 부산 등기 법무사 | `/부산등기법무사` | SERP_UNVERIFIED |

## 상속

| 검색어 | expected owner | 현재 status |
|--------|----------------|-------------|
| 부산 상속 법무사 | `/부산상속법무사` | SERP_UNVERIFIED |
| 부산 상속전문 법무사 | `/부산상속법무사` | SERP_UNVERIFIED |
| 부산 법무사 상속 | `/부산상속법무사` | SERP_UNVERIFIED |
| 부산 상속등기 | `/부산상속등기` | SERP_UNVERIFIED |
| 부산 상속포기 | `/부산상속포기` | SERP_UNVERIFIED |
| 부산 한정승인 | `/부산한정승인` | SERP_UNVERIFIED |
| 부산 특별한정승인 | `/특별한정승인` | SERP_UNVERIFIED |

## 부동산·법인·회생

| 검색어 | expected owner | 현재 status |
|--------|----------------|-------------|
| 부산 부동산등기 | `/부산부동산등기` | SERP_UNVERIFIED |
| 부산 법인등기 | `/부산법인등기` | SERP_UNVERIFIED |
| 부산 개인회생 | `/부산개인회생` | SERP_UNVERIFIED |
| 부산 개인파산 | `/부산개인파산` | SERP_UNVERIFIED |

## 지역 (16구·생활권)

| 검색어 | expected owner | 현재 status |
|--------|----------------|-------------|
| 연제구 법무사 | `/연제구법무사` | SERP_UNVERIFIED |
| 해운대 법무사 | `/해운대법무사` | SERP_UNVERIFIED |
| 해운대구 법무사 | `/해운대법무사` | SERP_UNVERIFIED |
| 센텀 법무사 | `/센텀법무사` | SERP_UNVERIFIED |
| 동래구 법무사 | `/동래구법무사` | SERP_UNVERIFIED |
| 서면 법무사 | `/서면법무사` | SERP_UNVERIFIED |

전체 106 seed keyword 목록: `seo/master/naver-top5-observation.csv`

## status 정의

| status | 의미 |
|--------|------|
| TOP5_CONFIRMED | 수동/Search Advisor로 TOP5 확인 |
| NOT_TOP5_CONFIRMED | 6위 이하 또는 미노출 확인 |
| SERP_UNVERIFIED | 아직 확인 안 됨 (현재 전체) |
| OWNER_MISMATCH | 노출 URL ≠ expected owner |
