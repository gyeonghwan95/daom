"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CASE_BASE } from "@/lib/southeast-cases/types";

export type SoutheastExplorerItem = {
  slug: string;
  regionName: string;
  parentRegion?: string;
  primaryKeyword: string;
  h1: string;
  pageType: string;
  keywords: string[];
};

export type SoutheastExplorerFilter = { id: string; label: string };

type Props = {
  items: SoutheastExplorerItem[];
  filters: SoutheastExplorerFilter[];
  coreLinks: Array<{ href: string; label: string }>;
  groupLabel: string;
};

function pathFor(slug: string) {
  return `${CASE_BASE}/${slug}`;
}

export function SoutheastHubExplorer({
  items,
  filters,
  coreLinks,
  groupLabel,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterId, setFilterId] = useState(searchParams.get("filter") ?? "all");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    return items.filter((item) => {
      if (q) {
        const hay = [
          item.regionName,
          item.parentRegion ?? "",
          item.slug,
          ...item.keywords,
        ]
          .join(" ")
          .toLowerCase()
          .replace(/\s+/g, "");
        if (!hay.includes(q)) return false;
      }
      if (filterId === "all") return true;
      const hay = `${item.regionName} ${item.parentRegion ?? ""} ${item.slug} ${item.pageType} ${item.keywords.join(" ")}`;
      if (filterId === "inheritance") return /inheritance|상속|유증/.test(hay);
      if (filterId === "cost-docs") return /cost|documents|비용|서류/.test(hay);
      if (filterId === "land") return /land|farm|forest|토지|농지|임야/.test(hay);
      if (filterId === "factory") return /factory|공장|산업/.test(hay);
      if (filterId === "corporate") return /corporate|법인|본점/.test(hay);
      if (filterId === "joint") return /joint|공동|담보|근저당/.test(hay);
      if (filterId === "old") return /오래된|조부모|legacy|complex/.test(hay);
      const tokenMap: Record<string, string> = {
        jung: "중구",
        nam: "남구",
        dong: "동구",
        buk: "북구",
        ulju: "울주",
        suseong: "수성",
        dalseo: "달서",
        dalseong: "달성",
        gunwi: "군위",
        east: "포항",
        west: "구미",
        "daegu-adj": "경산",
        andong: "안동",
      };
      const token = tokenMap[filterId] ?? filterId;
      return hay.includes(token);
    });
  }, [items, filterId, query]);

  function sync(nextFilter: string, nextQ: string) {
    const params = new URLSearchParams();
    if (nextFilter !== "all") params.set("filter", nextFilter);
    if (nextQ.trim()) params.set("q", nextQ.trim());
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-beige-dark bg-white p-4 shadow-sm md:p-5">
        <label
          htmlFor="southeast-search"
          className="block text-sm font-semibold text-navy"
        >
          {groupLabel} 지역·업무 검색
        </label>
        <input
          id="southeast-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            sync(filterId, e.target.value);
          }}
          className="mt-3 w-full min-h-12 rounded-xl border border-beige-dark bg-cream/40 px-4 text-base text-navy outline-none ring-navy/20 focus:ring-2"
          placeholder="구·군·생활권·업무 검색"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip
          active={filterId === "all"}
          label="전체"
          onClick={() => {
            setFilterId("all");
            sync("all", query);
          }}
        />
        {filters.map((f) => (
          <Chip
            key={f.id}
            active={filterId === f.id}
            label={f.label}
            onClick={() => {
              setFilterId(f.id);
              sync(f.id, query);
            }}
          />
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="section-heading">{groupLabel} 핵심 안내</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {coreLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 text-sm font-medium text-navy no-underline hover:bg-beige/40"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="section-heading">{groupLabel} 상세 페이지</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <li key={item.slug}>
              <Link
                href={pathFor(item.slug)}
                className="flex h-full flex-col rounded-xl border border-beige-dark bg-white p-4 no-underline hover:bg-beige/30"
              >
                <span className="font-semibold text-navy">
                  {item.primaryKeyword}
                </span>
                <span className="mt-1 text-sm text-navy/70">{item.h1}</span>
              </Link>
            </li>
          ))}
        </ul>
        {results.length === 0 ? (
          <p className="text-sm text-navy/60">검색 결과가 없습니다.</p>
        ) : null}
      </section>
    </div>
  );
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-3 text-sm ${
        active
          ? "border-navy bg-navy text-white"
          : "border-beige-dark bg-white text-navy hover:bg-beige/40"
      }`}
    >
      {label}
    </button>
  );
}
