"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AdminTableWrap } from "@/components/admin/AdminActionGrid";

export type SortableColumn<T> = {
  key: string;
  label: string;
  title?: string;
  numeric?: boolean;
  hideSm?: boolean;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => number | string | null;
};

type Props<T> = {
  rows: T[];
  columns: SortableColumn<T>[];
  rowKey: (row: T) => string;
  label: string;
  initialSort: string;
  pageSize?: number;
  activeKey?: string | null;
  onRowClick?: (row: T) => void;
  empty?: string;
};

export function SortableTable<T>({
  rows,
  columns,
  rowKey,
  label,
  initialSort,
  pageSize,
  activeKey,
  onRowClick,
  empty = "아직 측정되지 않음",
}: Props<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({
    key: initialSort,
    dir: "desc",
  });
  const [visible, setVisible] = useState(pageSize ?? Number.POSITIVE_INFINITY);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "string" || typeof vb === "string") {
        return String(va).localeCompare(String(vb), "ko") * factor;
      }
      return (va - vb) * factor;
    });
  }, [rows, columns, sort]);

  if (!rows.length) return <p className="admin-empty admin-acq-empty">{empty}</p>;

  const shown = sorted.slice(0, visible);

  return (
    <>
      <AdminTableWrap>
        <table className="admin-table admin-acq-table" aria-label={label}>
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sort.key === col.key;
                const className = [
                  col.numeric ? "is-num" : "",
                  col.hideSm ? "admin-hide-sm" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={className || undefined}
                    title={col.title}
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                  >
                    {col.sortValue ? (
                      <button
                        type="button"
                        className={`admin-acq-sort${active ? " is-active" : ""}`}
                        onClick={() =>
                          setSort((prev) =>
                            prev.key === col.key
                              ? { key: col.key, dir: prev.dir === "desc" ? "asc" : "desc" }
                              : { key: col.key, dir: col.numeric ? "desc" : "asc" },
                          )
                        }
                      >
                        {col.label}
                        <span aria-hidden className="admin-acq-sort__icon">
                          {active ? (sort.dir === "desc" ? "▼" : "▲") : "↕"}
                        </span>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => {
              const key = rowKey(row);
              const active = activeKey != null && activeKey === key;
              return (
                <tr
                  key={key}
                  className={[onRowClick ? "is-clickable" : "", active ? "is-active" : ""]
                    .filter(Boolean)
                    .join(" ") || undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                  aria-selected={onRowClick ? active : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        [col.numeric ? "is-num" : "", col.hideSm ? "admin-hide-sm" : ""]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminTableWrap>
      {sorted.length > shown.length ? (
        <button
          type="button"
          className="admin-btn admin-btn--ghost admin-acq-more"
          onClick={() => setVisible((v) => v + (pageSize ?? 20))}
        >
          {Math.min(pageSize ?? 20, sorted.length - shown.length)}개 더 보기 ({shown.length}/
          {sorted.length})
        </button>
      ) : null}
    </>
  );
}
