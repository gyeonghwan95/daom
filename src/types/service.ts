import type { RelatedLink } from "@/types/content";
import type { ContentRelations } from "@/types/content-relations";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceDetail = ContentRelations & {
  slug: string;
  title: string;
  description: string;
  intro: string;
  whenNeeded: string;
  procedures: string[];
  documents: string[];
  commonIssues: string[];
  ourApproach: string;
  faqs: ServiceFaq[];
  relatedCase?: RelatedLink;
  relatedLinks: RelatedLink[];
};
