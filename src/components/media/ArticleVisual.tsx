"use client";

import { useState } from "react";
import Image from "next/image";
import { encodePublicSrc } from "@/lib/encode-public-src";
import {
  getArticleImageAsset,
  resolveArticleImageSrc,
} from "@/lib/article-visuals/asset-catalog";
import { getArticleVisualsForPath } from "@/lib/article-visuals/page-placements";
import type {
  ArticleVisualAspect,
  ArticleVisualOverlayPosition,
  ArticleVisualPlacement,
  ArticleVisualTone,
} from "@/lib/article-visuals/types";

const ASPECT_CLASS: Record<ArticleVisualAspect, string> = {
  "16:9": "aspect-[16/9]",
  "3:2": "aspect-[3/2]",
  "4:3": "aspect-[4/3]",
  "2:1": "aspect-[2/1]",
};

const OBJECT_POS: Record<string, string> = {
  center: "object-center",
  left: "object-left",
  right: "object-right",
  top: "object-top",
  bottom: "object-bottom",
  face: "object-[center_20%]",
};

const OVERLAY_POS: Record<ArticleVisualOverlayPosition, string> = {
  left: "items-end justify-start text-left",
  center: "items-end justify-center text-center",
  right: "items-end justify-end text-right",
};

type ArticleVisualProps = {
  placement: ArticleVisualPlacement;
  className?: string;
};

function resolveTone(tone: ArticleVisualTone | undefined): "dark" | "light" {
  if (tone === "light") return "light";
  return "dark";
}

/**
 * 본문 중간 시각 요소.
 * 원본 파일에 문구를 굽지 않고 HTML 오버레이로 표시한다.
 */
export function ArticleVisual({ placement, className = "" }: ArticleVisualProps) {
  const asset = getArticleImageAsset(placement.assetId);
  const [failed, setFailed] = useState(false);

  if (!asset?.usable) return null;

  const src = resolveArticleImageSrc(asset);
  const aspect = placement.aspectRatio ?? "3:2";
  const overlayPos = placement.overlayPosition ?? asset.overlaySafe[0] ?? "left";
  const tone = resolveTone(placement.tone);
  const objectPos = OBJECT_POS[asset.mobileFocus] ?? OBJECT_POS.center;

  if (failed) {
    return (
      <figure
        className={`my-8 md:my-10 overflow-hidden rounded-xl border border-beige-dark bg-beige/40 ${className}`.trim()}
      >
        <div
          className={`${ASPECT_CLASS[aspect]} flex items-center justify-center px-4`}
        >
          <p className="body-text text-center text-sm text-navy/60">
            {placement.overlayText ?? "관련 안내 이미지"}
          </p>
        </div>
        {placement.caption ? (
          <figcaption className="border-t border-beige-dark px-4 py-2.5 text-sm text-navy/65">
            {placement.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  const gradient =
    tone === "dark"
      ? "bg-gradient-to-t from-navy/55 via-navy/15 to-transparent"
      : "bg-gradient-to-t from-white/70 via-white/20 to-transparent";
  const textClass =
    tone === "dark" ? "text-white drop-shadow-sm" : "text-navy";

  return (
    <figure
      className={`my-8 md:my-10 overflow-hidden rounded-xl border border-beige-dark bg-white shadow-sm ${className}`.trim()}
    >
      <div className={`relative w-full overflow-hidden ${ASPECT_CLASS[aspect]}`}>
        <Image
          src={encodePublicSrc(src)}
          alt={placement.alt}
          fill
          sizes="(max-width: 768px) 100vw, 820px"
          className={`object-cover ${objectPos}`}
          loading={placement.priority ? "eager" : "lazy"}
          priority={placement.priority === true}
          quality={72}
          decoding="async"
          onError={() => setFailed(true)}
        />
        {placement.overlayText ? (
          <div
            className={`pointer-events-none absolute inset-0 flex p-4 sm:p-5 md:p-6 ${gradient} ${OVERLAY_POS[overlayPos]}`}
          >
            <p
              className={`max-w-[18rem] text-[0.95rem] font-medium leading-snug sm:text-base ${textClass}`}
            >
              {placement.overlayText}
            </p>
          </div>
        ) : null}
      </div>
      {placement.caption ? (
        <figcaption className="border-t border-beige-dark bg-cream/80 px-4 py-2.5 text-sm leading-relaxed text-navy/70">
          {placement.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type ArticleVisualSlotProps = {
  path: string;
  slot: ArticleVisualPlacement["slot"];
  className?: string;
  category?: string;
  serviceSlug?: string;
};

export function ArticleVisualSlot({
  path,
  slot,
  className,
  category,
  serviceSlug,
}: ArticleVisualSlotProps) {
  const items = getArticleVisualsForPath(path, slot, { category, serviceSlug });
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
