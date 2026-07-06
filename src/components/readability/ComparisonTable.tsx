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
  return (
    <div className="overflow-x-auto rounded-xl border border-beige-dark">
      <table className="min-w-full text-left text-sm md:text-base">
        {caption ? (
          <caption className="sr-only">{caption}</caption>
        ) : null}
        <thead className="bg-beige/60 text-navy">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 font-semibold md:px-6"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-beige-dark bg-white">
          {rows.map((row, index) => (
            <tr key={`${row[columns[0]?.key ?? "row"]}-${index}`}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={
                    col.key === columns[0]?.key
                      ? "px-4 py-3 font-medium text-navy md:px-6"
                      : "px-4 py-3 leading-relaxed text-navy/85 md:px-6"
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
  );
}
