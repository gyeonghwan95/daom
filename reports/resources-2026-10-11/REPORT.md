# 의뢰 전 준비자료실 — 2026-10-11 (미배포)

## 구현
- 경로(신규, 기존 동일 목적 URL 없음): `/resources`, `/resources/{inheritance-family, unpaid-evidence, company-change, inheritance-overseas, property-closing}`
- 단일 원본 `src/data/resources/guides.ts`에서 웹 본문, PNG 1080×1440, A4 PDF, OG 1200×630, 인쇄 화면을 함께 만듦. 버전 `2026.10.11-1`, 근거 확인일 2026-10-11
- 자산 생성: `npm run resources:assets`(로컬 Chrome, Noto Sans KR 고정 TTF를 TrueType으로 임베딩). 빌드 전 검사 `scripts/validate-resource-assets.ts`가 확인하는 것:
  - 원본·조판 해시, 파일 존재
  - PNG·OG 크기
  - PDF 글꼴 임베딩·링크
- 연결: 메뉴 '준비자료실', 푸터, 홈 FAQ 아래 칩 5개, 관련 업무 글 20곳의 끝 신뢰 블록에 해당 자료 한 줄
- 문의: 본문 중간(개별 검토 조건 뒤)과 하단 2곳
  - 목적형 버튼 → `/contact/inquiry?intent=…&from=resources-<slug>-mid|end`
  - 카카오톡·네이버 톡톡, 문의 양식 복사(사실 3~4개를 빈칸 양식으로)
- 집계: 기존 `trackCTA`로 `resource-png/pdf/print/copy-link/share/copy-message/inquiry/kakao/naver-talk` 클릭 종류만 보냄(경로 외 내용 없음)
- 체크박스는 화면 상태만 씀(저장 없음). 공유 버튼은 지원 환경에서만 보이고, 취소(AbortError)는 무시함
- `_headers`: `/resources/pdf/*`에 application/pdf와 X-Robots-Tag noindex를 둠(원문 HTML이 색인 대상). 이미지는 색인을 허용함
- 의존성: `qrcode`, `@types/qrcode`(devDependencies, 생성기 전용)

## 근거
`EVIDENCE.md`(20행, 원문은 `sources/`). 단정하지 않은 항목(국가별 아포스티유, 유형별 결의·공증, 거래신고·허가 기한)은 내부 미확인 목록에 둠.

## 검증
- 회귀(after21→after22):
  - 기존 route 삭제 0, 추가 6
  - 기존 title·H1·description·canonical·robots·sitemap 변화 0, 링크 손실 0
  - 본문 변화 23(홈, 연결된 업무 글 20, 메뉴형 링크가 본문에 있는 업무사례 2)
- 새 페이지: self canonical, index, sitemap 포함, BreadcrumbList, 자료별 OG
- `npm run build` 성공, `npm test` 17/17, 중복 검사 FAIL 0, eslint(src) 통과, tsc는 기존 오류 1(대상 외)
- 렌더링:
  - 웹: 360·390·1280px 가로 넘침 0
  - 인쇄: 헤더 태그가 숨겨지는 문제를 고친 뒤 확인
  - PNG: 5종 확인
  - PDF: 5종 15쪽을 pdf.js로 렌더링. 텍스트 추출 가능, 링크 5~10개, 원문 주소 포함
- 문구 점검: 무료·보장·불안 조장 표현 0
- 확인하지 못한 것:
  - 실제 기기에서 공유 창과 길게 눌러 저장
  - 운영 MIME
  - 실제 문의 발송(금지)

## 내용을 바꿀 때
`guides.ts`에서 `RESOURCE_VERSION`을 올리고 `npm run resources:assets`를 실행함. 이전 버전 파일은 지우지 않음.
