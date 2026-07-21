"use client";

import { useEffect, useRef, useState } from "react";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getContactInfo, getPhoneHref } from "@/lib/contact";

export function HeaderConsultationStatus() {
  const availability = useConsultationAvailability();
  const reducedMotion = useReducedMotion();
  const { phone, kakao } = getContactInfo();
  const { isOpen, statusLabel, statusHint } = availability;

  const hint = isOpen ? "지금 바로 연결" : statusHint;
  const href =
    isOpen && phone ? getPhoneHref(phone) : kakao || "/contact/inquiry";
  const isExternal = !(isOpen && phone);
  const marqueeText = `${statusLabel} · ${hint}`;

  const measureRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLSpanElement>(null);
  const [useMarquee, setUseMarquee] = useState(false);

  useEffect(() => {
    const measureEl = measureRef.current;
    const viewportEl = viewportRef.current;
    if (!measureEl || !viewportEl) return;

    const sync = () => {
      const viewportWidth = viewportEl.clientWidth;
      if (viewportWidth <= 0) return;

      measureEl.style.width = `${viewportWidth}px`;

      const stackedTooTall = measureEl.scrollHeight > 36;
      const singleLine = measureEl.querySelector(
        "[data-measure-oneline]",
      ) as HTMLElement | null;
      const singleLineTooWide = singleLine
        ? singleLine.scrollWidth > viewportWidth + 2
        : false;

      setUseMarquee(stackedTooTall || singleLineTooWide);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(viewportEl);
    observer.observe(measureEl);
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [statusLabel, hint]);

  const showMarquee = useMarquee && !reducedMotion;

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
              <span className="header-consult-status__marquee-item">
                {marqueeText}
              </span>
              <span
                className="header-consult-status__marquee-item"
                aria-hidden="true"
              >
                {marqueeText}
              </span>
            </span>
          </span>
        ) : (
          <span className="header-consult-status__text">
            <span className="header-consult-status__label">{statusLabel}</span>
            <span className="header-consult-status__hint">{hint}</span>
          </span>
        )}
      </span>
      <span
        ref={measureRef}
        className="header-consult-status__measure"
        aria-hidden="true"
      >
        <span className="header-consult-status__label">{statusLabel}</span>
        <span className="header-consult-status__hint">{hint}</span>
        <span data-measure-oneline className="header-consult-status__oneline">
          {marqueeText}
        </span>
      </span>
    </>
  );

  const className = [
    "header-consult-status",
    `header-consult-status--${isOpen ? "live" : "away"}`,
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
