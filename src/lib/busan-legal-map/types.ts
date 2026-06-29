import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";

export type BusanDistrictDef = {
  id: string;
  regionKey: string;
  label: string;
  neighborhoods: string[];
  context: string;
  commonServices: string[];
  keywords: string[];
  hubPath: string;
  serviceLinks: PageRelatedLink[];
  situationLinks: PageRelatedLink[];
};

export type BusanLegalMapHubConfig = {
  slug: string;
  path: string;
  h1: string;
  intro: string;
  metaDescriptionBase: string;
  faqs: PageFaqItem[];
  districts: BusanDistrictDef[];
};
