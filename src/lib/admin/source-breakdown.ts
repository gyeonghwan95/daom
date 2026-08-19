import { getSourceLabel } from "@/lib/analytics/referrer";

export type SourceCounts = Record<string, number>;

export type SourceShare = {
  source: string;
  label: string;
  count: number;
  pct: number;
  color: string;
};

const SOURCE_COLORS: Record<string, string> = {
  naver: "#03c75a",
  google: "#4285f4",
  daum: "#f5c400",
  bing: "#008373",
  sns: "#c026d3",
  campaign: "#7c3aed",
  direct: "#64748b",
  internal: "#94a3b8",
  external: "#0ea5e9",
};

export function getSourceColor(source: string): string {
  return SOURCE_COLORS[source] ?? "#334155";
}

export function rankSources(
  sources: SourceCounts | undefined,
  limit = 6,
): SourceShare[] {
  const entries = Object.entries(sources || {}).filter(([, n]) => n > 0);
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  if (total === 0) return [];
  const ranked = entries
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({
      source,
      label: getSourceLabel(source),
      count,
      pct: Math.round((count / total) * 1000) / 10,
      color: getSourceColor(source),
    }));
  if (ranked.length <= limit) return ranked;
  const head = ranked.slice(0, limit - 1);
  const rest = ranked.slice(limit - 1);
  const otherCount = rest.reduce((sum, row) => sum + row.count, 0);
  return [
    ...head,
    {
      source: "other",
      label: "기타",
      count: otherCount,
      pct: Math.round((otherCount / total) * 1000) / 10,
      color: "#475569",
    },
  ];
}

export function formatSourceSummary(sources: SourceCounts | undefined): string {
  const ranked = rankSources(sources, 4);
  if (!ranked.length) return "—";
  return ranked.map((row) => `${row.label} ${row.count}`).join(" · ");
}

export function sourceTotal(sources: SourceCounts | undefined): number {
  return Object.values(sources || {}).reduce((sum, n) => sum + (n || 0), 0);
}
