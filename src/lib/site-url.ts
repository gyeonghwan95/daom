/** 프로덕션 기본 도메인 (한글 다옴법무사사무소.kr 와 동일) */
export const DEFAULT_SITE_URL = "https://xn--2j1br1na42lvxja38mk8r.kr";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  // URL 파서로 정규화해 항상 ASCII(punycode) origin을 반환 — HTTP 헤더 ByteString 오류 방지
  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
