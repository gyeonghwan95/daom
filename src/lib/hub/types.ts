import type { PageCategory } from "@/lib/pageData/types";
import type { LocalLandingPageType } from "@/types/local-landing";
import type { SeoLandingPageType } from "@/lib/seo-landing/types";

export type HubTheme =
  | "region-lawyer"
  | "region-service"
  | "cost"
  | "documents"
  | "period"
  | "court"
  | "female-lawyer"
  | "industrial"
  | "maritime"
  | "inheritance"
  | "corporate"
  | "real-estate"
  | "rehab"
  | "general";

export type HubSpoke = {
  href: string;
  label: string;
};

export type CoreHub = {
  id: string;
  slug: string;
  title: string;
  theme: HubTheme;
  spokes: HubSpoke[];
};

export type HubLinkInput = {
  slug: string;
  path: string;
  category: PageCategory;
  title?: string;
  serviceSlug?: string;
  landingPageType?: LocalLandingPageType;
  regionKey?: string;
  seoLandingType?: SeoLandingPageType;
  intentSuffix?: string;
};
