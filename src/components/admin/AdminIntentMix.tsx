"use client";

import {
  ADMIN_INTENT_LABEL,
  type AdminPathIntent,
  type IntentMixRow,
} from "@/lib/admin/path-intent";
import { formatKoreanNumber, formatPercent } from "@/lib/admin/url-display";

export function IntentBadge({ intent }: { intent: AdminPathIntent }) {
  return (
    <span className={`admin-intent-badge admin-intent-badge--${intent}`}>
      {ADMIN_INTENT_LABEL[intent]}
    </span>
  );
}

export function AdminFilterChips<T extends string>({
  value,
  options,
  onChange,
  allLabel = "전체",
}: {
  value: T | "all";
  options: Array<{ id: T; label: string; count?: number }>;
  onChange: (next: T | "all") => void;
  allLabel?: string;
}) {
  return (
    <div className="admin-filter-chips" role="tablist" aria-label="분류">
      <button
        type="button"
        className={value === "all" ? "is-active" : undefined}
        onClick={() => onChange("all")}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={value === opt.id ? "is-active" : undefined}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
          {opt.count != null ? ` ${opt.count}` : ""}
        </button>
      ))}
    </div>
  );
}

export function AdminIntentMix({
  rows,
  empty = "아직 측정되지 않음",
}: {
  rows: IntentMixRow[];
  empty?: string;
}) {
  if (!rows.length) {
    return <p className="admin-empty">{empty}</p>;
  }
  const max = Math.max(...rows.map((row) => row.visits), 1);
  return (
    <ul className="admin-intent-mix">
      {rows.map((row) => (
        <li key={row.intent}>
          <div className="admin-intent-mix__label">
            <IntentBadge intent={row.intent} />
            <span>
              {formatKoreanNumber(row.visits)}
              {row.share != null ? ` · ${formatPercent(row.share)}` : ""}
            </span>
          </div>
          <div
            className="admin-intent-mix__bar"
            style={{ width: `${Math.max(6, (row.visits / max) * 100)}%` }}
            aria-hidden
          />
        </li>
      ))}
    </ul>
  );
}
