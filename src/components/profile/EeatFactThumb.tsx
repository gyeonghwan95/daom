"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { EeatThumbImage } from "@/lib/lawyer-eeat-images";

type EeatFactThumbLayout = "square" | "banner";

type EeatFactThumbProps = {
  image?: EeatThumbImage;
  /** square: 작은 정사각 썸네일(기존) · banner: 카드 위쪽 전체 폭 16:10 */
  layout?: EeatFactThumbLayout;
};

/**
 * 소개 카드용 썸네일(작은 정사각 또는 카드 위쪽 넓은 사진).
 * 기존 fallback을 먼저 보여 주고, public/image/소개-*.jpg 드롭인이 있으면 그걸로 교체합니다.
 */
export function EeatFactThumb({ image, layout = "square" }: EeatFactThumbProps) {
  if (!image) return null;
  return <EeatFactThumbInner key={image.src} image={image} layout={layout} />;
}

function EeatFactThumbInner({ image, layout }: { image: EeatThumbImage; layout: EeatFactThumbLayout }) {
  const [src, setSrc] = useState<string | undefined>(
    image.fallbackSrc ?? image.src,
  );

  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled) setSrc(image.src);
    };
    probe.onerror = () => {
      if (!cancelled) setSrc(image.fallbackSrc);
    };
    probe.src = image.src;

    return () => {
      cancelled = true;
    };
  }, [image]);

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
          onError={() => setSrc(undefined)}
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
