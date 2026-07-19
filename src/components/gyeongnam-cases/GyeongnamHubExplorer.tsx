"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CASE_BASE } from "@/lib/gyeongnam-cases/types";

export type GyeongnamExplorerItem = {
  slug: string;
  regionName: string;
  parentRegion?: string;
  primaryKeyword: string;
  h1: string;
  pageType: string;
  keywords: string[];
};

export type GyeongnamExplorerFilter = {
  id: string;
  label: string;
};

type Props = {
  items: GyeongnamExplorerItem[];
  filters: GyeongnamExplorerFilter[];
  coreLinks: Array<{ href: string; label: string }>;
};

function pathFor(slug: string) {
  return `${CASE_BASE}/${slug}`;
}

export function GyeongnamHubExplorer({ items, filters, coreLinks }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") ?? "all";
  const initialQ = searchParams.get("q") ?? "";
  const [filterId, setFilterId] = useState(initialFilter);
  const [query, setQuery] = useState(initialQ);

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
      const filter = filters.find((f) => f.id === filterId);
      if (!filter) return true;
      // filter matching done via keyword tags embedded in keywords[0] as filter ids? 
      // Parent passes items already; we match by keyword includes filter label tokens
      const token = filter.label.split("·")[0] ?? filter.label;
      const hay = `${item.regionName} ${item.parentRegion ?? ""} ${item.slug} ${item.pageType} ${item.keywords.join(" ")}`;
      if (filter.id === "inheritance") {
        return /inheritance|상속/.test(`${item.pageType} ${item.slug}`);
      }
      if (filter.id === "renunciation") {
        return /renunciation|limited|포기|한정/.test(
          `${item.pageType} ${item.slug}`,
        );
      }
      if (filter.id === "corporate") {
        return /corporate|법인|본점/.test(`${item.pageType} ${item.slug}`);
      }
      if (filter.id === "joint") {
        return /joint|공동|담보|근저당/.test(`${item.pageType} ${item.slug}`);
      }
      if (filter.id === "cost-docs") {
        return /cost|documents|비용|서류/.test(`${item.pageType} ${item.slug}`);
      }
      return hay.includes(token);
    });
  }, [items, filters, filterId, query]);

  function syncUrl(nextFilter: string, nextQ: string) {
    const params = new URLSearchParams();
    if (nextFilter && nextFilter !== "all") params.set("filter", nextFilter);
    if (nextQ.trim()) params.set("q", nextQ.trim());
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-beige-dark bg-white p-4 shadow-sm md:p-5">
        <label
          htmlFor="gyeongnam-search"
          className="block text-sm font-semibold text-navy"
        >
          경남 지역·업무 검색
        </label>
        <p className="mt-1 text-xs text-navy/60">
          예: 김해, 장유, 물금, 사송, 진해, 비용, 본점이전
        </p>
        <input
          id="gyeongnam-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            syncUrl(filterId, e.target.value);
          }}
          className="mt-3 w-full min-h-12 rounded-xl border border-beige-dark bg-cream/40 px-4 text-base text-navy outline-none ring-navy/20 focus:ring-2"
          placeholder="시·군·생활권·업무 검색"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-navy">필터</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={filterId === "all"}
            label="전체"
            onClick={() => {
              setFilterId("all");
              syncUrl("all", query);
            }}
          />
          {filters.map((f) => (
            <FilterChip
              key={f.id}
              active={filterId === f.id}
              label={f.label}
              onClick={() => {
                setFilterId(f.id);
                syncUrl(f.id, query);
              }}
            />
          ))}
        </div>
      </div>

      <section className="space-y-3" aria-label="경남 시·군 핵심 안내">
        <h2 className="section-heading">경남 시·군 상속등기</h2>
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

      <section className="space-y-3" aria-label="경남 상세 페이지">
        <h2 className="section-heading">경남 상세·생활권·비용 안내</h2>
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
          <p className="text-sm text-navy/60">
            검색 결과가 없습니다. 김해·양산·창원 상속등기 안내를 이용해 주세요.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function FilterChip({
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
