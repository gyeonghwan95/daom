"use client";

import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  pinned?: boolean;
  x: number;
  y: number;
  rows: Array<{ label: string; value: string }>;
  extra?: ReactNode;
};

export function ChartTooltip({
  open,
  title,
  pinned = false,
  x,
  y,
  rows,
  extra,
}: Props) {
  if (!open) return null;

  return (
    <div
      className={`admin-chart-tip${pinned ? " is-pinned" : ""}`}
      style={{ left: x, top: y }}
      role="status"
    >
      <p className="admin-chart-tip__title">{title}</p>
      <dl className="admin-chart-tip__rows">
        {rows.map((row) => (
          <div key={row.label} className="admin-chart-tip__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {extra}
      <p className="admin-chart-tip__hint">
        {pinned ? "다시 클릭하면 닫힙니다" : "클릭하면 고정됩니다"}
      </p>
    </div>
  );
}
