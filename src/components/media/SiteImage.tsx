import Image from "next/image";
import type { SiteImageAsset } from "@/lib/site-images";

type SiteImageProps = SiteImageAsset & {
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function SiteImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  priority = false,
  sizes,
}: SiteImageProps) {
  if (fill) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`}>
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
    <div className={`relative block w-full overflow-hidden ${className}`}>
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
