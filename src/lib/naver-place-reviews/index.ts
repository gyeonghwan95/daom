import { readNaverPlaceReviewsFromDisk } from "@/lib/naver-place-reviews/store";
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";

export type {
  NaverPlaceReview,
  NaverPlaceReviewStats,
  NaverPlaceReviewsFeed,
} from "@/lib/naver-place-reviews/types";

export { fetchNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/fetch";
export {
  readNaverPlaceReviewsFromDisk,
  writeNaverPlaceReviewsToDisk,
} from "@/lib/naver-place-reviews/store";
export { formatReviewsFetchedAt } from "@/lib/naver-place-reviews/format";

export function getNaverPlaceReviewsFeed() {
  return readNaverPlaceReviewsFromDisk();
}

export function getSortedNaverPlaceReviews(): NaverPlaceReview[] {
  const feed = readNaverPlaceReviewsFromDisk();
  return [...feed.items].sort((a, b) =>
    b.createdSortKey.localeCompare(a.createdSortKey),
  );
}
