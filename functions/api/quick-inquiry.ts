import { handleQuickInquiry } from "../_lib/quick-inquiry/handler";

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

function jsonError(status: number, code: string, message: string, hint?: string): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
  if (status === 405) headers.Allow = "POST";

  return new Response(
    JSON.stringify({
      ok: false,
      code,
      message,
      ...(hint ? { hint } : {}),
    }),
    { status, headers },
  );
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    return await handleQuickInquiry(context.request, context.env);
  } catch (error) {
    const hint =
      error instanceof Error ? error.message.slice(0, 160) : "unknown_function_error";
    return jsonError(
      500,
      "server_error",
      "일시적인 오류가 발생했습니다. 전화로 문의해 주세요.",
      hint,
    );
  }
}

export async function onRequest(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  if (context.request.method !== "POST") {
    return jsonError(405, "method_not_allowed", "허용되지 않은 요청입니다.");
  }
  return onRequestPost(context);
}
