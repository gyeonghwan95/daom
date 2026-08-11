"use client";

import { useEffect, useState } from "react";

type Row = {
  path: string;
  visits: number;
  cta: number;
  consultSubmit: number;
  conversionRate: number | null;
};

export default function AdminPagesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/pages", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json()) as {
          data?: { rows?: Row[]; message?: string };
        };
        if (cancelled) return;
        setRows(json.data?.rows || []);
        setMessage(json.data?.message || null);
      })
      .catch(() => {
        if (!cancelled) setMessage("불러오기 실패");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>페이지 성과</h1>
      <p style={{ color: "#64748b", fontSize: 14 }}>오늘(KST) 기준</p>
      {message ? <p className="admin-alert admin-alert--info">{message}</p> : null}
      <div className="admin-card" style={{ marginTop: 16, overflowX: "auto" }}>
        {rows.length === 0 ? (
          <p style={{ color: "#64748b" }}>아직 측정되지 않음</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>페이지</th>
                <th>방문</th>
                <th>CTA</th>
                <th>제출</th>
                <th>전환율%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.path}>
                  <td>{r.path}</td>
                  <td>{r.visits}</td>
                  <td>{r.cta}</td>
                  <td>{r.consultSubmit}</td>
                  <td>{r.conversionRate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
