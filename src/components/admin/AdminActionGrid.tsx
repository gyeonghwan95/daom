import Link from "next/link";
import type { ReactNode } from "react";
import type { OpsAction, OpsStat } from "@/lib/admin/ops-insights";

export function AdminStatStrip({ stats }: { stats: OpsStat[] }) {
  if (!stats.length) return null;
  return (
    <ul className="admin-stat-strip">
      {stats.map((item) => (
        <li key={item.label}>
          <span className="admin-stat-strip__label">{item.label}</span>
          <strong>{item.value}</strong>
          {item.note ? <span className="admin-stat-strip__note">{item.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function AdminActionGrid({ actions }: { actions: OpsAction[] }) {
  if (!actions.length) return null;
  return (
    <ul className="admin-action-grid">
      {actions.map((item) => (
        <li key={item.id} className={`admin-action-card admin-action-card--${item.tone}`}>
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
          {item.href ? (
            <Link href={item.href} className="admin-insight__link">
              해당 화면
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function AdminTableWrap({ children }: { children: ReactNode }) {
  return <div className="admin-table-wrap">{children}</div>;
}
