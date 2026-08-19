"use client";

import { rankSources, type SourceCounts } from "@/lib/admin/source-breakdown";

export function SourceMix({
  sources,
  compact = false,
}: {
  sources?: SourceCounts;
  compact?: boolean;
}) {
  const ranked = rankSources(sources, compact ? 3 : 5);
  if (!ranked.length) return <span className="admin-muted">—</span>;

  return (
    <ul className={`admin-source-mix${compact ? " is-compact" : ""}`}>
      {ranked.map((row) => (
        <li key={row.source}>
          <i style={{ background: row.color }} />
          <span>
            {row.label} {row.count}
            {compact ? "" : ` (${row.pct}%)`}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SourceStackBar({ sources }: { sources?: SourceCounts }) {
  const ranked = rankSources(sources, 8);
  const total = ranked.reduce((sum, row) => sum + row.count, 0);
  if (!total) {
    return <div className="admin-source-stack__bar is-empty" />;
  }

  return (
    <div className="admin-source-stack__bar" title={ranked.map((r) => `${r.label} ${r.count}`).join(" · ")}>
      {ranked.map((row) => (
        <span
          key={row.source}
          style={{
            width: `${Math.max((row.count / total) * 100, 2)}%`,
            background: row.color,
          }}
        />
      ))}
    </div>
  );
}
