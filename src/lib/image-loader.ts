"use client";

import { optimizedImageSrc } from "@/lib/image-variants";

type ImageLoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

/** next.config.ts images.loaderFile — 빌드 시 생성한 WebP 파생본을 폭별로 고른다 */
export default function imageLoader({ src, width }: ImageLoaderParams): string {
  const out = optimizedImageSrc(src, width);
  // 파생본이 없는 이미지(1:1 썸네일·WebP 등)는 원본을 그대로 쓴다. 개발 서버는 로더 결과에 폭이 없으면
  // "loader does not implement width" 경고를 내므로 개발 모드에서만 폭 표시를 붙인다(배포 HTML은 그대로).
  if (out === src && process.env.NODE_ENV === "development" && src.startsWith("/")) {
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  }
  return out;
}
