"use client";

import { formatKoreanNumber, formatPercent } from "@/lib/admin/url-display";

type Step = {
  label: string;
  value: number | null | undefined;
  rate?: number | null;
};

export function FunnelChart({ steps }: { steps: Step[] }) {
  const max = Math.max(1, ...steps.map((s) => s.value || 0));
  return (
    <ol className="admin-funnel-bars">
      {steps.map((step) => {
        const v = step.value ?? 0;
        const width = Math.max(v > 0 ? 8 : 0, Math.round((v / max) * 100));
        return (
          <li key={step.label}>
            <div className="admin-funnel-bars__meta">
              <span>{step.label}</span>
              <strong>
                {formatKoreanNumber(step.value)}
                {step.rate != null ? <small>{formatPercent(step.rate)}</small> : null}
              </strong>
            </div>
            <div className="admin-funnel-bars__track" aria-hidden>
              <div className="admin-funnel-bars__fill" style={{ width: `${width}%` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
