import { NaverReviewsSectionClient } from "@/components/reviews/NaverReviewsSectionClient";
import { getNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews";

export function NaverReviewsSection() {
  const feed = getNaverPlaceReviewsFeed();
  return <NaverReviewsSectionClient initialFeed={feed} />;
}
