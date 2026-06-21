import { HomeServicesSection } from "@/components/home/HomeServicesSection";
import { getSortedNaverPlaceReviews } from "@/lib/naver-place-reviews";

export function HomeServices() {
  const reviews = getSortedNaverPlaceReviews();

  return <HomeServicesSection reviews={reviews} />;
}
