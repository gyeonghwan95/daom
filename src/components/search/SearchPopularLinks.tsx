"use client";

import Link from "next/link";
import { SEARCH_POPULAR_LINKS } from "@/lib/search/popular-links";

type SearchPopularLinksProps = {
  onNavigate?: () => void;
};

const GROUPS = [
  {
    key: "service" as const,
    title: "많이 찾는 업무",
  },
  {
    key: "region" as const,
    title: "자주 찾는 지역",
  },
  {
    key: "lecture" as const,
    title: "강의·특강",
  },
  {
    key: "menu" as const,
    title: "빠른 메뉴",
  },
];

export function SearchPopularLinks({ onNavigate }: SearchPopularLinksProps) {
  return (
    <div className="space-y-4">
      {GROUPS.map((group) => {
        const links = SEARCH_POPULAR_LINKS.filter(
          (link) => link.group === group.key,
        );
        if (links.length === 0) return null;

        return (
          <section key={group.key} aria-label={group.title}>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-navy/70">
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={`${group.key}-${link.href}`}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="inline-flex rounded-lg border border-beige-dark bg-cream/60 px-3 py-1.5 text-xs font-medium text-navy no-underline transition-colors hover:border-navy/25 hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
