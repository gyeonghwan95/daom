import Image from "next/image";
import Link from "next/link";
import type { SeoCarouselItem } from "@/lib/seo/carousel-images";
import { resolvePageThumbnailSrc } from "@/lib/seo/page-thumbnails";

type SeoCarouselCardProps = {
  item: SeoCarouselItem;
};

/**
 * 1:1 에디토리얼 썸네일 카드 (기존 SeoContentCarousel 호환).
 * page-thumbnails가 있으면 우선 사용.
 */
export function SeoCarouselCard({ item }: SeoCarouselCardProps) {
  const image = resolvePageThumbnailSrc(item.href) ?? item.image;

  return (
    <li className="w-[78%] min-w-[78%] snap-start sm:w-[42%] sm:min-w-[42%] lg:w-[28%] lg:min-w-[28%] xl:w-[23%] xl:min-w-[23%]">
      <Link
        href={item.href}
        className="group block h-full overflow-hidden rounded-[14px] border border-[var(--border,#e5e0d8)] bg-white shadow-[0_1px_2px_rgba(21,42,69,0.04)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_18px_rgba(21,42,69,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)] motion-safe:hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#f0ebe3]">
          <Image
            src={image}
            alt=""
            width={600}
            height={600}
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 23vw"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="sr-only">{item.title}</span>
        <div className="px-3 py-2.5">
          <p
            aria-hidden="true"
            className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--navy,#1e3a5f)]"
          >
            {item.title}
          </p>
        </div>
      </Link>
    </li>
  );
}
