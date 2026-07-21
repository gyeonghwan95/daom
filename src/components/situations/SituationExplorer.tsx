"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import {
  SITUATION_CATEGORY_LABELS,
  SITUATION_CATEGORY_ORDER,
  type SituationCategoryId,
} from "@/lib/situations";

export type SituationSearchItem = {
  slug: string;
  path: string;
  cardTitle: string;
  cardDescription: string;
  searchIntent: string;
  situationCategory: SituationCategoryId;
  categoryLabel: string;
  urgent?: boolean;
  isNew?: boolean;
  priority: number;
};

type SituationGroup = {
  category: SituationCategoryId;
  label: string;
  categoryPath: string;
  items: SituationSearchItem[];
};

type SituationExplorerProps = {
  groups: SituationGroup[];
  urgentItems: SituationSearchItem[];
  popularItems: SituationSearchItem[];
  recentItems: SituationSearchItem[];
};

const QUICK_SEARCHES = [
  "상속등기",
  "전세보증금",
  "급여압류",
  "개인회생",
  "임차권등기",
  "지급명령",
  "임원변경",
  "계약금 반환",
];

function normalizeForSearch(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function matchesQuery(item: SituationSearchItem, query: string): boolean {
  if (!query) return true;
  const q = normalizeForSearch(query);
  const haystack = normalizeForSearch(
    [
      item.cardTitle,
      item.cardDescription,
      item.searchIntent,
      item.categoryLabel,
    ].join(" "),
  );
  return haystack.includes(q);
}

export function SituationExplorer({
  groups,
  urgentItems,
  popularItems,
  recentItems,
}: SituationExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SituationCategoryId | "all">("all");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (category !== "all" && item.situationCategory !== category) {
            return false;
          }
          return matchesQuery(item, deferredQuery);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, category, deferredQuery]);

  const totalCount = filteredGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  const isSearching = deferredQuery.trim().length > 0 || category !== "all";

  function handleQuickSearch(value: string) {
    setQuery(value);
    setCategory("all");
    inputRef.current?.focus();
  }

  function clearSearch() {
    setQuery("");
    setCategory("all");
    inputRef.current?.focus();
  }

  return (
    <div className="glossary-explorer space-y-8 md:space-y-10">
      {urgentItems.length > 0 && !isSearching ? (
        <section aria-label="긴급 확인이 필요한 상황">
          <h2 className="section-heading">긴급 확인이 필요한 상황</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
            기한·권리에 영향을 줄 수 있어 빠른 확인이 필요한 주제입니다.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {urgentItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.path}
                  className="interactive-surface flex h-full flex-col rounded-2xl border border-red-200/80 bg-gradient-to-br from-white via-red-50/30 to-beige/30 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] hover:border-red-300/80 sm:p-6"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-700/80">
                    긴급
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-navy">
                    {item.cardTitle}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
                    {item.cardDescription}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="glossary-search" aria-label="상황 검색">
        <div className="glossary-search__panel">
          <label htmlFor="situation-search-input" className="glossary-search__label">
            상황 검색
          </label>
          <p className="glossary-search__lead">
            지금 겪는 상황을 입력하거나 분류를 선택하세요. 업무명을 몰라도
            괜찮습니다.
          </p>

          <div className="glossary-search__field-wrap">
            <span className="glossary-search__icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m21 21-4.3-4.3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <input
              id="situation-search-input"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="예: 전세금, 상속등기, 급여압류, 임원 임기"
              className="glossary-search__input"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                onClick={clearSearch}
                className="glossary-search__clear"
                aria-label="검색어 지우기"
              >
                ✕
              </button>
            ) : null}
          </div>

          <div className="glossary-search__quick">
            <span className="glossary-search__quick-label">자주 찾는 상황</span>
            <div className="glossary-search__quick-list">
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleQuickSearch(term)}
                  className="glossary-search__chip"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div
            className="glossary-search__filters"
            role="group"
            aria-label="분류 필터"
          >
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={
                category === "all"
                  ? "glossary-search__filter glossary-search__filter--active"
                  : "glossary-search__filter"
              }
            >
              전체
            </button>
            {SITUATION_CATEGORY_ORDER.map((catId) => (
              <button
                key={catId}
                type="button"
                onClick={() => setCategory(catId)}
                className={
                  category === catId
                    ? "glossary-search__filter glossary-search__filter--active"
                    : "glossary-search__filter"
                }
              >
                {SITUATION_CATEGORY_LABELS[catId]}
              </button>
            ))}
          </div>

          <p className="glossary-search__meta" aria-live="polite">
            {isSearching
              ? `검색 결과 ${totalCount}건`
              : `총 ${groups.reduce((n, g) => n + g.items.length, 0)}개 상황 안내`}
          </p>
        </div>
      </section>

      {!isSearching && popularItems.length > 0 ? (
        <section aria-label="많이 찾는 상황">
          <h2 className="section-heading">많이 찾는 상황</h2>
          <ul className="glossary-search__popular-list mt-4">
            {popularItems.slice(0, 6).map((item) => (
              <li key={item.slug}>
                <Link href={item.path} className="glossary-search__popular-card">
                  <span className="glossary-search__popular-term">
                    {item.cardTitle}
                  </span>
                  <span className="glossary-search__popular-desc">
                    {item.cardDescription}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!isSearching && recentItems.length > 0 ? (
        <section aria-label="최근 추가된 안내">
          <h2 className="section-heading">최근 추가된 안내</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.path}
                  className="interactive-surface flex h-full flex-col rounded-xl border border-navy/10 bg-white p-4 hover:border-navy/20 sm:p-5"
                >
                  <span className="text-xs font-semibold text-navy-light">NEW</span>
                  <h3 className="mt-1 font-semibold text-navy">{item.cardTitle}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/65">
                    {item.cardDescription}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {filteredGroups.length === 0 ? (
        <div className="glossary-search__empty" role="status">
          <p className="text-base font-semibold text-navy">검색 결과가 없습니다</p>
          <p className="mt-2 text-sm leading-relaxed text-navy/65">
            다른 키워드로 검색하거나 분류 필터를 바꿔 보세요.
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="mt-4 text-sm font-semibold text-navy-light underline"
          >
            검색 초기화
          </button>
        </div>
      ) : (
        filteredGroups.map((group) => (
          <section key={group.category} aria-labelledby={`situation-cat-${group.category}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id={`situation-cat-${group.category}`} className="section-heading">
                {group.label}
              </h2>
              <Link
                href={group.categoryPath}
                className="text-sm font-semibold text-navy-light hover:text-navy"
              >
                {group.label} 허브 →
              </Link>
            </div>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.path}
                    className="interactive-surface group flex h-full flex-col rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/30 to-beige/40 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] hover:border-navy/20 sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {item.urgent ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                          긴급
                        </span>
                      ) : null}
                      {item.isNew ? (
                        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">
                          NEW
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-navy group-hover:text-navy-dark">
                      {item.cardTitle}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
                      {item.cardDescription}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-navy-light group-hover:text-navy">
                      안내 보기 →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
