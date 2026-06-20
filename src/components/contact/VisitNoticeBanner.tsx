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

  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 sm:px-6"
      role="note"
    >
      <p className="text-sm font-semibold text-amber-950 sm:text-base">
        {officeLocation.visitNotice}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-amber-900/85">
        {officeLocation.visitNoticeDetail}
      </p>
    </div>
  );
}
