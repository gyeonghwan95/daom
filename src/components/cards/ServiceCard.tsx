import Link from "next/link";
import { SiteImage } from "@/components/media/SiteImage";
import type { SiteImageAsset } from "@/lib/site-images";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  image?: SiteImageAsset;
};

export function ServiceCard({
  title,
  description,
  href,
  image,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="card-surface group flex min-h-[7rem] flex-col overflow-hidden p-0 transition-colors hover:border-navy/20 hover:shadow-md hover:shadow-navy/5"
    >
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-beige-dark">
          <SiteImage
            {...image}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-base font-semibold text-navy md:text-lg">{title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-base text-navy/70">
          {description}
        </p>
        <span className="mt-3 text-sm font-medium text-navy-light">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}
