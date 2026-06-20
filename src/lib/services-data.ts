import { serviceDetailsPart2 } from "@/lib/service-details-part2";
import { serviceDetails } from "@/lib/service-details-part1";
import type { ServiceDetail } from "@/types/service";

export const allServiceDetails: ServiceDetail[] = [
  ...serviceDetails,
  ...serviceDetailsPart2,
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return allServiceDetails.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return allServiceDetails.map((s) => s.slug);
}
