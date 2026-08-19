"use client";

import { useEffect, useRef, useState } from "react";
import { ChartTooltip } from "@/components/admin/charts/ChartTooltip";
import { SourceMix } from "@/components/admin/charts/SourceMix";
import { rankSources, type SourceCounts } from "@/lib/admin/source-breakdown";

type HourRow = {
  hour: number;
  pageViews: number;
  cta?: number;
  consultSubmit?: number;
  naverPlace?: number;
  sources?: SourceCounts;
};

type Props = {
  today: HourRow[] | null | undefined;
  avg7Day: HourRow[] | null | undefined;
  insights?: {
    peakHourToday: number | null;
    peakViewsToday: number;
    peakHour7DayAvg: number | null;
    visitsSameHourVs7DayAvgPct: number | null;
  } | null;
};

function padHours(rows: HourRow[] | null | undefined): HourRow[] {
  const map = new Map((rows || []).map((r) => [r.hour, r]));
  return Array.from({ length: 24 }, (_, hour) => {
    const row = map.get(hour);
    return {
      hour,
      pageViews: row?.pageViews ?? 0,
      cta: row?.cta ?? 0,
      consultSubmit: row?.consultSubmit ?? 0,
      naverPlace: row?.naverPlace ?? 0,
      sources: row?.sources,
    };
  });
}

function clampTip(x: number, y: number, host: DOMRect) {
  return {
    x: Math.min(Math.max(8, x), Math.max(8, host.width - 220)),
    y: Math.min(Math.max(8, y - 8), Math.max(8, host.height - 12)),
  };
}

export function HourlyTrafficChart({ today, avg7Day, insights }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{
    hour: number;
    x: number;
    y: number;
    pinned: boolean;
  } | null>(null);

  const rows = padHours(today);
  const avgRows = padHours(avg7Day);
  const hasAny = rows.some((r) => r.pageViews > 0);

  useEffect(() => {
    if (!tip?.pinned) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTip(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tip?.pinned]);

  if (!hasAny) {
    return (
      <p className="admin-empty">오늘 수집된 시간대별 페이지뷰 데이터가 아직 없습니다.</p>
    );
  }

  const max = Math.max(
    1,
    ...rows.map((r) => r.pageViews),
    ...avgRows.map((r) => r.pageViews),
  );

  const nowHour =
    Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        hourCycle: "h23",
      })
        .format(new Date())
        .replace(/\D/g, ""),
    ) % 24;

  const active = tip ? rows.find((r) => r.hour === tip.hour) : null;
  const avgActive = tip
    ? avgRows.find((r) => r.hour === tip.hour)?.pageViews ?? 0
    : 0;
  const sourceRows = active ? rankSources(active.sources) : [];

  const moveTip = (hour: number, clientX: number, clientY: number, pin?: boolean) => {
    const host = hostRef.current?.getBoundingClientRect();
    if (!host) return;
    const pos = clampTip(clientX - host.left + 12, clientY - host.top, host);
    setTip((prev) => {
      if (pin) {
        if (prev?.pinned && prev.hour === hour) return null;
        return { hour, x: pos.x, y: pos.y, pinned: true };
      }
      if (prev?.pinned) {
        return prev.hour === hour ? { ...prev, x: pos.x, y: pos.y } : prev;
      }
      return { hour, x: pos.x, y: pos.y, pinned: false };
    });
  };

  return (
    <div
      className="admin-hourly"
      ref={hostRef}
      onMouseLeave={() => setTip((prev) => (prev?.pinned ? prev : null))}
    >
      <div className="admin-hourly__legend">
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--today" /> 오늘
        </span>
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--avg" /> 7일 평균
        </span>
        <span className="admin-hourly__hint">막대에 올리거나 클릭하면 상세가 보입니다</span>
      </div>
      <div className="admin-hourly__chart" role="img" aria-label="시간대별 페이지뷰">
        {rows.map((row) => {
          const avg = avgRows.find((x) => x.hour === row.hour)?.pageViews ?? 0;
          const hToday = Math.max(row.pageViews > 0 ? 6 : 0, Math.round((row.pageViews / max) * 100));
          const hAvg = Math.max(avg > 0 ? 4 : 0, Math.round((avg / max) * 100));
          const showTick = row.hour % 2 === 0;
          const isNow = row.hour === nowHour;
          const isActive = tip?.hour === row.hour;
          return (
            <button
              key={row.hour}
              type="button"
              className={`admin-hourly__col${isNow ? " is-now" : ""}${isActive ? " is-active" : ""}`}
              onMouseEnter={(event) => moveTip(row.hour, event.clientX, event.clientY)}
              onMouseMove={(event) => moveTip(row.hour, event.clientX, event.clientY)}
              onClick={(event) => moveTip(row.hour, event.clientX, event.clientY, true)}
            >
              <div className="admin-hourly__bars">
                <div
                  className="admin-hourly__bar admin-hourly__bar--avg"
                  style={{ height: `${hAvg}%` }}
                />
                <div
                  className="admin-hourly__bar admin-hourly__bar--today"
                  style={{ height: `${hToday}%` }}
                />
              </div>
              <span className="admin-hourly__tick">
                {showTick ? String(row.hour).padStart(2, "0") : ""}
              </span>
            </button>
          );
        })}
      </div>
      {insights ? (
        <ul className="admin-hourly__insights">
          {insights.peakHourToday != null ? (
            <li>
              오늘 피크: {String(insights.peakHourToday).padStart(2, "0")}시 (
              {insights.peakViewsToday}회)
            </li>
          ) : null}
          {insights.peakHour7DayAvg != null ? (
            <li>
              7일 평균 피크: {String(insights.peakHour7DayAvg).padStart(2, "0")}시
            </li>
          ) : null}
          {insights.visitsSameHourVs7DayAvgPct != null ? (
            <li>
              현재 시각까지: 7일 동일시간 대비{" "}
              {insights.visitsSameHourVs7DayAvgPct > 0 ? "+" : ""}
              {insights.visitsSameHourVs7DayAvgPct}%
            </li>
          ) : (
            <li>현재 시각까지 7일 비교: 비교 데이터 부족</li>
          )}
        </ul>
      ) : null}
      <table className="admin-hourly__table admin-sr-table">
        <caption>시간대별 페이지뷰 (차트 대체 데이터)</caption>
        <thead>
          <tr>
            <th>시</th>
            <th>오늘</th>
            <th>7일 평균</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.hour}>
              <td>{row.hour}</td>
              <td>{row.pageViews}</td>
              <td>{avgRows.find((x) => x.hour === row.hour)?.pageViews ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ChartTooltip
        open={Boolean(active && tip)}
        pinned={Boolean(tip?.pinned)}
        title={`${String(active?.hour ?? 0).padStart(2, "0")}시`}
        x={tip?.x ?? 0}
        y={tip?.y ?? 0}
        rows={
          active
            ? [
                { label: "오늘 페이지뷰", value: `${active.pageViews}회` },
                { label: "7일 평균", value: `${avgActive}회` },
                { label: "CTA", value: String(active.cta ?? 0) },
                { label: "제출", value: String(active.consultSubmit ?? 0) },
                { label: "네이버", value: String(active.naverPlace ?? 0) },
              ]
            : []
        }
        extra={
          sourceRows.length ? (
            <div className="admin-chart-tip__sources">
              <p>이 시간 유입 경로</p>
              <SourceMix sources={active?.sources} />
            </div>
          ) : (
            <p className="admin-chart-tip__empty">
              시간대별 유입 경로는 이번 개선 이후 페이지뷰부터 쌓입니다.
            </p>
          )
        }
      />
    </div>
  );
}
