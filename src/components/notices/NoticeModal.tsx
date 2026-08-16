"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import type { PublicFloatingNotice } from "@/lib/admin-ops/types";
import { formatNoticePublishedAt } from "@/lib/notices/dismiss";

type Props = {
  notice: PublicFloatingNotice;
  open?: boolean;
  /** Admin preview — no body scroll lock / focus trap aggression */
  preview?: boolean;
  previewMode?: "desktop" | "mobile";
  onClose?: () => void;
  onDismissToday?: () => void;
  onCtaClick?: () => void;
};

const STYLE_LABEL: Record<PublicFloatingNotice["style"], string> = {
  notice: "사무소 공지",
  important: "중요 안내",
  info: "안내",
  event: "일정 안내",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Centered office-style notice modal — shared by public host and admin preview.
 */
export function NoticeModal({
  notice,
  open = true,
  preview = false,
  previewMode = "desktop",
  onClose,
  onDismissToday,
  onCtaClick,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || preview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, preview]);

  useEffect(() => {
    if (!open || preview) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const nodes = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, preview, onClose]);

  if (!open && !preview) return null;

  const published = formatNoticePublishedAt(notice.publishedAt);
  const detailHref =
    notice.detailPath || `/공지사항/보기?id=${encodeURIComponent(notice.id)}`;
  const hasCustomCta = Boolean(notice.ctaUrl && notice.ctaLabel);
  const ctaHref = hasCustomCta ? notice.ctaUrl! : detailHref;
  const ctaLabel = hasCustomCta ? notice.ctaLabel! : "공지 자세히 보기";
  const styleKey = notice.style || "notice";
  const styleLabel = STYLE_LABEL[styleKey] || STYLE_LABEL.notice;
  const message =
    notice.message || "내용을 입력하면 여기에 미리보기가 표시됩니다.";

  const panel = (
    <div
      ref={dialogRef}
      className={`notice-modal__panel notice-modal__panel--${styleKey}`}
      role="dialog"
      aria-modal={!preview}
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={-1}
    >
      <div className="notice-modal__sheet-handle" aria-hidden />
      <div className="notice-modal__header">
        <div className="notice-modal__brand">
          <span className={`notice-modal__badge notice-modal__badge--${styleKey}`}>
            {styleLabel}
          </span>
          <p className="notice-modal__eyebrow">다옴법무사사무소</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          className="notice-modal__x"
          aria-label="닫기"
          onClick={onClose}
        >
          <span aria-hidden>×</span>
        </button>
      </div>
      <h2 id={titleId} className="notice-modal__title">
        {notice.title || "제목"}
      </h2>
      <p className="notice-modal__date">게시일 {published}</p>
      <div className="notice-modal__body">
        <p id={descId} className="notice-modal__message">
          {message}
        </p>
      </div>
      <div className="notice-modal__footer">
        <div className="notice-modal__actions">
          {preview ? (
            <span className="notice-modal__btn notice-modal__btn--primary" aria-hidden>
              {ctaLabel}
            </span>
          ) : (
            <Link
              href={ctaHref}
              className="notice-modal__btn notice-modal__btn--primary"
              onClick={onCtaClick}
            >
              {ctaLabel}
            </Link>
          )}
          {!preview && hasCustomCta ? (
            <Link href={detailHref} className="notice-modal__btn notice-modal__btn--ghost">
              공지 원문
            </Link>
          ) : null}
        </div>
        {notice.dismissible !== false ? (
          preview ? (
            <p className="notice-modal__dismiss-hint">오늘 하루 보지 않기</p>
          ) : (
            <button
              type="button"
              className="notice-modal__dismiss"
              onClick={onDismissToday}
            >
              오늘 하루 보지 않기
            </button>
          )
        ) : null}
      </div>
    </div>
  );

  if (preview) {
    return (
      <div
        className={`notice-modal-preview notice-modal-preview--${previewMode}`}
      >
        <div className="notice-modal-preview__stage">
          <div className="notice-modal notice-modal--preview">
            <div className="notice-modal__backdrop" aria-hidden />
            {panel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-modal">
      <button
        type="button"
        className="notice-modal__backdrop"
        aria-label="배경 닫기"
        onClick={onClose}
      />
      {panel}
    </div>
  );
}
