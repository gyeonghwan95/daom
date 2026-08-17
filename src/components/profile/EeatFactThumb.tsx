"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { EeatThumbImage } from "@/lib/lawyer-eeat-images";

type EeatFactThumbProps = {
  image?: EeatThumbImage;
};

/**
 * 소개 카드용 작은 썸네일.
 * 기존 fallback을 먼저 보여 주고, public/image/소개-*.jpg 드롭인이 있으면 그걸로 교체합니다.
 */
export function EeatFactThumb({ image }: EeatFactThumbProps) {
  if (!image) return null;
  return <EeatFactThumbInner key={image.src} image={image} />;
}

function EeatFactThumbInner({ image }: { image: EeatThumbImage }) {
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
    <div className="eeat-fact__thumb relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-beige-dark bg-beige/40 sm:h-24 sm:w-24">
      {src ? (
        <Image
          key={src}
          src={src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="96px"
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
