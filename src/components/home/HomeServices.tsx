import { HomeServicesSection } from "@/components/home/HomeServicesSection";
import {
  getNaverPlaceReviewsFeed,
  getSortedNaverPlaceReviews,
} from "@/lib/naver-place-reviews";

export function HomeServices() {
  const reviews = getSortedNaverPlaceReviews();
  const { stats } = getNaverPlaceReviewsFeed();

  return (
    <HomeServicesSection
      reviews={reviews}
      reviewCount={stats.totalCount}
    />
  );
}
