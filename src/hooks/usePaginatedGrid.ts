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
  /** 지정 시 maxRows 대신 화면 폭에 따라 행 수 결정 */
  getMaxRows?: (width: number) => number;
  getColumnCount?: (width: number) => number;
  gridClassName?: string;
};

export function usePaginatedGrid(
  itemCount: number,
  options?: UsePaginatedGridOptions,
) {
  const getColumnCount = options?.getColumnCount ?? defaultGetColumnCount;
  const getMaxRows = options?.getMaxRows;
  const fixedMaxRows = options?.maxRows ?? DEFAULT_MAX_ROWS;
  const gridClassName =
    options?.gridClassName ??
    "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  // 0 = SSR·첫 렌더 (모바일 기준 레이아웃)
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(1);
  const columns = getColumnCount(width);
  const maxRows = getMaxRows ? getMaxRows(width) : fixedMaxRows;
  const pageSize = columns * maxRows;
  const [prevPageSize, setPrevPageSize] = useState(pageSize);
  const [prevItemCount, setPrevItemCount] = useState(itemCount);

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));
  const showPagination = itemCount > pageSize;

  if (prevPageSize !== pageSize) {
    setPrevPageSize(pageSize);
    setPage(1);
  }
  if (prevItemCount !== itemCount) {
    setPrevItemCount(itemCount);
    setPage(1);
  }
  if (page > totalPages) {
    setPage(totalPages);
  }

  const visiblePage = Math.min(page, totalPages);

  const visibleItems = useMemo(() => {
    const start = (visiblePage - 1) * pageSize;
    return { start, end: start + pageSize };
  }, [visiblePage, pageSize]);

  return {
    columns,
    page: visiblePage,
    setPage,
    totalPages,
    pageSize,
    showPagination,
    visibleItems,
    gridClassName,
  };
}

/** 언론·활동 패널 — 모바일 2×2, 768px~ 3×3, 1280px~ 4×3 */
export const mediaPanelGridOptions: UsePaginatedGridOptions = {
  getColumnCount: (width) => (width >= 1280 ? 4 : width >= 768 ? 3 : 2),
  getMaxRows: (width) => (width >= 768 ? 3 : 2),
  gridClassName: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
};

function getReviewColumnCount(width: number): number {
  return width >= 768 ? 2 : 1;
}

export const reviewPaginatedGridOptions: UsePaginatedGridOptions = {
  maxRows: 3,
  getColumnCount: getReviewColumnCount,
  gridClassName: "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6",
};
