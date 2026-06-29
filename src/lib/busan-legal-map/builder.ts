import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import { busanLegalMapHub, getAllBusanDistricts } from "./config";

export function buildBusanLegalMapHubPageData(): PageData {
  const districts = getAllBusanDistricts();
  const districtLinks = districts.map((d) => ({
    href: d.hubPath,
    label: `${d.label} 법무사 안내`,
  }));

  return createPageData({
    slug: busanLegalMapHub.slug,
    path: busanLegalMapHub.path,
    category: "pillar",
    title: "부산 법률지도",
    metaTitle: buildMetaTitle("부산 법률지도 — 구·군별 상담 주제"),
    metaDescription: buildMetaDescription(busanLegalMapHub.metaDescriptionBase),
    h1: busanLegalMapHub.h1,
    intro: busanLegalMapHub.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "부산 법률지도" },
    ],
    introParagraphs: [busanLegalMapHub.intro],
    faqs: busanLegalMapHub.faqs,
    consultationExample: {
      title: "어느 구·군인지 모르겠을 때",
      body: "거주지나 부동산·법인 소재지를 알려주시면 관할과 다음 절차를 함께 정리해 드립니다. 해운대·센텀 사무소에서 부산 전역 상담이 가능합니다.",
    },
    internalLinks: [
      { href: "/부산법무사", label: "부산 법무사 허브" },
      ...districtLinks.slice(0, 8),
      { href: "/situations", label: "상황별 법률문제" },
      { href: "/tools", label: "법률 계산기" },
      { href: "/cases", label: "사례 탐색기" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: "지역별 안내",
        body: "16개 구·군 카드에서 생활권·많이 찾는 업무·관련 페이지로 이동할 수 있습니다.",
        links: districtLinks,
      },
    ],
    primaryKeywords: [
      "부산 법률지도",
      "부산 법무사",
      "해운대 법무사",
      "센텀 법무사",
      "상속등기",
      "부동산등기",
      "법인등기",
      "해운대구",
      "연제구",
      "동래구",
    ],
    includeFaqSchema: true,
    ctaTitle: "내 지역, 어떤 절차부터 볼까요?",
    ctaText:
      "구·군과 상황을 알려주시면 부산 다옴법무사사무소에서 서류·기한·다음 단계를 함께 정리해 드립니다. 전화·카카오톡·네이버 톡톡 상담이 가능합니다.",
  });
}

export function resolveBusanLegalMapHubPageData(): PageData {
  return buildBusanLegalMapHubPageData();
}
