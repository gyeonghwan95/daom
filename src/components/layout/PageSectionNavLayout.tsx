"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { SectionNavigator } from "@/components/navigation/SectionNavigator";
import {
  getSectionsForPath,
  isSectionNavExcluded,
  usesDynamicSectionDiscovery,
} from "@/lib/section-nav/get-sections-for-path";
import type { SectionNavItem } from "@/lib/section-nav/types";

type PageSectionNavLayoutProps = {
  children: React.ReactNode;
};

const MDX_END_SECTIONS: SectionNavItem[] = [
  { id: "consultation", label: "상담 문의" },
  { id: "related", label: "관련 안내" },
];

/** 「이 글에서 확인할 내용」 목차 → 좌측 페이지 목차 */
function discoverPageTocSections(): SectionNavItem[] {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    "[data-page-toc] a[href^='#']",
  );

  const seen = new Set<string>();
  const items: SectionNavItem[] = [];

  for (const link of Array.from(links)) {
    const href = link.getAttribute("href");
    if (!href || href.length < 2) continue;
    const id = href.slice(1);
    if (!id || seen.has(id)) continue;
    if (!document.getElementById(id)) continue;

    seen.add(id);
    items.push({
      id,
      label: link.textContent?.trim() || id,
    });
  }

  return items;
}

function discoverMdxSections(): SectionNavItem[] {
  const headings = document.querySelectorAll<HTMLElement>(
    "#main-content article h2[id]",
  );

  const discovered = Array.from(headings).map((heading) => ({
    id: heading.id,
    label: heading.textContent?.trim() || heading.id,
  }));

  const endSections = MDX_END_SECTIONS.filter((section) =>
    document.getElementById(section.id),
  );

  return [...discovered, ...endSections];
}

export function PageSectionNavLayout({ children }: PageSectionNavLayoutProps) {
  const pathname = usePathname();
  const staticSections = useMemo(
    () => getSectionsForPath(pathname),
    [pathname],
  );
  const [dynamicSections, setDynamicSections] = useState<SectionNavItem[] | null>(
    null,
  );
  const [prevPathname, setPrevPathname] = useState(pathname);
  const mdxDiscovery = usesDynamicSectionDiscovery(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setDynamicSections(null);
  }

  const sections =
    dynamicSections && dynamicSections.length >= 2
      ? dynamicSections
      : staticSections;

  useEffect(() => {
    if (isSectionNavExcluded(pathname)) return;

    const updateSections = () => {
      const fromToc = discoverPageTocSections();
      if (fromToc.length >= 2) {
        setDynamicSections(fromToc);
        return;
      }

      if (mdxDiscovery) {
        const discovered = discoverMdxSections();
        if (discovered.length >= 2) {
          setDynamicSections(discovered);
          return;
        }
      }

      setDynamicSections(null);
    };

    updateSections();
    const timer = window.setTimeout(updateSections, 160);
    return () => window.clearTimeout(timer);
  }, [mdxDiscovery, pathname]);

  if (isSectionNavExcluded(pathname)) {
    return <div className="min-w-0">{children}</div>;
  }

  return (
    <div
      data-section-nav-grid
      className="lg:grid lg:grid-cols-[11.5rem_minmax(0,1fr)] xl:grid-cols-[12.5rem_minmax(0,1fr)] lg:items-stretch lg:gap-8 xl:gap-10"
    >
      <SectionNavigator sections={sections} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
