# 법무사 업무범위 정리 (2026-10-04)

## 기준

- 법무사법 제2조 제1항: 법원·검찰청 제출 서류 작성(1·2호), 등기·공탁(3·4호), 경매·공매 대리(5호), 개인파산·회생 신청 대리(6호, 기일 진술 제외), 제출 대행(7호), 위 업무에 부수되는 상담·자문(8호)
- 법무사법 제21조 제1항: 업무범위를 넘어 다른 사람의 소송이나 그 밖의 쟁의사건에 관여 금지(위반 시 제73조 형사처벌)
- 변호사법 제109조: 비변호사의 소송대리·화해·합의 등 법률사무 취급 금지
- 원칙: URL·slug는 유지하고 심각한 구절만 수정. 삭제·리다이렉트 없음

## 수정한 내용

### 분쟁형 상황 페이지 4개 + 분류 허브

대상: `/situations/계약금-반환-분쟁`, `/situations/중고거래-분쟁`, `/situations/내용증명-받았을-때`, `/situations/손해배상-청구`, `/situations/분류/계약-일상-분쟁`

| 이전 | 이후 | 문제 |
| --- | --- | --- |
| "반환·배상 범위를 협의한 사례", "손해액을 조정·합의한 사례", "답변·협의 방향을 정한 사례" | "이해를 위한 예시"로 바꾸고, 다툼은 변호사 상담, 법원 서류는 지급명령·소장 준비로 구분 | 사무소가 분쟁 협상에 관여한 것처럼 표시(제21조), 실제 사례 근거 없음 |
| "합의서로 정리/마무리/종결합니다" | "당사자끼리 합의하는 방법입니다" | 합의 대행 암시 |
| "반박·합의 답변을 보냅니다", "소송·반소·이의를 준비합니다" | 본인이 답변, 지급명령엔 이의신청서·소장엔 답변서, 소송 수행은 변호사 | 대리 암시 |
| "귀책·위약·손해액 다툼처럼 … 법무사 상담으로 순서를 먼저 확인" | "다툼이 크거나 소송이 예상되면 변호사 상담 … 법무사는 법원 제출 서류 작성·제출 대행" | 분쟁을 법무사 상담으로 유도 |
| 요약 "상담이 필요한 대표 상황": 손해액 다툼, 형사·민사 병행 등 | 지급명령 신청, 법원 제출 서류, 제출 기한 임박 | 동일 |
| 비용 안내 "법무사 수임료 … 상담 시 안내" + 소송·고발 항목 | 법원 비용·서류 작성 수임료, 소송대리는 변호사 선임 비용 별도 | 소송 수임 암시 |
| 기본 FAQ "○○ 분쟁 상담은 어디서 받을 수 있나요?" | "○○ 관련 서류는 어디서 준비하나요?" + 협상·소송대리 불가 명시 | 분쟁 상담 광고 |
| Service 스키마 "다옴법무사사무소 계약금 반환 분쟁 상담·절차 안내" | "… 계약금 반환 분쟁 관련 법원 제출 서류 작성 상담·절차 안내" | 구조화 데이터상 분쟁 상담 서비스 표시 |
| description "부산 계약 분쟁 상담", "부산 민사 상담" | "부산 지급명령·소장 서류 상담" 등 | 동일 |
| 분류 허브 "합의서를 어떻게 써야 하나요?", FAQ "분쟁 상담은 어떻게 시작하나요?" | "지급명령·소장은 어떻게 준비하나요?", "협상이나 합의도 맡길 수 있나요? → 아닙니다" | 동일 |

### 그 밖의 상황 페이지

- `/situations/전세-경매-진행`: "낙찰 후 퇴거·명도·손해배상까지 검토" → "퇴거 일정과 배당금 수령 시점" (명도 관여 표시)
- `/situations/공동명의-정리`: "이혼·상속·유류분과 연계된 분할" → "이혼·상속과 연계된 지분 정리 등기" (유류분 표시)
- `/situations/상속등기-지연-과태료`: "형제 간 분쟁 … 협의·조정·소송 경로를 함께 설계" → 분할 협의는 상속인끼리, 조정·심판은 변호사 상담 영역
- `/situations/잔금-후-소유권이전-거부`: "이행청구 소송을 검토하고, 등기와 손해배상을 병행한 사례" → 예시로 바꾸고 처분금지가처분 신청서·소장 준비, 소송 수행은 변호사
- `/situations/전입신고-확정일자-없음`: "확정일자 소급 가능 여부를 확인 … 반환 협의를 진행한 사례" → "확정일자는 소급되지 않으므로 지금 바로 받고 …" (사실 오류 + 협의 대행 암시)
- `/situations/집주인-연락-두절`: description "부산 전세 분쟁 상담" → "부산 임차권등기명령 서류 상담"
- 상황 페이지 공통 사례 제목 "현실적인 상담 사례" → "상담 상황 예시" (실제 의뢰 기록이 아닌 예시가 섞여 있음)

### 소개·블로그

- `/about`, `/media`: "기업 법무 특화 … 여러 법률 자문을 진행" → "기업 등기·법원 서류 지원 … 기업의 등기·법원 제출 서류 업무와 관련한 상담" (MOU 사실은 유지)
- `/blog/jeonse-deposit-return-certified-mail`: "전세 분쟁 상담" → "임차권등기명령·지급명령 서류 상담"
- `/blog/complaint-filing-required-materials`: "부산지방법원 소송 상담" → "부산지방법원 소장 서류 상담"

## 수정 파일

`src/components/situations/SituationPageView.tsx`, `src/lib/situations/builder.ts`, `src/lib/situations/categories.ts`, `src/lib/situations/pages/{contract-dispute,inheritance-death,jeonse-lease,real-estate-trade}.ts`, `src/lib/pageData/{template-helpers,json-ld,types}.ts`(분쟁 제목에만 적용, 다른 페이지 출력 동일), `src/lib/lawyer-activities.ts`, `src/data/seo-intent-articles/civil.ts`, 블로그 mdx 2개

## 검증

- `npm run build` 통과, sitemap URL 추가·삭제 0, 이번 수정으로 lastmod가 바뀐 URL 0
- 빌드 결과(noindex 제외 전체 HTML)에서 제거 대상 문구 0건, 새 범위 문구가 분쟁 페이지 4개 모두에 렌더링됨
- 변경 파일 ESLint 0 오류, tsc는 기존 `reserved-inheritance-intents.ts` 1건만

## 수정하지 않고 표시만 한 항목

- 내용증명 작성: 법무부 해석은 법무사 업무 밖, 업계는 반론. 확실한 위반이 아니어서 유지(`/내용증명작성준비`, `/내용증명자가진단` 등)
- "법률상담" 제목(`/부산법률상담`, `/전화가어려울때법률상담`): 변호사법 제112조 제3호 쟁점이 있으나 법무사 업무 범위 내 상담 표시는 통상 허용
- `lawyer-track-record.ts` "법률 자문(부산창조경제혁신센터)", `lawyer-profile.ts` "계약·분쟁 예방 자문": 실제 이력 문구라 유지
- 다른 상황 페이지의 "…한 사례입니다" 본문: 실제 의뢰 여부 확인 불가. 업무범위 문제는 없어 유지

## 상속등기 과태료 사실 오류 수정 (사용자 결정: URL 유지, 내용만 정정)

- 근거: 부동산등기 특별조치법 제2조·제11조의 60일 신청의무·과태료는 계약(매매·증여 등)을 원인으로 한 소유권이전등기에만 적용. 상속등기는 신청기한·과태료 없음. 실제 불이익은 취득세 신고기한(지방세법 제20조, 상속개시일이 속한 달 말일부터 6개월, 외국 주소 상속인 9개월) 경과 시 가산세
- "상속등기를 늦추면 과태료" → "상속등기는 과태료 없음, 취득세 6개월(9개월) 경과 시 가산세"로 정정
- 법인등기(변경 2주, 상법 제635조)·매매·증여(60일) 과태료 설명은 사실이므로 유지
- 자동 생성 "○○과태료" 랜딩 19개: 모든 업무에 "등기·신고 지연 시 과태료가 부과될 수 있습니다"를 붙이던 것을 업무별 사실로 교체(상속등기·상속포기·한정승인·근저당말소·전세권설정·임차권등기명령·개인회생·파산은 "과태료 규정 없음" + 실제 기한, 법인등기 계열은 2주·상법 제635조, 소유권이전·증여는 60일)
- 제목·URL은 그대로 두고 본문에서 "과태료 여부"를 명확히 함

수정된 URL:

- `/situations/상속등기-지연-과태료`, `/situations/해외-거주-상속인`, `/situations/parent-passed-away`
- `/상속등기과태료` 외 자동 생성 "○○과태료" 랜딩 19개
- `/상속등기자가진단`
- `/faq/when-to-file-inheritance-registration`
- `/blog/delaying-inheritance-registration-risks`, `/blog/three-months-after-death-inheritance`, `/blog/inheritance-registration-priority-after-parent-death`
- `/services/cases/haeundae-inheritance-registration-case` ("상속등기 신고 기한" → "취득세 신고기한")
- 상속등기 지역 랜딩의 공통 문구("3개월 신고 기한과 과태료 리스크" → "상속포기·한정승인 3개월과 취득세 신고기한"), `/tools/inheritance-registration-deadline`, 상속등기 서비스 전환 블록

수정 파일: `src/lib/situations/{config.ts,pages/inheritance-death.ts}`, `src/data/diagnosis-pages/inheritance-registration.ts`, `src/data/diagnosis-seo/inheritance.ts`, `src/data/seo-intent-articles/inheritance.ts`, `src/content/blog/{delaying-inheritance-registration-risks,three-months-after-death-inheritance,inheritance-registration-priority-after-parent-death}.mdx`, `src/content/faq/when-to-file-inheritance-registration.mdx`, `src/content/cases/haeundae-inheritance-registration-case.mdx`, `src/lib/seo-landing/content.ts`, `src/lib/local-landing/{builder.ts,selection/topics/busan-inheritance-guide.ts}`, `src/lib/tools/{calculators,config}.ts`, `src/lib/service-conversion/configs.ts`

검증: `npm run build` 통과. 빌드 결과 전체(15,942개 파일)에서 이전 오류 문구 0건(남은 1건은 대표이사 주소변경 블로그로 법인 과태료라 사실). 정정 문구가 대상 페이지에 렌더링됨. sitemap URL 추가·삭제 0. 이번 수정으로 lastmod가 바뀐 URL은 `/상속등기자가진단` 1개(내용 정정 대상)

## 수집 요청 후보(배포 후)

lastmod가 바뀌지 않아 IndexNow 자동 제출에는 빠집니다. 필요하면 서치어드바이저에서 직접 요청하세요.

- https://다옴법무사사무소.kr/situations/계약금-반환-분쟁
- https://다옴법무사사무소.kr/situations/중고거래-분쟁
- https://다옴법무사사무소.kr/situations/내용증명-받았을-때
- https://다옴법무사사무소.kr/situations/손해배상-청구
- https://다옴법무사사무소.kr/situations/분류/계약-일상-분쟁
- https://다옴법무사사무소.kr/situations/상속등기-지연-과태료
- https://다옴법무사사무소.kr/상속등기과태료
- https://다옴법무사사무소.kr/faq/when-to-file-inheritance-registration
- https://다옴법무사사무소.kr/blog/delaying-inheritance-registration-risks
