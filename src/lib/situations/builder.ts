import { getServiceImage } from "@/lib/site-images";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import {
  getAllSituationPages,
  getSituationBySlug,
  situationsHub,
} from "./config";
import type { SituationPage } from "./types";

function collectInternalLinks(page: SituationPage) {
  return [
    ...page.serviceLinks,
    ...page.diagnosisLinks,
    ...page.faqLinks,
    ...page.extraLinks,
    { href: "/situations", label: "상황별 법률문제" },
    { href: "/자가진단", label: "자가진단" },
    { href: "/services", label: "업무안내" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "상담 문의" },
  ];
}

export function buildPageDataFromSituation(page: SituationPage): PageData {
  const sections = [
    {
      title: "이런 상황인가요?",
      body: "아래에 해당하면 이 안내가 도움이 될 수 있습니다.",
      items: page.situationChecklist,
    },
    {
      title: "먼저 확인해야 할 것",
      body: "절차를 시작하기 전에 아래 항목을 순서대로 점검해 보세요.",
      items: page.firstChecks,
    },
    {
      title: "혼자 처리해도 되는 경우",
      body: "다음에 해당하면 서류만 갖추고 직접 진행할 수 있는 경우가 많습니다.",
      items: page.selfHandleCases,
    },
    {
      title: "법무사 상담이 필요한 경우",
      body: "아래에 해당하면 사실관계·서류·기한을 함께 검토하는 것이 안전합니다.",
      items: page.lawyerNeededCases,
    },
    {
      title: "관련 자가진단",
      body: "질문에 답하며 위험도와 다음 절차를 확인할 수 있습니다.",
      links: page.diagnosisLinks,
    },
    {
      title: "관련 업무안내",
      body: "절차·서류·비용을 항목별로 정리한 업무 페이지입니다.",
      links: page.serviceLinks,
    },
    {
      title: "관련 FAQ",
      body: "자주 묻는 질문에서 세부 내용을 확인하세요.",
      links: page.faqLinks,
    },
  ];

  return createPageData({
    slug: page.slug,
    path: page.path,
    category: "situation",
    title: page.cardTitle,
    metaTitle: buildMetaTitle(page.h1.replace(/\?.*$/, "").slice(0, 24)),
    metaDescription: buildMetaDescription(page.metaDescriptionBase),
    h1: page.h1,
    intro: page.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "상황별 법률문제", href: "/situations" },
      { label: page.cardTitle },
    ],
    introParagraphs: [page.intro],
    procedures: page.procedures,
    documents: page.documents,
    consultationPoints: page.lawyerNeededCases.slice(0, 5),
    faqs: page.faqs,
    consultationExample: {
      title: `${page.cardTitle} — 부산 상담 예시`,
      body: `해운대·센텀 사무소에서 전화·카카오톡으로 상황을 듣고, 필요 서류와 다음 단계를 안내해 드립니다. 재송동·반여동 등 부산 전역 사건도 원격 진행이 가능합니다.`,
    },
    internalLinks: collectInternalLinks(page),
    sections,
    primaryKeywords: [
      page.cardTitle,
      "부산 법무사",
      "해운대 법무사",
      "센텀 법무사",
      "부산법무사",
    ],
    serviceSlug: page.serviceSlug,
    ogImage: page.serviceSlug
      ? getServiceImage(page.serviceSlug).src
      : undefined,
    includeFaqSchema: true,
    ctaTitle: "지금 상황, 함께 정리해 드립니다",
    ctaText:
      "위 내용은 일반적인 안내입니다. 사실관계·서류·기한은 사건마다 다릅니다. 부산 해운대구·센텀 다옴법무사사무소에 연락 주시면 다음에 무엇을 해야 할지부터 정리해 드립니다.",
  });
}

export function buildSituationsHubPageData(): PageData {
  const situationCards = getAllSituationPages().map((page) => ({
    href: page.path,
    label: page.cardTitle,
  }));

  return createPageData({
    slug: situationsHub.slug,
    path: situationsHub.path,
    category: "situation",
    title: "상황별 법률문제",
    metaTitle: buildMetaTitle("상황별 법률문제 안내"),
    metaDescription: buildMetaDescription(situationsHub.metaDescriptionBase),
    h1: situationsHub.h1,
    intro: situationsHub.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "상황별 법률문제" },
    ],
    introParagraphs: [situationsHub.intro],
    faqs: situationsHub.faqs,
    consultationExample: {
      title: "상황만 말씀해 주셔도 됩니다",
      body: "업무명을 몰라도 괜찮습니다. ‘부모님이 돌아가셨다’, ‘전세금을 못 받았다’처럼 겪고 계신 상황을 말씀해 주시면, 부산 해운대구·센텀 사무소에서 절차와 서류를 안내해 드립니다.",
    },
    internalLinks: [
      ...situationCards,
      { href: "/자가진단", label: "자가진단" },
      { href: "/services", label: "업무안내" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "상담 문의" },
      { href: "/해운대법무사", label: "해운대 법무사" },
      { href: "/센텀법무사", label: "센텀 법무사" },
    ],
    sections: [
      {
        title: "상황별 안내 목록",
        body: "지금 겪고 계신 문제에 가까운 항목을 선택하세요.",
        links: situationCards,
      },
    ],
    primaryKeywords: [
      "상황별 법률문제",
      "부산 법무사",
      "해운대 법무사",
      "센텀 법무사",
      "법률 상담",
    ],
    includeFaqSchema: true,
    ctaTitle: "막막할 때, 다음 한 걸음부터",
    ctaText:
      "혼자 검색하다 보면 용어만 늘어날 수 있습니다. 전화·카카오톡·네이버 톡톡으로 상황을 말씀해 주시면, 부산 다옴법무사사무소에서 우선순위를 함께 정리해 드립니다.",
  });
}

export function resolveSituationPageData(slug: string): PageData | undefined {
  const page = getSituationBySlug(slug);
  if (!page) return undefined;
  return buildPageDataFromSituation(page);
}

export function resolveSituationsHubPageData(): PageData {
  return buildSituationsHubPageData();
}

export {
  getAllSituationPages,
  getAllSituationSlugs,
  getSituationBySlug,
  situationsHub,
} from "./config";
