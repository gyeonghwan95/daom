/**
 * CTA 목적지 URL — 쿼리·PII 없이 path 또는 host+path만 남긴다.
 */

export function sanitizeOutboundHref(
  raw: string | undefined | null,
  origin?: string,
): string {
  if (!raw || typeof raw !== "string") return "";
  const href = raw.trim();
  if (!href) return "";
  if (href.startsWith("#")) return href.slice(0, 80);
  const lower = href.toLowerCase();
  if (lower.startsWith("tel:")) return "tel:";
  if (lower.startsWith("mailto:")) return "mailto:";
  if (lower.startsWith("sms:")) return "sms:";
  if (href.startsWith("/") && !href.startsWith("//")) {
    try {
      const u = new URL(href, "https://invalid.local");
      return `${u.pathname || "/"}${u.hash || ""}`.slice(0, 160) || "/";
    } catch {
      return href.split("?")[0].slice(0, 160);
    }
  }

  try {
    const base =
      origin ||
      (typeof window !== "undefined" ? window.location.origin : "https://invalid.local");
    const u = new URL(href, base);
    if (u.protocol === "tel:") return "tel:";
    if (u.protocol === "mailto:") return "mailto:";
    if (u.protocol === "sms:") return "sms:";
    const path = `${u.pathname || "/"}${u.hash || ""}`;
    const sameOrigin =
      (origin && u.origin === origin) ||
      (typeof window !== "undefined" && u.origin === window.location.origin);
    if (sameOrigin) return path.slice(0, 160) || "/";
    return `${u.host}${u.pathname || "/"}`.slice(0, 160);
  } catch {
    return href.slice(0, 80);
  }
}
