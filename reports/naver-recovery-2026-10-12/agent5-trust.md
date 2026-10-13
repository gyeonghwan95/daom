# 담당 5 — 실제 고객·지역 신뢰·전환 (2026-10-12)

기준: 로컬 `out/`(e231514 소스), `src/`, `functions/`. 네트워크 POST·메시지 전송 없음. 소스 수정 없음.
CTA·JSON-LD 상태는 네이버 순위와 무관한 사용자 신뢰·전환 점검이며, 순위 상승 근거로 쓰지 않는다.

## 1. 초기 HTML의 사무소 사실 — 정상
`<script>`·`<style>`을 빼고 남은 가시 텍스트에서 확인함(scratchpad txt.mjs).

| 페이지 | 사무소명 | 안윤정 법무사 | 부산 주소 | 전화 | 취급업무 | 직접 상담 |
|---|---|---|---|---|---|---|
| / | O(21) | O | 부산광역시 해운대구 센텀동로 200 | 010-4277-1279 | 상속·부동산·법인등기·회생·파산 | "안윤정 법무사가 직접 상담하고 진행합니다" |
| /부산법무사 | O | O("상담과 서류 검토를 직접 합니다") | 센텀동로 200 D동 1층 LAB9호 | O | O | O |
| /contact | O | O | 상호·대표자·주소·전화·이메일 표 | O | O | O |
| /about | O | O | O | O | O | O |

- 보수와 공과금 구분:
  - 홈: "수임료·공과금은 사실관계를 확인한 뒤 안내합니다".
  - /contact 2단계: "법무사 보수·공과금, 준비할 서류를 설명드립니다". "보수와 공과금을 구분해 보기"(수임료 vs 등록면허세·취득세) 링크가 있음.
  - /부산법무사: "보수와 세금·공과금을 나눠 설명하는지 확인하세요".
  - 판정: 정상.
- 상담 전 최소 정보 안내:
  - 홈: "어떤 일인지와 연락처만 남기시면 절차·비용·준비할 것을 먼저…".
  - /contact: "서류가 없어도 상황만 남겨 주시면 됩니다", "방문은 예약 후".
  - 판정: 정상.
- 부산 외 지점처럼 보이는 표현:
  - `out/*.html`을 지점·분사무소·서울사무소·현지 사무소 패턴으로 grep함.
  - 결과는 "부산 현지 사무소에서 업무를 진행합니다", "반드시 현지 사무소가 있어야 하는 것은 아닙니다"(협업·전국 FAQ)뿐이다.
  - 금지어 검사(`src/lib/southeast-cases/quality.ts:19` FORBIDDEN)가 이미 있다. 서울경제TV는 언론 출연 표기다.
  - 판정: 정상.
- 경미한 확정 결함: /about 본문에 "**부산광역시 부산 해운대구·센텀**에서 법무사 업무를 수행합니다"가 나온다(지역명 중복).
  - 위치: `src/components/profile/LawyerEeatProfile.tsx:311-312`
  - 원인: `region`(`src/lib/lawyer-profile.ts:10`, 부산광역시)과 `officeArea`(`:11`, "부산 해운대구·센텀")를 이어 붙임.

## 2. 연락 목적지 — 정상(일치)
`src/lib/contact.ts`, `src/config/external-links.ts`, `src/lib/naver-smartplace/cta.ts`의 값과 `out/index.html`의 href를 비교함.

| 채널 | 소스 | index.html href(개수) |
|---|---|---|
| 전화 | 010-4277-1279 → `tel:01042771279` | 6 |
| 카카오톡 | pf.kakao.com/_Bvhxnn/chat | 5 |
| 네이버 톡톡 | talk.naver.com/ct/w661kd4 | 3 |
| 네이버 예약 | map.naver.com/p/entry/place/2035745096?placePath=/booking | 3 |
| 플레이스 홈 | naver.me/58j9SzPA | 3 |
| 후기 | …2035745096?placePath=/review | 1 |
| 블로그 | blog.naver.com/law-yoon-91 | 2 |

카카오맵 링크 좌표(35.1838851, 129.1209835)는 JSON-LD geo 좌표와 같다. 소스에 없는 주소, 오타, 이전 주소는 없다.

## 3. 문의 폼 실패 경로 — 대부분 정상, 1건 확정 결함(경미)
- 서버 `functions/_lib/quick-inquiry/handler.ts`:
  - 처리 순서: origin → JSON → 검증 → IP 요청 제한 → Turnstile siteverify(실패하면 false) → 중복 확인 → 전달(Resend/Telegram).
  - 비밀 키가 없으면 503을 돌려준다. 메시지: "전화로 문의해 주시거나…".
  - 전달 실패 시 502 "전화로 바로 문의해 주세요"를 돌려준다.
- `functions/api/turnstile-config.ts`는 공개 사이트 키만 내려준다. 비밀 키는 노출되지 않는다.
- 클라이언트는 아래 6개 폼 모두에서 `errors.form || errors.turnstile`일 때 `InquiryFailureFallback`(카카오·톡톡·전화·예약)을 보여준다. 확인됨.
  - QuickInquiry(:308), ConsultationInquiryForm(:702), ConsultWizardShell(:746), Business(:432), Lecture(:629), ProjectBrief(:409, deliveryFailed)
  - TurnstileWidget(:138,159)에도 키·위젯 실패용 대체 채널이 있다.
  - 네트워크 예외: "작성하신 내용은 그대로 유지됩니다".
- **확정 결함(경미, 신뢰도 높음)**: `src/components/quick-inquiry/QuickInquiryForm.tsx:123-124`는 서버 `hint`를 고객 화면에 그대로 붙인다.
  - 예: "(missing_resend_or_telegram_env)", "(resend_http_4xx)", Resend 원문 오류 메시지, 서버 예외 메시지 앞 160자(`functions/api/quick-inquiry.ts:39-45`).
  - 같은 결함: `handler.ts:251-253`의 no_channel 메시지("발신 이메일 설정이 올바르지 않습니다. noreply@도메인 형식으로 등록해 주세요")도 관리자용 안내가 고객에게 그대로 보인다.
  - 영향: 장애 상황에서 고객에게 "설정이 덜 된 사이트"라는 인상을 준다. 대체 채널은 함께 표시된다.

## 4. 구조화 데이터 — 정상
- 4개 페이지 모두 같은 `#organization`, `#legalservice`, `#localbusiness`, `#person`, `#website` @id를 쓴다.
- 이름·전화·주소(센텀동로 200 D동 1층 LAB9호, 해운대구, 부산광역시, 48058)·좌표가 contact.ts와 일치한다.
- Person 안윤정의 jobTitle(법무사), url(/about), worksFor 연결이 모두 맞다.
- `aggregateRating`, `review`, `@type: Review`는 0건이다. 자체 평점이 없으므로 문제없다.
- 참고(결함 아님):
  - sameAs에 카카오 채팅·톡톡 채팅 URL이 들어 있다. 프로필 URL은 아니지만 사실과 맞다.
  - LegalService 노드가 2개(#legalservice, #localbusiness) 중복된다. 변경 이득이 불확실하므로 손대지 않는 것을 권장한다.

## 5. UI(소스 CSS로 판단 가능한 범위)
- **모바일 하단 CTA — 정상(코드 기준)**
  - `body.has-mobile-cta`(layout.tsx:63)가 `padding-bottom: calc(4.25rem + safe-area)`를 준다(globals.css:377-379). 버튼 min-height도 같은 4.25rem이고, 컨테이너는 safe-area 패딩을 따로 둔다. 차이는 border 1px뿐이다.
  - lg 이상에서는 숨김·패딩 0. 메뉴가 열리면 숨김.
  - floating-notice는 모바일에서 CTA 위(4.25rem+0.75rem)에 뜬다. 겹치지 않는다.
- **PC 좌측 고정 카드 후기 버튼 — 원인 후보(말줄임 가능성 있음, 확인 필요)**
  - 좌측 열 폭: 11.5rem(184px, lg). `PageSectionNavLayout.tsx:142,154`
  - 패널 p-3: `globals.css:1063`
  - 버튼 px-3, 아이콘 16px, gap 6px, `truncate`: `NaverSmartPlaceCta.tsx:47,147`
  - 따라서 라벨이 쓸 수 있는 폭은 약 110px이다.
  - "네이버 후기·사진"(`SidebarConsultationPanel.tsx:189`)을 14px로 쓰면 약 105–112px로 경계값이다. 1024–1279px 폭이나 폰트 대체 시 "네이버 후기·…"로 잘릴 수 있다.
- **스크린샷 요청(루트)**:
  - /부산법무사, /contact를 1024×768과 1280×800으로 촬영해 좌측 카드의 "네이버 후기·사진" 버튼을 확인.
  - 360×740에서 홈 하단 마지막 섹션과 푸터가 하단 CTA에 가려지는지 확인.

## 제안(최대 3)
1. **[증거]** `QuickInquiryForm.tsx:123-124`, `handler.ts:251-256`, `functions/api/quick-inquiry.ts:39-45`
   - **[문제]** 내부 hint와 설정 안내가 고객에게 노출된다(확정, 경미).
   - **[패치]** 클라이언트에서 hint 덧붙이기를 삭제(콘솔 로그로만 남김). no_channel 메시지를 "지금은 온라인 접수가 어렵습니다. 아래 전화·카카오톡으로 연락해 주세요"로 통일.
   - **[보호]** 오류 코드(field/code) 분기, InquiryFailureFallback 표시 조건, Turnstile 검증 순서.
   - **[검증]** `TURNSTILE_ALLOW_BYPASS=1`과 메일 환경변수가 없는 로컬 dev에서 제출 → 화면에 괄호 hint가 없고 대체 채널 4개가 보이는지 확인.
2. **[증거]** `LawyerEeatProfile.tsx:311-312`(+`lawyer-profile.ts:10-11`)
   - **[문제]** /about에 "부산광역시 부산 해운대구·센텀" 중복(확정, 경미).
   - **[패치]** 해당 두 문장에서 `${region} ` 제거, 또는 officeArea를 "해운대구·센텀"으로 바꾸기. 다른 사용처를 grep한 뒤 결정.
   - **[보호]** JSON-LD 주소, /contact 사업자 표, `protect-snapshot diff`에서 about 외 변경 0건.
   - **[검증]** `out/about.html`에서 "부산광역시 부산 " 0건.
3. **[증거]** `SidebarConsultationPanel.tsx:189`, `NaverSmartPlaceCta.tsx:147`
   - **[문제]** 184px 열에서 후기 버튼이 말줄임될 가능성(원인 후보, 스크린샷 필요).
   - **[패치]** 확인되면 사이드바 라벨만 "후기·사진"으로 줄이기. 다른 placement는 유지.
   - **[보호]** aria-label("네이버 플레이스 후기…"), href(`placePath=/review`), 트래킹 placement="sidebar".
   - **[검증]** 1024px 스크린샷에서 말줄임표가 없는지, 해당 버튼의 `scrollWidth <= clientWidth`인지 확인.
