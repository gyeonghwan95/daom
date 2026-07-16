"use client";

import Link from "next/link";
import type { SearchResult } from "@/lib/search/types";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchPopularLinks } from "./SearchPopularLinks";
import { SearchResultItem } from "./SearchResultItem";

type SiteSearchResultsProps = {
  query: string;
  results: SearchResult[];
  totalCount: number;
  activeIndex: number;
  loading?: boolean;
  listboxId: string;
  onSelect: () => void;
  onActiveIndexChange: (index: number) => void;
  showAllResultsLink?: boolean;
};

export function SiteSearchResults({
  query,
  results,
  totalCount,
  activeIndex,
  loading = false,
  listboxId,
  onSelect,
  onActiveIndexChange,
  showAllResultsLink = true,
}: SiteSearchResultsProps) {
  const trimmed = query.trim();

  if (!trimmed) {
    return <SearchPopularLinks onNavigate={onSelect} />;
  }

  if (loading) {
    return (
      <p className="py-4 text-sm text-navy/60" aria-live="polite">
        검색 준비 중…
      </p>
    );
  }

  if (results.length === 0) {
    return <SearchEmptyState query={trimmed} onNavigate={onSelect} />;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-navy/60" aria-live="polite">
        검색 결과 {totalCount}개
        {totalCount > results.length
          ? ` (상위 ${results.length}개 표시)`
          : null}
      </p>
      <ul
        id={listboxId}
        role="listbox"
        aria-label="검색 결과"
        className="space-y-1"
      >
        {results.map((item, index) => (
          <SearchResultItem
            key={item.id}
            id={`${listboxId}-option-${index}`}
            item={item}
            query={trimmed}
            active={index === activeIndex}
            onSelect={onSelect}
            onMouseEnter={() => onActiveIndexChange(index)}
          />
        ))}
      </ul>
      {showAllResultsLink && totalCount > results.length ? (
        <div className="pt-1">
          <Link
            href={`/search?q=${encodeURIComponent(trimmed)}`}
            onClick={onSelect}
            className="inline-flex text-sm font-medium text-navy underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            전체 결과 보기 ({totalCount}개)
          </Link>
        </div>
      ) : null}
    </div>
  );
}
