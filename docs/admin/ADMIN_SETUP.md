# Admin Setup

## 1. Cloudflare 설정 (필수)

> **중요:** 이 프로젝트는 `wrangler.toml`로 바인딩을 관리합니다.  
> Dashboard → Settings → Bindings에 “Bindings for this project are being managed through wrangler.toml”이 보이면 **대시보드에서 KV를 추가해도 적용되지 않습니다.**  
> `wrangler.toml`의 `[[kv_namespaces]]`를 수정한 뒤 **재배포**하세요.

1. **KV namespace**  
   Workers & Pages → KV  
   - Production: `gyeonghwan` (`a70f572c…`)  
   - Preview: `gyeonghwan-preview` (`6143c87e…`)  
   바인딩 이름(Variable name)은 반드시 **`ADMIN_KV`**.

2. **`wrangler.toml` 확인**
   ```toml
   [[kv_namespaces]]
   binding = "ADMIN_KV"
   id = "<production-namespace-id>"
   preview_id = "<preview-namespace-id>"
   ```

3. **Secrets (Production / Preview)**  
   Settings → Variables and secrets → Encrypt:

   | Name | 규칙 |
   |------|------|
   | `ADMIN_PASSWORD` | 12자 이상 |
   | `ADMIN_SESSION_SECRET` | 32자 이상 (`openssl rand -base64 32`) |
   | `ADMIN_EMAIL` | 선택 (표시용, 인증 미사용) |

   기존 문의용 `RESEND_*` / `TELEGRAM_*` / Turnstile 시크릿은 그대로 유지.

4. **재배포**  
   바인딩·시크릿·`wrangler.toml` 변경 후 반드시 새 배포.  
   배포 후 `/api/admin/session` JSON에서 `storageConfigured: true`인지 확인.

## 2. 로컬 확인

```bash
npm run build
npm run preview:cf
# http://localhost:8788/admin
```

`next dev`만으로는 Pages Function(`/api/admin/*`)이 동작하지 않을 수 있다. 운영 검증은 `preview:cf` 또는 실제 Pages를 사용한다.

## 3. 사용법 요약

| 작업 | 경로 |
|------|------|
| 오늘 상태 | `/admin` |
| 유입·전환 | `/admin/analytics` |
| 페이지 성과 | `/admin/pages` |
| 메일 실패 | `/admin/email` |
| 플로팅 공지 | `/admin/notices` |
| 시스템 | `/admin/monitoring` |
| SEO 안내 | `/admin/seo` |

공지: plain text만. CTA는 `/경로` 또는 `https://`만. 상담 플로팅과 겹치지 않게 기본 위치는 좌하단.

## 4. Feature 동작

| 기능 | 조건 |
|------|------|
| 로그인 | `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` |
| 통계·공지·메일로그 | `ADMIN_KV` (`wrangler.toml` 바인딩) |
| 공개 공지 | KV + active/scheduled 시간 범위 |

## 5. 장애 시

| 증상 | 확인 |
|------|------|
| `storageConfigured: false` | `wrangler.toml`에 `ADMIN_KV` 있는지 → 재배포 |
| 로그인 UI 안 뜸 / not_configured | Secrets `ADMIN_PASSWORD`(12+) · `ADMIN_SESSION_SECRET`(32+) |
| 공지 API 실패 | 홈은 공지 없이 정상 |
| analytics 실패 | 문의/CTA 정상 |
| 메일 실패 | `/admin/email` + Resend/Telegram 설정 확인 |
