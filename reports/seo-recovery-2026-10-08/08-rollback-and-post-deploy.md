# 복구 방법과 운영 반영 후 확인

배포하지 않았다. 운영 반영으로 말하지 않는다.

## 파일 단위 복구
Git로 이번 작업 파일만 되돌린다. `git reset --hard` 사용 금지.

- `src/lib/pageData/template-helpers.ts`
- `src/components/page-data/PageDataTemplate.tsx`
- `src/lib/local-landing/champion-article-summaries.ts`
- `src/components/nationwide/RemoteServicePanel.tsx`
- `src/lib/topic-hubs/config.ts`
- `src/lib/home-content.ts`
- `src/lib/priority-seo/existing/busan-lawyer.ts`
- `src/lib/local-landing/qualified-acceptance-busan.ts`
- `src/lib/local-landing/search-intent/seeds.ts`
- `src/lib/local-landing/search-intent/overrides/inheritance-asset-gaps-2026-09-23.ts`
- `src/lib/local-landing/search-intent/overrides/busan-missing-keyword-intents.ts`
- `tests/seo-recovery.spec.ts`
- `tests/intro-paragraphs.spec.ts`
- `tests/keyword-14-coverage.spec.ts`
- `reports/seo-recovery-2026-10-08/`

`/유언공증준비`를 다시 지우면 공개 URL 삭제 금지를 위반한다.

## 운영 반영 후 확인 (권한 있는 담당자)
1. `https://다옴법무사사무소.kr/상속` 초기 HTML에서 같은 문단이 Hero·요약에 연속 반복되지 않는지.
2. `/법인등기` 자세히 알아보기에 동일 문단이 연속하지 않는지.
3. `/유언공증준비` 200, 자기 canonical, 사이트맵 포함.
4. `/공탁채권회수` 이미지가 상속 필증이 아닌지, FAQ가 상속포기가 아닌지.
5. 홈 신뢰 포인트가 재송역·센텀역인지.
6. 전화·카카오·톡톡·예약·문의 폼이 보이는지(발송 테스트 금지).
7. 네이버 서치어드바이저: 변경 URL만 수집 요청. 요청 ≠ 색인·순위 회복.
8. IndexNow를 쓰더라도 순위 회복으로 기록하지 않음.

변경 URL 우선순위(수집 요청 후보, 색인 성공 보장 아님)
1. `/상속` `/법인등기`
2. `/유언공증준비`
3. `/공탁채권회수`
4. `/` `/부산법무사` `/부산한정승인` `/부산법인설립등기`

관측 일정(네이버 약속 기간 아님): 운영 반영일, 재수집 관측일, 7/14/28일 키워드별 노출·문의. 미확인 키워드는 계속 미확인.
