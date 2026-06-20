import Image from "next/image";
import type { SiteImageAsset } from "@/lib/site-images";

type SiteImageProps = SiteImageAsset & {
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  showPlaceholderBadge?: boolean;
};

export function SiteImage({
  src,
  alt,
  width,
  height,
  placeholder = true,
  className = "",
  fill = false,
  priority = false,
  sizes,
  showPlaceholderBadge = true,
}: SiteImageProps) {
  const badge =
    placeholder && showPlaceholderBadge ? (
      <span className="absolute left-3 top-3 z-10 rounded-full bg-navy/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        임시
      </span>
    ) : null;

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {badge}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes ?? "100vw"}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      {badge}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
