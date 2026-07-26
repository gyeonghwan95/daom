/** 생성 인벤토리 요약 re-export (JSON은 scripts로 생성) */

import type { PageInventoryItem } from "@/data/seo/page-image-types";
import { PAGE_IMAGE_MANIFEST } from "@/data/seo/page-image-manifest";

export type PageInventorySummary = {
  generatedAt: string;
  totalPages: number;
  indexablePages: number;
  menuLinkedPages: number;
  publicImageCount: number;
  byPriority: Record<string, number>;
  byAction: Record<string, number>;
  topDuplicateImages: { src: string; count: number }[];
  manifestWave1Count: number;
};

/** 런타임에 쓰는 1차 웨이브 대상 URL */
export const WAVE1_PAGE_URLS = PAGE_IMAGE_MANIFEST.map((i) => i.pageUrl);

export function getWave1InventoryOverlay(): Pick<
  PageInventoryItem,
  "url" | "imagePriority" | "recommendedAction"
>[] {
  return PAGE_IMAGE_MANIFEST.map((i) => ({
    url: i.pageUrl,
    imagePriority: i.imagePriority,
    recommendedAction:
      i.status === "existing-review" ? "reuse-existing" : "create-image",
  }));
}
