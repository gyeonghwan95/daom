/** 공개 사이트 URL — 한글 도메인(사람·연락처 표기용) */
export const DEFAULT_SITE_URL = "https://다옴법무사사무소.kr";

/** HTTP 헤더·metadataBase·sitemap loc용 ASCII(punycode) — 한글 도메인과 동일 호스트 */
export const DEFAULT_SITE_URL_ASCII = "https://xn--2j1br1na42lvxja38mk8r.kr";

const PUNYCODE_HOST = "xn--2j1br1na42lvxja38mk8r.kr";
const KOREAN_HOST = "다옴법무사사무소.kr";

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
 * 사무소 연락처·푸터·화면에 보이는 홈페이지 링크용.
 * punycode(xn--)가 아니라 한글 도메인으로 표기한다.
 */
export function getHumanSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (host === PUNYCODE_HOST || host === KOREAN_HOST) {
      return DEFAULT_SITE_URL;
    }
    return url.origin.replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/**
 * 사이트 절대 URL의 단일 출처(기술용).
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
