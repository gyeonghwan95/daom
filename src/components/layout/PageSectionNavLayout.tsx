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
  const [sections, setSections] = useState<SectionNavItem[]>(staticSections);
  const dynamicDiscovery = usesDynamicSectionDiscovery(pathname);

  useEffect(() => {
    setSections(staticSections);
  }, [staticSections]);

  useEffect(() => {
    if (!dynamicDiscovery) return;

    const updateSections = () => {
      const discovered = discoverMdxSections();
      if (discovered.length >= 2) {
        setSections(discovered);
      }
    };

    updateSections();
    const timer = window.setTimeout(updateSections, 120);
    return () => window.clearTimeout(timer);
  }, [dynamicDiscovery, pathname]);

  if (isSectionNavExcluded(pathname) || sections.length < 2) {
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
