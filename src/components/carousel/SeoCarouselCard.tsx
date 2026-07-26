import Image from "next/image";
import Link from "next/link";
import type { SeoCarouselItem } from "@/lib/seo/carousel-images";

type SeoCarouselCardProps = {
  item: SeoCarouselItem;
};

export function SeoCarouselCard({ item }: SeoCarouselCardProps) {
  return (
    <li className="w-[72%] min-w-[72%] snap-start sm:w-[46%] sm:min-w-[46%] lg:w-[23.5%] lg:min-w-[23.5%]">
      <Link
        href={item.href}
        className="group block h-full overflow-hidden rounded-2xl border border-[var(--border,#e5e0d8)] bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)]"
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#f0ebe3]">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 24vw"
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="p-4">
          <p className="line-clamp-2 text-base font-semibold text-[var(--navy,#1e3a5f)]">
            {item.title}
          </p>
          {item.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
              {item.description}
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
