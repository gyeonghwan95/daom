import type { ServiceFaq } from "@/types/service";

export type TopicHubLink = {
  href: string;
  label: string;
};

export type TopicHubSection = {
  title: string;
  intro: string;
  links: TopicHubLink[];
};

export type TopicHubConfig = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  primaryServiceSlug: string;
  intro: string;
  ctaDescription: string;
  sections: TopicHubSection[];
  relatedHubSlugs: string[];
  faqServiceSlugs: string[];
  jurisdictionHref?: string;
  costHref?: string;
  documentsHref?: string;
  /** '필요 서류' 목록. 없으면 공통 기본값을 쓴다(등기 업무 기준이라 회생·파산 허브는 따로 지정). */
  documents?: string[];
};

export type TopicHubPage = TopicHubConfig & {
  path: string;
  faqs: ServiceFaq[];
  relatedHubLinks: TopicHubLink[];
  lawyerOpinion: string;
};
