"use client";

type HourRow = {
  hour: number;
  pageViews: number;
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

export function HourlyTrafficChart({ today, avg7Day, insights }: Props) {
  const rows =
    today && today.length > 0
      ? [...today].sort((a, b) => a.hour - b.hour)
      : null;

  if (!rows) {
    return (
      <p className="admin-empty">오늘 수집된 시간대별 페이지뷰 데이터가 아직 없습니다.</p>
    );
  }

  const max = Math.max(
    1,
    ...rows.map((r) => r.pageViews),
    ...(avg7Day || []).map((r) => r.pageViews),
  );

  return (
    <div className="admin-hourly">
      <div className="admin-hourly__legend">
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--today" /> 오늘
        </span>
        <span>
          <i className="admin-hourly__dot admin-hourly__dot--avg" /> 7일 평균
        </span>
      </div>
      <div className="admin-hourly__chart" role="img" aria-label="시간대별 페이지뷰">
        {rows.map((row) => {
          const avg =
            avg7Day?.find((x) => x.hour === row.hour)?.pageViews ?? 0;
          const hToday = Math.round((row.pageViews / max) * 100);
          const hAvg = Math.round((avg / max) * 100);
          const showTick = row.hour % 3 === 0;
          return (
            <div
              key={row.hour}
              className="admin-hourly__col"
              title={`${row.hour}시 · 오늘 ${row.pageViews}회 · 7일 평균 ${avg}회`}
            >
              <div className="admin-hourly__bars">
                <div
                  className="admin-hourly__bar admin-hourly__bar--today"
                  style={{ height: `${hToday}%` }}
                />
                <div
                  className="admin-hourly__bar admin-hourly__bar--avg"
                  style={{ height: `${hAvg}%` }}
                />
              </div>
              <span className="admin-hourly__tick">
                {showTick ? String(row.hour).padStart(2, "0") : ""}
              </span>
            </div>
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
              <td>
                {avg7Day?.find((x) => x.hour === row.hour)?.pageViews ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
