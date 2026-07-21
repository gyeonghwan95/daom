import { SiteImage } from "@/components/media/SiteImage";
import type { SiteImageAsset } from "@/lib/site-images";

type PageCoverBannerProps = {
  image: SiteImageAsset;
  className?: string;
  priority?: boolean;
};

export function PageCoverBanner({
  image,
  className = "",
  priority = false,
}: PageCoverBannerProps) {
  return (
    <div
      className={`page-cover-banner relative aspect-[16/9] min-h-[140px] overflow-hidden rounded-xl border border-beige-dark bg-beige sm:min-h-[180px] sm:rounded-2xl md:aspect-[2.8/1] ${className}`}
    >
      <SiteImage
        {...image}
        fill
        priority={priority}
        variant="cover"
        sizes="(max-width: 768px) 100vw, 1200px"
        className="h-full w-full"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
