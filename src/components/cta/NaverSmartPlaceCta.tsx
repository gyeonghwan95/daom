"use client";

import { NaverIcon } from "@/components/consultation/ConsultationIcons";
import {
  getNaverSmartPlaceCopy,
  isNaverSmartPlaceConfigured,
  resolveNaverSmartPlaceHref,
  type NaverSmartPlacePlacement,
  type NaverSmartPlaceVariant,
} from "@/lib/naver-smartplace/cta";
import { trackNaverPlaceClick } from "@/lib/admin-ops/track-client";

type Size = "sm" | "md" | "lg";

/**
 * brand — 톡톡과 동일: #03C75A + 흰 N + 흰 텍스트
 * chip  — Hero 가이드 칩 (rounded-lg)
 * soft  — 흰 배경 + 초록 보더 (지도 보조)
 * text  — 인라인 링크 (푸터·후기)
 * primary/secondary — 하위 호환 (brand/soft로 매핑)
 */
type Tone = "brand" | "chip" | "soft" | "text" | "primary" | "secondary";

export type NaverSmartPlaceCtaProps = {
  variant: NaverSmartPlaceVariant;
  placement: NaverSmartPlacePlacement;
  size?: Size;
  tone?: Tone;
  fullWidth?: boolean;
  className?: string;
  label?: string;
  showHint?: boolean;
};

type VisualTone = "brand" | "chip" | "soft" | "text";

const sizeClass: Record<Size, string> = {
  sm: "min-h-10 px-3 text-sm gap-1.5",
  md: "min-h-11 px-3 text-sm gap-2 sm:min-h-12 sm:px-4",
  lg: "min-h-12 px-5 text-base gap-2",
};

const iconSize: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-[1.35rem] w-[1.35rem]",
};

function resolveTone(
  variant: NaverSmartPlaceVariant,
  tone: Tone | undefined,
): VisualTone {
  if (tone === "primary") return "brand";
  if (tone === "secondary") return variant === "map" ? "soft" : "brand";
  if (tone === "brand" || tone === "chip" || tone === "soft" || tone === "text") {
    return tone;
  }
  if (variant === "reservation" || variant === "map") return "brand";
  return "text";
}

function toneClass(tone: VisualTone, fullWidth: boolean, size: Size): string {
  const width = fullWidth ? "w-full" : "";
  const radius = size === "sm" ? "rounded-lg" : "rounded-xl";
  const base =
    "interactive-surface inline-flex items-center justify-center font-semibold transition-[filter,background-color,border-color,transform] duration-200";

  switch (tone) {
    case "brand":
      return `${base} ${width} ${radius} bg-[#03C75A] text-white hover:brightness-95 active:brightness-90`;
    case "chip":
      return `${base} ${width} flex-1 rounded-lg bg-[#03C75A] text-white hover:brightness-95`;
    case "soft":
      return `${base} ${width} ${radius} border border-[#03C75A]/30 bg-white text-[#028a46] hover:border-[#03C75A]/50 hover:bg-[#E8F8EF]`;
    case "text":
      return `${base} ${width} gap-1 rounded-md text-[#028a46] underline-offset-2 hover:underline`;
    default:
      return `${base} ${width}`;
  }
}

/**
 * 네이버 스마트플레이스 CTA.
 * 「네이버 톡톡」과 동일 톤: 초록(#03C75A) + 흰 N 아이콘 + 흰 볼드 텍스트.
 */
export function NaverSmartPlaceCta({
  variant,
  placement,
  size = "md",
  tone: toneProp,
  fullWidth = false,
  className = "",
  label,
  showHint = false,
}: NaverSmartPlaceCtaProps) {
  if (!isNaverSmartPlaceConfigured()) return null;

  const href = resolveNaverSmartPlaceHref();
  const copy = getNaverSmartPlaceCopy(variant);
  const visible = label || copy.label;
  const tone = resolveTone(variant, toneProp);
  const iconClass =
    tone === "soft" || tone === "text"
      ? `${iconSize[size]} shrink-0 text-current`
      : `${iconSize[size]} shrink-0 text-white`;

  // Hero chip: globals `.hero-contact__chip`가 padding/radius를 담당 → size 클래스 축소
  const sizing =
    tone === "chip" && className.includes("hero-contact__chip")
      ? "gap-1.5 sm:gap-2"
      : sizeClass[size];

  const anchor = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="naver-place"
      data-cta-variant={variant}
      data-cta-placement={placement}
      aria-label={copy.aria}
      className={`${toneClass(tone, fullWidth, size)} ${sizing} ${className}`.trim()}
      onClick={() => {
        trackNaverPlaceClick({ variant, placement, href });
      }}
    >
      <NaverIcon className={iconClass} />
      <span className="truncate leading-none">{visible}</span>
    </a>
  );

  if (!showHint || !copy.hint) return anchor;

  return (
    <span className={`inline-flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
      {anchor}
      <span className="text-xs leading-relaxed text-navy/60">{copy.hint}</span>
    </span>
  );
}
