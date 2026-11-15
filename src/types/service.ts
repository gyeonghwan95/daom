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
  /** 업무 목록 카드에 보일 한두 문장. 없으면 intro 앞 문장을 쓴다(description은 검색용이라 카드에 쓰지 않는다) */
  cardDescription?: string;
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
