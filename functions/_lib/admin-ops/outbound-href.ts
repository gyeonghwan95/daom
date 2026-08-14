export function sanitizeOutboundHref(raw, origin) {
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
    const base = origin || "https://invalid.local";
    const u = new URL(href, base);
    if (u.protocol === "tel:") return "tel:";
    if (u.protocol === "mailto:") return "mailto:";
    if (u.protocol === "sms:") return "sms:";
    const path = `${u.pathname || "/"}${u.hash || ""}`;
    if (origin) {
      try {
        if (u.origin === new URL(origin).origin) return (path.slice(0, 160) || "/");
      } catch {
        /* ignore */
      }
    }
    return `${u.host}${u.pathname || "/"}`.slice(0, 160);
  } catch {
    return href.slice(0, 80);
  }
}
