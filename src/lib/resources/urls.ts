/** 준비자료 원문 주소·출처 표기(웹·PNG·PDF 공통) */
export const RESOURCE_BRAND = "다옴법무사사무소 · 안윤정 법무사";
/** 사람이 읽는 원문 주소(한글 도메인) */
export const READABLE_ORIGIN = "다옴법무사사무소.kr";
/** QR·링크용 실제 라우트 호스트 */
export const ASCII_ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";

export function readableUrl(slug: string): string {
  return `${READABLE_ORIGIN}/resources/${slug}`;
}

export function absoluteUrl(slug: string): string {
  return `${ASCII_ORIGIN}/resources/${slug}`;
}
