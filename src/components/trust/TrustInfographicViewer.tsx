"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackCtaEvent } from "@/lib/admin-ops/track-client";
import type { SiteImageAsset } from "@/lib/site-images";

type TrustInfographicViewerProps = {
  image: SiteImageAsset;
};

function ZoomIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
    </svg>
  );
}

/**
 * 인포그래픽 썸네일 + 전체 화면 확대 보기.
 * 확대본은 열 때만 렌더해 본문 로딩에 영향을 주지 않는다.
 */
export function TrustInfographicViewer({ image }: TrustInfographicViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackCtaEvent("trust-infographic");
        }}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_18px_40px_-24px_rgba(30,58,95,0.45)] transition-shadow duration-300 hover:shadow-[0_24px_48px_-20px_rgba(30,58,95,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
        aria-label="안윤정 법무사 전문이력 인포그래픽 크게 보기"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          quality={80}
          sizes="(max-width: 767px) 92vw, (max-width: 1279px) 40vw, 460px"
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-navy/80 via-navy/30 to-transparent pb-3 pt-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-navy shadow-sm md:text-sm">
            <ZoomIcon />
            이력 크게 보기
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-transparent p-0 backdrop:bg-navy-dark/90 backdrop:backdrop-blur-sm"
        aria-label="안윤정 법무사 전문이력 인포그래픽"
      >
        {open ? (
          <div
            className="mx-auto flex min-h-full w-full max-w-[1086px] flex-col items-center px-3 py-4 md:py-8"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div className="sticky top-2 z-10 flex w-full justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-navy shadow-lg"
              >
                <span aria-hidden>✕</span> 닫기
              </button>
            </div>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              quality={85}
              sizes="(max-width: 1100px) 100vw, 1086px"
              className="mt-3 h-auto w-full rounded-xl shadow-2xl"
            />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
