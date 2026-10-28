import { ComparisonTable } from "@/components/readability/ComparisonTable";
import type { ContentTable } from "@/lib/pageData/types";

/** 본문 섹션 안의 표 — 법정 수치·단계·서류를 목록 대신 비교할 수 있게 보인다 */
export function SectionTable({ table }: { table: ContentTable }) {
  return (
    <div className="mt-4">
      <ComparisonTable columns={table.columns} rows={table.rows} caption={table.caption} />
      {table.note ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{table.note}</p>
      ) : null}
    </div>
  );
}
