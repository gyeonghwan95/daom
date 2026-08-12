"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCenter } from "@/components/admin/AlertCenter";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HourlyTrafficChart } from "@/components/admin/charts/HourlyTrafficChart";
import { MetricCard, AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { getActivityEventLabel, getSourceLabel } from "@/lib/admin/activity-labels";
import { formatKoreanNumber } from "@/lib/admin/url-display";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";
import type { DashboardPayload } from "@/lib/admin-ops/types";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const result = await adminFetchJson<DashboardPayload>("/api/admin/dashboard");
    setRefreshing(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setData(result.data);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error && !data) {
    return (
      <div>
        <AdminPageHeader title="대시보드" />
        <p className="admin-alert admin-alert--warning" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <AdminPageHeader title="대시보드" />
        <p>불러오는 중…</p>
      </div>
    );
  }

  const k = data.kpis;
  const funnel = data.funnelToday;
  const mailTotal = (k.emailSuccessToday ?? 0) + (k.emailFailedToday ?? 0);
  const mailRate =
    mailTotal > 0 && k.emailSuccessToday != null
      ? Math.round((k.emailSuccessToday / mailTotal) * 1000) / 10
      : null;

  return (
    <div className="admin-dashboard">
      <AdminPageHeader
        title="대시보드"
        generatedAt={data.generatedAt}
        onRefresh={() => void load()}
        refreshing={refreshing}
      >
        <Link href="/admin/notices" className="admin-btn admin-btn--primary">
          + 공지
        </Link>
      </AdminPageHeader>

      <p className="admin-summary">{data.summaryLine}</p>

      <div className="admin-metric-grid" aria-label="KPI">
        <MetricCard
          label="오늘 페이지뷰"
          value={k.visitsToday}
          compareValue={k.visitsYesterday}
        />
        <MetricCard
          label="최근 7일 페이지뷰"
          value={k.visits7d}
          compareValue={k.visitsPrev7d}
        />
        <MetricCard label="오늘 CTA" value={k.ctaToday ?? null} />
        <MetricCard label="오늘 문의 제출" value={k.consultSubmitToday} />
        <MetricCard
          label="네이버 플레이스 이동"
          value={k.naverPlaceToday ?? null}
          note={`예약 CTA ${k.naverReservationToday ?? "—"} · 7일 ${k.naverPlace7d ?? "—"}`}
        />
        <MetricCard
          label="메일 성공률"
          value={mailRate}
          suffix={mailRate != null ? "%" : undefined}
          note={
            k.emailFailedToday
              ? `실패 ${k.emailFailedToday}건`
              : `성공 ${k.emailSuccessToday ?? "—"}건`
          }
        />
        <MetricCard label="활성 공지" value={k.activeNotices} />
        <MetricCard label="확인할 경고" value={k.alertCount} />
      </div>

      <AdminSection title="확인할 사항">
        <AlertCenter alerts={data.alerts} />
      </AdminSection>

      <AdminSection title="오늘 시간대별 페이지 방문">
        <HourlyTrafficChart
          today={data.hourlyToday}
          avg7Day={data.hourly7DayAvg}
          insights={data.hourlyInsights}
        />
      </AdminSection>

      <div className="admin-two-col">
        <AdminSection title="최근 7일 추이">
          {data.visitsByDay.length === 0 ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>페이지뷰</th>
                  <th>CTA</th>
                  <th>제출</th>
                  <th>네이버</th>
                </tr>
              </thead>
              <tbody>
                {data.visitsByDay.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{d.visits}</td>
                    <td>{d.cta ?? "—"}</td>
                    <td>{d.submits}</td>
                    <td>{d.naverPlace ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>

        <AdminSection title="전환 Funnel (오늘)">
          {!funnel ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <ol className="admin-funnel">
              <li>
                <span>페이지뷰</span>
                <strong>{formatKoreanNumber(funnel.pageViews)}</strong>
              </li>
              <li>
                <span>CTA 클릭</span>
                <strong>{formatKoreanNumber(funnel.cta)}</strong>
              </li>
              <li>
                <span>상담 시작</span>
                <strong>{formatKoreanNumber(funnel.consultStart)}</strong>
              </li>
              <li>
                <span>문의 제출</span>
                <strong>{formatKoreanNumber(funnel.consultSubmit)}</strong>
              </li>
              <li>
                <span>메일 성공</span>
                <strong>{formatKoreanNumber(funnel.mailSuccess)}</strong>
              </li>
            </ol>
          )}
        </AdminSection>
      </div>

      <div className="admin-two-col">
        <AdminSection title="오늘 유입 TOP 페이지">
          {data.topPathsToday.length === 0 ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>페이지</th>
                  <th>페이지뷰</th>
                  <th>CTA</th>
                  <th>제출</th>
                </tr>
              </thead>
              <tbody>
                {data.topPathsToday.map((r) => (
                  <tr key={r.path}>
                    <td>
                      <PageIdentity path={r.path} />
                    </td>
                    <td>{r.visits}</td>
                    <td>{r.cta}</td>
                    <td>{r.consultSubmit ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>

        <AdminSection title="유입 Source (오늘)">
          {!data.sourcesToday?.length ? (
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
                {data.sourcesToday.map((s) => (
                  <tr key={s.source}>
                    <td>{getSourceLabel(s.source)}</td>
                    <td>{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>
      </div>

      <AdminSection title="최근 Activity">
        {!data.recentActivity?.length ? (
          <p className="admin-empty">최근 CTA·문의·네이버 클릭 기록이 없습니다.</p>
        ) : (
          <ul className="admin-activity">
            {data.recentActivity.map((a) => (
              <li key={a.id}>
                <time dateTime={a.at}>
                  {new Date(a.at).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Seoul",
                  })}
                </time>
                <PageIdentity path={a.path} compact />
                <span>{getSourceLabel(a.referrerType)}</span>
                <span>{getActivityEventLabel(a.eventType, a.meta)}</span>
              </li>
            ))}
          </ul>
        )}
      </AdminSection>

      <div className="admin-two-col">
        <AdminSection title="네이버 플레이스 (오늘)">
          {!data.naverPlaceTopPaths?.length ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>페이지</th>
                  <th>클릭</th>
                  <th>CTR%</th>
                </tr>
              </thead>
              <tbody>
                {data.naverPlaceTopPaths.slice(0, 8).map((r) => (
                  <tr key={r.path}>
                    <td>
                      <PageIdentity path={r.path} />
                    </td>
                    <td>{r.naverPlace}</td>
                    <td>{r.ctr ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>

        <AdminSection title="시스템 · 공지">
          <ul className="admin-health-list">
            {data.health.map((h) => (
              <li key={h.id}>
                <span className={`admin-badge admin-badge--${h.status}`}>
                  {h.status}
                </span>
                <strong>{h.label}</strong> {h.detail}
              </li>
            ))}
          </ul>
          {data.activeNotices.length ? (
            <ul className="admin-notice-list">
              {data.activeNotices.map((n) => (
                <li key={n.id}>
                  <strong>{n.title}</strong>
                  <span>{n.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty">활성 공지 없음</p>
          )}
        </AdminSection>
      </div>

      {!data.storageConfigured ? (
        <p className="admin-alert admin-alert--info">
          ADMIN_KV 미연결 — “—”는 데이터 없음입니다(가짜 0 아님).
        </p>
      ) : null}
    </div>
  );
}
