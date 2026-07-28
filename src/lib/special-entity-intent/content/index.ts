import type { SpecialEntityPageContent } from "../types";
import { SPECIAL_BODY_ENRICHMENTS } from "./body-enrichments";
import { specialEntityComparisonPages } from "./comparisons";
import { specialEntityHubPages } from "./hubs";
import { specialEntityIntentPages } from "./intents";
import { phase2AgriculturePages } from "./phase2-agriculture";
import { phase2ChangePages } from "./phase2-change";
import { phase2ComparisonPages } from "./phase2-comparisons";
import { phase2HubPages } from "./phase2-hubs";
import { phase2ProfessionalPages } from "./phase2-professional";
import { phase2SectorPages } from "./phase2-sector";
import { phase2SpecialLawPages } from "./phase2-special-law";
import { phase3BusanRegionalPages } from "./phase3-busan-regional";
import { phase3ProfessionalBoundaryPage } from "./phase3-professional-boundary";
import { phase3ProfessionalCorpPages } from "./phase3-professional-corps";
import { phase3ReligionExtensionPages } from "./phase3-religion-extension";
import {
  phase3RedevelopmentPages,
  phase3SocialEconomyPages,
} from "./phase3-social-redev";
import { phase3RegionalPages } from "./phase3-regional";
import { phase3ReligionPages } from "./phase3-religion";

const rawSpecialEntityPages: SpecialEntityPageContent[] = [
  ...specialEntityHubPages,
  ...phase2HubPages,
  ...specialEntityIntentPages,
  ...phase2SpecialLawPages,
  ...phase2AgriculturePages,
  ...phase2ProfessionalPages,
  ...phase3ProfessionalCorpPages,
  phase3ProfessionalBoundaryPage,
  ...phase2SectorPages,
  ...phase2ChangePages,
  ...phase3ReligionPages,
  ...phase3ReligionExtensionPages,
  ...phase3BusanRegionalPages,
  ...phase3RegionalPages,
  ...phase3SocialEconomyPages,
  ...phase3RedevelopmentPages,
  ...specialEntityComparisonPages,
  ...phase2ComparisonPages,
];

export const specialEntityPages: SpecialEntityPageContent[] =
  rawSpecialEntityPages.map((page) => {
    const extras = SPECIAL_BODY_ENRICHMENTS[page.slug];
    if (!extras?.length) return page;
    return {
      ...page,
      heroParagraphs: [...page.heroParagraphs, ...extras],
    };
  });

export function getSpecialEntityContent(
  slug: string,
): SpecialEntityPageContent | undefined {
  return specialEntityPages.find((p) => p.slug === slug);
}

export function getAllSpecialEntitySlugs(): string[] {
  return specialEntityPages.map((p) => p.slug);
}
