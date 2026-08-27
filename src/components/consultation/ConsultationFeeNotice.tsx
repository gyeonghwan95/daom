type ConsultationFeeNoticeProps = {
  className?: string;
  theme?: "light" | "dark" | "muted";
};

export function ConsultationFeeNotice({
  className = "",
  theme = "muted",
}: ConsultationFeeNoticeProps) {
  const themeClass = {
    light: "text-navy/50",
    dark: "text-white/45",
    muted: "text-navy/45",
  }[theme];

  return (
    <p className={`text-xs leading-relaxed ${themeClass} ${className}`}>
      ※ 지금 상황을 확인하는 안내는 부담 없이 남겨 주세요. 수임료·공과금은
      사실관계를 확인한 뒤 안내합니다.
    </p>
  );
}
