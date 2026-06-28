import type { Diagnosis } from "../diagnosis";
import { SUPPLEMENT_BY_SLUG } from "./supplements";
import type { DiagnosisSeoPack } from "./types";

export function applyDiagnosisSeo(
  diagnosis: Diagnosis,
  seo: DiagnosisSeoPack,
): Diagnosis {
  const introLead =
    seo.introLead ??
    `${diagnosis.serviceName} 절차·서류·기한을 질문으로 점검한 뒤, 아래 안내와 함께 검토해 보세요.`;

  const supplement = SUPPLEMENT_BY_SLUG[diagnosis.slug];
  const resultExplanation = [
    ...seo.resultExplanation,
    ...(supplement?.resultExplanation ?? []),
  ];
  const conceptParagraphs = [
    ...seo.conceptParagraphs,
    ...(supplement?.conceptParagraphs ?? []),
  ];

  return {
    ...diagnosis,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    h1: seo.h1 ?? diagnosis.h1,
    intro: [introLead, ...conceptParagraphs.slice(0, 1)],
    resultExplanation,
    conceptParagraphs,
    busanConsultationTypes: seo.busanConsultationTypes,
    targetUsers: seo.busanConsultationTypes,
    requiredDocuments: seo.requiredDocuments ?? diagnosis.requiredDocuments,
    processSteps: seo.processSteps ?? diagnosis.processSteps,
    costFactors: seo.costFactors ?? diagnosis.costFactors,
    deadlineWarnings: seo.deadlineWarnings ?? diagnosis.deadlineWarnings,
    caseExample: seo.caseExample ?? diagnosis.caseExample,
    faqs: seo.faqs ?? diagnosis.faqs,
  };
}
