import { consultationDecisionLine } from "@/lib/consultation-copy";

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
      ※ {consultationDecisionLine} 법무사 보수와 세금·수수료는 나눠 알려 드리고, 확정
      금액은 서류를 확인한 뒤 말씀드립니다.
    </p>
  );
}
