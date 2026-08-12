"use client";

import type { ReactNode } from "react";
import {
  formatDeltaPercent,
  formatKoreanNumber,
} from "@/lib/admin/url-display";

type Props = {
  label: string;
  value: number | null | undefined;
  compareValue?: number | null;
  suffix?: string;
  note?: string;
};

export function MetricCard({ label, value, compareValue, suffix, note }: Props) {
  const delta = formatDeltaPercent(value, compareValue);
  return (
    <div className="admin-metric">
      <div className="admin-metric__label">{label}</div>
      <div className="admin-metric__value">
        {formatKoreanNumber(value)}
        {suffix ? (
          <span className="admin-metric__suffix">{suffix}</span>
        ) : null}
      </div>
      <div className={`admin-metric__delta admin-metric__delta--${delta.direction}`}>
        {delta.text}
      </div>
      {note ? <div className="admin-metric__note">{note}</div> : null}
    </div>
  );
}

export function AdminSection({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2 className="admin-section__title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
