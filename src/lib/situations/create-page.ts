import type { SituationPage, SituationSolution } from "./types";

export type SituationPageInput = Omit<
  SituationPage,
  "path" | "relatedSituations"
> & {
  relatedSituationSlugs?: string[];
};

export function defineSituationPage(input: SituationPageInput): SituationPage {
  const relatedSituationSlugs = input.relatedSituationSlugs ?? [];
  return {
    ...input,
    path: `/situations/${input.slug}`,
    relatedSituations: relatedSituationSlugs,
    tags: input.tags ?? [input.searchIntent, input.cardTitle],
  };
}

export function solutions(
  items: SituationSolution[],
): SituationSolution[] {
  return items;
}
