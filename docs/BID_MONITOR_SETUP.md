# 법무사 업무기회 데일리 브리핑 — 설치·운영 가이드

나라장터(조달청) 공식 Open API에서 입찰공고를 매일 수집·분류·점수화해
이메일 브리핑을 발송하는 시스템입니다. 기존 사이트(URL·메뉴·SEO)와 완전히
분리된 `collector/` 폴더에서 동작하며, 정적 사이트 빌드에 영향을 주지 않습니다.

## 구조

```
GitHub Actions (매일 07:30 KST)
  → 나라장터 Open API 수집 (용역·물품)
  → 누리장터 민간입찰 Open API 수집 (용역·기타)  ← 아파트관리사무소 등
  → 키워드·의미규칙 분류 → 적합도 점수화 (100점 만점)
  → 중복 제거·정정/취소 추적 (collector/data/state.json, Actions cache 유지)
  → HTML + plain text 이메일 발송 (Resend)
  → 브리핑 아카이브를 artifact로 저장 (14일)
```

## 1. 공공데이터포털 API 키 발급

1. [공공데이터포털](https://www.data.go.kr) 회원가입 후 로그인.
2. 아래 **두 서비스**를 각각 검색해 **활용신청**합니다 (자동승인).
   - **조달청_나라장터 입찰공고정보서비스** — 공공기관 입찰공고
   - **조달청_누리장터 민간입찰공고서비스** — 아파트관리사무소·영리법인 등 민간입찰
   - 인증키는 계정당 하나지만 **API별로 활용신청 승인**이 있어야 합니다.
     나라장터만 신청하고 누리장터를 빼먹으면 누리장터 호출 시
     `SERVICE_KEY_IS_NOT_REGISTERED` / 접근거부(20)가 납니다.
3. 마이페이지 → 활용신청 현황 → 개발계정 상세에서 **Decoding(원본) 인증키** 복사.
4. 이 키가 `G2B_SERVICE_KEY` 입니다 (두 서비스 공통).

## 2. 이메일 설정 (Resend)

이 프로젝트는 간편문의에 이미 Resend를 사용 중이므로 같은 키를 재사용합니다.

- `RESEND_API_KEY` — Resend 대시보드의 API 키 (기존 키 재사용 가능)
- `BID_EMAIL_FROM` — 인증된 도메인의 발신 주소 (예: `브리핑 <brief@도메인>`)
- `BID_EMAIL_TO` — 수신 주소 (쉼표로 여러 명 가능)

`BID_EMAIL_FROM/TO`를 비우면 기존 `INQUIRY_FROM_EMAIL` / `INQUIRY_TO_EMAIL`을
대신 사용합니다. 개인 Gmail 비밀번호는 사용하지 않습니다.

## 3. GitHub Secrets 등록

저장소 → Settings → Secrets and variables → Actions → New repository secret:

| Secret | 값 |
|---|---|
| `G2B_SERVICE_KEY` | 공공데이터포털 Decoding 인증키 |
| `RESEND_API_KEY` | Resend API 키 |
| `BID_EMAIL_FROM` | 발신 주소 |
| `BID_EMAIL_TO` | 수신 주소 |

키를 코드·커밋에 절대 넣지 마세요. `.env.example`에는 키 이름만 있습니다.

## 4. 로컬 실행

```bash
# 오프라인 샘플 데이터로 전체 파이프라인 확인 (API 키 불필요)
npm run bid:sample

# 단위 테스트
npm run bid:test

# 실수집 + 이메일 미발송 (미리보기 파일만 생성)
# .env.local 등에 G2B_SERVICE_KEY 설정 후
npm run bid:dry

# 실수집 + 이메일 발송
npm run bid:run
```

미리보기·결과물은 `collector/output/briefing-YYYY-MM-DD.{html,txt,json}`에
생성됩니다 (gitignore 대상).

Windows PowerShell에서 환경변수 지정 예:

```powershell
$env:G2B_SERVICE_KEY="발급키"; npm run bid:dry
```

## 5. 예약·수동 실행

- 예약: `.github/workflows/daily-opportunity-brief.yml` — 매일 **07:30 KST**
  (UTC 22:30). GitHub 스케줄 지연 가능성이 있어 메일의 "수집 기준시각"은
  실제 실행시각을 표시합니다.
- 수동: Actions 탭 → Daily Opportunity Brief → Run workflow.
  `dry_run`(발송 안 함), `force_email`(당일 중복 발송 방지 무시) 옵션 제공.
- 중복 메일 방지: 상태 파일에 마지막 발송 KST 날짜를 기록해 하루 1회만 발송.
- 주말 미발송: 워크플로의 `BID_WEEKDAYS_ONLY`를 `"true"`로 변경.

## 6. 키워드·기관·프로필 수정

| 항목 | 파일 |
|---|---|
| 수집 소스 추가·비활성화 | `collector/config/sources.ts` |
| 키워드·가중치·의미규칙 | `collector/config/keywords.ts` ([가이드](./BID_KEYWORD_GUIDE.md)) |
| 사무소 지역·수행분야 | `collector/config/office-profile.ts` |

새 소스는 레지스트리에 항목을 추가하면 됩니다. 공식 API가 없는 소스는
`type: "manual-link"`로 등록하면 브리핑 하단에 수동 확인 링크로 포함됩니다.
robots·이용약관을 검토하지 않은 사이트를 자동수집으로 전환하지 마세요.

## 7. 오류 해결

| 증상 | 원인·조치 |
|---|---|
| `SERVICE_KEY_IS_NOT_REGISTERED_ERROR` | 해당 API 활용신청 미승인. 포털에서 "나라장터 입찰공고정보서비스" 활용신청 확인 |
| `G2B API resultCode 30` | 인증키 오류. Decoding 키인지 확인 |
| HTTP 429 | 트래픽 제한. 자동 백오프 후 재시도됨. 빈도 조정은 `BID_LOOKBACK_DAYS` 축소 |
| 이메일 미발송 로그 | `RESEND_API_KEY`/`BID_EMAIL_FROM`/`BID_EMAIL_TO` Secrets 확인 |
| 특정 소스만 실패 | 다른 소스와 브리핑은 정상 진행됨. 메일 하단 "수집 상태"에서 마지막 정상 수집시각 확인 |
| 엔드포인트 이관 공지 | `G2B_API_BASE` 환경변수 또는 `sources.ts`의 `apiUrl`만 수정 |

- "신규 적합 공고 없음"은 실패가 아닙니다 — 정상 브리핑이 발송됩니다.
- 수집 실패와 신규 없음은 메일 요약과 수집 상태 섹션에서 구분 표시됩니다.

## 8. 보안 원칙

- API 키·메일 비밀번호는 GitHub Secrets / 로컬 `.env.local`에만 저장.
- 로그에 키는 마스킹(`abcd…xy`), 메일 주소는 `la****@…` 형태로만 출력.
- 공고 제목·첨부 파일명은 이메일 렌더링 시 전부 HTML escaping (XSS 방지).
- 상태 DB(`collector/data/`)와 브리핑 출력물은 저장소에 커밋하지 않음.
- 자동 입찰서 제출·참가신청 기능은 없으며 구현하지 않음.
- 로그인·인증서·CAPTCHA 우회를 시도하지 않음.
