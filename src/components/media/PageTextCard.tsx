import Image from "next/image";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { getPageTextCard } from "@/data/seo/page-text-cards";

/**
 * 페이지별 텍스트 카드 1장(본문·공유용). 실제 img(width/height·alt) + 같은 뜻의 figcaption.
 * 등록되지 않은 경로는 아무것도 그리지 않는다.
 */
export function PageTextCardFigure({ path, className = "" }: { path: string; className?: string }) {
  const card = getPageTextCard(path);
  if (!card) return null;
  return (
    <figure
      className={`my-8 overflow-hidden rounded-xl border border-beige-dark bg-white shadow-sm md:my-10 ${className}`.trim()}
    >
      <Image
        src={encodePublicSrc(card.src)}
        alt={card.alt}
        width={card.width}
        height={card.height}
        sizes="(max-width: 768px) 100vw, 820px"
        className="h-auto w-full"
        loading="lazy"
        quality={80}
        decoding="async"
      />
      <figcaption className="border-t border-beige-dark bg-cream/80 px-4 py-2.5 text-sm leading-relaxed text-navy/75">
        {card.caption}
      </figcaption>
    </figure>
  );
}
