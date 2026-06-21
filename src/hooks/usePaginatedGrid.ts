"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_MAX_ROWS = 2;

function defaultGetColumnCount(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export type UsePaginatedGridOptions = {
  maxRows?: number;
  getColumnCount?: (width: number) => number;
  gridClassName?: string;
};

export function usePaginatedGrid(
  itemCount: number,
  options?: UsePaginatedGridOptions,
) {
  const maxRows = options?.maxRows ?? DEFAULT_MAX_ROWS;
  const getColumnCount = options?.getColumnCount ?? defaultGetColumnCount;
  const gridClassName =
    options?.gridClassName ??
    "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const [columns, setColumns] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(getColumnCount(window.innerWidth));
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [getColumnCount]);

  const pageSize = columns * maxRows;
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));
  const showPagination = itemCount > pageSize;

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [columns]);

  useEffect(() => {
    setPage(1);
  }, [itemCount]);

  const visibleItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return { start, end: start + pageSize };
  }, [page, pageSize]);

  return {
    columns,
    page,
    setPage,
    totalPages,
    pageSize,
    showPagination,
    visibleItems,
    gridClassName,
  };
}

function getReviewColumnCount(width: number): number {
  return width >= 768 ? 2 : 1;
}

export const reviewPaginatedGridOptions: UsePaginatedGridOptions = {
  maxRows: 3,
  getColumnCount: getReviewColumnCount,
  gridClassName: "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6",
};
