import { handleQuickInquiry } from "@/lib/quick-inquiry/core/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function envFromProcess() {
  return {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    INQUIRY_FROM_EMAIL: process.env.INQUIRY_FROM_EMAIL,
    INQUIRY_TO_EMAIL: process.env.INQUIRY_TO_EMAIL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
}

export async function POST(request: Request) {
  return handleQuickInquiry(request, envFromProcess());
}

export async function GET() {
  return Response.json(
    {
      ok: false,
      code: "method_not_allowed",
      message: "허용되지 않은 요청입니다.",
    },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}
