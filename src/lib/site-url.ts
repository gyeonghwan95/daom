/** 프로덕션 기본 도메인 (https://xn--2j1br1na42lvxja38mk8r.kr 과 동일) */
export const DEFAULT_SITE_URL = "https://다옴법무사사무소.kr";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
}
