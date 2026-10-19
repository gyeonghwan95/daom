import { PageSerpCarousel } from "@/components/carousel/PageSerpCarousel";

export function RealEstateRegistrationChoiceCards() {
  return (
    <PageSerpCarousel
      path="/부산부동산등기"
      heading="함께 확인하면 좋은 등기"
      className="mt-2"
    />
  );
}

export function CorporateRegistrationChoiceCards() {
  return (
    <PageSerpCarousel
      path="/부산법인법무사"
      heading="회사 운영 중 함께 확인할 등기"
      className="mt-2"
    />
  );
}
