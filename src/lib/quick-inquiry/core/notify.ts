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
  return {
    telegram: Boolean(env.TELEGRAM_BOT_TOKEN?.trim() && env.TELEGRAM_CHAT_ID?.trim()),
    email: Boolean(
      env.RESEND_API_KEY?.trim() &&
        env.INQUIRY_FROM_EMAIL?.trim() &&
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

function buildTelegramHtml(data: ValidatedInquiry, channels: ("telegram" | "email")[]): string {
  const contactLink =
    data.contactKind === "phone"
      ? `<a href="tel:${data.contact.replace(/\D/g, "")}">${escapeHtml(data.contact)}</a>`
      : `<a href="mailto:${escapeHtml(data.contact)}">${escapeHtml(data.contact)}</a>`;

  const pageUrlEscaped = escapeHtml(data.pageUrl);
  const pageLine =
    data.pageUrl.startsWith("http")
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

export async function sendTelegram(
  env: NotifyEnv,
  data: ValidatedInquiry,
  channels: ("telegram" | "email")[],
): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return false;

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
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendResendEmail(
  env: NotifyEnv,
  data: ValidatedInquiry,
  channels: ("telegram" | "email")[],
): Promise<boolean> {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.INQUIRY_FROM_EMAIL?.trim();
  const to = env.INQUIRY_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) return false;

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
        subject: `[다옴] 홈페이지 신규 문의 — ${data.contact}`,
        text: plain,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deliverInquiry(
  env: NotifyEnv,
  data: ValidatedInquiry,
): Promise<{ ok: true; channels: ("telegram" | "email")[] } | { ok: false; code: "no_channel" | "delivery_failed" }> {
  const available = resolveNotifyChannels(env);
  if (!available.telegram && !available.email) {
    return { ok: false, code: "no_channel" };
  }

  const planned: ("telegram" | "email")[] = [];
  if (available.telegram) planned.push("telegram");
  if (available.email) planned.push("email");

  const results = await Promise.all([
    available.telegram ? sendTelegram(env, data, planned) : Promise.resolve(false),
    available.email ? sendResendEmail(env, data, planned) : Promise.resolve(false),
  ]);

  const succeeded: ("telegram" | "email")[] = [];
  if (available.telegram && results[0]) succeeded.push("telegram");
  if (available.email && results[1]) succeeded.push("email");

  if (succeeded.length === 0) {
    return { ok: false, code: "delivery_failed" };
  }

  return { ok: true, channels: succeeded };
}
