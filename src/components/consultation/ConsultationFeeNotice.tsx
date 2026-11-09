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
      ※ 상담은 상황 확인입니다. 맡긴 뒤에 수임료·세금·수수료를 나눠 안내합니다.
      확정 금액은 사실관계를 본 다음입니다. 상담 후 안 맡으셔도 됩니다.
    </p>
  );
}
