import { getSourceLabel } from "@/lib/analytics/referrer";

const EVENT_LABELS: Record<string, string> = {
  cta_click: "CTA 클릭",
  phone_click: "전화 클릭",
  kakao_click: "카카오 클릭",
  naver_click: "네이버톡톡 클릭",
  consultation_start: "상담 시작",
  consultation_submit: "문의 제출",
  naver_place_click: "네이버 플레이스 이동",
};

export function getActivityEventLabel(type: string, meta?: Record<string, string>) {
  if (type === "naver_place_click" && meta?.variant === "reservation") {
    return "네이버 예약 CTA 클릭";
  }
  return EVENT_LABELS[type] || type;
}

export { getSourceLabel };
