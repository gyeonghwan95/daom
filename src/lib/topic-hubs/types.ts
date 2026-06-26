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
};

export type TopicHubPage = TopicHubConfig & {
  path: string;
  faqs: ServiceFaq[];
  relatedHubLinks: TopicHubLink[];
  lawyerOpinion: string;
};
