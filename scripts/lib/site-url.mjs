/** 프로덕션 기본 도메인 (한글 IDN — getSiteUrl에서 punycode로 정규화) */
export const DEFAULT_SITE_URL = "https://다옴법무사사무소.kr";

/** sitemap·canonical·robots용 ASCII(punycode) — 한글 도메인과 동일 호스트 */
export const DEFAULT_SITE_URL_ASCII = "https://xn--2j1br1na42lvxja38mk8r.kr";

/**
 * IDN(한글) 호스트를 punycode origin으로 정규화.
 * 페이지 path는 바꾸지 않고 호스트 표기만 sitemap/canonical과 맞춘다.
 */
export function toAsciiSiteUrl(raw) {
  const trimmed = String(raw ?? "").trim().replace(/\/$/, "");
  if (!trimmed) return DEFAULT_SITE_URL_ASCII;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol).origin.replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL_ASCII;
  }
}

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return toAsciiSiteUrl(raw);
}
