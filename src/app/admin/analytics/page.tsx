"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DailyTrendChart } from "@/components/admin/charts/DailyTrendChart";
import { MetricCard, AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { getSourceLabel } from "@/lib/analytics/referrer";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";
import type { DashboardPayload } from "@/lib/admin-ops/types";

type DayRow = {
  date: string;
  visits: number;
  sessions?: number;
  cta: number;
  consultSubmit: number;
  naverPlace?: number;
  sources?: Record<string, number>;
  devices?: { mobile: number; desktop: number; unknown: number };
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
      .then(([analytics, dashboard]) => {
        if (cancelled) return;
        if (!analytics.ok) {
          setMessage(analytics.message);
          return;
        }
        setDays(analytics.data?.days || []);
        setMessage(analytics.data?.message || null);
        if (dashboard.ok) setDash(dashboard.data);
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
      <AdminPageHeader title="유입 분석" />
      <p className="admin-prose">
        페이지뷰(화면 조회)와 세션(30분 방문)을 구분해 집계합니다. CTA는 클릭한 버튼이 연 주소까지 기록합니다.
      </p>
      {message ? (
        <p className="admin-alert admin-alert--info">{message}</p>
      ) : null}

      <div className="admin-metric-grid">
        <MetricCard label="오늘 페이지뷰" value={k?.visitsToday ?? null} />
        <MetricCard
          label="오늘 세션"
          value={k?.sessionsToday ?? null}
          note="같은 탭 30분 = 1방문"
        />
        <MetricCard
          label="오늘 SmartPlace 클릭"
          value={k?.naverPlaceToday ?? null}
        />
        <MetricCard
          label="오늘 예약 CTA"
          value={k?.naverReservationToday ?? null}
        />
        <MetricCard label="7일 SmartPlace" value={k?.naverPlace7d ?? null} />
      </div>

      <AdminSection title="방문 추이 (일별)">
        {days.length === 0 ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <>
            <DailyTrendChart
              days={days.map((d) => ({
                date: d.date,
                visits: d.visits,
                sessions: d.sessions,
                cta: d.cta,
                submits: d.consultSubmit,
              }))}
            />
            <table className="admin-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>페이지뷰</th>
                  <th>세션</th>
                  <th>CTA</th>
                  <th>제출</th>
                  <th>네이버</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{d.visits}</td>
                    <td>{d.sessions ?? "—"}</td>
                    <td>{d.cta}</td>
                    <td>{d.consultSubmit}</td>
                    <td>{d.naverPlace ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </AdminSection>

      <div className="admin-two-col">
        <AdminSection title="유입 Source (오늘)">
          {!dash?.sourcesToday?.length ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>페이지뷰</th>
                </tr>
              </thead>
              <tbody>
                {dash.sourcesToday.map((s) => (
                  <tr key={s.source}>
                    <td>{getSourceLabel(s.source)}</td>
                    <td>{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>

        <AdminSection title="Device (오늘)">
          {!dash?.devicesToday ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <tbody>
                <tr>
                  <td>Mobile</td>
                  <td>{dash.devicesToday.mobile}</td>
                </tr>
                <tr>
                  <td>Desktop</td>
                  <td>{dash.devicesToday.desktop}</td>
                </tr>
                <tr>
                  <td>Unknown</td>
                  <td>{dash.devicesToday.unknown}</td>
                </tr>
              </tbody>
            </table>
          )}
        </AdminSection>
      </div>

      <AdminSection title="네이버 SmartPlace · 페이지별">
        {!dash?.naverPlaceTopPaths?.length ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>페이지</th>
                <th>페이지뷰</th>
                <th>클릭</th>
                <th>예약</th>
                <th>CTR%</th>
              </tr>
            </thead>
            <tbody>
              {dash.naverPlaceTopPaths.map((r) => (
                <tr key={r.path}>
                  <td>
                    <PageIdentity path={r.path} />
                  </td>
                  <td>{r.visits}</td>
                  <td>{r.naverPlace}</td>
                  <td>{r.reservation}</td>
                  <td>{r.ctr ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminSection>
    </div>
  );
}
