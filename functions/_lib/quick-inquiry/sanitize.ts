/** HTML 태그·제어문자 제거 후 공백 정리 */
export function sanitizeText(input: unknown, maxLen: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 한국 휴대·유선 전화 (하이픈/공백 허용) 또는 일반 이메일 */
export function parseContact(
  raw: string,
): { kind: "phone" | "email"; value: string; display: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    const email = trimmed.toLowerCase();
    const emailOk =
      /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
        email,
      ) && email.length <= 120;
    if (!emailOk) return null;
    return { kind: "email", value: email, display: email };
  }

  const digits = trimmed.replace(/\D/g, "");
  // 010/011/016/017/018/019 휴대폰, 02·0XX 유선, 070 인터넷전화
  const phoneOk =
    /^(01[016789]\d{7,8}|02\d{7,8}|0[3-6]\d{7,9}|070\d{7,8})$/.test(digits);
  if (!phoneOk) return null;

  let display = digits;
  if (digits.startsWith("02") && digits.length >= 9) {
    display =
      digits.length === 9
        ? `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
        : `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 10) {
    display = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11) {
    display = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return { kind: "phone", value: digits, display };
}

export function formatKstNow(date = new Date()): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}
