"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackCtaEvent } from "@/lib/admin-ops/track-client";
import { buildShareUrl, getShareCopy } from "@/lib/share/page-share";

type PageShareButtonProps = {
  /** pill: 제목 아래 작은 버튼 / bar: 글 끝 안내 한 줄 + 버튼 */
  variant?: "pill" | "bar";
  className?: string;
};

function ShareIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <path d="m8.3 10.8 7.4-4.3M8.3 13.2l7.4 4.3" />
    </svg>
  );
}

/** 공유 제목: 화면의 H1(없으면 문서 제목에서 사이트 이름을 뺀 것) */
function pageTitle(): string {
  const h1 = document.querySelector("main h1, h1")?.textContent?.replace(/\s+/g, " ").trim();
  if (h1) return h1;
  return document.title.split("|")[0].trim();
}

/**
 * '가족에게 보내기' — 휴대폰은 기본 공유 창(카카오톡·문자), PC는 링크 복사·이메일.
 * PC의 윈도우 공유 창은 쓰기 불편해 터치 기기에서만 기본 공유 창을 연다.
 * 공유 링크에는 ?from=family|work|share 만 붙고, 받은 사람에게는 SharedArrivalNotice가 문의 버튼을 보여 준다.
 */
export function PageShareButton({ variant = "pill", className = "" }: PageShareButtonProps) {
  const pathname = usePathname() ?? "/";
  const copy = getShareCopy(pathname);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shareUrl = () => buildShareUrl(window.location.origin, window.location.pathname, copy.audience);
  const message = () => `${pageTitle()}\n${copy.messageTail}`;

  async function onClick() {
    setStatus("");
    const url = shareUrl();
    const touch = window.matchMedia?.("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      trackCtaEvent(`share-native-${copy.audience}`, undefined, url);
      try {
        await navigator.share({ title: pageTitle(), text: message(), url });
      } catch (e) {
        // 사용자가 닫은 것(AbortError)은 오류가 아니다. 그 밖의 실패는 링크 복사 창으로 넘긴다
        if ((e as DOMException)?.name !== "AbortError") setOpen(true);
      }
      return;
    }
    trackCtaEvent(`share-open-${copy.audience}`, undefined, url);
    setOpen((v) => !v);
  }

  async function copyLink() {
    const url = shareUrl();
    trackCtaEvent(`share-copy-${copy.audience}`, undefined, url);
    try {
      await navigator.clipboard.writeText(`${message()}\n${url}`);
      setStatus("복사했습니다. 카카오톡·문자 대화창에 붙여넣어 보내세요.");
    } catch {
      setStatus(`복사하지 못했습니다. 주소를 직접 복사해 주세요: ${url}`);
    }
  }

  function emailHref(): string {
    if (typeof window === "undefined") return "mailto:";
    const url = shareUrl();
    return `mailto:?subject=${encodeURIComponent(pageTitle())}&body=${encodeURIComponent(`${message()}\n\n${url}`)}`;
  }

  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={panelId}
      data-cta="page-share"
      className={
        variant === "pill"
          ? "inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full border border-navy/15 bg-white px-3.5 text-sm font-semibold text-navy shadow-sm transition hover:border-navy/35 hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          : "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-navy/15 bg-white px-4 text-[0.95rem] font-bold text-navy shadow-sm transition hover:border-navy/35 hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      }
    >
      <ShareIcon className={variant === "pill" ? "h-4 w-4" : "h-[1.1rem] w-[1.1rem]"} />
      {copy.label}
    </button>
  );

  const panel = open ? (
    <div
      id={panelId}
      role="dialog"
      aria-label={copy.label}
      className={`absolute top-full z-40 mt-2 w-[min(19rem,calc(100vw-2rem))] ${variant === "bar" ? "left-0 sm:left-auto sm:right-0" : "left-0"} rounded-2xl border border-navy/10 bg-white p-3 text-left shadow-[0_18px_40px_-18px_rgba(30,58,95,0.45)]`}
    >
      <p className="px-1 text-xs font-semibold text-navy/60">이 안내를 그대로 보냅니다</p>
      <div className="mt-2 grid gap-1.5">
        <button
          type="button"
          onClick={copyLink}
          className="flex min-h-11 items-center gap-2 rounded-xl bg-navy px-3.5 text-sm font-semibold text-white transition hover:bg-navy-dark"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M10 14a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 5.43" />
            <path d="M14 10a5 5 0 0 0-7.07 0L4.1 12.83a5 5 0 0 0 7.07 7.07L12.5 18.57" />
          </svg>
          링크 복사 <span className="text-xs font-normal text-white/75">카카오톡·문자에 붙여넣기</span>
        </button>
        <a
          href={emailHref()}
          onClick={() => trackCtaEvent(`share-email-${copy.audience}`)}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-navy/15 px-3.5 text-sm font-semibold text-navy no-underline transition hover:bg-cream"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          이메일로 보내기
        </a>
      </div>
      <p className="mt-2 min-h-5 px-1 text-xs leading-relaxed text-navy" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  ) : null;

  if (variant === "bar") {
    return (
      <div className={`flex flex-col gap-3 rounded-2xl border border-navy/10 bg-cream/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}>
        <p className="text-balance text-[0.95rem] font-semibold leading-relaxed text-navy">{copy.prompt}</p>
        <div ref={wrapRef} className="relative shrink-0">
          {button}
          {panel}
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`relative inline-block ${className}`.trim()}>
      {button}
      {panel}
    </div>
  );
}
