import { getServiceImage } from "@/lib/site-images";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import {
  getAllToolDefinitions,
  getToolBySlug,
  toolsHub,
} from "./config";
import type { ToolDefinition } from "./types";

function collectInternalLinks(tool: ToolDefinition) {
  return [
    ...tool.serviceLinks,
    ...tool.diagnosisLinks,
    { href: "/tools", label: "법률 계산기" },
    { href: "/자가진단", label: "자가진단" },
    { href: "/situations", label: "상황별 법률문제" },
    { href: "/contact", label: "상담 문의" },
  ];
}

export function buildPageDataFromTool(tool: ToolDefinition): PageData {
  return createPageData({
    slug: tool.slug,
    path: tool.path,
    category: "tool",
    title: tool.cardTitle,
    metaTitle: buildMetaTitle(tool.h1.replace(/\?.*$/, "").slice(0, 26)),
    metaDescription: buildMetaDescription(tool.metaDescriptionBase),
    h1: tool.h1,
    intro: tool.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "법률 계산기", href: "/tools" },
      { label: tool.cardTitle },
    ],
    introParagraphs: [tool.intro],
    documents: tool.documents,
    consultationPoints: tool.defaultActions,
    faqs: tool.faqs,
    consultationExample: {
      title: `${tool.cardTitle} — 상담 예시`,
      body: "계산 결과를 바탕으로 전화·카카오톡으로 상황을 보내 주시면, 부산 해운대·센텀 사무소에서 서류·기한을 함께 검토해 드립니다.",
    },
    internalLinks: collectInternalLinks(tool),
    sections: [
      {
        title: "계산기 안내",
        body: tool.intro,
      },
      {
        title: "관련 자가진단",
        body: "질문에 답하며 위험도와 다음 절차를 확인할 수 있습니다.",
        links: tool.diagnosisLinks,
      },
      {
        title: "관련 업무안내",
        body: "절차·서류·비용을 항목별로 정리한 업무 페이지입니다.",
        links: tool.serviceLinks,
      },
    ],
    primaryKeywords: tool.primaryKeywords,
    serviceSlug: tool.serviceSlug,
    ogImage: tool.serviceSlug
      ? getServiceImage(tool.serviceSlug).src
      : undefined,
    includeFaqSchema: true,
    ctaTitle: "계산 결과, 함께 검토해 드립니다",
    ctaText:
      "참고용 계산 결과입니다. 실제 기한·비용·절차는 사건별로 달라질 수 있으니 부산 다옴법무사사무소에 연락 주세요.",
  });
}

export function buildToolsHubPageData(): PageData {
  const cards = getAllToolDefinitions().map((tool) => ({
    href: tool.path,
    label: tool.cardTitle,
  }));

  return createPageData({
    slug: toolsHub.slug,
    path: toolsHub.path,
    category: "tool",
    title: "법률 계산기",
    metaTitle: buildMetaTitle("법률 계산기 — 기한·비용 검토"),
    metaDescription: buildMetaDescription(toolsHub.metaDescriptionBase),
    h1: toolsHub.h1,
    intro: toolsHub.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "법률 계산기" },
    ],
    introParagraphs: [toolsHub.intro],
    faqs: toolsHub.faqs,
    consultationExample: {
      title: "계산만으로는 부족할 때",
      body: "기한·비용이 애매하면 상황을 말씀해 주세요. 해운대·센텀 사무소에서 서류와 함께 다음 단계를 정리해 드립니다.",
    },
    internalLinks: [
      ...cards,
      { href: "/자가진단", label: "자가진단" },
      { href: "/situations", label: "상황별 법률문제" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: "계산기 목록",
        body: "필요한 도구를 선택해 대략적인 기한·비용·서류를 검토해 보세요.",
        links: cards,
      },
    ],
    primaryKeywords: [
      "법률 계산기",
      "상속등기 기한",
      "상속포기 3개월",
      "한정승인 기간",
      "법인등기 과태료",
      "부산 법무사",
    ],
    includeFaqSchema: true,
    ctaTitle: "검토용 계산 후, 상담이 필요하다면",
    ctaText:
      "전화·카카오톡·네이버 톡톡으로 계산 결과와 상황을 보내 주시면 부산 다옴법무사사무소에서 확인해 드립니다.",
  });
}

export function resolveToolPageData(slug: string): PageData | undefined {
  const tool = getToolBySlug(slug);
  if (!tool) return undefined;
  return buildPageDataFromTool(tool);
}

export function resolveToolsHubPageData(): PageData {
  return buildToolsHubPageData();
}

export {
  getAllToolDefinitions,
  getAllToolSlugs,
  getToolBySlug,
  toolsHub,
} from "./config";
