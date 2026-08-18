import { getSourceLabel } from "@/lib/analytics/referrer";

const EVENT_LABELS: Record<string, string> = {
  cta_click: "CTA 클릭",
  phone_click: "전화 클릭",
  kakao_click: "카카오 클릭",
  naver_click: "네이버톡톡 클릭",
  consultation_start: "상담 시작",
  consultation_submit: "문의 제출",
  collaboration_submit: "협업문의 제출",
  lecture_inquiry_submit: "강의문의 제출",
  naver_place_click: "네이버 플레이스 이동",
  search_used: "검색",
  tool_used: "계산기 실행",
  diagnosis_complete: "자가진단 완료",
  notice_click: "공지 클릭",
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
  lecture: "강의문의",
  business: "기업문의",
  wizard: "상담 위저드",
  popular: "검색 추천",
  result: "검색 결과",
  all: "검색 전체보기",
};

const SUBMIT_KIND_LABELS: Record<string, string> = {
  lecture: "강의문의 제출",
  collaboration: "협업문의 제출",
  business: "기업문의 제출",
  wizard: "상담 위저드 제출",
  inquiry: "빠른문의 제출",
  "corporate-legal": "기업법무 문의 제출",
};

export function getActivityEventLabel(type: string, meta?: Record<string, string>) {
  if (type === "naver_place_click" && meta?.variant === "reservation") {
    return "네이버 예약 CTA 클릭";
  }
  if (type === "cta_click" && meta?.kind && KIND_LABELS[meta.kind]) {
    return `${KIND_LABELS[meta.kind]} 클릭`;
  }
  if (type === "consultation_submit") {
    const base =
      meta?.kind && SUBMIT_KIND_LABELS[meta.kind]
        ? SUBMIT_KIND_LABELS[meta.kind]
        : "문의 제출";
    if (meta?.topic) return `${base} · ${meta.topic}`;
    if (meta?.field) return `${base} · ${meta.field}`;
    return base;
  }
  if (type === "search_used") {
    if (meta?.kind === "popular") {
      return meta.q ? `검색 추천 “${meta.q}”` : "검색 추천 클릭";
    }
    if (meta?.q) {
      const hits = meta.hits ? ` · ${meta.hits}건` : "";
      return `검색 “${meta.q}”${hits}`;
    }
    return "검색 사용";
  }
  if (type === "tool_used") {
    return meta?.tool ? `계산기 실행: ${meta.tool}` : "계산기 실행";
  }
  if (type === "diagnosis_complete") {
    const slug = meta?.slug ? `: ${meta.slug}` : "";
    const risk = meta?.risk ? ` · ${meta.risk}` : "";
    return `자가진단 완료${slug}${risk}`;
  }
  if (type === "notice_click") {
    return meta?.title ? `공지 클릭: ${meta.title}` : "공지 클릭";
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
