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
      <div className="comparison-table-wrap">
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
