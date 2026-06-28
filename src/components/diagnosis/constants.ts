import type { DiagnosisOutcome } from "@/data/diagnosis";

export type RiskLevel = DiagnosisOutcome["riskLevel"];

export const RISK_LEVEL_META: Record<
  RiskLevel,
  { label: string; symbol: string; hint: string; borderClass: string }
> = {
  low: {
    label: "사전 정보 확인",
    symbol: "○",
    hint: "서류를 모은 뒤 방향을 잡기 좋은 단계로 보입니다.",
    borderClass: "border-emerald-300",
  },
  medium: {
    label: "검토 필요",
    symbol: "△",
    hint: "절차·서류를 함께 검토해 보시는 것이 좋습니다.",
    borderClass: "border-amber-300",
  },
  high: {
    label: "상담 권장",
    symbol: "◇",
    hint: "사실관계 확인 후 상담을 권합니다.",
    borderClass: "border-orange-300",
  },
  urgent: {
    label: "긴급 확인 필요",
    symbol: "!",
    hint: "기한 확인이 필요할 수 있어 빠른 확인을 권합니다.",
    borderClass: "border-red-400",
  },
};

export function isQuestionAnswered(
  value: string | string[] | undefined,
): boolean {
  if (value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
