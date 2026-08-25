# 09 — Off-page actions (manual)

Cursor는 외부 계정(네이버 플레이스·블로그·Search Advisor)을 직접 수정하지 않습니다.  
아래 값은 사이트 SSOT(`getNapInfo()` / `office-location`)와 **글자 단위로 일치**시켜 주세요.

## NAP 소스 오브 트루스 (사이트)

| 항목 | 값 |
|---|---|
| 상호 | 다옴법무사사무소 |
| 대표 | 안윤정 법무사 |
| 주소 | 부산광역시 해운대구 센텀동로 200 D동 1층 LAB9호 |
| 전화 | 070-4172-8056 |
| 이메일 | lawyoonjung@naver.com |
| 웹사이트 | https://다옴법무사사무소.kr |
| 네이버 플레이스 | https://naver.me/58j9SzPA |
| 영업 | 평일 09:00–18:00 / 점심 12:00–13:00 / 토·일·공휴일 휴무 |
| 사업자등록번호 | 657-51-00996 |
| 방문 | 사전 예약 후 방문 |

## Operator checklist

1. **Naver Place**  
   - 상호·대표·주소·전화·영업시간·사업자번호 = 위 표와 동일  
   - 플레이스 URL이 `naver.me/58j9SzPA`와 연결되는지 확인  
   - 사이트 링크가 `https://다옴법무사사무소.kr` (또는 동일 punycode)인지 확인

2. **Naver Blog 프로필**  
   - 블로그명·닉네임에 `다옴법무사사무소` / `안윤정` 표기 일관  
   - 프로필 소개에 과장 「전문 자격」 오인 문구 없는지 점검

3. **Search Advisor**  
   - Priority A URL 검사·수집 요청: `reports/seo/index-submit-master-rebuild-2026-08-26.txt`  
   - 배포 직후 IndexNow: `npm run indexnow:dry` → `npm run indexnow`

4. **언론·명함·외부 인용**  
   - 브랜드 문자열 `다옴법무사사무소` / `안윤정 법무사` 통일

5. **하지 말 것**  
   - 유료 링크 구매·스팸 디렉터리  
   - 검색량·순위 허위 기재

검토일: 2026-08-26
