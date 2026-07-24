# 간편 문의 (Quick Inquiry) 설정 가이드

정적 Next.js(`out/`) + Cloudflare Pages Functions(`functions/`) 구성입니다.
문의 내용은 DB에 저장하지 않고 Telegram(필수 권장) / Resend(선택)로만 전달합니다.

서버 공용 로직 위치: `src/lib/quick-inquiry/core/`  
CF Function: `functions/api/quick-inquiry.ts`

## 1. Telegram Bot

1. Telegram에서 [@BotFather](https://t.me/BotFather)에게 `/newbot`으로 봇 생성
2. 발급된 **Bot Token** → `TELEGRAM_BOT_TOKEN`
3. 알림을 받을 채팅(개인/그룹)에서 봇을 추가한 뒤, 아무 메시지나 전송
4. 브라우저에서  
   `https://api.telegram.org/bot<TOKEN>/getUpdates`  
   응답의 `chat.id` → `TELEGRAM_CHAT_ID`  
   (그룹이면 보통 음수 ID)

## 2. Cloudflare Turnstile

1. Cloudflare Dashboard → Turnstile → Add site  
2. Domain에 `다옴법무사사무소.kr`(및 www) 등록  
3. Widget Mode: **Managed** 권장 (invisible/interaction-only 가능)  
4. Site Key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (**빌드 시** 클라이언트에 포함)  
5. Secret Key → `TURNSTILE_SECRET_KEY` (Pages **런타임** 환경변수, 공개 금지)

로컬에서 Secret이 없으면 Turnstile 검증을 건너뜁니다.  
Secret이 있으면 토큰 검증이 필수입니다.

## 3. Resend (선택)

1. [resend.com](https://resend.com) 가입 후 API Key 발급 → `RESEND_API_KEY`
2. 도메인 DNS 인증 후 발신 주소 → `INQUIRY_FROM_EMAIL` (예: `noreply@your-domain.com`)
3. 수신 주소 → `INQUIRY_TO_EMAIL` (법무사 이메일)

Telegram만 있어도 동작하고, Resend만 있어도 동작합니다.  
둘 다 실패할 때만 사용자에게 오류 + 전화 대체 CTA를 보여줍니다.

## 4. Cloudflare Pages 환경변수 위치

Cloudflare Dashboard → **Workers & Pages** → 해당 프로젝트 → **Settings** → **Environment variables**

| 변수 | Production | Preview | 비고 |
|------|------------|---------|------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ | ✅ | **Build**에도 필요 |
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | Build |
| `TURNSTILE_SECRET_KEY` | ✅ | ✅ | Runtime (Functions) |
| `TELEGRAM_BOT_TOKEN` | ✅ | ✅ | Runtime |
| `TELEGRAM_CHAT_ID` | ✅ | ✅ | Runtime |
| `RESEND_API_KEY` | 선택 | 선택 | Runtime |
| `INQUIRY_FROM_EMAIL` | 선택 | 선택 | Runtime |
| `INQUIRY_TO_EMAIL` | 선택 | 선택 | Runtime |
| `ALLOWED_ORIGINS` | 선택 | 선택 | Runtime |

Encrypted / Secret으로 저장하고 저장소·클라이언트 번들에 넣지 마세요.

## 5. 로컬 테스트

```bash
# 1) Next 개발 서버 (App Router API 사용)
# .env.local 에 위 변수 설정 후
npm run dev

# 2) 검증 유닛 테스트
npm run test:quick-inquiry

# 3) 정적 빌드 + Pages Functions 로컬
npm run build
npx wrangler pages dev out --port 8788
```

## 6. 배포 후 확인

1. 모바일: 하단 「간단히 문의 남기기」→ 시트 열림 → 제출
2. 데스크톱: 우측 「간편 문의」→ 패널 열림
3. Telegram에 `[홈페이지 신규 문의]` 수신
4. 잘못된 연락처 / 동의 미체크 / 연속 클릭 / GET `/api/quick-inquiry` (405) 확인
