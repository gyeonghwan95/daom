import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";
import type { ContentRelations } from "@/types/content-relations";

export const TOOL_DISCLAIMER =
  "본 계산 결과는 일반적인 안내를 위한 것이며, 실제 비용·기한·절차는 사안별 서류, 관할, 등기원인, 당사자 상황에 따라 달라질 수 있습니다.";

export type ToolCalculatorType =
  | "inheritance-registration-deadline"
  | "inheritance-renunciation-deadline"
  | "director-change-penalty"
  | "head-office-move-deadline"
  | "jeonse-deposit-timeline"
  | "payment-order-fee"
  | "real-estate-documents"
  | "rehab-income-debt";

export type ToolUrgency = "low" | "caution" | "urgent";

export type ToolCalculatorInput = Record<string, string | string[] | boolean>;

export type ToolCalculatorResult = {
  summary: string;
  details: string[];
  urgency: ToolUrgency;
  actions: string[];
  timeline?: { label: string; date?: string; note?: string }[];
};

export type ToolDefinition = ContentRelations & {
  slug: string;
  path: string;
  calculatorType: ToolCalculatorType;
  cardTitle: string;
  cardDescription: string;
  h1: string;
  intro: string;
  metaDescriptionBase: string;
  primaryKeywords: string[];
  documents: string[];
  defaultActions: string[];
  diagnosisLinks: PageRelatedLink[];
  serviceLinks: PageRelatedLink[];
  faqs: PageFaqItem[];
  serviceSlug?: string;
};

export type ToolsHubConfig = {
  slug: string;
  path: string;
  h1: string;
  intro: string;
  metaDescriptionBase: string;
  faqs: PageFaqItem[];
};
