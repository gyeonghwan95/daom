# C. 콘텐츠·회귀 (메인 에이전트 분리 검토)

관측 사실
- `/상속` 도입=요약 반복, `/법인등기` 자세히 알아보기 연속 동일 문단.
- 링크 카드 `주제명·분류·주제명`은 RelatedRecommendations의 섹션제목+그룹라벨+링크라벨 추출 가능성. DOM상 링크 텍스트는 한 번. 공유 컴포넌트 미수정.
- 법인 페이지 비대면 이미지 alt가 상속 문구.
- 홈 `센텀시티역 인근` vs NAP `동해선 재송역, 센텀역 도보 5분`. 센텀시티역 도보시간을 새로 단정하지 않음.
- `/부산법무사` 변경등기 기한을 취임일로만 서술.
- `/공탁채권회수` 상속 서비스 슬러그.
- 한정승인은 청산·통지는 있었으나 민법 제1032조 공고가 약함.

원인 가설
- PageDataTemplate 계약이 Hero 2문단 + Summary[0] + body slice(1).
- inferArticleVisualField가 serviceSlug `inheritance-registration`을 상속 필드로 먼저 매칭.

증거
- PageDataTemplate.tsx ArticleSummary, article-body
- RemoteServicePanel.tsx alt
- home-content.ts vs office-location.ts
- topic-hubs/config.ts 공탁
- busan-lawyer.ts 상법 문장
- qualified-acceptance-busan.ts

영향 URL
- 템플릿 사용 페이지, 전국 비대면 패널, 홈, `/부산법무사`, `/공탁채권회수`, `/부산한정승인`, `/유언공증준비`

해결안
- unique intro 계약.
- alt를 이미지 내용으로.
- 공탁 slug를 상속이 아닌 `payment-order`(시각 추론·FAQ 오부착 방지. 서비스 상세 미존재 → 기본 FAQ).
- 위치·기산점·공고 문구.
- 유언 공정증서 페이지 복구(공증 미수행 명시).

효과의 근거
- 반복·주제 불일치 제거는 콘텐츠 가이드와 일치. 순위 보장 아님.

부작용
- 공탁 FAQ가 상속 FAQ에서 기본 FAQ로 바뀜(의도된 회귀 수정).
- 민사소송 허브의 동일 slug 오류는 보호 페이지 FAQ 대량 변경이라 보류.

검증법
- 단위 테스트 partitionPageIntro.
- 보호 페이지 메타 비교.
- check-notary-wording은 법인 공증 경로만 스캔(유언 페이지는 범위 밖이나 문구는 공증인 경계 준수).

미확인
- 추출기의 카드 라벨 반복이 실제 접근성 문제인지.
- 센텀시티역(2호선) 실제 도보 시간.

이 관점의 최선안: unique-paragraph 계약.
