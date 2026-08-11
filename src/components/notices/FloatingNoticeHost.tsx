"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PublicFloatingNotice } from "@/lib/admin-ops/types";
import { trackEvent } from "@/lib/admin-ops/beacon";

const DISMISS_PREFIX = "noticeDismissed:";

function isDismissed(id: string, updatedAt: string): boolean {
  try {
    const raw = localStorage.getItem(`${DISMISS_PREFIX}${id}`);
    return raw === updatedAt;
  } catch {
    return false;
  }
}

function dismiss(id: string, updatedAt: string) {
  try {
    localStorage.setItem(`${DISMISS_PREFIX}${id}`, updatedAt);
  } catch {
    /* ignore */
  }
}

/**
 * Public floating notice — does not block FloatingCTA (desktop right)
 * or MobileBottomCTA. Soft-fail if API unavailable.
 */
export function FloatingNoticeHost() {
  const [notices, setNotices] = useState<PublicFloatingNotice[]>([]);
  const [index, setIndex] = useState(0);
  const [path] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/",
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/notices/active?path=${encodeURIComponent(path)}`, {
      credentials: "same-origin",
    })
      .then(async (res) => {
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          ok?: boolean;
          notices?: PublicFloatingNotice[];
        };
        if (cancelled) return;
        const list = (data.notices || []).filter(
          (n) => !isDismissed(n.id, n.updatedAt),
        );
        setNotices(list);
        setIndex(0);
        if (list[0]) {
          void trackEvent({
            type: "notice_impression",
            path,
            meta: { noticeId: list[0].id },
          });
        }
      })
      .catch(() => {
        /* soft-fail */
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (notices.length === 0) return null;
  const notice = notices[Math.min(index, notices.length - 1)];
  if (!notice) return null;

  const posClass =
    notice.position === "top"
      ? "floating-notice floating-notice--top"
      : notice.position === "bottom-right"
        ? "floating-notice floating-notice--br"
        : "floating-notice floating-notice--bl";

  const styleClass = `floating-notice__card floating-notice__card--${notice.style}`;

  return (
    <div className={posClass} role="region" aria-label="사이트 공지">
      <div className={styleClass}>
        <div className="floating-notice__header">
          <p className="floating-notice__title">{notice.title}</p>
          {notice.dismissible ? (
            <button
              type="button"
              className="floating-notice__close"
              aria-label="공지 닫기"
              onClick={() => {
                dismiss(notice.id, notice.updatedAt);
                void trackEvent({
                  type: "notice_dismiss",
                  path,
                  meta: { noticeId: notice.id },
                });
                setNotices((prev) => prev.filter((n) => n.id !== notice.id));
              }}
            >
              ×
            </button>
          ) : null}
        </div>
        <p className="floating-notice__message">{notice.message}</p>
        {notice.ctaLabel && notice.ctaUrl ? (
          <Link
            href={notice.ctaUrl}
            className="floating-notice__cta"
            onClick={() =>
              void trackEvent({
                type: "notice_click",
                path,
                meta: { noticeId: notice.id },
              })
            }
          >
            {notice.ctaLabel}
          </Link>
        ) : null}
        {notices.length > 1 ? (
          <div className="floating-notice__pager">
            <button
              type="button"
              onClick={() =>
                setIndex((i) => (i - 1 + notices.length) % notices.length)
              }
            >
              이전
            </button>
            <span>
              {index + 1} / {notices.length}
            </span>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % notices.length)}
            >
              다음
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
