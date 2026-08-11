"use client";

import { useEffect, useState } from "react";
import type { HealthCard } from "@/lib/admin-ops/types";

type AlertRow = {
  id: string;
  level: string;
  title: string;
  detail: string;
};

export default function AdminMonitoringPage() {
  const [health, setHealth] = useState<HealthCard[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/monitoring", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json()) as {
          data?: { health?: HealthCard[]; alerts?: AlertRow[] };
        };
        if (cancelled) return;
        setHealth(json.data?.health || []);
        setAlerts(json.data?.alerts || []);
      })
      .catch(() => {
        /* keep empty */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>모니터링</h1>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        실제 확인 가능한 항목만 표시합니다. 가짜 health는 만들지 않습니다.
      </p>
      {alerts.map((a) => (
        <div key={a.id} className={`admin-alert admin-alert--${a.level}`}>
          <strong>{a.title}</strong>
          <div>{a.detail}</div>
        </div>
      ))}
      <div className="admin-card" style={{ marginTop: 12 }}>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {health.map((h) => (
            <li key={h.id}>
              <strong>{h.label}</strong> — {h.status}: {h.detail}
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>자동화(참고)</h2>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
          IndexNow·입찰 브리핑·sitemap 생성은 GitHub Actions / prebuild에서
          실행됩니다. Actions 실행 이력은 GitHub에서 확인하세요. 콘솔 수동 실행은
          위험 작업을 피하기 위해 제공하지 않습니다.
        </p>
      </div>
    </div>
  );
}
