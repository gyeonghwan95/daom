import { JsonLd } from "@/components/seo/JsonLd";
import type { SeoCarouselItem } from "@/lib/seo/carousel-images";
import type { RelatedCardItem } from "@/lib/seo/page-visuals";
import { getCanonicalUrl, getAbsoluteImageUrl } from "@/lib/seo/metadata";

type SeoCarouselJsonLdProps = {
  items: Array<SeoCarouselItem | RelatedCardItem>;
};

/**
 * 캐러셀 ItemList — 화면 카드와 동일 순서.
 * image는 1200 SERP representative(있으면) 절대 URL.
 */
export function SeoCarouselJsonLd({ items }: SeoCarouselJsonLdProps) {
  if (items.length < 4) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: items.map((item, index) => {
          const related = item as RelatedCardItem;
          const imageSrc = related.representativeImage ?? item.image;
          return {
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            image: getAbsoluteImageUrl(imageSrc),
            url: getCanonicalUrl(item.href),
          };
        }),
      }}
    />
  );
}
