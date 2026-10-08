# 검증 결과 — 2026-10-08

코드 검증과 검색 성과를 구분한다. 아래는 코드·정적 export 결과다. 네이버 순위·색인 성공은 확인하지 않았다.

## 통과
- `npx tsx --test tests/intro-paragraphs.spec.ts tests/keyword-14-coverage.spec.ts` — 5 pass
- `npm run build` — exit 0. validate-page-data 1866 paths(+1 `/유언공증준비`). sitemap 1657 URLs(+1).
- `npm test` (out/ seo-recovery) — 15 pass. 신규 14·15 포함.
- `npx eslint` 변경 TS 파일 — 경고 0
- 보호 URL out HTML title/H1이 live baseline과 일치: `/`, `/부산상속등기`, `/부산부동산등기`, `/부산법인등기`, `/부산법무사`, `/개인회생파산`
- `/상속` article-body 연속 중복 0. `/법인등기` article-body 비움(고유 문단이 Hero+요약으로 소진)
- `/유언공증준비` self-canonical, 공증 미수행 문구 있음, `무료상담` 없음, sitemap-manifest 포함
- 홈 `센텀시티역 인근` 없음, `재송역` 있음
- 비대면 alt 상속등기·상속포기 반복 없음(`/`, `/법인등기`, `/공탁채권회수`)
- `/공탁채권회수` `단계별 전략이 필요합니다` 없음. visual field=court
- keyword ownership: 부산 법무사→/, 부산 상속 법무사→/부산상속법무사, 부산 등기 법무사→/부산등기법무사, 부산 법무사 추천/상담 기존 owner 유지

## 실패로 표기하지 않은 기존 제한
- `npx tsc --noEmit`: 기존 `reserved-inheritance-intents.ts` 한글 경로 타입 오류 1건. Next build는 타입 검증 생략.
- 네이버 14개 일반검색 SERP, 서치어드바이저 수집 상태, Yeti 로그: 미실행
- 실제 문의 발송, 브라우저 PC/모바일 스크린샷: 미실행. out HTML에 제목·H1·문의 링크 존재는 확인
- IndexNow 제출: 하지 않음. 배포하지 않음
