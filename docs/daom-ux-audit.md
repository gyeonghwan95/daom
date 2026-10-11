# 다옴 UX·전환 감사 — 2026-10-11

## 기준
- 배포: `6f75fa2`(Cloudflare Pages 성공 2026-10-11 17:01 KST) = 로컬 HEAD. 작업 전 미커밋: 신뢰 패널 전문활동 인포그래픽(보존, 함께 미커밋).
- 이번 변경은 미커밋·미배포.
- 분석 데이터(28일 랜딩·검색어·기기별 문의): 이 작업에서 조회 권한·도구 없음 → **데이터 없음**. 추정 수치를 만들지 않음.

## 사실(재현·코드 확인)
| 항목 | 재현/원인 | 수정 |
|---|---|---|
| 사이드바 후기 버튼 말줄임 | 2열(83px) + `span.truncate` | `NaverPlaceActions`에 `stacked` 추가, 사이드바만 1열 전체 폭·문구 '네이버 예약'/'네이버 후기·사진', 중복 안내문 삭제 |
| 짧은 창에서 패널 상단 가림 | 하단 고정·높이 제한 없음 | `SidebarConsultationPanelFixed` max-height(헤더 아래)+내부 스크롤 |
| 네이버 버튼 목적지 | 모두 naver.me/58j9SzPA → 플레이스 **홈** 탭 | 브라우저로 확인한 탭 주소 사용: 예약=`placePath=/booking`(예약 탭), 후기=`/review`(후기 탭), 지도·소개=단축 링크 |
| 접근성 이름 불일치 | `InquiryStartButton`이 aria-label을 항상 '1분만에 문의하기'로 고정 / 플레이스 버튼은 고정 aria | 화면 문구가 있으면 aria-label 생략, 플레이스 버튼은 '화면 문구 — 목적지 탭(새 창)' |
| 메모에 '메인 첫 화면 업무 의뢰 문의' | 버튼 `note`가 고객 메모(`situationNote`)를 미리 채우고 저장된 메모도 덮어씀 | `entryNote`로 분리, 접수 메시지에 '(문의 시작 위치: …)' 줄로만 전달 |
| '사이트에 개인정보를 보관하지 않음' | 실제: Functions가 텔레그램·이메일(Resend)로 전달, DB 저장 없음, 중복방지 해시는 메모리, 분석 이벤트엔 kind·field만, 단계형 초안은 sessionStorage(완료 시 삭제) | 문구를 '메시지·이메일로 전달, 사이트 데이터베이스에는 저장하지 않음'으로(3곳) |
| 주소 '도보 5/분' 줄바꿈 | `.home-hero__location` overflow-wrap:anywhere | keep-all·break-word |
| 진행 단계 설명 없음 | /contact | '상황 확인→범위·비용·준비사항 안내→맡기기로 하시면 진행→접수·진행·완료 안내' 4단계, '문의만으로 진행되지 않음' 명시 |
| 상속 서류 일률 표현 | '상속인 전원 인감증명서', '여러 명이면 협의서' | 협의분할로 등기하는 경우로 조건부(본인서명사실확인서 대체 포함), 오탈자 '망소(사망)' 수정 |
| PC 메뉴 19개 | 두 줄 나열 | 7개(업무안내·업무 사례·준비자료·소개·후기▾·협업문의·법률 정보▾·상담 문의▾), 모든 기존 URL은 하위 메뉴 a[href]·푸터 유지 |
| 작은 보조 링크 | 신뢰 패널·홈 후기/위치 링크 높이 16~29px | min-height 40px |

## 근거(확인일 2026-10-11)
- 부동산등기규칙 제60조①6(협의분할 상속등기: 상속인 전원 인감증명), 제60조의2(본인서명사실확인서 대체) — law.go.kr, 원문 `reports/resources-2026-10-11/sources/regrule60*.txt`
- 민법 제1013조·easylaw 공동상속인 상속재산분할(전원 참여) — 기존 근거표 재사용
- 네이버 플레이스 탭: 헤드리스 Chrome에서 iframe 경로 `/home`·`/booking`·`/review` 확인

## 가설·미검증
- 메뉴 축소·첫 화면 문구의 전환 효과: 데이터 없음, 배포 후 14/28일 비교 필요(표본 적으면 관찰 중).
- 예약 탭이 모바일 앱·로그인 상태에서 같은 화면을 여는지: 미검증.
- 실제 문의 전송: 실서비스 전송 금지로 미실행(코드 경로만 확인).

## 수정 파일
`src/components/cta/{NaverPlaceActions,NaverSmartPlaceCta}.tsx`, `src/lib/naver-smartplace/cta.ts`, `src/config/external-links.ts`,
`src/components/consultation/{SidebarConsultationPanel,SidebarConsultationPanelFixed,InquiryStartButton}.tsx`,
`src/components/consult-wizard/ConsultWizardShell.tsx`, `src/lib/consult-wizard/message.ts`,
`src/lib/consultation.ts`, `src/components/{b2b/ProjectBriefForm,conversion/ConsultationInquiryForm}.tsx`,
`src/app/contact/page.tsx`, `src/lib/navigation.ts`, `src/lib/home-content.ts`, `src/app/globals.css`,
`src/components/{trust/LawyerTrustShowcase,home/HomeReviewsMarquee}.tsx`,
`src/lib/{service-details-part1,situations/config,local-landing/selection/topics/busan-inheritance-guide,metro-remote/pages/seoul}.ts`,
`src/content/blog/busan-inheritance-registration-procedure-documents.mdx`

## 검사 결과
- `npm run build` 성공, `npm test` 25/25, 변경 파일 eslint 통과, tsc 기존 오류 1(`reserved-inheritance-intents.ts`), 중복 검사 FAIL 0.
- 사이드바 DOM 실측(/contact·/services/inheritance-registration·/resources × 1280x800·1366x768·1440x900·1920x1080·1366x600): 말줄임 0, 버튼 폭 159~174px, 패널 top 92px(헤더 80+12), 짧은 창은 내부 스크롤, 가로 넘침 0.
- 모바일 320/360/390/430 × 홈·contact·부산상속등기·resources·자료 상세·부산법인등기·partners: 가로 넘침 0. 홈 주 버튼 접근성 이름 '업무 의뢰 문의'.
- SEO 비교(이전 빌드 대비): route·title·H1·description·canonical·robots 변화 0, 본문 링크 손실 0, 구글·네이버 인증 메타 유지. 예전 최상위 메뉴 URL은 모든 페이지에 1회 이상 링크 유지(푸터·하위 메뉴).
- 200% 확대: 1280px@200% = 640px 레이아웃(사이드바 숨김) → 모바일 검사로 대체.

## 남은 문제
- 기존 lint 오류(FloatingCTA·HeaderConsultationStatus·HeroStage, 이번 diff 밖).
- 상속등기 페이지의 준비서류·상담 포인트·FAQ 반복 통합, 업무 페이지 공통 순서 재배치: 미착수(범위가 커서 별도 작업 권장).
- /partners 최소 항목 폼 정리, 빠른 문의 단계 축소(4→간단형): 코드 확인만, 미변경.
- 분석: 기존 이벤트(trackCTA·naver_place_click·문의 submit kind)로 클릭/문의 시작/접수를 구분 가능. 위임 전환은 사무소 업무 기록으로 집계 필요.
