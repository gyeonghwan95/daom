import { JsonLd } from "@/components/seo/JsonLd";
import type { SeoCarouselItem } from "@/lib/seo/carousel-images";
import { getCanonicalUrl, getAbsoluteImageUrl } from "@/lib/seo/metadata";

type SeoCarouselJsonLdProps = {
  items: SeoCarouselItem[];
};

/**
 * 캐러셀 ItemList — 화면에 표시되는 카드와 동일한 데이터·순서로 생성.
 * 항목이 4개 미만이면 렌더링하지 않는다.
 */
export function SeoCarouselJsonLd({ items }: SeoCarouselJsonLdProps) {
  if (items.length < 4) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          image: getAbsoluteImageUrl(item.image),
          url: getCanonicalUrl(item.href),
        })),
      }}
    />
  );
}
