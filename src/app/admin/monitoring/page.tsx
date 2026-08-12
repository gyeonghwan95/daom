"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSection } from "@/components/admin/MetricCard";
import type { HealthCard } from "@/lib/admin-ops/types";

type AlertRow = {
  id: string;
  level: string;
  title: string;
  detail: string;
  href?: string;
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
      <AdminPageHeader title="모니터링" />
      <p className="admin-prose">
        실제 확인 가능한 항목만 표시합니다. 가짜 health는 만들지 않습니다.
      </p>

      <AdminSection title="확인할 사항">
        {alerts.length === 0 ? (
          <p className="admin-empty">현재 긴급하게 확인할 항목이 없습니다.</p>
        ) : (
          alerts.map((a) => (
            <div key={a.id} className={`admin-alert admin-alert--${a.level}`}>
              <strong>{a.title}</strong>
              <div>{a.detail}</div>
            </div>
          ))
        )}
      </AdminSection>

      <AdminSection title="시스템 상태">
        <ul className="admin-health-list">
          {health.map((h) => (
            <li key={h.id}>
              <span className={`admin-badge admin-badge--${h.status}`}>
                {h.status}
              </span>{" "}
              <strong>{h.label}</strong> — {h.detail}
            </li>
          ))}
        </ul>
      </AdminSection>

      <AdminSection title="자동화 (참고)">
        <div className="admin-panel" style={{ padding: 0, border: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>작업</th>
                <th>실행 위치</th>
                <th>관리자 수동 실행</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SEO audit / regression</td>
                <td>CI / prebuild</td>
                <td>금지 (로컬 npm만)</td>
              </tr>
              <tr>
                <td>Sitemap 생성</td>
                <td>prebuild</td>
                <td>금지</td>
              </tr>
              <tr>
                <td>IndexNow</td>
                <td>GitHub Actions</td>
                <td>금지</td>
              </tr>
              <tr>
                <td>입찰 브리핑</td>
                <td>GitHub Actions</td>
                <td>금지</td>
              </tr>
            </tbody>
          </table>
          <p className="admin-prose" style={{ marginTop: 8 }}>
            Actions 실행 이력은 GitHub에서 확인하세요. 배포·DB 마이그레이션·데이터
            삭제는 관리자 콘솔에서 실행하지 않습니다.
          </p>
        </div>
      </AdminSection>
    </div>
  );
}
