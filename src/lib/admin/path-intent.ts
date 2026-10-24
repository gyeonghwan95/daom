import { LECTURE_CHAMPION_PATHS } from "@/data/seo/lecture-100-champions";
import { normalizeDisplayPath } from "@/lib/admin/url-display";

export type AdminPathIntent =
  | "home"
  | "lecture"
  | "inheritance"
  | "corporate"
  | "local"
  | "consult"
  | "jeonse"
  | "insolvency"
  | "tools"
  | "other";

export const ADMIN_INTENT_LABEL: Record<AdminPathIntent, string> = {
  home: "홈·사무소",
  lecture: "특강·강의",
  inheritance: "상속",
  corporate: "법인",
  local: "지역 법무사",
  consult: "상담·문의",
  jeonse: "전세·임대차",
  insolvency: "회생·파산",
  tools: "계산기·진단",
  other: "기타",
};

const LECTURE_PATHS = new Set<string>([
  ...LECTURE_CHAMPION_PATHS,
  "/디지털법률교육",
  "/부산기관법률특강",
  "/강의문의",
  "/강사소개",
  "/강의이력",
  "/부산강사섭외비용",
  "/부산강사섭외체크리스트",
  "/기관특강주제추천",
  "/강의시간별구성",
]);

export function classifyAdminPath(path: string): AdminPathIntent {
  const p = normalizeDisplayPath(path);
  if (p === "/" || p === "/about" || p === "/office") {
    return "home";
  }
  if (p.startsWith("/강의이력") || LECTURE_PATHS.has(p)) return "lecture";
  if (
    p.includes("특강") ||
    p.includes("강의") ||
    p.includes("강사") ||
    p.includes("법률교육")
  ) {
    return "lecture";
  }
  if (p.startsWith("/tools") || p.includes("자가진단")) return "tools";
  if (
    p.includes("상담") ||
    p === "/contact" ||
    p.startsWith("/contact/") ||
    p === "/1분간편상담"
  ) {
    return "consult";
  }
  if (
    p.includes("전세") ||
    p.includes("임차권") ||
    p.includes("보증금") ||
    p.includes("임대차")
  ) {
    return "jeonse";
  }
  if (p.includes("회생") || p.includes("파산") || p.includes("면책")) {
    return "insolvency";
  }
  if (
    p.includes("상속") ||
    p.includes("한정승인") ||
    p.includes("유증") ||
    p.includes("유류분")
  ) {
    return "inheritance";
  }
  if (
    p.includes("법인") ||
    p.includes("회사") ||
    p.includes("임원") ||
    p.includes("본점") ||
    p.includes("설립")
  ) {
    return "corporate";
  }
  if (p.endsWith("법무사") || p.includes("법무사")) return "local";
  return "other";
}

export type IntentMixRow = {
  intent: AdminPathIntent;
  label: string;
  visits: number;
  share: number | null;
};

export function mixByIntent(
  rows: Array<{ path: string; visits: number }>,
): IntentMixRow[] {
  const totals = new Map<AdminPathIntent, number>();
  let sum = 0;
  for (const row of rows) {
    const intent = classifyAdminPath(row.path);
    const visits = row.visits || 0;
    totals.set(intent, (totals.get(intent) || 0) + visits);
    sum += visits;
  }
  return [...totals.entries()]
    .map(([intent, visits]) => ({
      intent,
      label: ADMIN_INTENT_LABEL[intent],
      visits,
      share: sum > 0 ? Math.round((visits / sum) * 1000) / 10 : null,
    }))
    .sort((a, b) => b.visits - a.visits);
}
