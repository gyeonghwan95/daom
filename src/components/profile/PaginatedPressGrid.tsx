"use client";

import { PressCard } from "@/components/cards/PressCard";
import { GridPagination } from "@/components/profile/GridPagination";
import { mediaPanelGridOptions, usePaginatedGrid } from "@/hooks/usePaginatedGrid";
import type { PressArticle } from "@/lib/press-articles";

type PaginatedPressGridProps = {
  articles: PressArticle[];
};

export function PaginatedPressGrid({ articles }: PaginatedPressGridProps) {
  const { page, setPage, totalPages, showPagination, visibleItems, gridClassName } =
    usePaginatedGrid(articles.length, mediaPanelGridOptions);

  return (
    <div>
      <ul className={gridClassName}>
        {articles.map((article, index) => (
          <li
            key={article.slug}
            className={
              index < visibleItems.start || index >= visibleItems.end ? "hidden" : undefined
            }
          >
            <PressCard article={article} />
          </li>
        ))}
      </ul>

      {showPagination ? (
        <GridPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : null}
    </div>
  );
}
