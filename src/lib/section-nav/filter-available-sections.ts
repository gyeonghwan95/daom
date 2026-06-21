import type { SectionNavItem } from "@/lib/section-nav/types";

export function filterAvailableSections(
  sections: SectionNavItem[],
): SectionNavItem[] {
  if (typeof document === "undefined") return sections;

  const available = sections.filter((section) =>
    document.getElementById(section.id),
  );

  return available.length >= 2 ? available : [];
}
