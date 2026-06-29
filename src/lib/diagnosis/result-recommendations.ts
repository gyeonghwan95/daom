import "server-only";

import type { Diagnosis } from "@/data/diagnosis";
import type { PageRelatedLink } from "@/lib/pageData/types";
import type { RecommendationGroups } from "@/lib/internal-links";
import {
  recommendInternalLinks,
  recommendationFromDiagnosis,
} from "@/lib/internal-links/server";

export type DiagnosisRecommendationGroups = {
  services: PageRelatedLink[];
  faqs: PageRelatedLink[];
  cases: PageRelatedLink[];
  blogs: PageRelatedLink[];
  diagnosis?: PageRelatedLink[];
  glossary?: PageRelatedLink[];
  situations?: PageRelatedLink[];
  tools?: PageRelatedLink[];
};

function pickGroups(groups: RecommendationGroups): DiagnosisRecommendationGroups {
  return {
    services: groups.services ?? [],
    faqs: groups.faqs ?? [],
    cases: groups.cases ?? [],
    blogs: groups.blogs ?? [],
    diagnosis: groups.diagnosis,
    glossary: groups.glossary,
    situations: groups.situations,
    tools: groups.tools,
  };
}

export function getDiagnosisResultRecommendations(
  diagnosis: Diagnosis,
): DiagnosisRecommendationGroups {
  return pickGroups(recommendInternalLinks(recommendationFromDiagnosis(diagnosis)));
}
