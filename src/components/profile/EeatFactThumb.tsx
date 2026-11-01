"use client";

import Image from "next/image";
import { useState } from "react";
import type { EeatThumbImage } from "@/lib/lawyer-eeat-images";

type EeatFactThumbLayout = "square" | "banner";

type EeatFactThumbProps = {
  image?: EeatThumbImage;
  /** square: 작은 정사각 썸네일(기존) · banner: 카드 위쪽 전체 폭 16:10 */
  layout?: EeatFactThumbLayout;
};

/**
 * 소개 카드용 썸네일(작은 정사각 또는 카드 위쪽 넓은 사진).
 * 드롭인(public/image/소개-*.jpg) 여부는 빌드 때 정해지며, 불러오지 못하면 기존 사진으로 대신합니다.
 */
export function EeatFactThumb({ image, layout = "square" }: EeatFactThumbProps) {
  if (!image) return null;
  return <EeatFactThumbInner key={image.src} image={image} layout={layout} />;
}

function EeatFactThumbInner({ image, layout }: { image: EeatThumbImage; layout: EeatFactThumbLayout }) {
  // 존재 여부는 빌드 때 서버가 확정해 넘기므로(lawyer-eeat-images-server) 원본을 미리 내려받아 확인하지 않는다.
  const [src, setSrc] = useState<string | undefined>(image.fallbackSrc ?? image.src);

  return (
    <div
      className={
        layout === "banner"
          ? "eeat-fact__thumb eeat-fact__thumb--banner relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-beige-dark bg-beige/40"
          : "eeat-fact__thumb relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-beige-dark bg-beige/40 sm:h-24 sm:w-24"
      }
    >
      {src ? (
        <Image
          key={src}
          src={src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={layout === "banner" ? "(max-width: 768px) 100vw, 480px" : "96px"}
          onError={() => setSrc(image.fallbackSrc && image.fallbackSrc !== src ? image.fallbackSrc : undefined)}
        />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-beige to-beige-dark/40"
          aria-hidden
        >
          <span className="h-5 w-5 rounded-full border border-beige-muted/80 bg-white/50" />
        </span>
      )}
    </div>
  );
}
