import { SeoContentCarousel } from "@/components/carousel/SeoContentCarousel";
import { SeoCarouselJsonLd } from "@/components/carousel/SeoCarouselJsonLd";
import { getApprovedCarouselHubData } from "@/lib/seo/carousel-images";

type ChoiceCarouselProps = {
  hubUrl: "/부산부동산등기" | "/부산법인법무사";
  description: string;
};

function ChoiceCarousel({ hubUrl, description }: ChoiceCarouselProps) {
  const carousel = getApprovedCarouselHubData(hubUrl);

  if (!carousel) return null;

  return (
    <>
      <SeoContentCarousel
        heading={carousel.heading}
        description={description}
        items={carousel.items}
        className="mt-2"
      />
      <SeoCarouselJsonLd items={carousel.items} />
    </>
  );
}

export function RealEstateRegistrationChoiceCards() {
  return (
    <ChoiceCarousel
      hubUrl="/부산부동산등기"
      description="필요한 부동산등기 업무에서 준비서류·절차·비용 안내를 확인하세요."
    />
  );
}

export function CorporateRegistrationChoiceCards() {
  return (
    <ChoiceCarousel
      hubUrl="/부산법인법무사"
      description="현재 필요한 법인등기 업무에서 기한·결의·준비서류를 확인하세요."
    />
  );
}
