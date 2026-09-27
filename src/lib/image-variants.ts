import variants from "@/generated/image-variants.json";

/** scripts/optimize-images.mjs 가 만든 원본 경로 → 파생본 폭 목록 */
const VARIANTS = variants as Record<string, number[]>;

/**
 * public 이미지 원본 경로를 요청 폭에 맞는 WebP 파생본 URL로 바꾼다.
 * 파생본이 없는 경로(외부 URL·SVG·이미 가벼운 WebP 등)는 그대로 돌려준다.
 */
export function optimizedImageSrc(src: string, width: number): string {
  if (!src.startsWith("/") || src.startsWith("//")) return src;

  const cut = src.search(/[?#]/);
  const pathname = cut >= 0 ? src.slice(0, cut) : src;
  let key: string;
  try {
    key = decodeURIComponent(pathname);
  } catch {
    return src;
  }

  const widths = VARIANTS[key];
  if (!widths?.length) return src;

  const chosen = widths.find((w) => w >= width) ?? widths[widths.length - 1];
  const variant = `/_img${key.replace(/\.(jpe?g|png)$/i, "")}.${chosen}.webp`;
  return variant
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : segment))
    .join("/");
}

/** next/image를 쓸 수 없는 <img>용 srcset — 파생본이 없으면 undefined */
export function optimizedSrcSet(src: string): string | undefined {
  const cut = src.search(/[?#]/);
  let key: string;
  try {
    key = decodeURIComponent(cut >= 0 ? src.slice(0, cut) : src);
  } catch {
    return undefined;
  }
  const widths = VARIANTS[key];
  if (!widths?.length) return undefined;
  return widths.map((w) => `${optimizedImageSrc(src, w)} ${w}w`).join(", ");
}
