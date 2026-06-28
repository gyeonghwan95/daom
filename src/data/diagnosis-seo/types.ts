import type { PageFaqItem } from "@/lib/pageData/types";
import type { Diagnosis } from "../diagnosis";

export type DiagnosisSeoPack = {
  metaTitle: string;
  metaDescription: string;
  h1?: string;
  introLead?: string;
  resultExplanation: string[];
  conceptParagraphs: string[];
  busanConsultationTypes: string[];
  faqs?: PageFaqItem[];
  requiredDocuments?: string[];
  processSteps?: string[];
  costFactors?: string[];
  deadlineWarnings?: string[];
  caseExample?: Diagnosis["caseExample"];
};
