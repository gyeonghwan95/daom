"use client";

import Link from "next/link";

type Alert = {
  id: string;
  level: "critical" | "warning" | "info";
  title: string;
  detail: string;
  href?: string;
};

export function AlertCenter({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) {
    return (
      <div className="admin-alert admin-alert--info">
        현재 긴급하게 확인할 항목이 없습니다.
      </div>
    );
  }

  return (
    <div className="admin-alerts" role="region" aria-label="확인할 사항">
      {alerts.map((a) => (
        <div key={a.id} className={`admin-alert admin-alert--${a.level}`}>
          <strong>{a.title}</strong>
          <div>{a.detail}</div>
          {a.href ? (
            <Link href={a.href} className="admin-alert__link">
              상세 보기 →
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
