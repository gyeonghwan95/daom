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

function buildEmailSubject(pageTitle: string): string {
  const title = pageTitle.replace(/\s+/g, " ").trim();
  if (!title || title === "제목 없음" || title === "-") {
    return "[다옴] 홈페이지 신규 문의";
  }
  const short = title.length > 48 ? `${title.slice(0, 48)}…` : title;
  return `[다옴] ${short}`;
}

function channelLabel(channels: ("telegram" | "email")[]): string {
  return channels.map((c) => (c === "telegram" ? "Telegram" : "Email")).join(" / ");
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
    `알림 경로: ${channelLabel(channels)}`,
  ].join("\n");
}

/** 트랜잭션 HTML — 외부 이미지·웹폰트 없이 인라인 스타일만 사용 */
function buildHtmlBody(
  data: ValidatedInquiry,
  channels: ("telegram" | "email")[],
): string {
  const receivedAt = formatKstNow();
  const contactHref =
    data.contactKind === "phone"
      ? `tel:${data.contact.replace(/\D/g, "")}`
      : `mailto:${escapeHtml(data.contact)}`;
  const pageHref = data.pageUrl.startsWith("http") ? escapeHtml(data.pageUrl) : "";
  const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br>");

  const pageBlock = pageHref
    ? `<a href="${pageHref}" style="color:#0f766e;font-weight:600;text-decoration:none;">${escapeHtml(data.pageTitle)}</a>
       <div style="margin-top:6px;font-size:12px;color:#64748b;word-break:break-all;">${pageHref}</div>`
    : `<div style="font-weight:600;color:#0f172a;">${escapeHtml(data.pageTitle)}</div>
       <div style="margin-top:6px;font-size:12px;color:#64748b;word-break:break-all;">${escapeHtml(data.pageUrl)}</div>`;

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>홈페이지 신규 문의</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#0f766e;padding:22px 24px;">
              <div style="font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.75);">다옴법무사사무소</div>
              <div style="font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:20px;font-weight:800;color:#ffffff;margin-top:6px;">홈페이지 신규 문의</div>
              <div style="font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:13px;color:rgba(255,255,255,0.85);margin-top:8px;">접수 ${escapeHtml(receivedAt)} (KST)</div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 24px;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
              <div style="font-size:12px;font-weight:700;color:#0f766e;letter-spacing:0.04em;margin-bottom:8px;">문의 내용</div>
              <div style="font-size:15px;line-height:1.7;color:#0f172a;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;">${messageHtml}</div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td style="padding:0 0 14px;border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:12px;font-weight:700;color:#64748b;margin-bottom:4px;">연락처</div>
                    <a href="${contactHref}" style="font-size:16px;font-weight:700;color:#0f766e;text-decoration:none;">${escapeHtml(data.contact)}</a>
                    <div style="font-size:12px;color:#94a3b8;margin-top:4px;">${data.contactKind === "phone" ? "전화" : "이메일"}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:12px;font-weight:700;color:#64748b;margin-bottom:4px;">유입 페이지</div>
                    ${pageBlock}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0 0;">
                    <div style="font-size:12px;font-weight:700;color:#64748b;margin-bottom:4px;">알림 경로</div>
                    <div style="font-size:14px;color:#334155;">${escapeHtml(channelLabel(channels))}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:12px;color:#94a3b8;line-height:1.6;">
              사이트 DB에는 문의 원문을 저장하지 않습니다. 본 메일은 접수 알림용입니다.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
  const html = buildHtmlBody(data, channels);

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
        subject: buildEmailSubject(data.pageTitle),
        html,
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
