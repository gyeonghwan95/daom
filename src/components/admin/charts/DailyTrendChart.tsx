"use client";

type DayRow = {
  date: string;
  visits: number;
  sessions?: number;
  cta?: number;
  submits?: number;
};

export function DailyTrendChart({ days }: { days: DayRow[] }) {
  if (!days.length) {
    return <p className="admin-empty">아직 측정되지 않음</p>;
  }

  const w = 640;
  const h = 180;
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const max = Math.max(1, ...days.map((d) => Math.max(d.visits, d.sessions || 0, d.cta || 0)));
  const x = (i: number) => pad.l + (days.length === 1 ? innerW / 2 : (i / (days.length - 1)) * innerW);
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;

  const line = (key: "visits" | "sessions" | "cta") =>
    days
      .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(Number(d[key] || 0)).toFixed(1)}`)
      .join(" ");

  const area = days
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.visits).toFixed(1)}`)
    .concat(`L ${x(days.length - 1).toFixed(1)} ${y(0).toFixed(1)} L ${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`)
    .join(" ");

  return (
    <div className="admin-trend">
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
            <circle cx={x(i)} cy={y(d.visits)} r="3" className="admin-trend__dot" />
            <text x={x(i)} y={h - 8} textAnchor="middle" className="admin-trend__tick">
              {d.date.slice(5)}
            </text>
            <title>
              {d.date} · 페이지뷰 {d.visits} · 세션 {d.sessions ?? "—"} · CTA {d.cta ?? 0}
            </title>
          </g>
        ))}
      </svg>
    </div>
  );
}
