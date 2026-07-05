"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SidebarConsultationPanelFixed } from "@/components/consultation/SidebarConsultationPanelFixed";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { filterAvailableSections } from "@/lib/section-nav/filter-available-sections";
import {
  computeSectionNavFixedLayout,
  getSectionNavRootMargin,
} from "@/lib/section-nav/scroll-spy";
import type { SectionNavItem } from "@/lib/section-nav/types";

type SectionNavigatorProps = {
  sections: SectionNavItem[];
};

type NavLayout = {
  left: number;
  width: number;
};

export function SectionNavigator({ sections }: SectionNavigatorProps) {
  const reduced = useReducedMotion();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [availableSections, setAvailableSections] = useState(sections);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [layout, setLayout] = useState<NavLayout>({ left: 0, width: 0 });
  const [isReady, setIsReady] = useState(false);

  const showToc = availableSections.length >= 2;

  useEffect(() => {
    const updateAvailable = () => {
      setAvailableSections(filterAvailableSections(sections));
    };

    updateAvailable();
    const timer = window.setTimeout(updateAvailable, 160);
    return () => window.clearTimeout(timer);
  }, [sections]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const syncLayout = () => {
      if (!anchorRef.current) return;

      const next = computeSectionNavFixedLayout(anchorRef.current);
      setLayout(next);
      setIsReady(next.width > 0);
    };

    syncLayout();
    const timer = window.setTimeout(syncLayout, 160);

    window.addEventListener("resize", syncLayout);

    const resizeObserver = new ResizeObserver(syncLayout);
    resizeObserver.observe(anchor);

    const grid = anchor.closest("[data-section-nav-grid]");
    if (grid instanceof HTMLElement) {
      resizeObserver.observe(grid);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", syncLayout);
      resizeObserver.disconnect();
    };
  }, [availableSections.length]);

  const scrollToSection = useCallback(
    (id: string) => {
      const element = document.getElementById(id);
      if (!element) return;

      setActiveId(id);
      element.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduced],
  );

  useEffect(() => {
    if (!showToc) return;

    const visibleIds = new Set<string>();
    let observer: IntersectionObserver | null = null;

    const attachObserver = () => {
      observer?.disconnect();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            if (!id) return;

            if (entry.isIntersecting) {
              visibleIds.add(id);
            } else {
              visibleIds.delete(id);
            }
          });

          const matched = availableSections.find((section) =>
            visibleIds.has(section.id),
          );
          if (matched) {
            setActiveId(matched.id);
          }
        },
        {
          rootMargin: getSectionNavRootMargin(),
          threshold: 0,
        },
      );

      availableSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer?.observe(element);
      });
    };

    attachObserver();
    window.addEventListener("resize", attachObserver);

    return () => {
      window.removeEventListener("resize", attachObserver);
      observer?.disconnect();
    };
  }, [availableSections, showToc]);

  const resolvedActiveId = availableSections.some(
    (section) => section.id === activeId,
  )
    ? activeId
    : (availableSections[0]?.id ?? "");

  return (
    <>
      <div
        ref={anchorRef}
        className="hidden h-full min-h-full w-full lg:block"
        aria-hidden
      />

      {showToc ? (
        <nav
          aria-label="페이지 목차"
          className={`fixed z-30 hidden overflow-y-auto pr-1 lg:block ${
            isReady ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{
            top: "calc(var(--header-height) + 1.25rem)",
            left: layout.left,
            width: layout.width,
            maxHeight:
              "calc(100dvh - var(--header-height) - var(--sidebar-consult-panel-reserve, 21.5rem))",
          }}
        >
          <p className="mb-3 text-xs font-semibold tracking-wide text-navy-light/80">
            페이지 목차
          </p>
          <ul className="space-y-1 border-l border-beige-dark/90">
            {availableSections.map((section) => {
              const isActive = section.id === resolvedActiveId;

              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`block w-full border-l-2 py-1.5 pl-3 text-left text-[13px] leading-snug transition-colors duration-300 ${
                      isActive
                        ? "border-navy font-semibold text-navy"
                        : "border-transparent text-navy/55 hover:border-navy/25 hover:text-navy"
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}

      <SidebarConsultationPanelFixed
        left={layout.left}
        width={layout.width}
        isReady={isReady}
      />
    </>
  );
}
