"use client";

import { useEffect, useRef, useState } from "react";
import { ChartTooltip } from "@/components/admin/charts/ChartTooltip";
import { SourceMix, SourceStackBar } from "@/components/admin/charts/SourceMix";
import { formatDeviceSplit } from "@/lib/admin/device-label";
import { rankSources, type SourceCounts } from "@/lib/admin/source-breakdown";

export type DailyTrendRow = {
  date: string;
  visits: number;
  sessions?: number;
  cta?: number;
  submits?: number;
  naverPlace?: number;
  mobile?: number;
  desktop?: number;
  sources?: SourceCounts;
};

function clampTip(x: number, y: number, host: DOMRect) {
  return {
    x: Math.min(Math.max(8, x), Math.max(8, host.width - 220)),
    y: Math.min(Math.max(8, y - 8), Math.max(8, host.height - 12)),
  };
}

export function DailyTrendChart({ days }: { days: DailyTrendRow[] }) {
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

  if (!days.length) {
    return <p className="admin-empty">아직 측정되지 않음</p>;
  }

  const w = 640;
  const h = 180;
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const max = Math.max(
    1,
    ...days.map((d) => Math.max(d.visits, d.sessions || 0, d.cta || 0)),
  );
  const x = (i: number) =>
    pad.l + (days.length === 1 ? innerW / 2 : (i / (days.length - 1)) * innerW);
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;

  const line = (key: "visits" | "sessions" | "cta") =>
    days
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(Number(d[key] || 0)).toFixed(1)}`,
      )
      .join(" ");

  const area = days
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.visits).toFixed(1)}`)
    .concat(
      `L ${x(days.length - 1).toFixed(1)} ${y(0).toFixed(1)} L ${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`,
    )
    .join(" ");

  const hasSources = days.some((d) => Object.keys(d.sources || {}).length > 0);
  const active = tip ? days[tip.index] : null;
  const sourceRows = active ? rankSources(active.sources) : [];

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
      className="admin-trend"
      ref={hostRef}
      onMouseLeave={() => {
        setTip((prev) => (prev?.pinned ? prev : null));
      }}
    >
      <div className="admin-hourly__legend">
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--today" /> 페이지뷰
        </span>
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--session" /> 세션
        </span>
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--cta" /> CTA
        </span>
        {hasSources ? (
          <span className="admin-hourly__hint">점·막대에 올리면 유입 경로가 보입니다</span>
        ) : (
          <span className="admin-hourly__hint">점에 마우스를 올리거나 클릭하세요</span>
        )}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="admin-trend__svg" role="img" aria-label="일별 추이">
        {[0, 0.5, 1].map((t) => {
          const yy = pad.t + innerH * (1 - t);
          return (
            <g key={t}>
              <line x1={pad.l} x2={w - pad.r} y1={yy} y2={yy} className="admin-trend__grid" />
              <text x={4} y={yy + 4} className="admin-trend__axis">
                {Math.round(max * t)}
              </text>
            </g>
          );
        })}
        <path d={area} className="admin-trend__area" />
        <path d={line("visits")} className="admin-trend__line admin-trend__line--visits" />
        <path d={line("sessions")} className="admin-trend__line admin-trend__line--sessions" />
        <path d={line("cta")} className="admin-trend__line admin-trend__line--cta" />
        {days.map((d, i) => (
          <g key={d.date}>
            <circle
              cx={x(i)}
              cy={y(d.visits)}
              r={tip?.index === i ? 5 : 3}
              className={`admin-trend__dot${tip?.index === i ? " is-active" : ""}`}
            />
            <text x={x(i)} y={h - 8} textAnchor="middle" className="admin-trend__tick">
              {d.date.slice(5)}
            </text>
            <rect
              x={x(i) - (days.length === 1 ? innerW / 2 : innerW / days.length / 2)}
              y={pad.t}
              width={days.length === 1 ? innerW : innerW / days.length}
              height={innerH + 12}
              className="admin-trend__hit"
              onMouseEnter={(event) => moveTip(i, event.clientX, event.clientY)}
              onMouseMove={(event) => moveTip(i, event.clientX, event.clientY)}
              onClick={(event) => {
                event.preventDefault();
                moveTip(i, event.clientX, event.clientY, true);
              }}
            />
          </g>
        ))}
      </svg>

      <div className="admin-source-stack" aria-label="일자별 유입 경로">
        {days.map((d, i) => (
          <button
            key={d.date}
            type="button"
            className={`admin-source-stack__col${tip?.index === i ? " is-active" : ""}`}
            onMouseEnter={(event) => moveTip(i, event.clientX, event.clientY)}
            onClick={(event) => moveTip(i, event.clientX, event.clientY, true)}
          >
            <SourceStackBar sources={d.sources} />
            <span>{d.date.slice(5)}</span>
          </button>
        ))}
      </div>

      <ChartTooltip
        open={Boolean(active && tip)}
        pinned={Boolean(tip?.pinned)}
        title={active?.date ?? ""}
        x={tip?.x ?? 0}
        y={tip?.y ?? 0}
        rows={
          active
            ? [
                { label: "페이지뷰", value: String(active.visits) },
                { label: "세션", value: active.sessions == null ? "—" : String(active.sessions) },
                { label: "CTA", value: String(active.cta ?? 0) },
                { label: "제출", value: String(active.submits ?? 0) },
                { label: "네이버", value: String(active.naverPlace ?? 0) },
                {
                  label: "기기",
                  value: formatDeviceSplit(active.mobile, active.desktop),
                },
              ]
            : []
        }
        extra={
          sourceRows.length ? (
            <div className="admin-chart-tip__sources">
              <p>유입 경로</p>
              <SourceMix sources={active?.sources} />
            </div>
          ) : (
            <p className="admin-chart-tip__empty">이 날짜의 유입 경로 집계가 없습니다.</p>
          )
        }
      />
    </div>
  );
}
