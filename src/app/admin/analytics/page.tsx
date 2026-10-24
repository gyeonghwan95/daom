"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminStatStrip, AdminTableWrap } from "@/components/admin/AdminActionGrid";
import { AdminIntentMix } from "@/components/admin/AdminIntentMix";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DailyTrendChart } from "@/components/admin/charts/DailyTrendChart";
import { HourlyTrafficChart } from "@/components/admin/charts/HourlyTrafficChart";
import { MetricCard, AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { SourceMix } from "@/components/admin/charts/SourceMix";
import { getSourceLabel } from "@/lib/admin/activity-labels";
import { formatDeviceSplit } from "@/lib/admin/device-label";
import { buildOpsBriefing, withShare } from "@/lib/admin/ops-insights";
import { mixByIntent } from "@/lib/admin/path-intent";
import { formatPercent } from "@/lib/admin/url-display";
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
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const [analytics, dashboard] = await Promise.all([
      adminFetchJson<{ days?: DayRow[]; message?: string }>(
        "/api/admin/analytics?days=14",
      ),
      adminFetchJson<DashboardPayload>("/api/admin/dashboard"),
    ]);
    setRefreshing(false);
    if (!analytics.ok) {
      setMessage(analytics.message);
      return;
    }
    setDays(analytics.data?.days || []);
    setMessage(analytics.data?.message || null);
    if (dashboard.ok) setDash(dashboard.data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      adminFetchJson<{ days?: DayRow[]; message?: string }>(
        "/api/admin/analytics?days=14",
      ),
      adminFetchJson<DashboardPayload>("/api/admin/dashboard"),
    ]).then(([analytics, dashboard]) => {
      if (cancelled) return;
      if (!analytics.ok) {
        setMessage(analytics.message);
        return;
      }
      setDays(analytics.data?.days || []);
      setMessage(analytics.data?.message || null);
      if (dashboard.ok) setDash(dashboard.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const k = dash?.kpis;
  const intentMix = useMemo(
    () =>
      mixByIntent(
        (dash?.topPathsToday || []).map((row) => ({
          path: row.path,
          visits: row.visits,
        })),
      ),
    [dash],
  );

  const briefing = dash ? buildOpsBriefing(dash) : null;
  const last14Views = days.reduce((sum, d) => sum + (d.visits || 0), 0);
  const last14Submits = days.reduce((sum, d) => sum + (d.consultSubmit || 0), 0);
  const deviceTotal =
    (dash?.devicesToday?.mobile || 0) +
    (dash?.devicesToday?.desktop || 0) +
    (dash?.devicesToday?.unknown || 0);

  return (
    <div>
      <AdminPageHeader
        title="유입 분석"
        generatedAt={dash?.generatedAt}
        onRefresh={() => {
          void load();
        }}
        refreshing={refreshing}
      />
      <p className="admin-prose">
        최근 14일 공개 페이지뷰입니다. 관리자 세션과 봇은 제외됩니다. 네이버 검색 순위는 이 화면에 없습니다.
      </p>
      {message ? (
        <p className="admin-alert admin-alert--info">{message}</p>
      ) : null}

      <p className="admin-summary">
        14일 페이지뷰 {last14Views.toLocaleString("ko-KR")} · 문의 제출{" "}
        {last14Submits.toLocaleString("ko-KR")}
        {dash?.hourlyInsights?.peakHourToday != null
          ? ` · 오늘 피크 ${dash.hourlyInsights.peakHourToday}시`
          : ""}
      </p>
      {briefing ? <AdminStatStrip stats={briefing.stats} /> : null}

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
        <MetricCard label="오늘 검색" value={k?.searchUsedToday ?? null} />
        <MetricCard label="오늘 계산기" value={k?.toolUsedToday ?? null} />
        <MetricCard
          label="오늘 자가진단"
          value={k?.diagnosisCompleteToday ?? null}
        />
        <MetricCard label="오늘 CTA" value={k?.ctaToday ?? null} />
        <MetricCard label="오늘 문의" value={k?.consultSubmitToday ?? null} />
      </div>

      {dash ? (
        <AdminSection title="시간대별 페이지뷰">
          <HourlyTrafficChart
            today={dash.hourlyToday}
            yesterday={dash.hourlyYesterday}
            avg7Day={dash.hourly7DayAvg}
            insights={dash.hourlyInsights}
          />
        </AdminSection>
      ) : null}

      <AdminSection title="방문 추이 (14일)">
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
                naverPlace: d.naverPlace,
                mobile: d.devices?.mobile,
                desktop: d.devices?.desktop,
                sources: d.sources,
              }))}
            />
            <AdminTableWrap>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>페이지뷰</th>
                  <th>세션</th>
                  <th className="admin-hide-sm">기기</th>
                  <th className="admin-hide-sm">유입 경로</th>
                  <th>CTA</th>
                  <th>제출</th>
                  <th className="admin-hide-sm">네이버</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{d.visits}</td>
                    <td>{d.sessions ?? "—"}</td>
                    <td className="admin-hide-sm">
                      {formatDeviceSplit(d.devices?.mobile, d.devices?.desktop)}
                    </td>
                    <td className="admin-hide-sm">
                      <SourceMix sources={d.sources} compact />
                    </td>
                    <td>{d.cta}</td>
                    <td>{d.consultSubmit}</td>
                    <td className="admin-hide-sm">{d.naverPlace ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </AdminTableWrap>
          </>
        )}
      </AdminSection>

      <div className="admin-two-col">
        <AdminSection title="오늘 방문 의도">
          <AdminIntentMix
            rows={intentMix}
            empty="오늘 TOP 페이지가 아직 없습니다."
          />
        </AdminSection>
        <AdminSection title="유입 Source (오늘)">
          {!dash?.sourcesToday?.length ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <AdminTableWrap>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>유입</th>
                  <th>페이지뷰</th>
                  <th>비중</th>
                </tr>
              </thead>
              <tbody>
                {withShare(dash.sourcesToday).map((s) => (
                  <tr key={s.source}>
                    <td>{getSourceLabel(s.source)}</td>
                    <td>{s.count}</td>
                    <td>{formatPercent(s.share)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </AdminTableWrap>
          )}
        </AdminSection>
      </div>

      <AdminSection title="Device (오늘)">
        {!dash?.devicesToday ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <AdminTableWrap>
          <table className="admin-table">
            <tbody>
              <tr>
                <td>모바일</td>
                <td>{dash.devicesToday.mobile}</td>
                <td>
                  {formatPercent(
                    deviceTotal
                      ? Math.round(
                          (dash.devicesToday.mobile / deviceTotal) * 1000,
                        ) / 10
                      : null,
                  )}
                </td>
              </tr>
              <tr>
                <td>PC</td>
                <td>{dash.devicesToday.desktop}</td>
                <td>
                  {formatPercent(
                    deviceTotal
                      ? Math.round(
                          (dash.devicesToday.desktop / deviceTotal) * 1000,
                        ) / 10
                      : null,
                  )}
                </td>
              </tr>
              <tr>
                <td>미확인</td>
                <td>{dash.devicesToday.unknown}</td>
                <td>
                  {formatPercent(
                    deviceTotal
                      ? Math.round(
                          (dash.devicesToday.unknown / deviceTotal) * 1000,
                        ) / 10
                      : null,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          </AdminTableWrap>
        )}
      </AdminSection>

      <AdminSection title="네이버 SmartPlace · 페이지별">
        {!dash?.naverPlaceTopPaths?.length ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <AdminTableWrap>
          <table className="admin-table">
            <thead>
              <tr>
                <th>페이지</th>
                <th>페이지뷰</th>
                <th>클릭</th>
                <th className="admin-hide-sm">예약</th>
                <th>CTR%</th>
              </tr>
            </thead>
            <tbody>
              {dash.naverPlaceTopPaths.map((r) => (
                <tr key={r.path}>
                  <td>
                    <PageIdentity path={r.path} showIntent />
                  </td>
                  <td>{r.visits}</td>
                  <td>{r.naverPlace}</td>
                  <td className="admin-hide-sm">{r.reservation}</td>
                  <td>{r.ctr ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </AdminTableWrap>
        )}
      </AdminSection>
    </div>
  );
}
