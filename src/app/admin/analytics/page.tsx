"use client";

import { useEffect, useState } from "react";

type DayRow = {
  date: string;
  visits: number;
  cta: number;
  consultSubmit: number;
};

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState<DayRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/analytics?days=14", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json()) as {
          data?: { days?: DayRow[]; message?: string };
        };
        if (cancelled) return;
        setDays(json.data?.days || []);
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
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>유입·전환</h1>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        page_view → CTA → 상담 제출 집계(개인정보 없음)
      </p>
      {message ? (
        <p className="admin-alert admin-alert--info">{message}</p>
      ) : null}
      <div className="admin-card" style={{ marginTop: 16 }}>
        {days.length === 0 ? (
          <p style={{ color: "#64748b" }}>아직 측정되지 않음</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>방문</th>
                <th>CTA</th>
                <th>제출</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{d.visits}</td>
                  <td>{d.cta}</td>
                  <td>{d.consultSubmit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
