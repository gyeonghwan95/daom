type ComparisonTableColumn = {
  key: string;
  header: string;
};

type ComparisonTableProps = {
  columns: ComparisonTableColumn[];
  rows: Record<string, string>[];
  caption?: string;
};

export function ComparisonTable({
  columns,
  rows,
  caption,
}: ComparisonTableProps) {
  const primaryKey = columns[0]?.key;

  return (
    <div>
      {/* 모바일: 카드형 행 */}
      <ul className="comparison-cards" aria-label={caption}>
        {rows.map((row, index) => (
          <li
            key={`${row[primaryKey ?? "row"]}-${index}`}
            className="comparison-card"
          >
            <p className="comparison-card__title">
              {primaryKey ? row[primaryKey] : `항목 ${index + 1}`}
            </p>
            <dl>
              {columns.slice(1).map((col) => (
                <div key={col.key} className="comparison-card__row">
                  <dt className="comparison-card__label">{col.header}</dt>
                  <dd className="comparison-card__value">{row[col.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* 태블릿 이상: 가로 스크롤 표 */}
      <div className="comparison-table-wrap hidden md:block">
        <table>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="bg-beige text-[var(--text-primary)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3 font-bold md:px-5"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige-dark bg-white">
            {rows.map((row, index) => (
              <tr key={`${row[primaryKey ?? "row"]}-${index}`}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={
                      col.key === primaryKey
                        ? "px-4 py-3 font-semibold text-[var(--text-primary)] md:px-5"
                        : "px-4 py-3 leading-relaxed text-[var(--text-body)] md:px-5"
                    }
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
