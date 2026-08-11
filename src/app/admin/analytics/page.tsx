"use client";

import { useEffect, useState } from "react";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";
import type { DashboardPayload } from "@/lib/admin-ops/types";

type DayRow = {
  date: string;
  visits: number;
  cta: number;
  consultSubmit: number;
  naverPlace?: number;
};

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState<DayRow[]>([]);
  const [dash, setDash] = useState<DashboardPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      adminFetchJson<{ days?: DayRow[]; message?: string }>(
        "/api/admin/analytics?days=14",
      ),
      adminFetchJson<DashboardPayload>("/api/admin/dashboard"),
    ])
      .then(([analytics, dash]) => {
        if (cancelled) return;
        if (!analytics.ok) {
          setMessage(analytics.message);
          return;
        }
        setDays(analytics.data?.days || []);
        setMessage(analytics.data?.message || null);
        if (dash.ok) setDash(dash.data);
      })
      .catch(() => {
        if (!cancelled) setMessage("불러오기 실패");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const k = dash?.kpis;

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>유입·전환</h1>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        page_view → CTA → 상담 제출 · 네이버 플레이스 이동 클릭(개인정보 없음)
      </p>
      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
        “네이버 플레이스 이동 클릭”은 사이트에서 나간 클릭 수입니다. 네이버 내부
        실제 방문자·예약완료와는 다릅니다.
      </p>
      {message ? (
        <p className="admin-alert admin-alert--info">{message}</p>
      ) : null}

      <section className="admin-kpi-grid" style={{ marginTop: 16 }} aria-label="네이버 KPI">
        <div className="admin-kpi">
          <div className="admin-kpi__label">오늘 SmartPlace 클릭</div>
          <div className="admin-kpi__value">
            {k?.naverPlaceToday == null ? "—" : k.naverPlaceToday}
          </div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">오늘 예약 CTA</div>
          <div className="admin-kpi__value">
            {k?.naverReservationToday == null ? "—" : k.naverReservationToday}
          </div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">7일 SmartPlace 클릭</div>
          <div className="admin-kpi__value">
            {k?.naverPlace7d == null ? "—" : k.naverPlace7d}
          </div>
        </div>
      </section>

      <div className="admin-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>일별 방문·전환</h2>
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
                <th>네이버이동</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{d.visits}</td>
                  <td>{d.cta}</td>
                  <td>{d.consultSubmit}</td>
                  <td>{d.naverPlace ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <section className="admin-card">
          <h2 style={{ fontSize: 15, marginTop: 0 }}>페이지별 SmartPlace</h2>
          {!dash?.naverPlaceTopPaths?.length ? (
            <p style={{ color: "#64748b", fontSize: 13 }}>아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>페이지</th>
                  <th>방문</th>
                  <th>클릭</th>
                  <th>예약</th>
                  <th>CTR%</th>
                </tr>
              </thead>
              <tbody>
                {dash.naverPlaceTopPaths.map((r) => (
                  <tr key={r.path}>
                    <td>{r.path}</td>
                    <td>{r.visits}</td>
                    <td>{r.naverPlace}</td>
                    <td>{r.reservation}</td>
                    <td>{r.ctr ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card">
          <h2 style={{ fontSize: 15, marginTop: 0 }}>Placement별 (오늘)</h2>
          {!dash?.naverPlaceByPlacement?.length ? (
            <p style={{ color: "#64748b", fontSize: 13 }}>아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>위치</th>
                  <th>클릭</th>
                </tr>
              </thead>
              <tbody>
                {dash.naverPlaceByPlacement.map((r) => (
                  <tr key={r.placement}>
                    <td>{r.placement}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
