import Image from "next/image";
import type { SiteImageAsset } from "@/lib/site-images";

type PageRepresentativeFigureProps = {
  image: SiteImageAsset;
  caption?: string;
  priority?: boolean;
};

/**
 * 본문 대표 figure — 실제 <img> 의미의 Next Image (CSS background 금지).
 * SERP/og와 동일 소스. desktop max ~680px.
 */
export function PageRepresentativeFigure({
  image,
  caption,
  priority = false,
}: PageRepresentativeFigureProps) {
  return (
    <figure
      className={`mx-auto w-full ${(image.height || 1200) > (image.width || 1200) ? "max-w-[480px]" : "max-w-[680px]"}`}
    >
      {/* 실제 이미지 비율을 따른다(정사각 SERP 이미지는 그대로 1:1, 현장·서류 사진은 4:3·세로형 그대로) */}
      <div
        className="relative w-full overflow-hidden rounded-[14px] border border-[var(--border,#e5e0d8)] bg-[#f0ebe3] shadow-[0_1px_2px_rgba(21,42,69,0.04)]"
        style={{ aspectRatio: `${image.width || 1200} / ${image.height || 1200}` }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width || 1200}
          height={image.height || 1200}
          sizes="(max-width: 768px) 100vw, 680px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-navy/60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
