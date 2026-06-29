import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import {
  CASE_CATEGORIES,
  CASE_REGIONS,
  CASE_SITUATION_TAGS,
} from "./types";

export function buildCasesHubPageData(): PageData {
  return createPageData({
    slug: "cases",
    path: "/cases",
    category: "core",
    title: "사례 탐색기",
    metaTitle: buildMetaTitle("사례 탐색기 — 부산 법무사 실무 사례"),
    metaDescription: buildMetaDescription(
      "상속·부동산등기·법인등기·전세보증금·민사서류·회생파산 등 업무별 사례를 카테고리·상황·지역으로 찾아볼 수 있습니다. 부산 다옴법무사사무소 안윤정 법무사 실무 사례.",
    ),
    h1: "나와 비슷한 사례를 찾아보세요",
    intro:
      "다옴법무사사무소에서 다룬 사례를 카테고리·상황·지역으로 검색할 수 있습니다. 개인정보는 비공개이며, 사건 유형과 처리 과정 위주로 안내합니다. 유사한 사례에서도 사실관계에 따라 절차·결과가 달라질 수 있습니다.",
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "사례 탐색기" },
    ],
    introParagraphs: [
      "상속·부동산·법인·채무 등 업무별로 비슷한 사례를 찾아 다음 단계를 점검해 보세요.",
    ],
    faqs: [
      {
        question: "사례 내용을 그대로 따라 해도 되나요?",
        answer:
          "아니요. 본 사례는 참고용이며, 유사한 사례에서도 사실관계·관할·서류에 따라 절차와 결과가 달라질 수 있습니다. 상담·서류 확인이 필요합니다.",
      },
      {
        question: "의뢰인 정보가 공개되나요?",
        answer:
          "아니요. 개인정보 보호를 위해 구체적 의뢰인 정보는 비공개하며, 사건 유형과 처리 과정 위주로 정리합니다.",
      },
    ],
    internalLinks: [
      { href: "/services", label: "업무안내" },
      { href: "/자가진단", label: "자가진단" },
      { href: "/tools", label: "법률 계산기" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: "탐색 가능한 분류",
        body: `카테고리 ${CASE_CATEGORIES.length}종, 상황 태그 ${CASE_SITUATION_TAGS.length}종, 지역 ${CASE_REGIONS.length}종으로 사례를 필터링할 수 있습니다.`,
        items: [
          ...CASE_CATEGORIES,
          ...CASE_SITUATION_TAGS.slice(0, 4),
          ...CASE_REGIONS.slice(0, 4),
        ],
      },
    ],
    primaryKeywords: [
      "부산 법무사 사례",
      "상속등기 사례",
      "부동산등기 사례",
      "법인등기 사례",
      "개인회생 사례",
      "부산 법무사",
    ],
    includeFaqSchema: true,
    ctaTitle: "비슷한 상황이시라면 상담으로 확인해 보세요",
    ctaText:
      "사례와 비슷해도 세부 사항에 따라 절차가 달라질 수 있습니다. 부산 해운대·센텀 다옴법무사사무소에 상황을 알려주시면 다음 단계를 함께 정리해 드립니다.",
  });
}

export function resolveCasesHubPageData(): PageData {
  return buildCasesHubPageData();
}
