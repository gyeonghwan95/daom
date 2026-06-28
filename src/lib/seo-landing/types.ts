import type { PageCategory } from "@/lib/pageData/types";

export type SeoLandingPageType =
  | "region-lawyer"
  | "region-service"
  | "service-intent"
  | "institution-lawyer"
  | "institution-service"
  | "special";

export type SeoLandingSpec = {
  slug: string;
  path: string;
  type: SeoLandingPageType;
  title: string;
  h1: string;
  priority: number;
  isHub: boolean;
  category: PageCategory;
  regionId?: string;
  regionLabel?: string;
  regionKey?: string;
  serviceId?: string;
  serviceName?: string;
  serviceSiteSlug?: string;
  intentId?: string;
  intentSuffix?: string;
  institutionId?: string;
  institutionName?: string;
  institutionShortName?: string;
  specialId?: string;
  keywords: string[];
  seed: string;
};
