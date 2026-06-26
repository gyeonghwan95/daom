import { getServiceBySlug } from "@/lib/services-data";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import type { TopicHubPage } from "./types";
import { getTopicHubConfig } from "./config";

export function buildTopicHubPage(slug: string): TopicHubPage | null {
  const config = getTopicHubConfig(slug);
  if (!config) return null;

  const faqs = config.faqServiceSlugs.flatMap((serviceSlug) => {
    const service = getServiceBySlug(serviceSlug);
    return service?.faqs.slice(0, 3) ?? [];
  });

  const uniqueFaqs = faqs.filter(
    (faq, index, arr) =>
      arr.findIndex((f) => f.question === faq.question) === index,
  ).slice(0, 8);

  const relatedHubLinks = config.relatedHubSlugs.map((hubSlug) => {
    const hub = getTopicHubConfig(hubSlug);
    return {
      href: `/${hubSlug}`,
      label: hub ? `${hub.title} 보기` : hubSlug,
    };
  });

  const lawyerOpinion = `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 부산 전역 ${config.title.replace(" 종합 안내", "")} 사건을 상담·진행합니다. 법무사·공인중개사·신용관리사 자격과 대한법무사협회 표창, 부산 시민도서관·자립지원전담기관 법률 강의 경험을 바탕으로 절차와 비용을 알기 쉽게 설명합니다. 막막할수록 ‘지금 무엇부터 해야 하는지’를 정리하는 것이 우선이라고 생각합니다.`;

  return {
    ...config,
    path: `/${slug}`,
    faqs: uniqueFaqs,
    relatedHubLinks,
    lawyerOpinion,
  };
}

export function getTopicHubBySlug(slug: string): TopicHubPage | null {
  return buildTopicHubPage(slug);
}
