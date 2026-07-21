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
      className="interactive-surface card-surface group flex min-h-[7rem] flex-col overflow-hidden p-0 hover:border-navy/25"
    >
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-beige-dark">
          <SiteImage
            {...image}
            fill
            variant="thumbnail"
            sizes="(max-width: 640px) 100vw, 360px"
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-base font-bold text-[var(--text-primary)] md:text-lg">{title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-base leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
        <span className="mt-3 text-sm font-semibold text-navy">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}
