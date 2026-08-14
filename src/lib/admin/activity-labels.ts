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

const KIND_LABELS: Record<string, string> = {
  contact: "상담 문의",
  phone: "전화",
  kakao: "카카오톡",
  "naver-talk": "네이버 톡톡",
  naver: "네이버 톡톡",
  location: "오시는 길",
  documents: "준비서류",
  diagnosis: "자가진단",
  "naver-reservation": "네이버 예약",
  "naver-place": "네이버 플레이스",
  collaboration: "협업 문의",
  inquiry: "상담 문의",
};

export function getActivityEventLabel(type: string, meta?: Record<string, string>) {
  if (type === "naver_place_click" && meta?.variant === "reservation") {
    return "네이버 예약 CTA 클릭";
  }
  if (type === "cta_click" && meta?.kind && KIND_LABELS[meta.kind]) {
    return `${KIND_LABELS[meta.kind]} 클릭`;
  }
  return EVENT_LABELS[type] || type;
}

export function getCtaKindLabel(kind: string) {
  return KIND_LABELS[kind] || kind;
}

export function getActivityDestination(meta?: Record<string, string>) {
  const dest = meta?.dest || meta?.href || "";
  return dest.trim();
}

export function formatActivityAction(type: string, meta?: Record<string, string>) {
  const label = getActivityEventLabel(type, meta);
  const dest = getActivityDestination(meta);
  return dest ? `${label} → ${dest}` : label;
}

export { getSourceLabel };
