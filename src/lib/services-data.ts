import { serviceDetailsPart2 } from "@/lib/service-details-part2";
import { serviceDetails } from "@/lib/service-details-part1";
import type { ServiceDetail } from "@/types/service";
import { normalizeRouteSlug } from "@/lib/seo/slug";

export const allServiceDetails: ServiceDetail[] = [
  ...serviceDetails,
  ...serviceDetailsPart2,
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  const key = normalizeRouteSlug(slug);
  return allServiceDetails.find((s) => normalizeRouteSlug(s.slug) === key);
}

export function getAllServiceSlugs(): string[] {
  return allServiceDetails.map((s) => s.slug);
}
