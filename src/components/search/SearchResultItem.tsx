"use client";

import Link from "next/link";
import type { SearchResult } from "@/lib/search/types";
import { SearchHighlight } from "./SearchHighlight";

type SearchResultItemProps = {
  item: SearchResult;
  query: string;
  active: boolean;
  id: string;
  onSelect: () => void;
  onMouseEnter: () => void;
};

export function SearchResultItem({
  item,
  query,
  active,
  id,
  onSelect,
  onMouseEnter,
}: SearchResultItemProps) {
  return (
    <li role="option" id={id} aria-selected={active}>
      <Link
        href={item.href}
        onClick={onSelect}
        onMouseEnter={onMouseEnter}
        className={`block rounded-lg px-3 py-2.5 no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
          active ? "bg-beige/80" : "hover:bg-beige/50"
        }`}
      >
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 rounded border border-beige-dark bg-cream px-1.5 py-0.5 text-[11px] font-medium text-navy/70">
            {item.categoryLabel}
          </span>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold text-navy">
              <SearchHighlight text={item.title} query={query} />
            </p>
            {item.description ? (
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-navy/60">
                <SearchHighlight text={item.description} query={query} />
              </p>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  );
}
