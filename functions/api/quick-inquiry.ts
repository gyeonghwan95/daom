import { handleQuickInquiry } from "../../src/lib/quick-inquiry/core/handler";

type Env = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  INQUIRY_FROM_EMAIL?: string;
  INQUIRY_TO_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
  NEXT_PUBLIC_SITE_URL?: string;
};

function methodNotAllowed(): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      code: "method_not_allowed",
      message: "허용되지 않은 요청입니다.",
    }),
    {
      status: 405,
      headers: {
        Allow: "POST",
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  return handleQuickInquiry(context.request, context.env);
}

export async function onRequest(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  if (context.request.method !== "POST") {
    return methodNotAllowed();
  }
  return onRequestPost(context);
}
