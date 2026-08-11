# Admin Data Model

저장소: **Cloudflare KV (`ADMIN_KV`)** — 별도 SQL migration 없음.

## Keys

| Key | 내용 |
|-----|------|
| `notices` | `FloatingNotice[]` (최대 ~100) |
| `analytics:day:YYYY-MM-DD` | 일별 집계 (`DailyBucket`) |
| `email_logs` | 최근 ~500건 |
| `audit` | 관리자 작업 ~200건 |

## FloatingNotice

```ts
{
  id, title, message,
  status: "draft" | "scheduled" | "active" | "expired" | "archived",
  startAt?, endAt?,
  displayScope: "home" | "all" | "selected-pages",
  selectedPaths?,
  position, style, ctaLabel?, ctaUrl?,
  dismissible, priority,
  createdAt, updatedAt
}
```

공개 API는 title/message/style/CTA/display 옵션만 반환. draft·audit 미포함.

상태 전환: **on-read** (`startAt`/`endAt` + KST) — 별도 cron 없음.

## Analytics (집계만)

원본 event row를 장기 보관하지 않음. collect 시 일별 path/source 카운터만 증가.

이벤트 타입(예): `page_view`, `cta_click`, `phone_click`, `kakao_click`, `consultation_start`, `consultation_submit`, `notice_*`

저장하지 않음: 이름, 전화, 이메일, 상담 본문, 정확 IP, fingerprint.

## EmailLog

`timestamp, messageType, provider, recipientMasked, status, errorSummary, …`  
본문 미저장. 수신 주소 마스킹.

## AdminAuditLog

`action, entityType?, entityId?, createdAt, summary` — IP 미저장.

## Retention

| 데이터 | 방침 |
|--------|------|
| raw events | 저장 안 함 (집계만) |
| daily aggregate | KV에 유지 (트래픽 적을 때 단순 유지; 필요 시 90일+ 키 정리) |
| email / audit | ring buffer (최근 N건) |

## 문의 내용

문의 DB 없음. Telegram/Resend 전달만. 관리자 “문의”는 전환 카운트·메일 로그로 간접 확인.
