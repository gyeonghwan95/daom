import { NATIONWIDE_PAGE_SLUGS } from "./pages";

const NATIONWIDE_SERVICE_SLUGS = new Set([
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "corporate-registration",
  "company-establishment",
  "director-change",
]);

/** 제목 위 '전 지역 업무 가능' chip 표시 여부 */
export function shouldShowNationwideRegionChip(
  path: string,
  slug: string,
): boolean {
  if ((NATIONWIDE_PAGE_SLUGS as readonly string[]).includes(slug)) {
    return true;
  }
  if (NATIONWIDE_SERVICE_SLUGS.has(slug)) {
    return true;
  }
  if (path.startsWith("/업무사례/전국")) {
    return true;
  }
  return false;
}
