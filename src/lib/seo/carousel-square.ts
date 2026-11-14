import { readGeneratedTable } from "@/lib/seo/server-json";

/**
 * 서버 렌더링 전용(빌드 시 HTML·구조화 데이터 생성)이다. 클라이언트 컴포넌트에서 import하지 않는다 — 목록 JSON이 브라우저 JS에 실린다.
 * 캐러셀 구조화 데이터(ItemList) 이미지를 정사각형 사본으로 바꾼다.
 * 네이버 캐러셀 칸은 정사각형이라 4:3 대표 이미지는 글자가 잘렸다. 사본은 scripts/generate-carousel-squares.mjs가 만든다.
 * 사본이 없는 이미지(이미 정사각형 등)는 그대로 둔다.
 */
export function toSquareCarouselImage(src: string): string {
  if (!src || /^https?:\/\//.test(src)) return src;
  let decoded = src.split(/[?#]/)[0];
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    /* keep */
  }
  return readGeneratedTable("carousel-squares.json")[decoded.normalize("NFC")] ?? src;
}
