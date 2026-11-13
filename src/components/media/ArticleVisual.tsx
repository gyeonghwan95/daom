import {
  getArticleImageAsset,
  resolveArticleImageSrc,
} from "@/lib/article-visuals/asset-catalog";
import { getArticleVisualsForPath } from "@/lib/article-visuals/page-placements";
import type { ArticleVisualPlacement } from "@/lib/article-visuals/types";
import { ArticleVisualFigure } from "./ArticleVisualFigure";

/*
 * 사진 선택(페이지 배치표·사진 목록)은 서버에서 하고, 클라이언트에는 고른 사진 한 장의 표시 정보만 넘긴다.
 * 예전에는 이 파일 전체가 "use client"라서 배치표·사진 목록이 모든 페이지 JS에 실렸다(2026-11-13).
 */

type ArticleVisualProps = {
  placement: ArticleVisualPlacement;
  className?: string;
};

export function ArticleVisual({ placement, className = "" }: ArticleVisualProps) {
  const asset = getArticleImageAsset(placement.assetId);
  if (!asset?.usable) return null;
  return (
    <ArticleVisualFigure
      placement={placement}
      className={className}
      asset={{
        src: resolveArticleImageSrc(asset),
        overlaySafe0: asset.overlaySafe[0],
        focusY: asset.focusY,
        mobileFocus: asset.mobileFocus,
      }}
    />
  );
}

type ArticleVisualSlotProps = {
  path: string;
  slot: ArticleVisualPlacement["slot"];
  className?: string;
  category?: string;
  serviceSlug?: string;
  /** 페이지 위쪽에 이미 보인 사진 원본 경로 — 같은 사진을 다시 고르지 않는다 */
  avoidSrc?: readonly string[];
};

export function ArticleVisualSlot({
  path,
  slot,
  className,
  category,
  serviceSlug,
  avoidSrc,
}: ArticleVisualSlotProps) {
  const items = getArticleVisualsForPath(path, slot, { category, serviceSlug, avoidSrc });
  if (items.length === 0) return null;
  return (
    <>
      {items.map((placement) => (
        <ArticleVisual
          key={`${placement.path}-${placement.slot}-${placement.assetId}-${placement.overlayText}`}
          placement={placement}
          className={className}
        />
      ))}
    </>
  );
}
