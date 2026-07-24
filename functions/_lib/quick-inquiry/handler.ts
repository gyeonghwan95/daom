import { checkDuplicate, checkRateLimit, hashDuplicateKey } from "./rate-limit";
import { deliverInquiry, type NotifyEnv } from "./notify";
import { validateInquiryBody } from "./validate";
import type { InquiryResult } from "./types";

export type QuickInquiryHandlerEnv = NotifyEnv & {
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGINS?: string;
  NEXT_PUBLIC_SITE_URL?: string;
};

function json(result: InquiryResult, status: number): Response {
  return new Response(JSON.stringify(result), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function defaultAllowedOrigins(env: QuickInquiryHandlerEnv): string[] {
  const fromEnv = (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const site = env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const bases = [
    ...fromEnv,
    site,
    "https://다옴법무사사무소.kr",
    "https://www.다옴법무사사무소.kr",
    "https://xn--2j1br1na42lvxja38mk8r.kr",
    "https://www.xn--2j1br1na42lvxja38mk8r.kr",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8788",
    "http://127.0.0.1:8788",
  ].filter(Boolean) as string[];
  return Array.from(new Set(bases));
}

/** IDN(한글 도메인) ↔ punycode 를 같은 origin으로 맞춤 */
function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function buildAllowedOriginSet(
  request: Request,
  env: QuickInquiryHandlerEnv,
): Set<string> {
  const set = new Set<string>();
  for (const raw of defaultAllowedOrigins(env)) {
    const normalized = normalizeOrigin(raw);
    if (normalized) set.add(normalized);
  }
  // 현재 배포 호스트(pages.dev·커스텀 도메인)는 항상 허용
  const selfOrigin = normalizeOrigin(request.url);
  if (selfOrigin) set.add(selfOrigin);
  return set;
}

function isAllowedOrigin(request: Request, env: QuickInquiryHandlerEnv): boolean {
  const allowed = buildAllowedOriginSet(request, env);
  const originHeader = request.headers.get("Origin");

  if (originHeader) {
    const origin = normalizeOrigin(originHeader);
    return origin !== null && allowed.has(origin);
  }

  // Origin 생략 시(일부 브라우저/프록시): same-site 또는 Referer
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (fetchSite === "same-origin" || fetchSite === "same-site") return true;

  const referer = request.headers.get("Referer");
  if (!referer) return false;
  const refOrigin = normalizeOrigin(referer);
  return refOrigin !== null && allowed.has(refOrigin);
}

async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string | null,
): Promise<boolean> {
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/** Cloudflare Pages Function / Next.js Route Handler 공용 */
export async function handleQuickInquiry(
  request: Request,
  env: QuickInquiryHandlerEnv,
): Promise<Response> {
  if (request.method !== "POST") {
    return json(
      {
        ok: false,
        code: "method_not_allowed",
        message: "허용되지 않은 요청입니다.",
      },
      405,
    );
  }

  if (!isAllowedOrigin(request, env)) {
    return json(
      {
        ok: false,
        code: "origin",
        message: "허용되지 않은 요청입니다.",
      },
      403,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(
      {
        ok: false,
        code: "invalid_json",
        message: "요청 형식이 올바르지 않습니다.",
      },
      400,
    );
  }

  const validated = validateInquiryBody(body);
  if (!validated.ok) {
    const status =
      validated.error.code === "honeypot"
        ? 200 // silent success-style block without revealing
        : 400;
    if (validated.error.code === "honeypot") {
      return json({ ok: true, channels: [] }, 200);
    }
    return json(validated.error, status);
  }

  const clientIp =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown";

  // rate key: IP만 사용 (연락처 로그·키 저장 최소화)
  if (!checkRateLimit(`ip:${clientIp}`)) {
    return json(
      {
        ok: false,
        code: "rate_limit",
        message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      },
      429,
    );
  }

  const dupHash = await hashDuplicateKey(
    validated.data.message,
    validated.data.contact,
  );
  if (!checkDuplicate(dupHash)) {
    return json(
      {
        ok: false,
        code: "duplicate",
        message: "같은 내용의 문의가 방금 접수되었습니다. 잠시만 기다려 주세요.",
      },
      429,
    );
  }

  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();
  const token =
    body && typeof body === "object" && "turnstileToken" in body
      ? String((body as { turnstileToken?: unknown }).turnstileToken ?? "")
      : "";

  if (turnstileSecret) {
    if (!token) {
      return json(
        {
          ok: false,
          code: "turnstile",
          field: "turnstile",
          message: "보안 확인을 완료해 주세요.",
        },
        400,
      );
    }
    const ok = await verifyTurnstile(token, turnstileSecret, clientIp === "unknown" ? null : clientIp);
    if (!ok) {
      return json(
        {
          ok: false,
          code: "turnstile",
          field: "turnstile",
          message: "보안 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        },
        400,
      );
    }
  }

  const delivered = await deliverInquiry(env, validated.data);
  if (!delivered.ok) {
    if (delivered.code === "no_channel") {
      const from = env.INQUIRY_FROM_EMAIL?.trim() ?? "";
      const looksLikeDomainOnly = Boolean(from) && !from.includes("@");
      return json(
        {
          ok: false,
          code: "no_channel",
          message: looksLikeDomainOnly
            ? "발신 이메일 설정이 올바르지 않습니다. noreply@도메인 형식으로 등록해 주세요."
            : "지금은 문의 접수 설정이 준비되지 않았습니다. 전화로 문의해 주세요.",
          hint: looksLikeDomainOnly
            ? "INQUIRY_FROM_EMAIL must be an email like noreply@xn--2j1br1na42lvxja38mk8r.kr"
            : "missing_resend_or_telegram_env",
        },
        503,
      );
    }
    return json(
      {
        ok: false,
        code: "delivery_failed",
        message: "문의 전달에 실패했습니다. 전화로 바로 문의해 주세요.",
        ...(delivered.hint ? { hint: delivered.hint } : {}),
      },
      502,
    );
  }

  return json({ ok: true, channels: delivered.channels }, 200);
}
