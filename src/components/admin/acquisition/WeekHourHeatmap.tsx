"use client";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21];

export function WeekHourHeatmap({ grid }: { grid: number[][] }) {
  const max = Math.max(0, ...grid.flat());
  if (!max) return <p className="admin-empty admin-acq-empty">시간대 데이터가 아직 없습니다.</p>;

  let peak = { d: 0, h: 0, v: 0 };
  grid.forEach((row, d) =>
    row.forEach((v, h) => {
      if (v > peak.v) peak = { d, h, v };
    }),
  );
  const dayTotals = grid.map((row) => row.reduce((s, v) => s + v, 0));
  const busiestDay = dayTotals.indexOf(Math.max(...dayTotals));
  const hourTotals = Array.from({ length: 24 }, (_, h) => grid.reduce((s, row) => s + row[h], 0));
  const workHours = hourTotals.slice(9, 18).reduce((s, v) => s + v, 0);
  const all = hourTotals.reduce((s, v) => s + v, 0);

  return (
    <div className="admin-acq-heat">
      <div className="admin-acq-heat__grid" role="table" aria-label="요일·시간대별 페이지뷰">
        <div role="row" className="admin-acq-heat__row admin-acq-heat__row--head">
          <span role="columnheader" />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} role="columnheader" className="admin-acq-heat__hour">
              {HOUR_LABELS.includes(h) ? h : ""}
            </span>
          ))}
        </div>
        {grid.map((row, d) => (
          <div key={DAYS[d]} role="row" className="admin-acq-heat__row">
            <span role="rowheader" className="admin-acq-heat__day">
              {DAYS[d]}
            </span>
            {row.map((v, h) => (
              <span
                key={h}
                role="cell"
                className="admin-acq-heat__cell"
                style={{
                  background: v
                    ? `rgba(15, 98, 254, ${(0.08 + 0.92 * (v / max)).toFixed(3)})`
                    : undefined,
                }}
                title={`${DAYS[d]}요일 ${h}시 · 페이지뷰 ${v.toLocaleString("ko-KR")}`}
                aria-label={`${DAYS[d]} ${h}시 ${v}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="admin-acq-heat__foot">
        <span>
          피크 <strong>{DAYS[peak.d]}요일 {peak.h}시</strong> ({peak.v.toLocaleString("ko-KR")} PV)
        </span>
        <span>
          가장 많은 요일 <strong>{DAYS[busiestDay]}요일</strong>
        </span>
        <span>
          근무시간(9–18시) 비중 <strong>{all ? Math.round((workHours / all) * 100) : 0}%</strong>
        </span>
        <span className="admin-acq-heat__scale" aria-hidden>
          적음 <i /> 많음
        </span>
      </div>
    </div>
  );
}
