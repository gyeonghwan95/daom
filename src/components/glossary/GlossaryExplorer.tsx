"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import {
  GLOSSARY_CATEGORY_LABELS,
  type GlossaryCategory,
} from "@/lib/glossary";

export type GlossarySearchItem = {
  slug: string;
  path: string;
  term: string;
  category: GlossaryCategory;
  categoryLabel: string;
  cardDescription: string;
  oneLineDefinition: string;
};

type GlossaryGroup = {
  category: GlossaryCategory;
  label: string;
  terms: GlossarySearchItem[];
};

type GlossaryExplorerProps = {
  groups: GlossaryGroup[];
  popularTerms: GlossarySearchItem[];
};

const QUICK_SEARCHES = [
  "상속등기",
  "한정승인",
  "전세권",
  "지급명령",
  "법인등기",
  "개인회생",
];

function normalizeForSearch(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function matchesQuery(item: GlossarySearchItem, query: string): boolean {
  if (!query) return true;
  const q = normalizeForSearch(query);
  const haystack = normalizeForSearch(
    [
      item.term,
      item.cardDescription,
      item.oneLineDefinition,
      item.categoryLabel,
    ].join(" "),
  );
  return haystack.includes(q);
}

export function GlossaryExplorer({ groups, popularTerms }: GlossaryExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => ({
        ...group,
        terms: group.terms.filter((term) => {
          if (category !== "all" && term.category !== category) return false;
          return matchesQuery(term, deferredQuery);
        }),
      }))
      .filter((group) => group.terms.length > 0);
  }, [groups, category, deferredQuery]);

  const totalCount = filteredGroups.reduce(
    (sum, group) => sum + group.terms.length,
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
      <section
        className="glossary-search"
        aria-label="법률 용어 검색"
      >
        <div className="glossary-search__panel">
          <label htmlFor="glossary-search-input" className="glossary-search__label">
            법률 용어 검색
          </label>
          <p className="glossary-search__lead">
            궁금한 용어를 입력하면 바로 찾을 수 있습니다. 상속·등기·민사·회생·법인
            분야를 함께 검색합니다.
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
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              ref={inputRef}
              id="glossary-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="예: 상속등기, 한정승인, 전세권, 지급명령…"
              className="glossary-search__input"
              autoComplete="off"
              enterKeyHint="search"
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
            <span className="glossary-search__quick-label">자주 찾는 용어</span>
            <div className="glossary-search__quick-list">
              {QUICK_SEARCHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickSearch(item)}
                  className="glossary-search__chip"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="glossary-search__filters" role="group" aria-label="분야 필터">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={
                category === "all"
                  ? "glossary-search__filter glossary-search__filter--active"
                  : "glossary-search__filter"
              }
              aria-pressed={category === "all"}
            >
              전체
            </button>
            {groups.map((group) => (
              <button
                key={group.category}
                type="button"
                onClick={() => setCategory(group.category)}
                className={
                  category === group.category
                    ? "glossary-search__filter glossary-search__filter--active"
                    : "glossary-search__filter"
                }
                aria-pressed={category === group.category}
              >
                {group.label}
              </button>
            ))}
          </div>

          <p className="glossary-search__meta" aria-live="polite">
            {isSearching
              ? `검색 결과 ${totalCount}개 용어`
              : `총 ${totalCount}개 용어 · 분야별로 둘러보거나 검색해 보세요`}
          </p>
        </div>

        {!isSearching && popularTerms.length > 0 ? (
          <div className="glossary-search__popular">
            <h2 className="glossary-search__popular-title">바로 읽어보기</h2>
            <ul className="glossary-search__popular-list">
              {popularTerms.map((item) => (
                <li key={item.slug}>
                  <Link href={item.path} className="glossary-search__popular-card">
                    <span className="glossary-search__popular-term">{item.term}</span>
                    <span className="glossary-search__popular-desc">
                      {item.oneLineDefinition}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {totalCount === 0 ? (
        <div className="glossary-search__empty" role="status">
          <p className="text-base font-semibold text-navy">
            &apos;{deferredQuery}&apos;에 맞는 용어를 찾지 못했습니다
          </p>
          <p className="mt-2 text-sm leading-relaxed text-navy/65">
            다른 키워드로 검색하거나 분야 필터를 바꿔 보세요. 상담이 필요하면
            아래에서 문의하실 수 있습니다.
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="btn-secondary mt-4 inline-flex min-h-11 items-center px-5"
          >
            검색 초기화
          </button>
        </div>
      ) : (
        filteredGroups.map((group) => (
          <section key={group.category} id={`glossary-${group.category}`}>
            <h2 className="section-heading">{group.label}</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.terms.map((term) => (
                <li key={term.slug}>
                  <Link
                    href={term.path}
                    className="interactive-surface group flex h-full flex-col rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/30 to-beige/40 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] hover:border-navy/20 hover:shadow-[0_8px_32px_rgba(26,39,68,0.08)] sm:p-6"
                  >
                    <span className="glossary-card__badge">{term.categoryLabel}</span>
                    <h3 className="mt-2 text-lg font-semibold text-navy group-hover:text-navy-dark">
                      {term.term}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                      {term.cardDescription}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-navy-light group-hover:text-navy">
                      뜻과 절차 보기 →
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
