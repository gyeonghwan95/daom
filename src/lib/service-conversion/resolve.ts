import type { PageData } from "@/lib/pageData/types";
import { getServiceConversionConfig } from "@/lib/service-conversion";

export function resolveConversionKey(page: PageData): string | null {
  if (getServiceConversionConfig(page.slug)) {
    return page.slug;
  }

  const pathKey = page.path.replace(/^\//, "");
  if (getServiceConversionConfig(pathKey)) {
    return pathKey;
  }

  return null;
}

export function hasConversionEnhancements(page: PageData): boolean {
  return resolveConversionKey(page) !== null;
}
