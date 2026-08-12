"use client";

/**
 * @deprecated Prefer NoticeModal for the centered office notice.
 * Kept for any residual admin preview references.
 */
import type { PublicFloatingNotice } from "@/lib/admin-ops/types";
import { NoticeModal } from "@/components/notices/NoticeModal";

type Props = {
  notice: PublicFloatingNotice;
  preview?: boolean;
  previewMode?: "desktop" | "mobile";
  onDismiss?: () => void;
  onCtaClick?: () => void;
};

export function FloatingNoticeCard({
  notice,
  preview = false,
  previewMode = "desktop",
  onDismiss,
  onCtaClick,
}: Props) {
  return (
    <NoticeModal
      notice={notice}
      preview={preview}
      previewMode={previewMode}
      onClose={onDismiss}
      onDismissToday={onDismiss}
      onCtaClick={onCtaClick}
    />
  );
}
