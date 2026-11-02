import dimensions from "@/generated/image-dimensions.json";
import { getAbsoluteAssetUrl } from "@/lib/seo/social";
import { PAGE_THUMB_SIZE } from "@/lib/seo/page-thumbnail-size";

/**
 * 공유·검색 대표 이미지(og:image, twitter:image, primaryImageOfPage)를 실제 파일과 일치시킨다.
 * - 원본이 1200px 또는 600KB를 넘으면 scripts/optimize-images.mjs가 만든 1200px JPEG(.og.jpg)를 쓴다(같은 사진).
 * - width·height·type은 그 파일의 실제 값. 파일 정보를 모르면 호출자가 준 값을 그대로 쓴다.
 * 서버(빌드)에서만 쓴다 — 메타데이터·JSON-LD 생성용.
 */
type DimEntry = {
  width: number;
  height: number;
  format: string;
  bytes: number;
  og?: { src: string; width: number; height: number; format: string };
};
const DIMS = dimensions as Record<string, DimEntry>;

export type ShareImage = { url: string; width: number; height: number; type?: string };

const mime = (format: string) => (format === "jpg" ? "image/jpeg" : `image/${format}`);

function keyOf(path: string): string {
  const cut = path.search(/[?#]/);
  const pathname = cut >= 0 ? path.slice(0, cut) : path;
  try {
    return decodeURIComponent(pathname).normalize("NFC");
  } catch {
    return pathname.normalize("NFC");
  }
}

export function resolveShareImage(path: string, fallbackWidth = 1200, fallbackHeight = 630): ShareImage {
  if (/^https?:\/\//.test(path)) return { url: path, width: fallbackWidth, height: fallbackHeight };
  const key = keyOf(path.startsWith("/") ? path : `/${path}`);
  // 페이지별 4:3 대표 썸네일(npm run thumbnails:hero)은 모두 같은 크기의 JPEG — 크기 표(image-dimensions.json)에 넣지 않는다
  if (key.startsWith("/image/og-pages/") || key.startsWith("/image/hero/")) {
    return { url: getAbsoluteAssetUrl(key), ...PAGE_THUMB_SIZE, type: "image/jpeg" };
  }
  const entry = DIMS[key];
  if (!entry) return { url: getAbsoluteAssetUrl(path), width: fallbackWidth, height: fallbackHeight };
  if (entry.og) {
    return { url: getAbsoluteAssetUrl(entry.og.src), width: entry.og.width, height: entry.og.height, type: mime(entry.og.format) };
  }
  return { url: getAbsoluteAssetUrl(key), width: entry.width, height: entry.height, type: mime(entry.format) };
}

/** 실제 파일 크기(크기 표 기준). 표에 없으면 undefined — 화면 이미지 틀 비율을 실제 사진에 맞출 때 쓴다 */
export function getActualImageSize(path: string): { width: number; height: number } | undefined {
  if (/^https?:\/\//.test(path)) return undefined;
  const key = keyOf(path.startsWith("/") ? path : `/${path}`);
  if (key.startsWith("/image/og-pages/") || key.startsWith("/image/hero/")) return { ...PAGE_THUMB_SIZE };
  const entry = DIMS[key];
  return entry ? { width: entry.width, height: entry.height } : undefined;
}
