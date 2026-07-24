import { escapeHtml, formatKstNow } from "./sanitize";
import type { ValidatedInquiry } from "./types";

export type NotifyEnv = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  RESEND_API_KEY?: string;
  INQUIRY_FROM_EMAIL?: string;
  INQUIRY_TO_EMAIL?: string;
};

export type NotifyChannels = {
  telegram: boolean;
  email: boolean;
};

export function resolveNotifyChannels(env: NotifyEnv): NotifyChannels {
  const from = env.INQUIRY_FROM_EMAIL?.trim() ?? "";
  const fromOk = from.includes("@") && !from.startsWith("@") && !from.endsWith("@");
  return {
    telegram: Boolean(env.TELEGRAM_BOT_TOKEN?.trim() && env.TELEGRAM_CHAT_ID?.trim()),
    email: Boolean(
      env.RESEND_API_KEY?.trim() &&
        fromOk &&
        env.INQUIRY_TO_EMAIL?.trim(),
    ),
  };
}

function buildPlainBody(
  data: ValidatedInquiry,
  channels: ("telegram" | "email")[],
): string {
  return [
    "[홈페이지 신규 문의]",
    `문의 내용: ${data.message}`,
    `연락처: ${data.contact}`,
    `유입 페이지: ${data.pageTitle}`,
    `URL: ${data.pageUrl}`,
    `접수 시각: ${formatKstNow()}`,
    `알림 경로: ${channels.map((c) => (c === "telegram" ? "Telegram" : "Email")).join(" / ")}`,
  ].join("\n");
}

/**
 * Resend는 인증 도메인을 punycode(xn--...)로 등록하는 경우가 많음.
 * FROM에 한글 도메인이 오면 ASCII로 바꿔 발송 실패를 줄인다.
 */
export function normalizeSenderAddress(from: string): string {
  const trimmed = from.trim();
  const angled = trimmed.match(/^(.*)<\s*([^<>@\s]+)@([^<>\s]+)\s*>\s*$/);
  if (angled) {
    const name = angled[1].trim();
    const local = angled[2];
    const domain = angled[3];
    const asciiDomain = toAsciiDomain(domain);
    const email = `${local}@${asciiDomain}`;
    return name ? `${name} <${email}>` : email;
  }

  const plain = trimmed.match(/^([^<>@\s]+)@([^<>\s]+)$/);
  if (!plain) return trimmed;
  return `${plain[1]}@${toAsciiDomain(plain[2])}`;
}

function toAsciiDomain(domain: string): string {
  try {
    return new URL(`http://${domain}`).hostname;
  } catch {
    return domain;
  }
}

function buildTelegramHtml(data: ValidatedInquiry, channels: ("telegram" | "email")[]): string {
  const contactLink =
    data.contactKind === "phone"
      ? `<a href="tel:${data.contact.replace(/\D/g, "")}">${escapeHtml(data.contact)}</a>`
      : `<a href="mailto:${escapeHtml(data.contact)}">${escapeHtml(data.contact)}</a>`;

  const pageUrlEscaped = escapeHtml(data.pageUrl);
  const pageLine = data.pageUrl.startsWith("http")
    ? `<a href="${pageUrlEscaped}">${escapeHtml(data.pageTitle)}</a>\n${pageUrlEscaped}`
    : `${escapeHtml(data.pageTitle)}\n${pageUrlEscaped}`;

  return [
    "<b>[홈페이지 신규 문의]</b>",
    "",
    `<b>문의 내용</b>\n${escapeHtml(data.message)}`,
    "",
    `<b>연락처</b>\n${contactLink}`,
    "",
    `<b>유입 페이지</b>\n${pageLine}`,
    "",
    `<b>접수 시각</b>\n${escapeHtml(formatKstNow())}`,
    "",
    `<b>알림 경로</b>\n${channels.map((c) => (c === "telegram" ? "Telegram" : "Email")).join(" / ")}`,
  ].join("\n");
}

export type DeliveryAttempt = {
  ok: boolean;
  status?: number;
  /** Resend 등 외부 API의 짧은 오류 문구 (비밀·연락처 제외) */
  hint?: string;
};

export async function sendTelegram(
  env: NotifyEnv,
  data: ValidatedInquiry,
  channels: ("telegram" | "email")[],
): Promise<DeliveryAttempt> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return { ok: false, hint: "telegram_not_configured" };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramHtml(data, channels),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (res.ok) return { ok: true, status: res.status };
    return { ok: false, status: res.status, hint: "telegram_send_failed" };
  } catch {
    return { ok: false, hint: "telegram_network_error" };
  }
}

export async function sendResendEmail(
  env: NotifyEnv,
  data: ValidatedInquiry,
  channels: ("telegram" | "email")[],
): Promise<DeliveryAttempt> {
  const apiKey = env.RESEND_API_KEY?.trim();
  const fromRaw = env.INQUIRY_FROM_EMAIL?.trim();
  const to = env.INQUIRY_TO_EMAIL?.trim();
  if (!apiKey || !fromRaw || !to) {
    return { ok: false, hint: "email_not_configured" };
  }

  const from = normalizeSenderAddress(fromRaw);
  const plain = buildPlainBody(data, channels);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[다옴] 홈페이지 신규 문의`,
        text: plain,
      }),
    });

    if (res.ok) return { ok: true, status: res.status };

    let hint = `resend_http_${res.status}`;
    try {
      const errBody = (await res.json()) as {
        message?: string;
        name?: string;
        error?: string;
      };
      const msg = (errBody.message || errBody.error || errBody.name || "")
        .toString()
        .slice(0, 180);
      if (msg) hint = msg;
    } catch {
      // ignore parse errors
    }
    return { ok: false, status: res.status, hint };
  } catch {
    return { ok: false, hint: "resend_network_error" };
  }
}

export async function deliverInquiry(
  env: NotifyEnv,
  data: ValidatedInquiry,
): Promise<
  | { ok: true; channels: ("telegram" | "email")[] }
  | { ok: false; code: "no_channel" | "delivery_failed"; hint?: string }
> {
  const available = resolveNotifyChannels(env);
  if (!available.telegram && !available.email) {
    return { ok: false, code: "no_channel" };
  }

  const planned: ("telegram" | "email")[] = [];
  if (available.telegram) planned.push("telegram");
  if (available.email) planned.push("email");

  const results = await Promise.all([
    available.telegram
      ? sendTelegram(env, data, planned)
      : Promise.resolve({ ok: false } as DeliveryAttempt),
    available.email
      ? sendResendEmail(env, data, planned)
      : Promise.resolve({ ok: false } as DeliveryAttempt),
  ]);

  const succeeded: ("telegram" | "email")[] = [];
  if (available.telegram && results[0].ok) succeeded.push("telegram");
  if (available.email && results[1].ok) succeeded.push("email");

  if (succeeded.length === 0) {
    const hint =
      (available.email && results[1].hint) ||
      (available.telegram && results[0].hint) ||
      "delivery_failed";
    return { ok: false, code: "delivery_failed", hint };
  }

  return { ok: true, channels: succeeded };
}
