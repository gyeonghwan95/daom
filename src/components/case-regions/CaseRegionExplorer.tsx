"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  caseRegionPath,
  getChildrenOfDistrict,
  getIndexableCaseRegions,
  searchCaseRegions,
  DISTRICT_METAS,
  type DistrictKey,
} from "@/lib/case-regions";

export function CaseRegionExplorer() {
  const [query, setQuery] = useState("");
  const [districtKey, setDistrictKey] = useState<DistrictKey | "all">("all");

  const results = useMemo(() => {
    if (query.trim()) {
      return searchCaseRegions(query);
    }
    if (districtKey === "all") {
      return getIndexableCaseRegions().filter((e) => e.kind === "district");
    }
    const children = getChildrenOfDistrict(districtKey);
    const district = getIndexableCaseRegions().find(
      (e) => e.kind === "district" && e.parentDistrictKey === districtKey,
    );
    return district ? [district, ...children] : children;
  }, [query, districtKey]);

  const sortedAlpha = useMemo(() => {
    if (query.trim() || districtKey !== "all") return [];
    return [...getIndexableCaseRegions()]
      .filter((e) => e.kind !== "city")
      .sort((a, b) => a.name.localeCompare(b.name, "ko"))
      .slice(0, 60);
  }, [query, districtKey]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-beige-dark bg-white p-4 shadow-sm md:p-5">
        <label htmlFor="case-region-search" className="block text-sm font-semibold text-navy">
          지역 검색
        </label>
        <p className="mt-1 text-xs text-navy/60">
          구·군, 동, 센텀, 서면, 동부지원 등 생활권·기관명으로 검색하세요.
        </p>
        <input
          id="case-region-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 반여동, 센텀, 연산동, 정관"
          className="mt-3 w-full min-h-12 rounded-xl border border-beige-dark bg-cream/40 px-4 text-base text-navy outline-none ring-navy/20 focus:ring-2"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-navy">구·군 선택</p>
        <div
          className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="부산 구·군"
        >
          <DistrictTab
            active={districtKey === "all" && !query}
            onClick={() => {
              setQuery("");
              setDistrictKey("all");
            }}
            label="전체 구·군"
          />
          {DISTRICT_METAS.map((d) => (
            <DistrictTab
              key={d.key}
              active={districtKey === d.key && !query}
              onClick={() => {
                setQuery("");
                setDistrictKey(d.key);
              }}
              label={d.name}
            />
          ))}
        </div>
      </div>

      <section aria-live="polite">
        <h2 className="section-heading text-lg">
          {query.trim()
            ? `검색 결과 (${results.length})`
            : districtKey === "all"
              ? "구·군 허브"
              : `${DISTRICT_METAS.find((d) => d.key === districtKey)?.name ?? ""} 지역`}
        </h2>
        {results.length === 0 ? (
          <p className="mt-3 text-sm text-navy/65">
            검색 결과가 없습니다. 구·군 탭을 이용하거나{" "}
            <Link href="/contact" className="underline">
              상담 문의
            </Link>
            로 알려 주세요.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={caseRegionPath(entry.slug)}
                  className="flex min-h-[5.5rem] flex-col rounded-xl border border-beige-dark bg-white px-4 py-3 no-underline transition-colors hover:bg-beige/40"
                >
                  <span className="text-sm font-semibold text-navy">
                    {entry.displayName} 법무사
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy/60">
                    {entry.context}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!query.trim() && districtKey === "all" && sortedAlpha.length > 0 ? (
        <section>
          <h2 className="section-heading text-lg">가나다순 주요 지역</h2>
          <p className="mt-1 text-sm text-navy/65">
            일부 대표 지역만 표시합니다. 나머지는 검색·구·군 탭으로 찾아 주세요.
          </p>
          <ul className="mt-4 columns-2 gap-x-6 text-sm md:columns-3 lg:columns-4">
            {sortedAlpha.map((entry) => (
              <li key={`alpha-${entry.slug}`} className="mb-1.5 break-inside-avoid">
                <Link
                  href={caseRegionPath(entry.slug)}
                  className="text-navy/80 underline-offset-2 hover:underline"
                >
                  {entry.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function DistrictTab({
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
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "shrink-0 rounded-full px-3.5 py-2 text-sm transition-colors",
        active
          ? "bg-navy font-semibold text-cream"
          : "bg-white font-medium text-navy/75 ring-1 ring-beige-dark active:bg-beige",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
