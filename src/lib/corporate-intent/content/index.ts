import type { CorporatePageContent } from "../types";
import { corporateHubPage } from "./hub";
import { corporateIntentPages } from "./intents";
import { corporateGapPages } from "./phase-gaps";
import { corporateClusterPhase1Pages } from "./cluster-phase1";

export const corporatePages: CorporatePageContent[] = [
  corporateHubPage,
  ...corporateIntentPages,
  ...corporateGapPages,
  ...corporateClusterPhase1Pages,
];

export function getCorporateContent(slug: string): CorporatePageContent | undefined {
  return corporatePages.find((p) => p.slug === slug);
}

export function getAllCorporateSlugs(): string[] {
  return corporatePages.map((p) => p.slug);
}
