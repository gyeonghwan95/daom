"use client";

import { useDeferredValue, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SEARCH_FILTER_LABELS, normalizeQueryInput } from "@/lib/search";
import { useSiteSearch } from "@/lib/search/use-site-search";
import type { SearchCategoryFilter } from "@/lib/search/types";
import { SearchEmptyState } from "@/components/search/SearchEmptyState";
import { SearchHighlight } from "@/components/search/SearchHighlight";
import { SiteSearchInput } from "@/components/search/SiteSearchInput";

const FILTERS: SearchCategoryFilter[] = [
  "all",
  "service",
  "region",
  "diagnosis",
  "faq",
  "case",
  "cost",
  "lecture",
  "tool",
  "glossary",
  "other",
];

function resolveFilter(value: string | null): SearchCategoryFilter {
  if (value && FILTERS.includes(value as SearchCategoryFilter)) {
    return value as SearchCategoryFilter;
  }
  return "all";
}

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlFilter = resolveFilter(searchParams.get("type"));

  const [draftQuery, setDraftQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [filter, setFilter] = useState<SearchCategoryFilter>(urlFilter);
  const [prevUrlFilter, setPrevUrlFilter] = useState(urlFilter);

  if (prevUrlQuery !== urlQuery) {
    setPrevUrlQuery(urlQuery);
    setDraftQuery(urlQuery);
  }
  if (prevUrlFilter !== urlFilter) {
    setPrevUrlFilter(urlFilter);
    setFilter(urlFilter);
  }

  const deferredQuery = useDeferredValue(normalizeQueryInput(draftQuery));
  const { results, totalCount, loading } = useSiteSearch({
    query: deferredQuery,
    filter,
    limit: 50,
    enabled: true,
  });

  const syncUrl = (nextQuery: string, nextFilter: SearchCategoryFilter) => {
    const params = new URLSearchParams();
    const q = normalizeQueryInput(nextQuery);
    if (q) params.set("q", q);
    if (nextFilter !== "all") params.set("type", nextFilter);
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  };

  return (
    <div className="space-y-6">
      <form
        role="search"
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          syncUrl(draftQuery, filter);
        }}
      >
        <SiteSearchInput
          value={draftQuery}
          onChange={setDraftQuery}
          onClear={() => {
            setDraftQuery("");
            syncUrl("", filter);
          }}
          placeholder="상속등기, 개인회생, 법인설립, 전세사기 강의 등을 검색해보세요"
        />
        <div className="flex flex-wrap gap-2" aria-label="검색 결과 필터">
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-beige-dark bg-white text-navy hover:bg-beige"
                }`}
                aria-pressed={active}
                onClick={() => {
                  setFilter(item);
                  syncUrl(draftQuery, item);
                }}
              >
                {SEARCH_FILTER_LABELS[item]}
              </button>
            );
          })}
        </div>
      </form>

      {!deferredQuery ? (
        <p className="text-sm text-navy/65">
          업무명, 지역명, 강의 주제 등으로 검색해 보세요.
        </p>
      ) : loading ? (
        <p className="text-sm text-navy/65" aria-live="polite">
          검색 준비 중…
        </p>
      ) : results.length === 0 ? (
        <SearchEmptyState query={deferredQuery} />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-navy/65" aria-live="polite">
            검색 결과 {totalCount}개
            {filter !== "all" ? ` · ${SEARCH_FILTER_LABELS[filter]}` : null}
          </p>
          <ul className="divide-y divide-beige-dark border-y border-beige-dark">
            {results.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block py-4 no-underline transition-colors hover:bg-beige/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                  <span className="inline-flex rounded border border-beige-dark bg-cream px-1.5 py-0.5 text-xs font-medium text-navy/70">
                    {item.categoryLabel}
                  </span>
                  <p className="mt-2 text-base font-semibold text-navy">
                    <SearchHighlight text={item.title} query={deferredQuery} />
                  </p>
                  {item.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-navy/65">
                      <SearchHighlight
                        text={item.description}
                        query={deferredQuery}
                      />
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
