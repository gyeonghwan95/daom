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

## 3. Resend (이메일 알림)

1. [resend.com](https://resend.com) 가입 후 API Key 발급 → `RESEND_API_KEY`
2. Domains에 사이트 도메인 추가·DNS 인증 → **Verified**
3. 환경변수:

| 변수 | 올바른 예 | 잘못된 예 |
|------|-----------|-----------|
| `INQUIRY_FROM_EMAIL` | `noreply@xn--2j1br1na42lvxja38mk8r.kr` | `xn--2j1br1na42lvxja38mk8r.kr` (도메인만 넣으면 실패) |
| `INQUIRY_TO_EMAIL` | `lawyoonjung@naver.com` | — |
| `RESEND_API_KEY` | `re_...` | — |

FROM은 **Resend에 Verified된 도메인**의 주소여야 합니다.  
한글 도메인 사이트라면 punycode 형태를 권장합니다.

```text
INQUIRY_FROM_EMAIL=noreply@xn--2j1br1na42lvxja38mk8r.kr
```

또는 표시 이름 포함:

```text
INQUIRY_FROM_EMAIL=다옴법무사사무소 <noreply@xn--2j1br1na42lvxja38mk8r.kr>
```

Telegram만 / Resend만 / 둘 다 가능합니다.  
둘 다 실패할 때만 사용자에게 오류 + 전화 대체 CTA를 보여줍니다.

### 502 delivery_failed 점검

1. Resend → **Emails / Logs** 에 실패 기록이 있는지 확인
2. 브라우저 개발자도구 → Network → `quick-inquiry` 응답 JSON의 `hint` 확인
3. `INQUIRY_FROM_EMAIL`이 Verified 도메인과 일치하는지 확인 후 **재배포**

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

## 7. 배포 후 403 (Origin)

브라우저는 한글 도메인을 punycode(`https://xn--....kr`) Origin으로 보냅니다.
서버는 Origin을 정규화해 비교하며, 현재 배포 호스트도 허용합니다.

그래도 403이면 Cloudflare Pages Runtime에 다음을 추가한 뒤 **재배포**하세요.

```text
ALLOWED_ORIGINS=https://다옴법무사사무소.kr,https://xn--2j1br1na42lvxja38mk8r.kr
```

www를 쓰면 www 주소도 쉼표로 추가합니다.
