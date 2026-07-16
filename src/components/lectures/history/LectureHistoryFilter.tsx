"use client";

import { useMemo, useState } from "react";
import type { LectureHistoryEntry } from "@/lib/lectures/types";
import { LECTURE_CATEGORY_FILTERS } from "@/lib/lectures/types";
import {
  filterLectureHistory,
  getLectureHistoryFilterOptions,
} from "@/lib/lectures/history-helpers";
import { LectureHistoryTimeline } from "./LectureHistoryTimeline";

type LectureHistoryFilterProps = {
  items: LectureHistoryEntry[];
};

export function LectureHistoryFilter({ items }: LectureHistoryFilterProps) {
  const options = useMemo(() => getLectureHistoryFilterOptions(items), [items]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [institutionType, setInstitutionType] = useState("all");
  const [audience, setAudience] = useState("all");

  const filtered = useMemo(
    () =>
      filterLectureHistory(
        { query, category, year, institutionType, audience },
        items,
      ),
    [audience, category, institutionType, items, query, year],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-beige-dark bg-cream/30 p-4 md:p-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-navy/70">
            검색
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="기관명, 주제, 대상, 지역"
            className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy focus:border-navy/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/25"
            aria-label="강의 이력 검색"
          />
        </label>

        <div>
          <p className="mb-2 text-xs font-semibold text-navy/70">주제</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {LECTURE_CATEGORY_FILTERS.map((item) => {
              const active = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item.id)}
                  className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-beige-dark bg-white text-navy hover:bg-beige"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <FilterSelect
            label="연도"
            value={year}
            onChange={setYear}
            options={[
              { id: "all", label: "전체 연도" },
              ...options.years.map((value) => ({ id: value, label: value })),
            ]}
          />
          <FilterSelect
            label="기관 유형"
            value={institutionType}
            onChange={setInstitutionType}
            options={[
              { id: "all", label: "전체 기관" },
              ...options.institutionTypes,
            ]}
          />
          <FilterSelect
            label="대상"
            value={audience}
            onChange={setAudience}
            options={[
              { id: "all", label: "전체 대상" },
              ...options.audiences.map((value) => ({
                id: value,
                label: value,
              })),
            ]}
          />
        </div>
      </div>

      <p className="text-sm text-navy/60" aria-live="polite">
        확인된 이력 {filtered.length}건
      </p>

      <LectureHistoryTimeline items={filtered} />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; label: string }>;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1.5 block font-semibold text-navy/70">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
