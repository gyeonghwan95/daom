import type { CorporatePageContent } from "../types";
import { corporateHubPage } from "./hub";
import { corporateIntentPages } from "./intents";

export const corporatePages: CorporatePageContent[] = [
  corporateHubPage,
  ...corporateIntentPages,
];

export function getCorporateContent(slug: string): CorporatePageContent | undefined {
  return corporatePages.find((p) => p.slug === slug);
}

export function getAllCorporateSlugs(): string[] {
  return corporatePages.map((p) => p.slug);
}
