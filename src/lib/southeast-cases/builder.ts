import { createPageData } from "@/lib/pageData/template-helpers";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import type { PageData, PageSection } from "@/lib/pageData/types";
import {
  inquiryRegionFromSoutheast,
  southeastPath,
  type SoutheastLandingDef,
} from "./types";

const DISCLAIMER =
  "본 안내는 일반적인 정보이며, 개별 사건은 서류·관할·등기원인을 확인한 뒤 달라질 수 있습니다. 실제 수행하지 않은 사건을 성공사례처럼 단정하지 않습니다.";

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function resolveHref(slug: string): { href: string; label: string } {
  if (slug.startsWith("/")) {
    return { href: slug, label: slug.replace(/^\//, "") };
  }
  if (slug === "부산상속등기") {
    return { href: "/부산상속등기", label: "부산 상속등기" };
  }
  if (slug === "부산법인등기") {
    return { href: "/부산법인등기", label: "부산 법인등기" };
  }
  return { href: southeastPath(slug), label: slug };
}

function sectionTitles(def: SoutheastLandingDef, seed: number): string[] {
  const r = def.regionName;
  const pools = [
    [
      `${r} 업무 가능 여부`,
      "부산 해운대 사무소라는 안내",
      "관할 특례와 법정 관할",
      `${r}에서 자주 문의되는 상황`,
      "방문 상담이 적합한 경우",
      "비대면으로 먼저 검토하는 경우",
      "필요서류·비용·절차",
      "관련 지역·업무로 이어가기",
    ],
    [
      `검색하신 ${r} 질문에 대한 답변`,
      "지점이 아니라는 점",
      def.regionGroup === "울산"
        ? "부산과 인접한 지역의 진행 방식"
        : "거리가 있어도 서류를 먼저 확인하는 방법",
      `${r} 고유 상담 상황`,
      "재산유형별 확인사항",
      "안윤정 법무사 직접 확인",
      "보수와 공과금 구분",
      "상담 전 준비하면 좋은 정보",
    ],
  ];
  return pools[seed % pools.length]!;
}

export function buildSoutheastPageData(
  def: SoutheastLandingDef,
  catalog: Map<string, SoutheastLandingDef>,
): PageData {
  const seed = hashSlug(def.slug);
  const titles = sectionTitles(def, seed);
  const region = inquiryRegionFromSoutheast(def);
  const field =
    def.pageType.startsWith("corporate")
      ? "corporate-registration"
      : def.pageType === "renunciation" || def.pageType === "limited-acceptance"
        ? "inheritance-renunciation"
        : "inheritance-registration";
  const inquiry = `/contact/inquiry?from=nationwide&region=${encodeURIComponent(region)}&field=${field}`;

  const regionLinks = def.relatedRegionSlugs.map((slug) => {
    const target = catalog.get(slug);
    if (target) {
      return { href: southeastPath(slug), label: target.primaryKeyword };
    }
    return resolveHref(slug);
  });
  const serviceLinks = def.relatedServiceSlugs.map(resolveHref);

  const hubPath =
    def.regionGroup === "울산"
      ? southeastPath("울산법무사업무")
      : def.regionGroup === "대구"
        ? southeastPath("대구법무사업무")
        : southeastPath("경북법무사업무");

  const sections: PageSection[] = [
    {
      title: titles[0]!,
      body: def.heroDescription,
      items: [
        "안윤정 법무사 직접 확인",
        "보수와 공과금 구분",
        "진행 가능 여부 사전 안내",
        "접수·보정·완료 공유",
      ],
    },
    { title: titles[1]!, body: def.officeDisclosure },
    { title: titles[2]!, body: def.legalScopeNotice },
    {
      title: titles[3]!,
      body: "일반적인 상담 유형으로 정리했습니다. 개별 가능 여부는 서류 확인 후 안내합니다.",
      items: def.scenarioTitles.map(
        (t, i) => `${t}: ${def.scenarioBodies[i] ?? ""}`,
      ),
    },
    { title: titles[4]!, body: def.visitHint },
    { title: titles[5]!, body: def.remoteHint },
    {
      title: titles[6]!,
      body: "서류가 모두 없어도 부동산 소재지와 가족관계·법인 개요만으로 먼저 확인할 자료를 안내합니다.",
      items: [
        "부동산·법인 소재 지역",
        "상속인·임원 수",
        "협의·매도·이전 일정",
        ...def.propertyTypes.map((p) => `재산·업무 유형: ${p}`),
      ],
    },
    {
      title: titles[7]!,
      body: "처음 보이는 금액만 낮게 안내하기보다 취득세·등록면허세·국민주택채권·등기신청수수료와 법무사 보수를 구분해 설명합니다.",
      links: [...regionLinks, ...serviceLinks].slice(0, 10),
    },
  ];

  if (def.pageType === "region-hub") {
    sections.unshift({
      title: `${def.regionGroup}에서 의뢰할 수 있는 업무`,
      body: "상속·유증등기, 복잡한 토지상속, 법인등기·본점이전, 공동근저당 등을 관할과 비대면 범위로 구분해 안내합니다.",
    });
  }

  return createPageData({
    slug: def.slug,
    path: southeastPath(def.slug),
    category: "case",
    title: def.primaryKeyword,
    metaTitle: buildMetaTitle(def.seoTitle),
    metaDescription: buildMetaDescription(def.metaDescription),
    h1: def.h1,
    intro: def.heroDescription,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무 사례", href: "/업무사례" },
      { label: `${def.regionGroup} 지역 업무사례`, href: hubPath },
      { label: def.regionName },
    ],
    introParagraphs: [def.heroDescription, def.officeDisclosure, DISCLAIMER],
    procedures: [
      `${region} 소재·문의 업무 공유`,
      "관할·방문·비대면 범위 검토",
      "보수·공과금 구분 안내",
      "원본 전달 후 접수·보정·완료 공유",
    ],
    documents: [
      "부동산·법인 소재 지역",
      "의뢰인 거주 지역",
      "상속인·임원 등 관련 인원",
      "준비된 서류(사진 가능)",
    ],
    consultationPoints: [
      "가까운 사무소인지도 중요하지만, 누가 직접 검토하고 비용·진행을 얼마나 구체적으로 설명하는지도 확인하세요.",
      "서류가 모두 준비되지 않아도 됩니다.",
      def.regionGroup === "울산"
        ? "울산은 부산과 인접해 방문·비대면 중 편한 방식을 먼저 검토할 수 있습니다."
        : "거리가 있어도 전화·카카오톡·전자문서·등기우편으로 먼저 확인할 수 있습니다.",
    ],
    faqs: def.uniqueFaqs,
    consultationExample: {
      title: "일반적인 상담 유형",
      body: def.scenarioBodies.slice(0, 2).join(" "),
    },
    sections,
    primaryKeywords: [def.primaryKeyword, ...def.secondaryKeywords],
    internalLinks: [
      ...regionLinks.slice(0, 5),
      ...serviceLinks.slice(0, 3),
      { href: inquiry, label: def.ctaTitle },
    ],
    ctaTitle: def.ctaTitle,
    ctaText: def.ctaDescription,
    includeFaqSchema: def.uniqueFaqs.length > 0,
  });
}

export function buildAllSoutheastPageData(
  published: SoutheastLandingDef[],
): PageData[] {
  const catalog = new Map(published.map((d) => [d.slug, d]));
  return published.map((d) => buildSoutheastPageData(d, catalog));
}
