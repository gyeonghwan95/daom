import { RelatedContentCarousel } from "@/components/carousel/RelatedContentCarousel";
import { SeoCarouselJsonLd } from "@/components/carousel/SeoCarouselJsonLd";
import { getSerpCarouselPack } from "@/lib/seo/serp-carousel-pack";

type PageSerpCarouselProps = {
  path: string;
  className?: string;
  heading?: string;
};

/** 화면 카드와 ItemList를 같은 팩으로 렌더. 4장 미만이면 아무것도 그리지 않는다. */
export function PageSerpCarousel({ path, className, heading }: PageSerpCarouselProps) {
  const pack = getSerpCarouselPack(path);
  if (!pack) return null;
  const name = heading ?? pack.heading;
  return (
    <>
      <RelatedContentCarousel
        heading={name}
        description={pack.description}
        items={pack.items}
        className={className ?? "mt-8"}
        sectionId="featured-pages"
      />
      <SeoCarouselJsonLd items={pack.items} pagePath={path} name={name} />
    </>
  );
}
