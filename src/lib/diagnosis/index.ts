export {
  diagnosisHub,
  toPageConfig,
  DIAGNOSIS_CTA_TEXT,
  DIAGNOSIS_CTA_TITLE,
  DIAGNOSIS_SEO_KEYWORDS,
} from "@/data/diagnosis";
export {
  allDiagnoses,
  allDiagnosisPages,
  diagnosisHubPage,
  diagnosisTopicPages,
  getAllDiagnosisSlugs,
  getDiagnosisById,
  getDiagnosisBySlug,
  getDiagnosisTopicPages,
  getRawDiagnosisBySlug,
} from "@/data/diagnosis-registry";
export type {
  Diagnosis,
  DiagnosisCaseExample,
  DiagnosisOption,
  DiagnosisOutcome,
  DiagnosisPageConfig,
  DiagnosisQuestion,
  Option,
  Outcome,
  Question,
  QuestionType,
} from "@/data/diagnosis";
export { buildPageDataFromDiagnosis, getDiagnosisCtaCopy } from "./builder";
export {
  evaluateDiagnosis,
  resolveDiagnosisResult,
  type DiagnosisAnswers,
  type DiagnosisEvaluation,
} from "./evaluate";

import { getRawDiagnosisBySlug } from "@/data/diagnosis-registry";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { buildPageDataFromDiagnosis } from "./builder";

export function getDiagnosisPageDataBySlug(slug: string) {
  const config = getRawDiagnosisBySlug(normalizeRouteSlug(slug));
  if (!config) return undefined;
  return buildPageDataFromDiagnosis(config);
}

export function isDiagnosisSlug(slug: string): boolean {
  return Boolean(getRawDiagnosisBySlug(normalizeRouteSlug(slug)));
}
