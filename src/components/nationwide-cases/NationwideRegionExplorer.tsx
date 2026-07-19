"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CASE_BASE } from "@/lib/nationwide-cases/types";

export type RegionExplorerItem = {
  slug: string;
  regionName: string;
  parentRegion?: string;
  primaryKeyword: string;
  h1: string;
  priority: 1 | 2 | 3;
  keywords: string[];
};

export type RegionExplorerGroup = {
  label: string;
  slugs: string[];
};

type Props = {
  items: RegionExplorerItem[];
  groups: RegionExplorerGroup[];
};

function pathFor(slug: string) {
  return `${CASE_BASE}/${slug}`;
}

export function NationwideRegionExplorer({ items, groups }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);

  const bySlug = useMemo(
    () => new Map(items.map((i) => [i.slug, i])),
    [items],
  );

  const metros = useMemo(
    () => items.filter((i) => i.priority === 1),
    [items],
  );

  const cities = useMemo(
    () => items.filter((i) => i.priority === 2),
    [items],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    if (!q) return [];
    return items
      .filter((i) => {
        const hay = [i.regionName, i.parentRegion ?? "", i.slug, ...i.keywords]
          .join(" ")
          .toLowerCase()
          .replace(/\s+/g, "");
        return hay.includes(q);
      })
      .slice(0, 40);
  }, [items, query]);

  function updateQuery(next: string) {
    setQuery(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim()) params.set("q", next.trim());
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-beige-dark bg-white p-4 shadow-sm md:p-5">
        <label
          htmlFor="nationwide-region-search"
          className="block text-sm font-semibold text-navy"
        >
          지역 검색
        </label>
        <p className="mt-1 text-xs text-navy/60">
          예: 서울, 강남, 수원, 분당, 송도, 제주, 창원, 대구, 세종
        </p>
        <input
          id="nationwide-region-search"
          type="search"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="시·구·생활권 검색"
          className="mt-3 w-full min-h-12 rounded-xl border border-beige-dark bg-cream/40 px-4 text-base text-navy outline-none ring-navy/20 focus:ring-2"
        />
      </div>

      {results.length > 0 ? (
        <section className="space-y-3" aria-label="검색 결과">
          <h2 className="section-heading">검색 결과</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <li key={r.slug}>
                <Link
                  href={pathFor(r.slug)}
                  className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 text-sm font-medium text-navy no-underline hover:bg-beige/40"
                >
                  {r.primaryKeyword}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4" aria-label="권역별 안내">
        <h2 className="section-heading">권역별 상속등기 안내</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li
              key={group.label}
              className="rounded-xl border border-beige-dark bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-navy">{group.label}</p>
              <ul className="mt-2 space-y-1">
                {group.slugs.map((slug) => {
                  const def = bySlug.get(slug);
                  if (!def) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={pathFor(slug)}
                        className="text-sm text-navy/80 underline-offset-2 hover:underline"
                      >
                        {def.regionName} 상속등기
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
          <li className="rounded-xl border border-beige-dark bg-beige/30 p-4 shadow-sm">
            <p className="font-semibold text-navy">부산</p>
            <p className="mt-1 text-xs text-navy/65">
              신규 지역 페이지 대신 기존 안내로 연결합니다.
            </p>
            <Link
              href="/부산상속등기"
              className="mt-2 inline-block text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              부산 상속등기
            </Link>
          </li>
        </ul>
      </section>

      <section className="space-y-3" aria-label="광역 카드">
        <h2 className="section-heading">광역 단위 안내</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {metros.map((m) => (
            <li key={m.slug}>
              <Link
                href={pathFor(m.slug)}
                className="flex h-full flex-col rounded-xl border border-beige-dark bg-white p-4 no-underline hover:bg-beige/30"
              >
                <span className="font-semibold text-navy">{m.regionName}</span>
                <span className="mt-1 text-sm text-navy/70">{m.h1}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-label="공개 지역 전체">
        <h2 className="section-heading">공개된 지역·생활권</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((d) => (
            <li key={d.slug}>
              <Link
                href={pathFor(d.slug)}
                className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 text-sm text-navy no-underline hover:bg-beige/40"
              >
                {d.regionName}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
