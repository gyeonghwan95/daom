"use client";

import { useEffect, useRef, useState } from "react";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getContactInfo, getPhoneHref } from "@/lib/contact";

type HeaderConsultationStatusProps = {
  variant?: "default" | "compact";
};

/**
 * SEO: 상태 문구를 DOM에 2~3중으로 복제하지 않는다.
 * 마퀴 필요 여부는 보이는 텍스트 노드의 scrollWidth/Height로만 측정한다.
 * 모바일(default)은 칩 폭이 좁아 짧은 라벨만 보이고, 전체 안내는 aria-label에 둔다.
 */
export function HeaderConsultationStatus({
  variant = "default",
}: HeaderConsultationStatusProps) {
  const availability = useConsultationAvailability();
  const reducedMotion = useReducedMotion();
  const { phone, kakao } = getContactInfo();
  const { isOpen, statusLabel, statusHint } = availability;

  const hint = isOpen ? "지금 바로 연결" : statusHint;
  const href =
    isOpen && phone ? getPhoneHref(phone) : kakao || "/contact/inquiry";
  const isExternal = !(isOpen && phone);
  const marqueeText = `${statusLabel} · ${hint}`;
  const mobileLabel = isOpen ? "상담 가능" : "톡 상담";
  const isCompact = variant === "compact";

  const viewportRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [useMarquee, setUseMarquee] = useState(false);
  const [cloneReady, setCloneReady] = useState(false);

  useEffect(() => {
    setCloneReady(true);
  }, []);

  useEffect(() => {
    if (!isCompact) {
      setUseMarquee(false);
      return;
    }
    const viewportEl = viewportRef.current;
    const textEl = textRef.current;
    if (!viewportEl || !textEl) return;

    const sync = () => {
      const viewportWidth = viewportEl.clientWidth;
      if (viewportWidth <= 0) return;
      const stackedTooTall = textEl.scrollHeight > 36;
      const singleLineTooWide = textEl.scrollWidth > viewportWidth + 2;
      setUseMarquee(stackedTooTall || singleLineTooWide);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(viewportEl);
    observer.observe(textEl);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [statusLabel, hint, isCompact]);

  const showMarquee = isCompact && useMarquee && !reducedMotion;

  const content = (
    <>
      <span
        className={`header-consult-status__dot-wrap header-consult-status__dot-wrap--${isOpen ? "live" : "away"}${reducedMotion ? " header-consult-status__dot-wrap--static" : ""}`}
        aria-hidden
      >
        <span className="header-consult-status__dot" />
        <span className="header-consult-status__dot-ring" />
      </span>
      <span
        ref={viewportRef}
        className="header-consult-status__viewport min-w-0 flex-1"
      >
        {showMarquee ? (
          <span className="header-consult-status__marquee-viewport">
            <span className="header-consult-status__marquee-track">
              <span
                ref={textRef}
                className="header-consult-status__marquee-item"
              >
                {marqueeText}
              </span>
              {cloneReady ? (
                <span
                  className="header-consult-status__marquee-item"
                  aria-hidden="true"
                >
                  {marqueeText}
                </span>
              ) : null}
            </span>
          </span>
        ) : (
          <span ref={textRef} className="header-consult-status__text">
            <span className="header-consult-status__label">
              {isCompact ? statusLabel : mobileLabel}
            </span>
            {isCompact ? (
              <span className="header-consult-status__hint">{hint}</span>
            ) : null}
          </span>
        )}
      </span>
    </>
  );

  const className = [
    "header-consult-status",
    `header-consult-status--${isOpen ? "live" : "away"}`,
    isCompact ? "header-consult-status--compact" : "header-consult-status--mobile",
    showMarquee ? "header-consult-status--marquee" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target={kakao ? "_blank" : undefined}
        rel={kakao ? "noopener noreferrer" : undefined}
        aria-label={marqueeText}
      >
        {content}
      </a>
    );
  }

  return (
    <a href={href} className={className} aria-label={marqueeText}>
      {content}
    </a>
  );
}
