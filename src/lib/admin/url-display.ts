/**
 * Admin display layer for URLs — aggregation keys stay normalized elsewhere.
 */

import titlesJson from "@/generated/admin-page-titles.json";

const TITLE_MAP: Record<string, string> =
  (titlesJson as { titles?: Record<string, string> }).titles ?? {};

const CORE_TITLES: Record<string, string> = {
  "/": "홈",
  "/about": "사무소 소개",
  "/office": "사무소",
  "/services": "업무 안내",
  "/contact": "상담·문의",
  "/contact/inquiry": "빠른 문의",
  "/location": "오시는 길",
  "/reviews": "고객 후기",
  "/faq": "FAQ",
  "/blog": "블로그",
  "/media": "미디어",
  "/search": "검색",
  "/search-guides": "검색 가이드",
};

/** Decode pathname for human-readable admin display. Never throws. */
export function safeDecodePathname(path: string): string {
  const raw = String(path || "/").split("?")[0]?.split("#")[0] || "/";
  if (!raw.includes("%")) return raw;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Display path with leading slash, decoded, no trailing slash (except root). */
export function normalizeDisplayPath(path: string): string {
  let p = safeDecodePathname(path);
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export function formatPagePath(path: string): string {
  return normalizeDisplayPath(path);
}

/** Page title for admin tables — inventory first, then heuristics. */
export function getPageDisplayName(path: string): string | null {
  const display = normalizeDisplayPath(path);
  const fromMap = TITLE_MAP[display] ?? CORE_TITLES[display];
  if (fromMap) return fromMap;
  if (display === "/") return CORE_TITLES["/"];
  const slug = display.slice(1);
  if (!slug) return null;
  return slug;
}

export function hrefForPublicPage(path: string): string {
  const display = normalizeDisplayPath(path);
  return encodeURI(display);
}

export function formatKoreanNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("ko-KR");
}

export function formatPercent(
  value: number | null | undefined,
  digits = 1,
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatDeltaPercent(
  current: number | null | undefined,
  previous: number | null | undefined,
): { text: string; direction: "up" | "down" | "flat" | "na" } {
  if (
    current == null ||
    previous == null ||
    previous === 0 ||
    Number.isNaN(current) ||
    Number.isNaN(previous)
  ) {
    return { text: "비교 데이터 부족", direction: "na" };
  }
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 0.05) {
    return { text: "0%", direction: "flat" };
  }
  const sign = pct > 0 ? "▲" : "▼";
  return {
    text: `${sign} ${Math.abs(pct).toFixed(1)}%`,
    direction: pct > 0 ? "up" : "down",
  };
}
