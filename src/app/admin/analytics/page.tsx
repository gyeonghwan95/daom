"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminInsightList } from "@/components/admin/AdminInsightList";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminErrorState, AdminLoading } from "@/components/admin/AdminState";
import { AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { ChannelTrendChart } from "@/components/admin/acquisition/ChannelTrendChart";
import { PortalAiGrid } from "@/components/admin/acquisition/ChannelSubBreakdown";
import { SortableTable, type SortableColumn } from "@/components/admin/acquisition/SortableTable";
import { Sparkline } from "@/components/admin/acquisition/Sparkline";
import { UtmBuilder } from "@/components/admin/acquisition/UtmBuilder";
import { WeekHourHeatmap } from "@/components/admin/acquisition/WeekHourHeatmap";
import { SourceStackBar } from "@/components/admin/charts/SourceMix";
import {
  buildAcquisitionInsights,
  buildChannelSubBreakdown,
  CHANNEL_HINTS,
  channelColor,
  channelLabel,
  contactBreakdown,
  conversionRate,
  deltaCount,
  deltaPoints,
  DETAIL_CHANNELS,
  describeReferrerHost,
  downloadCsv,
  engagementRate,
  formatCount,
  formatDecimal,
  formatRate,
  groupReferrersByLabel,
  pageLabel,
  pagesPerSession,
  ratio,
  type Delta,
  type ReferrerGroupRow,
} from "@/lib/admin/acquisition-view";
import { normalizeDisplayPath } from "@/lib/admin/url-display";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";
import type {
  AcquisitionChannelRow,
  AcquisitionMetrics,
  AcquisitionReport,
} from "@/lib/admin-ops/types";

const PERIODS: Array<{ days: number; label: string }> = [
  { days: 1, label: "오늘" },
  { days: 7, label: "7일" },
  { days: 14, label: "14일" },
  { days: 30, label: "30일" },
  { days: 90, label: "90일" },
];
const DEFAULT_DAYS = 30;
/** 비율은 이 세션 수 미만이면 "—" (1~2세션 100% 방지) */
const MIN_RATE_BASE = 5;

type ReferrerRow = AcquisitionReport["referrers"][number];
type LandingRow = AcquisitionReport["landings"][number];
type CampaignRow = AcquisitionReport["campaigns"][number];

function readQuery() {
  try {
    const q = new URLSearchParams(window.location.search);
    const n = Number(q.get("days"));
    return {
      days: PERIODS.some((p) => p.days === n) ? n : DEFAULT_DAYS,
      channel: q.get("channel"),
      landing: q.get("landing") || "",
    };
  } catch {
    return { days: DEFAULT_DAYS, channel: null as string | null, landing: "" };
  }
}

function writeQuery(days: number, channel: string | null, landing: string) {
  try {
    const q = new URLSearchParams();
    if (days !== DEFAULT_DAYS) q.set("days", String(days));
    if (channel) q.set("channel", channel);
    if (landing.trim()) q.set("landing", landing.trim());
    const qs = q.toString();
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  } catch {
    /* ignore */
  }
}

function DeltaText({ delta }: { delta: Delta }) {
  return <span className={`admin-acq-delta admin-acq-delta--${delta.direction}`}>{delta.text}</span>;
}

function Kpi({
  label,
  value,
  delta,
  note,
  spark,
  color,
}: {
  label: string;
  value: string;
  delta: Delta;
  note?: string;
  spark?: number[];
  color?: string;
}) {
  return (
    <div className="admin-metric admin-acq-kpi">
      <div className="admin-metric__label">{label}</div>
      <div className="admin-acq-kpi__row">
        <div className="admin-metric__value">{value}</div>
        {spark ? <Sparkline values={spark} color={color} /> : null}
      </div>
      <div className={`admin-metric__delta admin-metric__delta--${delta.direction}`}>{delta.text}</div>
      {note ? <div className="admin-metric__note">{note}</div> : null}
    </div>
  );
}

function ChannelName({ id, hint = false }: { id: string; hint?: boolean }) {
  return (
    <span className="admin-acq-channel">
      <i style={{ background: channelColor(id) }} aria-hidden />
      <span>
        <strong>{channelLabel(id)}</strong>
        {hint && CHANNEL_HINTS[id] ? <small>{CHANNEL_HINTS[id]}</small> : null}
      </span>
    </span>
  );
}

function ShareBar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <span className="admin-acq-share">
      <span className="admin-acq-share__num">{formatCount(value)}</span>
      <span className="admin-acq-share__track" aria-hidden>
        <span style={{ width: `${Math.max(pct, value ? 2 : 0)}%`, background: color }} />
      </span>
      <small>{total ? `${pct.toFixed(pct < 10 ? 1 : 0)}%` : ""}</small>
    </span>
  );
}

function ContactChips({ m }: { m: AcquisitionMetrics }) {
  const rows = contactBreakdown(m);
  if (!rows.length) return <span className="admin-muted">—</span>;
  return (
    <span className="admin-acq-chips">
      {rows.map((r) => (
        <span key={r.key} className={`admin-acq-chip admin-acq-chip--${r.key}`}>
          {r.label} {r.count}
        </span>
      ))}
    </span>
  );
}

function CsvButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="admin-btn admin-btn--ghost admin-acq-csv" onClick={onClick}>
      CSV
    </button>
  );
}

const rateCols = {
  engagement: <T extends AcquisitionMetrics>(): SortableColumn<T> => ({
    key: "eng",
    label: "참여율",
    title: "2페이지 이상 보거나 연락·검색·계산기 등 행동이 있었던 세션 비율",
    numeric: true,
    render: (r) => formatRate(engagementRate(r, MIN_RATE_BASE), 0),
    sortValue: (r) => engagementRate(r, MIN_RATE_BASE),
  }),
  converted: <T extends AcquisitionMetrics>(): SortableColumn<T> => ({
    key: "cv",
    label: "상담 연결",
    title: "전화·카카오톡·톡톡·예약·문의 중 하나 이상을 한 세션 수",
    numeric: true,
    render: (r) => formatCount(r.cv),
    sortValue: (r) => r.cv,
  }),
  conversion: <T extends AcquisitionMetrics>(): SortableColumn<T> => ({
    key: "cvr",
    label: "연결률",
    title: "상담 연결 세션 ÷ 진입 세션",
    numeric: true,
    render: (r) => <strong>{formatRate(conversionRate(r, MIN_RATE_BASE))}</strong>,
    sortValue: (r) => conversionRate(r, MIN_RATE_BASE),
  }),
};

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [report, setReport] = useState<AcquisitionReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState<string | null>(null);
  const [landingQuery, setLandingQuery] = useState("");
  const [referrerMode, setReferrerMode] = useState<"group" | "host">("group");
  const requestSeq = useRef(0);

  const fetchReport = useCallback(async (n: number) => {
    const seq = ++requestSeq.current;
    const res = await adminFetchJson<AcquisitionReport>(`/api/admin/acquisition?days=${n}`);
    return { res, current: seq === requestSeq.current };
  }, []);

  useEffect(() => {
    const initial = readQuery();
    setChannelFilter(initial.channel);
    setLandingQuery(initial.landing);
    void fetchReport(initial.days).then(({ res, current }) => {
      if (!current) return;
      setDays(initial.days);
      setLoading(false);
      if (res.ok) setReport(res.data);
      else setError(res.message);
    });
  }, [fetchReport]);

  const syncUrl = useCallback((n: number, channel: string | null, landing: string) => {
    writeQuery(n, channel, landing);
  }, []);

  const load = async (n: number) => {
    setDays(n);
    setLoading(true);
    syncUrl(n, channelFilter, landingQuery);
    const { res, current } = await fetchReport(n);
    if (!current) return;
    setLoading(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setError(null);
    setReport(res.data);
  };

  const applyChannelFilter = (id: string | null) => {
    setChannelFilter(id);
    syncUrl(days, id, landingQuery);
  };

  const applyLandingQuery = (value: string) => {
    setLandingQuery(value);
    syncUrl(days, channelFilter, value);
  };

  const applyInsightHref = (href: string) => {
    try {
      const q = new URL(href, window.location.origin).searchParams;
      const nextChannel = q.get("channel");
      const nextLanding = q.get("landing") || "";
      setChannelFilter(nextChannel);
      setLandingQuery(nextLanding);
      syncUrl(days, nextChannel, nextLanding);
      if (nextLanding) {
        document.getElementById("admin-acq-landings")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        document.getElementById("admin-acq-referrers")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch {
      /* ignore */
    }
  };

  const view = useMemo(() => {
    if (!report) return null;
    const external = report.channels.filter((c) => c.id !== "internal");
    const chartOrder = external.filter((c) => c.sessions > 0).map((c) => c.id);
    const series = (id: string) => report.daily.map((d) => d.byChannel[id] || 0);
    const detailPanels = DETAIL_CHANNELS.filter((id) => (external.find((c) => c.id === id)?.sessions ?? 0) > 0).map(
      (id) => ({ channelId: id, groups: buildChannelSubBreakdown(report, id) }),
    );
    return {
      external,
      chartOrder,
      series,
      insights: buildAcquisitionInsights(report, { days }),
      detailPanels,
      groupedReferrers: groupReferrersByLabel(report.referrers, channelFilter),
      maxSessions: Math.max(1, ...report.channels.map((c) => c.sessions)),
    };
  }, [report, days, channelFilter]);

  const t = report?.totals;
  const p = report?.prevTotals ?? null;

  const filteredReferrers = useMemo(() => {
    if (!report) return [];
    return channelFilter
      ? report.referrers.filter((r) => r.channel === channelFilter)
      : report.referrers;
  }, [report, channelFilter]);

  const filteredLandings = useMemo(() => {
    if (!report) return [];
    const q = landingQuery.trim().toLowerCase();
    return report.landings.filter((l) => {
      if (channelFilter && !((l.mix?.[channelFilter] ?? 0) > 0)) return false;
      if (!q) return true;
      return (
        normalizeDisplayPath(l.path).toLowerCase().includes(q) ||
        pageLabel(l.path).toLowerCase().includes(q)
      );
    });
  }, [report, channelFilter, landingQuery]);

  const groupedReferrerColumns: SortableColumn<ReferrerGroupRow>[] = [
    {
      key: "label",
      label: "유입처",
      render: (r) => (
        <span className="admin-acq-channel">
          <i style={{ background: channelColor(r.channel) }} aria-hidden />
          <span>
            <strong>{r.label}</strong>
            <small>{r.hosts.length > 1 ? `${r.hosts.length}개 호스트 합산` : r.hosts[0]}</small>
          </span>
        </span>
      ),
      sortValue: (r) => r.label,
    },
    {
      key: "s",
      label: "세션",
      numeric: true,
      render: (r) => formatCount(r.sessions),
      sortValue: (r) => r.sessions,
    },
    {
      key: "delta",
      label: "증감",
      numeric: true,
      hideSm: true,
      render: (r) =>
        r.prevSessions === 0 && r.sessions > 0 ? (
          <span className="admin-acq-badge">새 유입처</span>
        ) : (
          <DeltaText delta={deltaCount(r.sessions, r.prevSessions)} />
        ),
      sortValue: (r) => (r.prevSessions ? (r.sessions - r.prevSessions) / r.prevSessions : null),
    },
    {
      key: "eng",
      label: "참여율",
      title: "2페이지 이상 보거나 연락·검색·계산기 등 행동이 있었던 세션 비율",
      numeric: true,
      render: (r) => formatRate(engagementRate({ eng: r.eng, s: r.sessions }, MIN_RATE_BASE), 0),
      sortValue: (r) => engagementRate({ eng: r.eng, s: r.sessions }, MIN_RATE_BASE),
    },
    {
      key: "cv",
      label: "상담 연결",
      numeric: true,
      render: (r) => formatCount(r.cv),
      sortValue: (r) => r.cv,
    },
    {
      key: "cvr",
      label: "연결률",
      numeric: true,
      render: (r) => (
        <strong>{formatRate(conversionRate({ cv: r.cv, s: r.sessions }, MIN_RATE_BASE))}</strong>
      ),
      sortValue: (r) => conversionRate({ cv: r.cv, s: r.sessions }, MIN_RATE_BASE),
    },
  ];

  const channelColumns: SortableColumn<AcquisitionChannelRow>[] = view
    ? [
        {
          key: "channel",
          label: "채널",
          render: (r) => <ChannelName id={r.id} hint />,
          sortValue: (r) => channelLabel(r.id),
        },
        {
          key: "sessions",
          label: "세션",
          numeric: true,
          title: "외부에서 들어와 시작된 세션 (진입)",
          render: (r) => (
            <ShareBar value={r.sessions} total={t?.sessions || 0} color={channelColor(r.id)} />
          ),
          sortValue: (r) => r.sessions,
        },
        {
          key: "delta",
          label: "증감",
          numeric: true,
          render: (r) => <DeltaText delta={deltaCount(r.sessions, r.prevSessions)} />,
          sortValue: (r) => (r.prevSessions ? (r.sessions - r.prevSessions) / r.prevSessions : null),
        },
        {
          key: "trend",
          label: "추이",
          hideSm: true,
          render: (r) => (
            <Sparkline values={view.series(r.id)} color={channelColor(r.id)} label={`${channelLabel(r.id)} 일별 세션`} />
          ),
        },
        rateCols.engagement<AcquisitionChannelRow>(),
        {
          key: "pps",
          label: "페이지/세션",
          numeric: true,
          hideSm: true,
          render: (r) => formatDecimal(r.s >= MIN_RATE_BASE ? pagesPerSession(r) : null),
          sortValue: (r) => (r.s >= MIN_RATE_BASE ? pagesPerSession(r) : null),
        },
        {
          key: "mobile",
          label: "모바일",
          numeric: true,
          hideSm: true,
          render: (r) => formatRate(ratio(r.m, r.s, MIN_RATE_BASE), 0),
          sortValue: (r) => ratio(r.m, r.s, MIN_RATE_BASE),
        },
        rateCols.converted<AcquisitionChannelRow>(),
        rateCols.conversion<AcquisitionChannelRow>(),
        {
          key: "contacts",
          label: "연락 행동",
          hideSm: true,
          render: (r) => <ContactChips m={r} />,
          sortValue: (r) => r.contacts,
        },
      ]
    : [];

  const referrerColumns: SortableColumn<ReferrerRow>[] = [
    {
      key: "host",
      label: "유입처",
      render: (r) => {
        const d = describeReferrerHost(r.host);
        return (
          <span className="admin-acq-channel">
            <i style={{ background: channelColor(r.channel) }} aria-hidden />
            <span>
              <strong>{d.label}</strong>
              {d.known ? <small>{r.host}</small> : null}
            </span>
          </span>
        );
      },
      sortValue: (r) => describeReferrerHost(r.host).label,
    },
    {
      key: "s",
      label: "세션",
      numeric: true,
      render: (r) => formatCount(r.s),
      sortValue: (r) => r.s,
    },
    {
      key: "delta",
      label: "증감",
      numeric: true,
      hideSm: true,
      render: (r) =>
        r.prevSessions === 0 && r.s > 0 ? (
          <span className="admin-acq-badge">새 유입처</span>
        ) : (
          <DeltaText delta={deltaCount(r.s, r.prevSessions)} />
        ),
      sortValue: (r) => (r.prevSessions ? (r.s - r.prevSessions) / r.prevSessions : null),
    },
    rateCols.engagement<ReferrerRow>(),
    rateCols.converted<ReferrerRow>(),
    rateCols.conversion<ReferrerRow>(),
  ];

  const landingColumns: SortableColumn<LandingRow>[] = [
    {
      key: "path",
      label: "랜딩 페이지",
      render: (r) =>
        r.path === "(other)" ? (
          <span className="admin-muted">기타 (상한 초과 합계)</span>
        ) : (
          <PageIdentity path={r.path} showIntent />
        ),
      sortValue: (r) => pageLabel(r.path),
    },
    {
      key: "s",
      label: channelFilter ? `${channelLabel(channelFilter)} 진입` : "진입 세션",
      numeric: true,
      render: (r) =>
        channelFilter ? (
          <>
            {formatCount(r.mix?.[channelFilter] || 0)}
            <small className="admin-acq-sub"> / {formatCount(r.s)}</small>
          </>
        ) : (
          formatCount(r.s)
        ),
      sortValue: (r) => (channelFilter ? r.mix?.[channelFilter] || 0 : r.s),
    },
    {
      key: "mix",
      label: "채널 구성",
      hideSm: true,
      render: (r) => <SourceStackBar sources={r.mix} />,
    },
    rateCols.engagement<LandingRow>(),
    {
      key: "pps",
      label: "페이지/세션",
      numeric: true,
      hideSm: true,
      render: (r) => formatDecimal(r.s >= MIN_RATE_BASE ? pagesPerSession(r) : null),
      sortValue: (r) => (r.s >= MIN_RATE_BASE ? pagesPerSession(r) : null),
    },
    rateCols.converted<LandingRow>(),
    rateCols.conversion<LandingRow>(),
    {
      key: "delta",
      label: "증감",
      numeric: true,
      hideSm: true,
      render: (r) => <DeltaText delta={deltaCount(r.s, r.prevSessions)} />,
      sortValue: (r) => (r.prevSessions ? (r.s - r.prevSessions) / r.prevSessions : null),
    },
  ];

  const campaignColumns: SortableColumn<CampaignRow>[] = [
    {
      key: "source",
      label: "출처",
      render: (r) => <strong>{r.source || "—"}</strong>,
      sortValue: (r) => r.source,
    },
    { key: "medium", label: "매체", render: (r) => r.medium || "—", sortValue: (r) => r.medium },
    {
      key: "campaign",
      label: "캠페인",
      hideSm: true,
      render: (r) => r.campaign || "—",
      sortValue: (r) => r.campaign,
    },
    { key: "s", label: "세션", numeric: true, render: (r) => formatCount(r.s), sortValue: (r) => r.s },
    rateCols.engagement<CampaignRow>(),
    rateCols.converted<CampaignRow>(),
    rateCols.conversion<CampaignRow>(),
    {
      key: "contacts",
      label: "연락 행동",
      hideSm: true,
      render: (r) => <ContactChips m={r} />,
      sortValue: (r) => r.contacts,
    },
  ];

  const stamp = report ? `${report.range.start}_${report.range.end}` : "";
  const csvRate = (m: AcquisitionMetrics, kind: "eng" | "cv") => {
    const v = kind === "eng" ? engagementRate(m) : conversionRate(m);
    return v == null ? null : Number(v.toFixed(1));
  };

  const engRate = t ? ratio(t.eng, t.acqSessions) : null;
  const prevEngRate = p ? ratio(p.eng, p.acqSessions) : null;
  const cvRate = t ? ratio(t.cv, t.acqSessions) : null;
  const prevCvRate = p ? ratio(p.cv, p.acqSessions) : null;
  const coverageGap = report ? report.coverage.acqDays < report.coverage.days : false;

  return (
    <div className="admin-acq" aria-busy={loading}>
      <AdminPageHeader
        title="유입 분석"
        generatedAt={report?.generatedAt}
        onRefresh={() => void load(days)}
        refreshing={loading}
      >
        <div className="admin-acq-segment" role="group" aria-label="분석 기간">
          {PERIODS.map((period) => (
            <button
              key={period.days}
              type="button"
              aria-pressed={days === period.days}
              disabled={loading && days === period.days}
              onClick={() => void load(period.days)}
            >
              {period.label}
            </button>
          ))}
        </div>
      </AdminPageHeader>

      {report ? (
        <p className="admin-acq-range">
          <strong>
            {report.range.start === report.range.end
              ? report.range.start
              : `${report.range.start} ~ ${report.range.end}`}
          </strong>
          {report.compareRange ? (
            <span>
              {" "}
              · 비교 {report.compareRange.start === report.compareRange.end
                ? report.compareRange.start
                : `${report.compareRange.start} ~ ${report.compareRange.end}`}
            </span>
          ) : (
            <span> · 90일은 이전 기간 비교 없음</span>
          )}
        </p>
      ) : null}

      {error ? (
        <AdminErrorState message={error} onRetry={() => void load(days)} />
      ) : null}
      {report && !report.storageConfigured ? (
        <p className="admin-alert admin-alert--warning">
          ADMIN_KV가 연결되지 않아 수집 데이터가 없습니다. Cloudflare Pages 바인딩을 확인하세요.
        </p>
      ) : null}
      {report && coverageGap ? (
        <p className="admin-alert admin-alert--info">
          {report.coverage.firstAcqDate
            ? `참여율·상담 연결·유입처·랜딩·캠페인 지표는 ${report.coverage.firstAcqDate}부터 수집됩니다 (이번 기간 ${report.coverage.days}일 중 ${report.coverage.acqDays}일).`
            : "참여율·상담 연결·유입처·랜딩·캠페인 지표는 이번 업데이트 이후 방문부터 수집됩니다."}{" "}
          세션 수와 채널별 추이는 기존 데이터로 전체 기간을 보여줍니다.
        </p>
      ) : null}

      {!report && loading ? (
        <AdminLoading label="유입 데이터를 불러오는 중" />
      ) : null}

      {report && t && view ? (
        <>
          <div className="admin-metric-grid admin-acq-kpis">
            <Kpi
              label="외부 유입 세션"
              value={formatCount(t.sessions)}
              delta={deltaCount(t.sessions, p?.sessions)}
              spark={report.daily.map((d) => d.sessions)}
              color="#0f62fe"
              note={`페이지뷰 ${formatCount(t.pageViews)}`}
            />
            <Kpi
              label="참여율"
              value={formatRate(engRate)}
              delta={deltaPoints(engRate, prevEngRate)}
              note={`참여 세션 ${formatCount(t.eng)}`}
            />
            <Kpi
              label="상담 연결 세션"
              value={formatCount(t.cv)}
              delta={deltaCount(t.cv, p && p.acqSessions ? p.cv : null)}
              spark={report.daily.map((d) => d.converted ?? 0)}
              color="#15803d"
              note="전화·카카오톡·톡톡·예약·문의"
            />
            <Kpi
              label="상담 연결률"
              value={formatRate(cvRate, 2)}
              delta={deltaPoints(cvRate, prevCvRate)}
              note="연결 세션 ÷ 외부 유입 세션"
            />
            <Kpi
              label="세션당 페이지"
              value={formatDecimal(pagesPerSession({ pv: t.pv, s: t.acqSessions }))}
              delta={deltaCount(
                Number((pagesPerSession({ pv: t.pv, s: t.acqSessions }) ?? 0).toFixed(2)),
                p && p.acqSessions ? Number((p.pv / p.acqSessions).toFixed(2)) : null,
              )}
              note={`모바일 진입 ${formatRate(ratio(t.m, t.acqSessions), 0)}`}
            />
          </div>

          <div className="admin-acq-actions-row">
            <span>연락 행동 합계 {formatCount(t.contacts)}건</span>
            <ContactChips m={t} />
            {t.place ? <span className="admin-acq-chip">지도·플레이스 보기 {t.place}</span> : null}
            {t.cta ? <span className="admin-acq-chip">상담 안내 클릭 {t.cta}</span> : null}
          </div>

          <AdminSection title="한눈에 보기">
            <AdminInsightList
              insights={view.insights}
              empty="이번 기간에 눈에 띄는 변화가 없습니다. 데이터가 더 쌓이면 자동으로 요약합니다."
              onNavigate={applyInsightHref}
            />
          </AdminSection>

          <AdminSection
            title="채널 성과"
            action={
              <CsvButton
                onClick={() =>
                  downloadCsv(
                    `유입채널_${stamp}.csv`,
                    ["채널", "세션", "이전 세션", "참여율%", "상담 연결 세션", "연결률%", "전화", "카카오톡", "톡톡", "예약", "문의", "페이지뷰"],
                    report.channels.map((r) => [
                      channelLabel(r.id),
                      r.sessions,
                      r.prevSessions,
                      csvRate(r, "eng"),
                      r.cv,
                      csvRate(r, "cv"),
                      r.phone,
                      r.kakao,
                      r.talk,
                      r.reserve,
                      r.submit,
                      r.pv,
                    ]),
                  )
                }
              />
            }
          >
            <p className="admin-acq-hint">행을 누르면 아래 유입처·랜딩 표가 그 채널로 필터됩니다. 네이버·구글·AI는 아래에서 검색·블로그·엔진별로 다시 나눕니다.</p>
            <SortableTable
              label="채널별 유입 성과"
              rows={report.channels}
              columns={channelColumns}
              rowKey={(r) => r.id}
              initialSort="sessions"
              activeKey={channelFilter}
              onRowClick={(r) => applyChannelFilter(channelFilter === r.id ? null : r.id)}
            />
          </AdminSection>

          {view.detailPanels.some((p) => p.groups.length > 0) ? (
            <AdminSection title="포털·AI 세부 분석">
              <p className="admin-acq-hint">
                네이버·구글·다음·빙은 검색·블로그·지도 등으로, AI는 ChatGPT·Perplexity·Gemini 등으로 나눕니다. 모바일·PC 호스트는 같은 이름으로 합칩니다.
              </p>
              <PortalAiGrid
                panels={
                  channelFilter && DETAIL_CHANNELS.includes(channelFilter as (typeof DETAIL_CHANNELS)[number])
                    ? view.detailPanels.filter((p) => p.channelId === channelFilter)
                    : view.detailPanels
                }
              />
            </AdminSection>
          ) : null}

          <AdminSection title="일별 채널 추이">
            <ChannelTrendChart daily={report.daily} channelOrder={view.chartOrder} />
          </AdminSection>

          {channelFilter || landingQuery ? (
            <div className="admin-acq-filterbar" role="status">
              {channelFilter ? <ChannelName id={channelFilter} /> : null}
              {landingQuery ? <span>랜딩 검색: {landingQuery}</span> : null}
              <span>필터 중</span>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => {
                  applyChannelFilter(null);
                  applyLandingQuery("");
                }}
              >
                필터 해제
              </button>
            </div>
          ) : null}

          <div className="admin-acq-split" id="admin-acq-referrers">
            <AdminSection
              title="세부 유입처"
              action={
                <div className="admin-acq-section-actions">
                  <div className="admin-acq-segment" role="group" aria-label="유입처 묶음 방식">
                    <button
                      type="button"
                      aria-pressed={referrerMode === "group"}
                      onClick={() => setReferrerMode("group")}
                    >
                      이름별
                    </button>
                    <button
                      type="button"
                      aria-pressed={referrerMode === "host"}
                      onClick={() => setReferrerMode("host")}
                    >
                      호스트별
                    </button>
                  </div>
                  <CsvButton
                    onClick={() =>
                      referrerMode === "group"
                        ? downloadCsv(
                            `유입처_이름별_${stamp}.csv`,
                            ["유입처", "채널", "세션", "이전 세션", "참여율%", "상담 연결 세션", "연결률%", "호스트"],
                            view.groupedReferrers.map((r) => [
                              r.label,
                              channelLabel(r.channel),
                              r.sessions,
                              r.prevSessions,
                              engagementRate({ eng: r.eng, s: r.sessions }),
                              r.cv,
                              conversionRate({ cv: r.cv, s: r.sessions }),
                              r.hosts.join(" "),
                            ]),
                          )
                        : downloadCsv(
                            `유입처_호스트별_${stamp}.csv`,
                            ["유입처", "호스트", "채널", "세션", "이전 세션", "참여율%", "상담 연결 세션", "연결률%"],
                            filteredReferrers.map((r) => [
                              describeReferrerHost(r.host).label,
                              r.host,
                              channelLabel(r.channel),
                              r.s,
                              r.prevSessions,
                              csvRate(r, "eng"),
                              r.cv,
                              csvRate(r, "cv"),
                            ]),
                          )
                    }
                  />
                </div>
              }
            >
              {referrerMode === "group" ? (
                <SortableTable
                  label="이름별 유입처 세션"
                  rows={view.groupedReferrers}
                  columns={groupedReferrerColumns}
                  rowKey={(r) => `${r.channel}::${r.label}`}
                  initialSort="s"
                  pageSize={12}
                  empty={
                    channelFilter === "direct" || channelFilter === "campaign"
                      ? "직접 방문·캠페인은 referrer 호스트가 없습니다. 캠페인 표를 보세요."
                      : "외부 링크 유입이 아직 없습니다."
                  }
                />
              ) : (
                <SortableTable
                  label="호스트별 유입처 세션"
                  rows={filteredReferrers}
                  columns={referrerColumns}
                  rowKey={(r) => r.key}
                  initialSort="s"
                  pageSize={12}
                  empty={
                    channelFilter === "direct" || channelFilter === "campaign"
                      ? "직접 방문·캠페인은 referrer 호스트가 없습니다. 캠페인 표를 보세요."
                      : "외부 링크 유입이 아직 없습니다."
                  }
                />
              )}
            </AdminSection>

            <AdminSection title="요일·시간대 유입">
              <WeekHourHeatmap grid={report.weekHour} />
            </AdminSection>
          </div>

          <AdminSection
            title="랜딩 페이지"
            action={
              <CsvButton
                onClick={() =>
                  downloadCsv(
                    `랜딩페이지_${stamp}.csv`,
                    ["페이지", "경로", "진입 세션", "이전 세션", "참여율%", "상담 연결 세션", "연결률%", "페이지뷰"],
                    filteredLandings.map((r) => [
                      pageLabel(r.path),
                      normalizeDisplayPath(r.path),
                      r.s,
                      r.prevSessions,
                      csvRate(r, "eng"),
                      r.cv,
                      csvRate(r, "cv"),
                      r.pv,
                    ]),
                  )
                }
              />
            }
          >
            <div className="admin-acq-toolbar" id="admin-acq-landings">
              <input
                type="search"
                className="admin-input"
                placeholder="페이지 이름·경로 검색"
                value={landingQuery}
                onChange={(e) => applyLandingQuery(e.target.value)}
                aria-label="랜딩 페이지 검색"
              />
              <span className="admin-acq-hint">
                방문자가 사이트에 처음 들어온 페이지입니다. 참여율·연결률은 그 페이지로 시작한 세션 전체 기준.
              </span>
            </div>
            <SortableTable
              label="랜딩 페이지별 성과"
              rows={filteredLandings}
              columns={landingColumns}
              rowKey={(r) => r.key}
              initialSort="s"
              pageSize={20}
              empty={landingQuery ? "검색 결과가 없습니다." : "랜딩 데이터가 아직 없습니다."}
            />
          </AdminSection>

          <AdminSection
            title="캠페인 (UTM)"
            action={
              report.campaigns.length ? (
                <CsvButton
                  onClick={() =>
                    downloadCsv(
                      `캠페인_${stamp}.csv`,
                      ["출처", "매체", "캠페인", "세션", "참여율%", "상담 연결 세션", "연결률%"],
                      report.campaigns.map((r) => [
                        r.source,
                        r.medium,
                        r.campaign,
                        r.s,
                        csvRate(r, "eng"),
                        r.cv,
                        csvRate(r, "cv"),
                      ]),
                    )
                  }
                />
              ) : undefined
            }
          >
            <SortableTable
              label="UTM 캠페인별 성과"
              rows={report.campaigns}
              columns={campaignColumns}
              rowKey={(r) => r.key}
              initialSort="s"
              empty="UTM 링크로 들어온 방문이 아직 없습니다. 아래 생성기로 블로그·QR·문자용 링크를 만들어 쓰세요."
            />
            <details className="admin-acq-details" open={!report.campaigns.length}>
              <summary>추적 링크 만들기</summary>
              <UtmBuilder
                suggestedPaths={report.landings
                  .filter((l) => l.path !== "(other)")
                  .slice(0, 30)
                  .map((l) => normalizeDisplayPath(l.path))}
              />
            </details>
          </AdminSection>

          <AdminSection title="측정 기준">
            <dl className="admin-acq-glossary">
              <div>
                <dt>세션</dt>
                <dd>같은 탭에서 30분 안에 이어진 방문. 첫 페이지의 referrer로 채널을 정합니다.</dd>
              </div>
              <div>
                <dt>채널</dt>
                <dd>
                  네이버·구글·다음·빙·AI·SNS·외부·캠페인·직접·내부. AI는 ChatGPT·Perplexity·Gemini·Claude·Copilot·뤼튼 등을 묶습니다.
                </dd>
              </div>
              <div>
                <dt>포털·AI 세부</dt>
                <dd>
                  같은 이름(예: 네이버 검색)의 모바일·PC 호스트를 합칩니다. 검색·블로그·지도·AI 엔진별 비중과 연결률을 봅니다.
                </dd>
              </div>
              <div>
                <dt>참여 세션</dt>
                <dd>2페이지 이상 보거나 연락·검색·계산기·자가진단 중 하나를 한 세션.</dd>
              </div>
              <div>
                <dt>상담 연결</dt>
                <dd>전화·카카오톡·네이버 톡톡·네이버 예약·문의 제출 중 하나 이상. 세션당 1회로 셉니다.</dd>
              </div>
              <div>
                <dt>제외</dt>
                <dd>관리자 로그인 세션, 검색 로봇, /admin·/api 경로. 고유 방문자(사람 수)는 저장하지 않습니다.</dd>
              </div>
              <div>
                <dt>검색어</dt>
                <dd>
                  브라우저가 검색어를 넘기지 않아 이 화면에는 없습니다. Google Search Console·네이버
                  서치어드바이저에서 확인하세요.
                </dd>
              </div>
            </dl>
          </AdminSection>
        </>
      ) : null}
    </div>
  );
}
