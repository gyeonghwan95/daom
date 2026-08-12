"use client";

import { useEffect, useState } from "react";
import type { PublicFloatingNotice } from "@/lib/admin-ops/types";
import { trackEvent } from "@/lib/admin-ops/beacon";
import { NoticeModal } from "@/components/notices/NoticeModal";
import {
  clearLegacyDismiss,
  dismissForSession,
  dismissForToday,
  isDismissedForToday,
  isDismissedThisSession,
} from "@/lib/notices/dismiss";

/**
 * Public centered notice modal — soft-fail if API unavailable.
 * Does not block FloatingCTA / MobileBottomCTA (modal overlays above).
 */
export function FloatingNoticeHost() {
  const [notice, setNotice] = useState<PublicFloatingNotice | null>(null);
  const [open, setOpen] = useState(false);
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
        const candidate = (data.notices || [])[0];
        if (!candidate) return;
        clearLegacyDismiss(candidate.id);
        if (isDismissedForToday(candidate.id)) return;
        if (isDismissedThisSession(candidate.id)) return;
        setNotice(candidate);
        setOpen(true);
        void trackEvent({
          type: "notice_impression",
          path,
          meta: { noticeId: candidate.id },
        });
      })
      .catch(() => {
        /* soft-fail — never block public site */
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!notice) return null;

  return (
    <NoticeModal
      notice={notice}
      open={open}
      onClose={() => {
        dismissForSession(notice.id);
        void trackEvent({
          type: "notice_dismiss",
          path,
          meta: { noticeId: notice.id, mode: "session" },
        });
        setOpen(false);
      }}
      onDismissToday={() => {
        dismissForToday(notice.id);
        void trackEvent({
          type: "notice_dismiss",
          path,
          meta: { noticeId: notice.id, mode: "today" },
        });
        setOpen(false);
      }}
      onCtaClick={() =>
        void trackEvent({
          type: "notice_click",
          path,
          meta: { noticeId: notice.id },
        })
      }
    />
  );
}
