import type { CSSProperties } from "react";
import Image from "next/image";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { optimizedImageSrc } from "@/lib/image-variants";

type MediaFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
};

/**
 * 페이지 첫 이미지 틀 — 원본을 자르지 않는다.
 * 모바일: 원본 비율 그대로 폭 전체. PC: 넓은 틀(16:9 → 넓은 화면 2:1) 가운데에 원본 비율로 두고
 * 양옆은 같은 사진을 흐리게 깐 CSS 배경으로 채운다(두 번째 <img>를 만들지 않는다).
 * 틀 비율이 고정이라 이미지가 늦게 와도 아래 내용이 밀리지 않는다.
 */
export function MediaFrame({
  src,
  alt,
  width,
  height,
  priority = false,
  quality,
  sizes = "(max-width: 48rem) 100vw, 40rem",
  className = "",
}: MediaFrameProps) {
  const encoded = encodePublicSrc(src);
  // 흐린 배경은 작은 파생본이면 충분하다(없으면 본 이미지와 같은 주소라 캐시를 같이 쓴다)
  const backdrop = optimizedImageSrc(encoded, 384);
  const style = {
    "--media-ratio": `${width} / ${height}`,
    "--media-bg": `url("${backdrop}")`,
  } as CSSProperties;

  return (
    <div className={`media-frame ${className}`.trim()} style={style}>
      <Image
        src={encoded}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        quality={quality}
        sizes={sizes}
        className="media-frame__img"
      />
    </div>
  );
}
