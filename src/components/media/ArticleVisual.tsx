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

/**
 * 본문 중간 사진은 높이를 많이 차지하면 읽는 흐름만 끊는다. 지정 비율과 무관하게 모바일 16:9, PC 5:2로 넓게 보여
 * 차지하는 높이를 줄인다(894px 폭 기준 596px → 358px). 잘리는 부분은 사진별 focusY로 맞춘다.
 */
const WIDE_FRAME = "aspect-[16/9] md:aspect-[5/2]";
const ASPECT_CLASS: Record<ArticleVisualAspect, string> = {
  "16:9": WIDE_FRAME,
  "3:2": WIDE_FRAME,
  "4:3": WIDE_FRAME,
  "2:1": WIDE_FRAME,
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
  const objectPos =
    asset.focusY === undefined ? (OBJECT_POS[asset.mobileFocus] ?? OBJECT_POS.center) : "";
  const objectStyle =
    asset.focusY === undefined ? undefined : { objectPosition: `center ${asset.focusY}%` };

  if (failed) {
    return (
      <figure
        className={`my-6 md:my-8 overflow-hidden rounded-xl border border-beige-dark bg-beige/40 ${className}`.trim()}
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
      ? "bg-gradient-to-t from-navy/80 via-navy/40 to-transparent"
      : "bg-gradient-to-t from-white/70 via-white/20 to-transparent";
  const textClass =
    tone === "dark"
      ? "text-white [text-shadow:0_2px_14px_rgba(10,19,32,0.65)]"
      : "text-navy";

  return (
    <figure
      className={`my-6 md:my-8 overflow-hidden rounded-xl border border-beige-dark bg-white shadow-sm ${className}`.trim()}
    >
      <div className={`relative w-full overflow-hidden ${ASPECT_CLASS[aspect]}`}>
        <Image
          src={encodePublicSrc(src)}
          alt={placement.alt}
          fill
          sizes="(max-width: 768px) 100vw, 820px"
          className={`object-cover ${objectPos}`.trim()}
          style={objectStyle}
          loading={placement.priority ? "eager" : "lazy"}
          priority={placement.priority === true}
          quality={72}
          decoding="async"
          onError={() => setFailed(true)}
        />
        {placement.overlayText ? (
          <div
            className={`pointer-events-none absolute inset-0 flex px-4 pb-3.5 pt-12 sm:px-6 sm:pb-5 md:px-8 md:pb-6 ${gradient} ${OVERLAY_POS[overlayPos]}`}
          >
            <p
              className={`max-w-[22rem] text-[1.2rem] font-bold leading-snug tracking-[-0.01em] sm:max-w-[30rem] sm:text-[1.5rem] md:max-w-[38rem] md:text-[1.75rem] ${textClass}`}
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
