import type { CorporatePageContent } from "../types";
import { corporateHubPage } from "./hub";
import { corporateIntentPages } from "./intents";
import { corporateGapPages } from "./phase-gaps";

export const corporatePages: CorporatePageContent[] = [
  corporateHubPage,
  ...corporateIntentPages,
  ...corporateGapPages,
];

export function getCorporateContent(slug: string): CorporatePageContent | undefined {
  return corporatePages.find((p) => p.slug === slug);
}

export function getAllCorporateSlugs(): string[] {
  return corporatePages.map((p) => p.slug);
}
