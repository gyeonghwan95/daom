# 네이버 유입 복구 작업 — 2026-10-08

방법: 하위 에이전트 3명이 이 세션에서 완료 보고를 마치지 못했다. 이전 세션의 의도 담당은 다른 14개 검색어(기간/기한)를 분석해 채택하지 않았다. 아래 세 관점은 같은 수정 전 자료(저장소·live GET·out HTML)를 메인 에이전트가 분리 검토한 결과이다.

## 확인된 문제
1. `PageDataTemplate`이 Hero·ArticleSummary·자세히 알아보기에 같은 intro 문단을 재출력. `/상속`·`/법인등기` live/out HTML에서 재현.
2. `splitIntroParagraphs` extras가 둘째 문단과 겹치면 3번 반복.
3. 공개 URL `/유언공증준비`가 소스에서 사라져 live 404.
4. `RemoteServicePanel` 이미지 alt가 모든 비대면 패널에 상속등기·상속포기 문구.
5. `/공탁채권회수` `primaryServiceSlug`가 `inheritance-registration`이라 상속 이미지/FAQ가 붙음.
6. 홈 신뢰 문구 `센텀시티역 인근`이 `officeLocation.subway`(동해선 재송역·센텀역)와 불일치.
7. `/부산법무사` 본문이 변경등기 기한을 취임일로만 서술.

## 실제 변경
- 문단 고유화 계약: `template-helpers.ts`, `PageDataTemplate.tsx`
- `/상속`·`/법인등기`·`/부산법인설립등기` 전용 요약
- `/유언공증준비` 복구(공증인 vs 법무사 역할 구분)
- alt, 공탁 slug, 홈 위치, 상법 기산점, 한정승인 공고(민법 제1032조)
- `/법인등기` → `/부산법인설립등기` 내부링크

## 채택한 최선안
콘텐츠 관점의 unique-paragraph 계약. 수집 가능한 초기 HTML 중복이 재현됐고, URL을 바꾸지 않고 검증 가능하다.

## 보장하지 않는 것
검색 1위, 색인 성공, 다른 검색어 순위 상승. 코드 검증과 검색 성과는 별개다.
