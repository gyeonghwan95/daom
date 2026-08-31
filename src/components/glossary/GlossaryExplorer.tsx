"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { GLOSSARY_SITUATION_SHORTCUTS, type GlossaryCategory } from "@/lib/glossary";

export type GlossarySearchItem = {
  slug: string;
  path: string;
  term: string;
  category: GlossaryCategory;
  categoryLabel: string;
  cardDescription: string;
  oneLineDefinition: string;
  discoverable: boolean;
};

type GlossaryGroup = {
  category: GlossaryCategory;
  label: string;
  terms: GlossarySearchItem[];
};

type GlossaryExplorerProps = {
  groups: GlossaryGroup[];
  allTerms: GlossarySearchItem[];
};

function normalizeForSearch(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function matchesQuery(item: GlossarySearchItem, query: string): boolean {
  if (!query) return item.discoverable;
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

export function GlossaryExplorer({ groups, allTerms }: GlossaryExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const uniqueGroups = useMemo(() => {
    const searching = deferredQuery.trim().length > 0;
    if (searching) {
      const terms = allTerms.filter((term) => {
        if (category !== "all" && term.category !== category) return false;
        return matchesQuery(term, deferredQuery);
      });
      if (terms.length === 0) return [];
      return [{ category: "inheritance" as GlossaryCategory, label: "용어", terms }];
    }
    return groups
      .map((group) => ({
        ...group,
        terms: group.terms.filter((term) => {
          if (category !== "all" && term.category !== category) return false;
          return matchesQuery(term, deferredQuery);
        }),
      }))
      .filter((group) => group.terms.length > 0);
  }, [groups, allTerms, category, deferredQuery]);

  const situationHits = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q) return [];
    const n = normalizeForSearch(q);
    return GLOSSARY_SITUATION_SHORTCUTS.filter((item) =>
      normalizeForSearch(item.label).includes(n),
    );
  }, [deferredQuery]);

  const totalCount = uniqueGroups.reduce((sum, group) => sum + group.terms.length, 0);
  const isSearching = deferredQuery.trim().length > 0 || category !== "all";

  function clearSearch() {
    setQuery("");
    setCategory("all");
    inputRef.current?.focus();
  }

  return (
    <div className="glossary-explorer space-y-8 md:space-y-10">
      <section className="glossary-search" aria-label="용어 검색">
        <div className="glossary-search__panel">
          <label htmlFor="glossary-search-input" className="glossary-search__label">
            용어 검색
          </label>
          <p className="glossary-search__lead">
            등기·신청 서류에서 본 용어를 찾아 짧게 구분합니다. 지금 할 일이 먼저면
            아래 상황별 안내를 보세요.
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
              placeholder="예: 상속등기, 임원변경, 임차권등기명령"
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

          <div className="glossary-search__filters" role="group" aria-label="용어 분류">
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
              ? `검색 결과 용어 ${totalCount}개`
              : `확인할 수 있는 용어 ${totalCount}개`}
          </p>
        </div>
      </section>

      {situationHits.length > 0 ? (
        <section>
          <h2 className="section-heading">바로 갈 수 있는 업무 안내</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {situationHits.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="interactive-surface flex min-h-12 items-center rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-beige/50"
                >
                  {item.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {totalCount === 0 && situationHits.length === 0 ? (
        <div className="glossary-search__empty" role="status">
          <p className="text-base font-semibold text-navy">
            &apos;{deferredQuery}&apos;에 맞는 용어를 찾지 못했습니다
          </p>
          <p className="mt-2 text-sm leading-relaxed text-navy/65">
            용어 이름으로 다시 검색하거나, 상황별 안내에서 지금 할 일을 고르세요.
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
        uniqueGroups.map((group) => (
          <section key={`${group.category}-${group.label}`} id={`glossary-${group.category}`}>
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
                      용어 확인 →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {!isSearching ? (
        <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-navy sm:text-lg">
            지금 할 일이 먼저라면
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/70">
            용어보다 신청·등기가 급하면 해당 업무 안내로 바로 갑니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {GLOSSARY_SITUATION_SHORTCUTS.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href} className="glossary-search__chip">
                {item.label}
              </Link>
            ))}
            <Link href="/situations" className="glossary-search__chip">
              상황별 안내
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
