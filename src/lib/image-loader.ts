"use client";

import { optimizedImageSrc } from "@/lib/image-variants";

type ImageLoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

/** next.config.ts images.loaderFile — 빌드 시 생성한 WebP 파생본을 폭별로 고른다 */
export default function imageLoader({ src, width }: ImageLoaderParams): string {
  return optimizedImageSrc(src, width);
}
