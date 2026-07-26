/** 공개 사이트 URL (sitemap·canonical·RSS·JSON-LD) — ASCII(punycode)로 통일 */
export const DEFAULT_SITE_URL = "https://다옴법무사사무소.kr";

/** HTTP 헤더·metadataBase·sitemap loc용 ASCII(punycode) — 한글 도메인과 동일 호스트 */
export const DEFAULT_SITE_URL_ASCII = "https://xn--2j1br1na42lvxja38mk8r.kr";

/**
 * IDN(한글) 호스트를 punycode origin으로 정규화한다.
 * Google Search Console은 sitemap `<loc>`와 페이지 canonical 호스트 표기가
 * 다르면(한글 vs xn--) 발견·색인이 어긋날 수 있다.
 * 페이지 path(경로)는 변경하지 않는다.
 */
export function toAsciiSiteUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
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

/**
 * 사이트 절대 URL의 단일 출처.
 * 환경변수에 한글 도메인이 들어와도 punycode로 정규화해
 * sitemap · robots · canonical · metadataBase가 같은 호스트를 쓰게 한다.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return toAsciiSiteUrl(raw);
}

/**
 * Next.js metadataBase 전용 — getSiteUrl()과 동일(이미 ASCII).
 */
export function getMetadataBaseUrl(): string {
  return getSiteUrl() || DEFAULT_SITE_URL_ASCII;
}
