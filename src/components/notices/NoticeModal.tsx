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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || preview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, preview]);

  useEffect(() => {
    if (!open || preview) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, preview, onClose]);

  if (!open && !preview) return null;

  const published = formatNoticePublishedAt(notice.publishedAt);
  const detailHref =
    notice.detailPath || `/공지사항/보기?id=${encodeURIComponent(notice.id)}`;
  const ctaHref = notice.ctaUrl || detailHref;
  const ctaLabel = notice.ctaLabel || "자세히 보기";

  const panel = (
    <div
      ref={dialogRef}
      className={`notice-modal__panel notice-modal__panel--${notice.style || "notice"}`}
      role="dialog"
      aria-modal={!preview}
      aria-labelledby={titleId}
    >
      <div className="notice-modal__header">
        <p className="notice-modal__eyebrow">공지사항</p>
        <button
          ref={closeRef}
          type="button"
          className="notice-modal__x"
          aria-label="닫기"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <h2 id={titleId} className="notice-modal__title">
        {notice.title || "제목"}
      </h2>
      <p className="notice-modal__date">게시일 {published}</p>
      <div className="notice-modal__body">
        <p className="notice-modal__message">
          {notice.message || "내용을 입력하면 여기에 미리보기가 표시됩니다."}
        </p>
      </div>
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
        {!preview && ctaHref !== detailHref ? (
          <Link href={detailHref} className="notice-modal__btn notice-modal__btn--ghost">
            자세히 보기
          </Link>
        ) : null}
        <button
          type="button"
          className="notice-modal__btn notice-modal__btn--ghost"
          onClick={onClose}
        >
          닫기
        </button>
        {notice.dismissible !== false ? (
          <button
            type="button"
            className="notice-modal__btn notice-modal__btn--text"
            onClick={onDismissToday}
          >
            오늘은 더 이상 보지 않기
          </button>
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
