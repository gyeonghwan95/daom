"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { channelColor, channelLabel } from "@/lib/admin/acquisition-view";
import type { AcquisitionReport } from "@/lib/admin-ops/types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
/** viewBox를 실제 폭에 맞춰 축 글자가 모바일에서 줄어들지 않게 한다. */
const DEFAULT_W = 720;
const MIN_W = 300;
const H = 230;
/** t: 막대 위에 상담 연결 점을 둘 여백 */
const PAD = { l: 40, r: 8, t: 22, b: 28 };
const CONTACT_ROW_Y = 8;

function weekday(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

function niceMax(v: number) {
  if (v <= 5) return 5;
  const mag = 10 ** Math.floor(Math.log10(v));
  const n = v / mag;
  return (n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag;
}

export function ChannelTrendChart({
  daily,
  channelOrder,
}: {
  daily: AcquisitionReport["daily"];
  channelOrder: string[];
}) {
  const [mode, setMode] = useState<"count" | "share">("count");
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState<number | null>(null);
  const [W, setW] = useState(DEFAULT_W);
  const plotRef = useRef<HTMLDivElement>(null);
  const hasData = daily.length > 0 && channelOrder.length > 0;

  useEffect(() => {
    const el = plotRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width || DEFAULT_W);
      setW(Math.max(MIN_W, width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasData]);

  const visible = useMemo(
    () => channelOrder.filter((id) => !hidden.has(id)),
    [channelOrder, hidden],
  );

  const stacks = useMemo(
    () =>
      daily.map((day) => {
        const total = visible.reduce((sum, id) => sum + (day.byChannel[id] || 0), 0);
        let acc = 0;
        const parts = visible.map((id) => {
          const raw = day.byChannel[id] || 0;
          const value = mode === "share" ? (total ? (raw / total) * 100 : 0) : raw;
          const part = { id, raw, from: acc, to: acc + value };
          acc += value;
          return part;
        });
        return { day, total, parts };
      }),
    [daily, visible, mode],
  );

  if (!hasData) {
    return <p className="admin-empty admin-acq-empty">아직 측정되지 않음</p>;
  }

  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const max = mode === "share" ? 100 : niceMax(Math.max(1, ...stacks.map((s) => s.total)));
  const slot = innerW / daily.length;
  const barW = Math.max(2, Math.min(28, slot * 0.72));
  const y = (v: number) => PAD.t + innerH - (v / max) * innerH;
  const labelEvery = Math.max(1, Math.ceil(daily.length / Math.max(3, Math.floor(innerW / 90))));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const current = active != null ? stacks[active] : null;
  // 오른쪽 절반의 막대는 툴팁을 왼쪽에 띄워 막대를 가리지 않게 한다.
  const activePct = active != null ? ((PAD.l + slot * active + slot / 2) / W) * 100 : 0;
  const tipStyle =
    activePct > 55
      ? { right: `${Math.max(0, 100 - activePct + 1.5)}%` }
      : { left: `${Math.min(70, activePct + 1.5)}%` };
  const grandTotal = stacks.reduce((sum, s) => sum + s.total, 0);

  const toggle = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (channelOrder.length - next.size > 1) next.add(id);
      return next;
    });

  return (
    <div className="admin-acq-chart">
      <div className="admin-acq-chart__toolbar">
        <div className="admin-acq-legend" role="group" aria-label="표시할 채널">
          {channelOrder.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={!hidden.has(id)}
              className={hidden.has(id) ? "is-off" : undefined}
              onClick={() => toggle(id)}
            >
              <i style={{ background: channelColor(id) }} />
              {channelLabel(id)}
            </button>
          ))}
        </div>
        <div className="admin-acq-segment" role="group" aria-label="표시 방식">
          <button type="button" aria-pressed={mode === "count"} onClick={() => setMode("count")}>
            세션 수
          </button>
          <button type="button" aria-pressed={mode === "share"} onClick={() => setMode("share")}>
            구성비
          </button>
        </div>
      </div>

      <div className="admin-acq-chart__plot" ref={plotRef} onMouseLeave={() => setActive(null)}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="admin-acq-chart__svg"
          role="img"
          aria-label={`일별 외부 유입 세션 ${daily.length}일, 합계 ${grandTotal.toLocaleString("ko-KR")}세션`}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="admin-acq-chart__grid" />
              <text x={PAD.l - 6} y={y(t) + 3} textAnchor="end" className="admin-acq-chart__tick">
                {mode === "share" ? `${Math.round(t)}%` : Math.round(t).toLocaleString("ko-KR")}
              </text>
            </g>
          ))}
          {stacks.map((stack, i) => {
            const cx = PAD.l + slot * i + slot / 2;
            return (
              <g key={stack.day.date} opacity={active == null || active === i ? 1 : 0.45}>
                {stack.parts.map((p) =>
                  p.to > p.from ? (
                    <rect
                      key={p.id}
                      x={cx - barW / 2}
                      width={barW}
                      y={y(p.to)}
                      height={Math.max(0, y(p.from) - y(p.to))}
                      fill={channelColor(p.id)}
                    />
                  ) : null,
                )}
                {!stack.day.hasAcq ? null : stack.day.contacts ? (
                  <circle
                    cx={cx}
                    cy={CONTACT_ROW_Y}
                    r={Math.min(4, 1.6 + stack.day.contacts * 0.4)}
                    className="admin-acq-chart__contact"
                  />
                ) : null}
                {i % labelEvery === 0 || i === stacks.length - 1 ? (
                  <text x={cx} y={H - 9} textAnchor="middle" className="admin-acq-chart__tick">
                    {stack.day.date.slice(5).replace("-", ".")}
                  </text>
                ) : null}
                <rect
                  x={PAD.l + slot * i}
                  y={0}
                  width={slot}
                  height={PAD.t + innerH}
                  fill="transparent"
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActive(i);
                  }}
                  onClick={(event) => {
                    // 마우스는 호버로 이미 열려 있으므로 클릭은 터치·펜 탭에만 토글로 쓴다.
                    if ((event.nativeEvent as PointerEvent).pointerType === "mouse") return;
                    setActive((prev) => (prev === i ? null : i));
                  }}
                />
              </g>
            );
          })}
        </svg>

        {current ? (
          <div className="admin-acq-tip" style={tipStyle} role="status">
            <strong>
              {current.day.date} ({weekday(current.day.date)})
            </strong>
            <span className="admin-acq-tip__total">
              외부 유입 {current.total.toLocaleString("ko-KR")}세션 · 페이지뷰{" "}
              {current.day.pageViews.toLocaleString("ko-KR")}
            </span>
            <ul>
              {[...current.parts]
                .filter((p) => p.raw > 0)
                .sort((a, b) => b.raw - a.raw)
                .map((p) => (
                  <li key={p.id}>
                    <i style={{ background: channelColor(p.id) }} />
                    <span>{channelLabel(p.id)}</span>
                    <b>{p.raw.toLocaleString("ko-KR")}</b>
                    <small>{current.total ? `${Math.round((p.raw / current.total) * 100)}%` : ""}</small>
                  </li>
                ))}
            </ul>
            {current.day.hasAcq ? (
              <span className="admin-acq-tip__foot">
                상담 연결 행동 {current.day.contacts ?? 0}건 · 연결 세션 {current.day.converted ?? 0}
              </span>
            ) : (
              <span className="admin-acq-tip__foot">전환 지표 수집 전 날짜</span>
            )}
          </div>
        ) : null}
      </div>
      <p className="admin-acq-chart__note">
        막대 = 외부 유입 세션(채널별) · 위쪽 점 = 그날 상담 연결 행동(전화·카카오·톡톡·예약·문의)
      </p>
    </div>
  );
}
