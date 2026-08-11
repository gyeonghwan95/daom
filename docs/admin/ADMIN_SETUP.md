# Admin Setup

## 1. Cloudflare 설정 (필수)

1. **KV namespace 생성**  
   Workers & Pages → KV → Create → 예: `daom-admin`

2. **Pages 프로젝트에 바인딩**  
   프로젝트 → Settings → Functions → KV namespace bindings  
   - Variable name: **`ADMIN_KV`** (이름 고정)  
   - Namespace: 위에서 만든 KV

3. **Secrets (Production / Preview)**  
   Settings → Variables and secrets → Encrypt:

   | Name | 규칙 |
   |------|------|
   | `ADMIN_PASSWORD` | 12자 이상 |
   | `ADMIN_SESSION_SECRET` | 32자 이상 (`openssl rand -base64 32`) |
   | `ADMIN_EMAIL` | 선택 (표시용, 인증 미사용) |

   기존 문의용 `RESEND_*` / `TELEGRAM_*` / Turnstile 시크릿은 그대로 유지.

4. **재배포**  
   바인딩·시크릿 변경 후 반드시 새 배포.

## 2. 로컬 확인

```bash
npm run build
npm run preview:cf
# http://localhost:8788/admin
```

`wrangler.toml`에 KV preview id를 넣거나, Dashboard binding과 동일하게 로컬 바인딩을 지정한다.  
KV 없이 실행하면 로그인 UI는 뜨지만 통계·공지 저장은 “미측정/저장소 없음”으로 표시된다.

`next dev`만으로는 Pages Function(`/api/admin/*` 신규)이 동작하지 않을 수 있다. 운영 검증은 `preview:cf` 또는 실제 Pages를 사용한다.

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
| 통계·공지·메일로그 | `ADMIN_KV` |
| 공개 공지 | KV + active/scheduled 시간 범위 |

## 5. 장애 시

- 공지 API 실패 → 홈은 공지 없이 정상
- analytics 실패 → 문의/CTA 정상
- 메일 실패 → `/admin/email` + Resend/Telegram 설정 확인
