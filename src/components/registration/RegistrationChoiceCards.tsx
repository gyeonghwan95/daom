import { RelatedContentCarousel } from "@/components/carousel/RelatedContentCarousel";
import { SeoCarouselJsonLd } from "@/components/carousel/SeoCarouselJsonLd";
import { getApprovedCarouselHubData } from "@/lib/seo/carousel-images";
import { getRelatedContentCarousel } from "@/lib/seo/page-visuals";

type ChoiceCarouselProps = {
  hubUrl: "/부산부동산등기" | "/부산법인법무사";
  description: string;
  heading: string;
};

function ChoiceCarousel({ hubUrl, description, heading }: ChoiceCarouselProps) {
  const related = getRelatedContentCarousel(hubUrl, 7);
  const fallback = getApprovedCarouselHubData(hubUrl);
  const carousel = related ?? fallback;

  if (!carousel) return null;

  return (
    <>
      <RelatedContentCarousel
        heading={related?.heading ?? heading}
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
      heading="함께 확인하면 좋은 등기"
      description="필요한 부동산등기 업무에서 준비서류·절차·비용 안내를 확인하세요."
    />
  );
}

export function CorporateRegistrationChoiceCards() {
  return (
    <ChoiceCarousel
      hubUrl="/부산법인법무사"
      heading="회사 운영 중 함께 확인할 등기"
      description="현재 필요한 법인등기 업무에서 기한·결의·준비서류를 확인하세요."
    />
  );
}
