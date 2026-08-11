/** Asia/Seoul date helpers for admin aggregates */

export function formatKstDate(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatKstDateTime(d = new Date()): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

export function addKstDays(dateYmd: string, delta: number): string {
  const [y, m, d] = dateYmd.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d) + delta * 86400000;
  return formatKstDate(new Date(utc));
}

export function kstDateRange(days: number): string[] {
  const today = formatKstDate();
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    out.push(addKstDays(today, -i));
  }
  return out;
}

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at < 1) return "***";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}

export function classifyReferrer(host: string | undefined): string {
  if (!host) return "direct";
  const h = host.toLowerCase();
  if (h.includes("google.")) return "google";
  if (h.includes("naver.")) return "naver";
  if (h.includes("daum.") || h.includes("kakao.")) return "daum";
  if (h.includes("bing.")) return "bing";
  if (h.includes("instagram.") || h.includes("facebook.") || h.includes("t.co")) {
    return "sns";
  }
  return "external";
}

export function normalizePath(raw: string): string {
  try {
    if (raw.startsWith("http")) {
      const u = new URL(raw);
      return u.pathname || "/";
    }
  } catch {
    /* ignore */
  }
  const path = raw.split("?")[0]?.split("#")[0] || "/";
  if (!path.startsWith("/")) return `/${path}`;
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function isSafeCtaUrl(url: string): boolean {
  const t = url.trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return false;
  }
  if (t.startsWith("/")) return true;
  try {
    const u = new URL(t);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function newId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}
