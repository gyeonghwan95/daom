import type { BuildingPageContent } from "../types";
import { buildingHubPages } from "./hubs";
import { buildingDemolitionPages } from "./demolition";
import { buildingPreservationSituationPages } from "./preservation-situations";
import { buildingDisplayChangePages } from "./display-change";
import { buildingSplitSpecialRegionalPages } from "./split-special-regional";

export const buildingPages: BuildingPageContent[] = [
  ...buildingHubPages,
  ...buildingDemolitionPages,
  ...buildingPreservationSituationPages,
  ...buildingDisplayChangePages,
  ...buildingSplitSpecialRegionalPages,
];

export function getBuildingContent(
  slug: string,
): BuildingPageContent | undefined {
  return buildingPages.find((p) => p.slug === slug);
}

export function getAllBuildingSlugs(): string[] {
  return buildingPages.map((p) => p.slug);
}
