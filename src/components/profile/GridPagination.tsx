type GridPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function GridPagination({
  page,
  totalPages,
  onPageChange,
}: GridPaginationProps) {
  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex min-h-10 items-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy transition hover:border-navy/30 hover:bg-beige/40 disabled:cursor-not-allowed disabled:opacity-45"
      >
        이전
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                isActive
                  ? "border-navy bg-navy text-white"
                  : "border-navy/15 bg-white text-navy hover:border-navy/30 hover:bg-beige/40"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex min-h-10 items-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy transition hover:border-navy/30 hover:bg-beige/40 disabled:cursor-not-allowed disabled:opacity-45"
      >
        다음
      </button>
    </nav>
  );
}
