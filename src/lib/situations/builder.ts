import { getServiceImage } from "@/lib/site-images";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import type { SituationCategoryId } from "./categories";
import {
  getSituationCategoryById,
  getSituationCategoryBySlug,
  SITUATION_CATEGORY_ORDER,
} from "./categories";
import {
  getAllSituationPages,
  getRelatedSituationLinks,
  getSituationBySlug,
  getSituationsByCategory,
  situationsHub,
} from "./config";
import type { SituationPage } from "./types";

const SITUATION_CATEGORY_META_TITLES: Record<SituationCategoryId, string> = {
  "inheritance-death": "가족 사망·상속｜상속등기·포기·한정승인 상황별",
  "jeonse-lease": "전세·보증금｜미반환·임차권등기명령 상황별",
  "real-estate-trade": "부동산 매매·증여·등기｜잔금·말소·명의 상황별",
  "debt-rehab": "개인채무·회생·파산｜빚·압류·신청 가능 여부",
  "corporate-business": "법인·사업 운영｜설립·임원·본점이전 상황별",
  "debt-collection": "돈을 받지 못한 경우｜지급명령·강제집행 상황별",
  "contract-dispute": "계약·일상 분쟁｜계약금·내용증명·합의 상황별",
};

function collectInternalLinks(page: SituationPage) {
  const relatedSituations = getRelatedSituationLinks(page);
  return [
    ...relatedSituations,
    ...page.serviceLinks,
    ...page.diagnosisLinks,
    ...page.faqLinks,
    ...page.extraLinks,
    {
      href: getSituationCategoryById(page.situationCategory).path,
      label: `${getSituationCategoryById(page.situationCategory).label} 허브`,
    },
    { href: "/situations", label: "상황별 법률문제" },
    { href: "/자가진단", label: "자가진단" },
    { href: "/services", label: "업무안내" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "상담 문의" },
  ];
}

export function buildPageDataFromSituation(page: SituationPage): PageData {
  const category = getSituationCategoryById(page.situationCategory);
  const relatedSituations = getRelatedSituationLinks(page);

  const sections = [
    {
      title: "핵심 결론",
      body: page.conclusion,
    },
    {
      title: "이런 상황인가요?",
      body: "아래에 해당하면 이 안내가 도움이 될 수 있습니다.",
      items: page.situationChecklist,
    },
    {
      title: "지금 가장 먼저 할 일",
      body: "절차를 시작하기 전에 아래 항목을 순서대로 점검해 보세요.",
      items: page.firstChecks,
    },
    {
      title: "가능한 해결 방법",
      body: "상황에 따라 선택지가 달라집니다. 각 방법의 선택 기준을 함께 확인하세요.",
      items: page.solutions.map(
        (solution) =>
          `${solution.title}: ${solution.body} (선택 기준: ${solution.whenToChoose})`,
      ),
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
      title: "비용·기간에 영향을 주는 요소",
      body: "사건마다 다르지만, 아래 요소가 수임료·등기·법원 비용에 영향을 줍니다.",
      items: page.costFactors,
    },
    {
      title: "자주 하는 실수",
      body: "아래 실수는 기한·권리를 놓치거나 분쟁을 키우는 경우가 많습니다.",
      items: page.commonMistakes,
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
    ...(relatedSituations.length > 0
      ? [
          {
            title: "비슷한 상황 안내",
            body: "같은 분류 또는 연관된 상황 페이지입니다.",
            links: relatedSituations,
          },
        ]
      : []),
  ];

  return createPageData({
    slug: page.slug,
    path: page.path,
    category: "situation",
    title: page.cardTitle,
    metaTitle: buildMetaTitle(
      `${page.cardTitle}｜${page.searchIntent}`.slice(0, 40),
    ),
    metaDescription: buildMetaDescription(page.metaDescriptionBase),
    h1: page.h1,
    intro: page.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "상황별 법률문제", href: "/situations" },
      { label: category.label, href: category.path },
      { label: page.cardTitle },
    ],
    introParagraphs: [page.conclusion, page.intro],
    procedures: page.procedures,
    documents: page.documents,
    consultationPoints: page.lawyerNeededCases.slice(0, 5),
    faqs: page.faqs,
    consultationExample: page.caseExample,
    internalLinks: collectInternalLinks(page),
    sections,
    primaryKeywords: [page.cardTitle, page.searchIntent, category.label],
    serviceSlug: page.serviceSlug,
    ogImage: page.serviceSlug
      ? getServiceImage(page.serviceSlug).src
      : undefined,
    includeFaqSchema: true,
    ctaTitle: "지금 상황, 함께 정리해 드립니다",
    ctaText:
      "위 내용은 일반적인 안내이며, 법률·절차는 사건마다 달라질 수 있습니다. 사실관계·서류·기한을 확인한 뒤 다음 단계를 정하는 것이 좋습니다. 부산 해운대구·센텀 다옴법무사사무소에 연락 주시면 우선순위부터 정리해 드립니다.",
  });
}

export function buildSituationsHubPageData(): PageData {
  const situationCards = getAllSituationPages().map((page) => ({
    href: page.path,
    label: page.cardTitle,
  }));

  const categoryLinks = SITUATION_CATEGORY_ORDER.map((id) => {
    const cat = getSituationCategoryById(id);
    return { href: cat.path, label: cat.label };
  });

  return createPageData({
    slug: situationsHub.slug,
    path: situationsHub.path,
    category: "situation",
    title: "상황별 법률문제",
    metaTitle: buildMetaTitle("상황별 법률문제｜상속·전세·법인·채무"),
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
      ...categoryLinks,
      ...situationCards,
      { href: "/자가진단", label: "자가진단" },
      { href: "/services", label: "업무안내" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "상담 문의" },
      { href: "/glossary", label: "법률용어사전" },
    ],
    sections: [
      {
        title: "분류별 안내",
        body: "겪고 계신 문제와 가까운 분류를 선택하세요.",
        links: categoryLinks,
      },
      {
        title: "상황별 안내 목록",
        body: "지금 겪고 계신 문제에 가까운 항목을 선택하세요.",
        links: situationCards,
      },
    ],
    primaryKeywords: [
      "상황별 법률문제",
      "법률 상담",
      "상속",
      "전세",
      "개인회생",
      "채권회수",
    ],
    includeFaqSchema: true,
    ctaTitle: "막막할 때, 다음 한 걸음부터",
    ctaText:
      "혼자 검색하다 보면 용어만 늘어날 수 있습니다. 전화·카카오톡·네이버 톡톡으로 상황을 말씀해 주시면, 부산 다옴법무사사무소에서 우선순위를 함께 정리해 드립니다.",
  });
}

export function buildSituationCategoryHubPageData(
  categoryId: SituationCategoryId,
): PageData {
  const category = getSituationCategoryById(categoryId);
  const pages = getSituationsByCategory(categoryId);
  const pageLinks = pages.map((page) => ({
    href: page.path,
    label: page.cardTitle,
  }));

  return createPageData({
    slug: `situations-category-${category.id}`,
    path: category.path,
    category: "situation",
    title: category.label,
    metaTitle: buildMetaTitle(
      SITUATION_CATEGORY_META_TITLES[category.id] ??
        `${category.label}｜상황별 절차·확인사항`,
    ),
    metaDescription: buildMetaDescription(
      `${category.description} 지금 겪는 상황에서 먼저 확인할 일·절차·서류·관련 업무를 정리했습니다.`,
    ),
    h1: `${category.label} — 지금 겪는 문제부터 확인하기`,
    intro: category.hubIntro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "상황별 법률문제", href: "/situations" },
      { label: category.label },
    ],
    introParagraphs: [category.hubIntro],
    faqs: [
      {
        question: `${category.label} 상담은 어떻게 시작하나요?`,
        answer:
          "겪고 계신 상황을 말씀해 주시면, 관련 안내 페이지·자가진단·필요 서류를 함께 정리해 드립니다. 전화·카카오톡·방문(예약) 상담이 가능합니다.",
      },
      {
        question: "업무명을 몰라도 괜찮은가요?",
        answer:
          "네. 이 분류는 법률 업무명 대신 실제 생활 상황·검색 질문을 기준으로 구성했습니다. 가장 가까운 상황 페이지를 선택하시면 됩니다.",
      },
    ],
    internalLinks: [
      ...pageLinks,
      { href: "/situations", label: "상황별 법률문제 전체" },
      { href: "/자가진단", label: "자가진단" },
      { href: "/services", label: "업무안내" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: `${category.label} 안내 목록`,
        body: "아래에서 지금 상황과 가장 가까운 항목을 선택하세요.",
        links: pageLinks,
      },
    ],
    primaryKeywords: [category.label, category.shortLabel, "상황별 법률문제"],
    includeFaqSchema: true,
    ctaTitle: `${category.shortLabel} 문제, 다음 단계부터`,
    ctaText:
      "위 안내는 일반적인 참고용입니다. 사실관계·기한·서류는 사건마다 달라질 수 있으니, 막막할 때는 상담으로 우선순위를 함께 정해 보세요.",
  });
}

export function resolveSituationCategoryHubPageData(
  categorySlug: string,
): PageData | undefined {
  const category = getSituationCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return buildSituationCategoryHubPageData(category.id);
}

export function buildAllSituationCategoryHubPageData(): PageData[] {
  return SITUATION_CATEGORY_ORDER.map((id) =>
    buildSituationCategoryHubPageData(id),
  );
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
  getSituationsByCategory,
  getUrgentSituations,
  getPopularSituations,
  getRecentSituations,
  getRelatedSituationLinks,
  situationsHub,
} from "./config";

export {
  getAllSituationCategorySlugs,
  getSituationCategoryBySlug,
  getSituationCategoryById,
  SITUATION_CATEGORIES,
  SITUATION_CATEGORY_ORDER,
  SITUATION_CATEGORY_LABELS,
} from "./categories";

export type { SituationPage, SituationsHubConfig } from "./types";
