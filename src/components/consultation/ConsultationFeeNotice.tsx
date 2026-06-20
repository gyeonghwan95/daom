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
      ※ 자세한 사건 검토 및 법률 자문은 별도 비용이 발생할 수 있으며, 필요 시
      상담 중 안내드립니다.
    </p>
  );
}
