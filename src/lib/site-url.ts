/** 공개 사이트 URL (sitemap·canonical·RSS·JSON-LD) */
export const DEFAULT_SITE_URL = "https://다옴법무사사무소.kr";

/** HTTP 헤더·metadataBase용 ASCII(punycode) — 한글 도메인과 동일 */
export const DEFAULT_SITE_URL_ASCII = "https://xn--2j1br1na42lvxja38mk8r.kr";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

/**
 * Next.js metadataBase 전용.
 * `new URL(한글도메인).origin`은 punycode로 바뀌므로, 헤더 ByteString 오류 방지를 위해
 * ASCII origin을 명시적으로 반환합니다.
 */
export function getMetadataBaseUrl(): string {
  try {
    return new URL(getSiteUrl()).origin;
  } catch {
    return DEFAULT_SITE_URL_ASCII;
  }
}
