import { sectionNavByPath, serviceDetailSections } from "@/lib/section-nav/config";
import type { SectionNavItem } from "@/lib/section-nav/types";

function normalizePath(pathname: string): string {
  return pathname.split("?")[0].split("#")[0];
}

export function isSectionNavExcluded(pathname: string): boolean {
  const path = normalizePath(pathname);

  if (path === "/") return true;
  if (path.startsWith("/admin")) return true;
  if (path === "/cases" || path.startsWith("/cases/")) return true;
  if (path === "/press" || path.startsWith("/press/")) return true;

  return false;
}

export function isMdxArticlePath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return (
    path.startsWith("/blog/") ||
    path.startsWith("/faq/") ||
    path.startsWith("/services/cases/")
  );
}

export function isPressArticlePath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return path.startsWith("/media/") && path !== "/media";
}

export function usesDynamicSectionDiscovery(pathname: string): boolean {
  return isMdxArticlePath(pathname);
}

export function getSectionsForPath(pathname: string): SectionNavItem[] {
  const path = normalizePath(pathname);

  if (isSectionNavExcluded(path)) return [];

  if (path in sectionNavByPath) {
    return sectionNavByPath[path];
  }

  if (path.startsWith("/services/") && !path.startsWith("/services/cases/")) {
    return serviceDetailSections;
  }

  if (isPressArticlePath(path)) {
    return [
      { id: "article", label: "기사 본문" },
      { id: "related", label: "관련 안내" },
    ];
  }

  if (usesDynamicSectionDiscovery(path)) {
    return [];
  }

  return [];
}
