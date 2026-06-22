/** 프로덕션 기본 도메인 (Punycode — IDN canonical, https://다옴법무사사무소.kr 와 동일) */
export const DEFAULT_SITE_URL = "https://xn--2j1br1na42lvxja38mk8r.kr";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
}
