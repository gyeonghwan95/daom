import type { SiteImageAsset } from "@/lib/site-images";
import { encodePublicSrc } from "@/lib/encode-public-src";
import Image from "next/image";

type SiteImageProps = SiteImageAsset & {
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  /** 카드·목록 썸네일은 낮은 quality로 빠르게 로드 */
  variant?: "thumbnail" | "cover" | "default";
};

const QUALITY = {
  thumbnail: 55,
  cover: 72,
  default: 80,
} as const;

export function SiteImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  priority = false,
  sizes,
  variant = "default",
}: SiteImageProps) {
  const encodedSrc = encodePublicSrc(src);
  const quality = QUALITY[variant];

  if (fill) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`}>
        <Image
          src={encodedSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes ?? "100vw"}
          priority={priority}
          quality={quality}
        />
      </div>
    );
  }

  return (
    <div className={`relative block w-full overflow-hidden ${className}`}>
      <Image
        src={encodedSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
        sizes={sizes}
        priority={priority}
        quality={quality}
      />
    </div>
  );
}
