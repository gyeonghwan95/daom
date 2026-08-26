"use client";

import { useEffect, useRef, useState } from "react";
import { ChartTooltip } from "@/components/admin/charts/ChartTooltip";
import { addKstDays, formatKstDate } from "@/lib/admin-ops/utils";

export type ActivityDayCount = {
  date: string;
  count: number;
};

export function buildActivityByDay(
  items: Array<{ at: string }> | null | undefined,
): ActivityDayCount[] {
  const counts = new Map<string, number>();
  for (const item of items || []) {
    const t = Date.parse(item.at);
    if (Number.isNaN(t)) continue;
    const day = formatKstDate(new Date(t));
    counts.set(day, (counts.get(day) || 0) + 1);
  }
  if (counts.size === 0) return [];

  const dates = [...counts.keys()].sort();
  let start = dates[0]!;
  const end = formatKstDate();
  const yday = addKstDays(end, -1);
  if (start > yday) start = yday;
  const out: ActivityDayCount[] = [];
  let cursor = start;
  while (cursor <= end) {
    out.push({ date: cursor, count: counts.get(cursor) || 0 });
    cursor = addKstDays(cursor, 1);
    if (out.length > 31) break;
  }
  return out;
}

function clampTip(x: number, y: number, host: DOMRect) {
  return {
    x: Math.min(Math.max(8, x), Math.max(8, host.width - 220)),
    y: Math.min(Math.max(8, y - 8), Math.max(8, host.height - 12)),
  };
}

function shortDate(date: string) {
  const parts = date.split("-");
  return `${Number(parts[1])}.${Number(parts[2])}`;
}

export function ActivityByDayChart({ days }: { days: ActivityDayCount[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{
    index: number;
    x: number;
    y: number;
    pinned: boolean;
  } | null>(null);

  useEffect(() => {
    if (!tip?.pinned) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTip(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tip?.pinned]);

  if (!days.length) return null;

  const today = formatKstDate();
  const yesterday = addKstDays(today, -1);
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const todayCount = days.find((d) => d.date === today)?.count ?? 0;
  const yesterdayCount = days.find((d) => d.date === yesterday)?.count ?? 0;
  const active = tip ? days[tip.index] : null;

  const moveTip = (index: number, clientX: number, clientY: number, pin?: boolean) => {
    const host = hostRef.current?.getBoundingClientRect();
    if (!host) return;
    const pos = clampTip(clientX - host.left + 12, clientY - host.top, host);
    setTip((prev) => {
      if (pin) {
        if (prev?.pinned && prev.index === index) return null;
        return { index, x: pos.x, y: pos.y, pinned: true };
      }
      if (prev?.pinned) {
        return prev.index === index ? { ...prev, x: pos.x, y: pos.y } : prev;
      }
      return { index, x: pos.x, y: pos.y, pinned: false };
    });
  };

  return (
    <div
      className="admin-activity-chart"
      ref={hostRef}
      onMouseLeave={() => setTip((prev) => (prev?.pinned ? prev : null))}
    >
      <div className="admin-hourly__legend">
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--today" /> 오늘 {todayCount}건
        </span>
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--yesterday" /> 어제 {yesterdayCount}건
        </span>
        <span className="admin-hourly__hint">최근 기록 {total}건 · 날짜별 CTA·검색·문의 등</span>
      </div>
      <div
        className="admin-activity-chart__bars"
        role="img"
        aria-label="날짜별 최근 액티비티 건수"
        style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
      >
        {days.map((day, index) => {
          const h = Math.max(day.count > 0 ? 8 : 0, Math.round((day.count / max) * 100));
          const isToday = day.date === today;
          const isActive = tip?.index === index;
          return (
            <button
              key={day.date}
              type="button"
              className={`admin-activity-chart__col${isToday ? " is-today" : ""}${isActive ? " is-active" : ""}`}
              onMouseEnter={(event) => moveTip(index, event.clientX, event.clientY)}
              onMouseMove={(event) => moveTip(index, event.clientX, event.clientY)}
              onClick={(event) => moveTip(index, event.clientX, event.clientY, true)}
            >
              <span className="admin-activity-chart__value">
                {day.count > 0 ? day.count : ""}
              </span>
              <div
                className={`admin-activity-chart__bar${isToday ? " is-today" : ""}`}
                style={{ height: `${h}%` }}
              />
              <span className="admin-activity-chart__tick">{shortDate(day.date)}</span>
            </button>
          );
        })}
      </div>
      <ChartTooltip
        open={Boolean(active && tip)}
        pinned={Boolean(tip?.pinned)}
        title={active?.date === today ? `${active?.date} (오늘)` : active?.date ?? ""}
        x={tip?.x ?? 0}
        y={tip?.y ?? 0}
        rows={
          active
            ? [{ label: "액티비티", value: `${active.count}건` }]
            : []
        }
      />
    </div>
  );
}
