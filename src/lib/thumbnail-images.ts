/** public/image/ 썸네일-* — 카드·목록 썸네일 풀 */
export const THUMBNAIL_IMAGE_PATHS = [
  "/image/썸네일-등기소.jpg",
  "/image/썸네일-서류등기.jpg",
  "/image/썸네일-서류확인.jpg",
  "/image/썸네일-상담협의.jpg",
  "/image/썸네일-사무실.jpg",
  "/image/썸네일-오브제.jpg",
  "/image/썸네일-전공책.jpg",
  "/image/썸네일-법무사책.png",
  "/image/썸네일-민사소송책.png",
  "/image/썸네일-계약임원.jpg",
  "/image/썸네일-법원절차.jpg",
  "/image/썸네일-동부지원.jpg",
  "/image/썸네일-동부지원2.jpg",
  "/image/썸네일-동래구청.jpg",
  "/image/썸네일-수영구청.jpg",
  "/image/썸네일-컴퓨터작업.png",
  "/image/썸네일-작성중.png",
  "/image/썸네일-아래.jpg",
  "/image/썸네일-정면.jpg",
] as const;

export type ThumbnailImagePath = (typeof THUMBNAIL_IMAGE_PATHS)[number];

function hashSlug(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 33) ^ slug.charCodeAt(i);
  }
  return hash >>> 0;
}

/** slug 기준으로 풀에서 안정적으로 썸네일 경로 선택 */
export function pickThumbnailImagePath(slug: string): ThumbnailImagePath {
  return THUMBNAIL_IMAGE_PATHS[hashSlug(slug) % THUMBNAIL_IMAGE_PATHS.length];
}
