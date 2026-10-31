"use client";

export function Sparkline({
  values,
  color = "#0f172a",
  width = 72,
  height = 22,
  label,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  label?: string;
}) {
  if (values.length < 2 || values.every((v) => v === 0)) {
    return <span className="admin-acq-spark is-empty" aria-hidden />;
  }
  const max = Math.max(...values, 1);
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => `${(i * step).toFixed(1)},${(height - 2 - (v / max) * (height - 4)).toFixed(1)}`)
    .join(" ");
  return (
    <svg
      className="admin-acq-spark"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        fill={color}
        opacity={0.12}
        stroke="none"
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}
