import { officeLocation } from "@/lib/office-location";

type VisitNoticeBannerProps = {
  variant?: "default" | "compact";
  theme?: "light" | "dark";
};

export function VisitNoticeBanner({
  variant = "default",
  theme = "light",
}: VisitNoticeBannerProps) {
  const lightCompact =
    "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950";
  const darkCompact =
    "rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white/90";

  if (variant === "compact") {
    return (
      <p className={theme === "dark" ? darkCompact : lightCompact}>
        {officeLocation.visitNotice}
      </p>
    );
  }

  // 예전엔 visitNotice와 visitNoticeDetail(거의 같은 문장)을 연달아 보여 줬다 — 자세한 문장 하나만(2026-11-15)
  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 sm:px-6"
      role="note"
    >
      <p className="text-sm font-semibold leading-relaxed text-amber-950 sm:text-base">
        {officeLocation.visitNoticeDetail}
      </p>
    </div>
  );
}
