import type { RelatedLink } from "@/types/content";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceDetail = {
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
