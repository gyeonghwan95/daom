import { NaverReviewsSectionClient } from "@/components/reviews/NaverReviewsSectionClient";
import { getNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews";
import { toPreviewFeed } from "@/lib/naver-place-reviews/preview";

export function NaverReviewsSection() {
  const feed = toPreviewFeed(getNaverPlaceReviewsFeed());
  return <NaverReviewsSectionClient initialFeed={feed} />;
}
