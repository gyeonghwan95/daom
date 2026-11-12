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
  /** 하위 페이지에 노출할 spoke 수(기본 12). 담당 페이지를 추가하면서 기존 링크가 밀리지 않게 늘린다. */
  childSpokeLimit?: number;
  /** 하위 페이지의 상위 허브 링크 문구(기본 「{title} 허브로 돌아가기」) */
  backLabel?: string;
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
