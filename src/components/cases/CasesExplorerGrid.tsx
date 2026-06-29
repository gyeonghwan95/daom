"use client";

import { useMemo, useState } from "react";
import {
  CASE_CATEGORIES,
  CASE_REGIONS,
  CASE_SITUATION_TAGS,
  type CaseCategory,
  type CaseRecord,
  type CaseRegion,
  type CaseSituationTag,
} from "@/lib/cases/types";
import { filterCaseRecords } from "@/lib/cases/filter";
import { CaseExplorerCard } from "./CaseExplorerCard";

type CasesExplorerGridProps = {
  cases: CaseRecord[];
};

type FilterKey = "caseCategory" | "situationTag" | "region";

const filterLabels: Record<FilterKey, string> = {
  caseCategory: "카테고리",
  situationTag: "상황 태그",
  region: "지역",
};

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`interactive-surface rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-navy bg-navy text-white"
          : "border-navy/15 bg-white text-navy/75 hover:border-navy/25 hover:bg-beige/40"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export function CasesExplorerGrid({ cases }: CasesExplorerGridProps) {
  const [caseCategory, setCaseCategory] = useState<CaseCategory | "all">("all");
  const [situationTag, setSituationTag] = useState<CaseSituationTag | "all">("all");
  const [region, setRegion] = useState<CaseRegion | "all">("all");

  const filtered = useMemo(
    () =>
      filterCaseRecords(cases, {
        caseCategory,
        situationTag,
        region,
      }),
    [cases, caseCategory, situationTag, region],
  );

  const activeCount =
    (caseCategory !== "all" ? 1 : 0) +
    (situationTag !== "all" ? 1 : 0) +
    (region !== "all" ? 1 : 0);

  function resetFilters() {
    setCaseCategory("all");
    setSituationTag("all");
    setRegion("all");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/20 to-beige/30 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-navy sm:text-lg">필터로 사례 찾기</h2>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-navy-light hover:text-navy"
            >
              필터 초기화
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy-light">
              {filterLabels.caseCategory}
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="전체"
                active={caseCategory === "all"}
                onClick={() => setCaseCategory("all")}
              />
              {CASE_CATEGORIES.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={caseCategory === item}
                  onClick={() => setCaseCategory(item)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy-light">
              {filterLabels.situationTag}
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="전체"
                active={situationTag === "all"}
                onClick={() => setSituationTag("all")}
              />
              {CASE_SITUATION_TAGS.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={situationTag === item}
                  onClick={() => setSituationTag(item)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy-light">
              {filterLabels.region}
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="전체"
                active={region === "all"}
                onClick={() => setRegion("all")}
              />
              {CASE_REGIONS.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={region === item}
                  onClick={() => setRegion(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-navy/65">
        {filtered.length}건의 사례
        {activeCount > 0 ? " (필터 적용)" : ""}
      </p>

      {filtered.length > 0 ? (
        <ul className="listing-card-grid">
          {filtered.map((item) => (
            <li key={item.slug}>
              <CaseExplorerCard record={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-beige-dark bg-beige/25 px-5 py-10 text-center">
          <p className="text-base font-medium text-navy">조건에 맞는 사례가 없습니다.</p>
          <p className="mt-2 text-sm text-navy/65">
            필터를 조정하거나 상담으로 비슷한 사례를 안내받아 보세요.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="interactive-surface mt-4 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-beige/40"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
