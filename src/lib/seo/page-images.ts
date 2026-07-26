/**
 * 대표 이미지 해석기.
 * approved|applied 상태만 반환한다. (파일 존재는 audit 스크립트에서 검증)
 * needed/existing-review 의 seo/* 경로는 내보내지 않아 깨진 OG를 막는다.
 */

import {
  getManifestItemByUrl,
  PAGE_IMAGE_MANIFEST,
} from "@/data/seo/page-image-manifest";
import type { PageImageManifestItem } from "@/data/seo/page-image-types";
import { encodePublicSrc } from "@/lib/encode-public-src";

/** 배포·메타데이터에 쓸 수 있는 이미지인지 */
export function isManifestImageReady(item: PageImageManifestItem): boolean {
  return item.status === "approved" || item.status === "applied";
}

/**
 * 페이지 URL의 대표 이미지 경로.
 * 준비되지 않았으면 undefined (호출측은 기존 og 로직 유지).
 */
export function resolvePageSeoImage(pageUrl: string):
  | {
      src: string;
      alt: string;
      width: number;
      height: number;
      manifestId: string;
    }
  | undefined {
  const item = getManifestItemByUrl(pageUrl);
  if (!item || !isManifestImageReady(item)) return undefined;
  return {
    src: encodePublicSrc(item.imagePath),
    alt: item.alt,
    width: item.width,
    height: item.height,
    manifestId: item.id,
  };
}

/** 검사용: 상태별 집계 */
export function summarizeManifestStatus() {
  const counts: Record<string, number> = {};
  for (const item of PAGE_IMAGE_MANIFEST) {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
  }
  return {
    total: PAGE_IMAGE_MANIFEST.length,
    byStatus: counts,
    ready: PAGE_IMAGE_MANIFEST.filter(isManifestImageReady).length,
  };
}
