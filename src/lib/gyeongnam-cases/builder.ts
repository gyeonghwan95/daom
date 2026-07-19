import { createPageData } from "@/lib/pageData/template-helpers";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import type { PageData, PageSection } from "@/lib/pageData/types";
import {
  gyeongnamPath,
  inquiryRegionFromDef,
  type GyeongnamLandingDef,
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
  return { href: gyeongnamPath(slug), label: slug };
}

function sectionTitles(def: GyeongnamLandingDef, seed: number): string[] {
  const r = def.regionName;
  const pools = [
    [
      `${r} ${def.primaryKeyword.includes("법인") ? "법인등기" : "상속등기"} 가능 여부`,
      "부산 해운대 사무소에 맡길 수 있는 이유",
      "관할·신청 방식 안내",
      `${r}에서 자주 문의되는 상황`,
      "방문 상담이 적합한 경우",
      "비대면으로 먼저 검토하는 경우",
      "필요서류와 진행 절차",
      "법무사 보수와 공과금",
    ],
    [
      `검색하신 ${r} 업무에 대한 바로 답변`,
      "사무소 위치와 지점 안내(오인 방지)",
      "법정 관할과 특례를 구분하는 방법",
      `${r} 고유 상담 상황`,
      "가까운 경남이라 방문하고 싶을 때",
      "서류 사진으로 시작하는 방법",
      "비용 구성과 처리기간",
      "관련 지역·업무로 이어가기",
    ],
    [
      `${r} 사건을 한 사무소에서 검토하는 방법`,
      "안윤정 법무사가 직접 확인하는 범위",
      "원본서류가 필요한 단계",
      "여러 필지·여러 지역이 섞인 경우",
      "협의분할과 법정지분",
      "취득세·국민주택채권·수수료",
      "일반적인 상담 유형",
      "상담 전 준비하면 좋은 정보",
    ],
  ];
  return pools[seed % pools.length]!;
}

export function buildGyeongnamPageData(
  def: GyeongnamLandingDef,
  catalog: Map<string, GyeongnamLandingDef>,
): PageData {
  const seed = hashSlug(def.slug);
  const titles = sectionTitles(def, seed);
  const region = inquiryRegionFromDef(def);
  const inquiry = `/contact/inquiry?from=nationwide&region=${encodeURIComponent(region)}&field=${
    def.pageType.startsWith("corporate")
      ? "corporate-registration"
      : def.pageType === "renunciation" || def.pageType === "limited-acceptance"
        ? "inheritance-renunciation"
        : "inheritance-registration"
  }`;

  const regionLinks = def.relatedRegionSlugs.map((slug) => {
    const target = catalog.get(slug);
    if (target) {
      return { href: gyeongnamPath(slug), label: target.primaryKeyword };
    }
    return resolveHref(slug);
  });
  const serviceLinks = def.relatedServiceSlugs.map(resolveHref);

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
    {
      title: titles[1]!,
      body: def.officeDisclosure,
    },
    {
      title: titles[2]!,
      body: def.jurisdictionNote,
    },
    {
      title: titles[3]!,
      body: "일반적인 상담 유형으로 정리했습니다. 개별 사건 가능 여부는 서류 확인 후 안내합니다.",
      items: def.scenarioTitles.map(
        (t, i) => `${t}: ${def.scenarioBodies[i] ?? ""}`,
      ),
    },
    {
      title: titles[4]!,
      body: def.visitHint,
    },
    {
      title: titles[5]!,
      body: def.remoteHint,
    },
    {
      title: titles[6]!,
      body: "서류가 모두 없어도 부동산 소재지와 가족관계 개요만으로 먼저 확인할 자료를 안내합니다.",
      items: [
        "부동산 주소·지번 목록",
        "상속인 수·거주지",
        "협의 여부·매도 일정",
        "현재 준비된 서류(사진 가능)",
        ...def.propertyTypes.map((p) => `재산 유형: ${p}`),
      ],
    },
    {
      title: titles[7]!,
      body: "처음 보이는 금액만 낮게 안내하기보다 취득세·국민주택채권·등기신청수수료와 법무사 보수를 구분해 설명합니다. 출장이 필요하면 사전 고지합니다.",
      links: [...regionLinks, ...serviceLinks].slice(0, 10),
    },
  ];

  if (def.pageType === "region-hub") {
    sections.unshift({
      title: "경남에서 문의할 수 있는 업무",
      body: "상속·유증등기, 상속포기·한정승인(법정 관할 유지), 법인등기·본점이전, 공동근저당 등 사건별로 관할과 비대면 범위를 구분해 안내합니다.",
      links: [
        { href: gyeongnamPath("경남상속등기법무사"), label: "경남 상속등기" },
        { href: gyeongnamPath("경남유증등기법무사"), label: "경남 유증등기" },
        { href: gyeongnamPath("경남법인등기법무사"), label: "경남 법인등기" },
        {
          href: gyeongnamPath("부산김해양산공동근저당권"),
          label: "부산·김해·양산 공동근저당",
        },
      ],
    });
  }

  return createPageData({
    slug: def.slug,
    path: gyeongnamPath(def.slug),
    category: "case",
    title: def.primaryKeyword,
    metaTitle: buildMetaTitle(def.seoTitle),
    metaDescription: buildMetaDescription(def.metaDescription),
    h1: def.h1,
    intro: def.heroDescription,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무 사례", href: "/업무사례" },
      { label: "경남 지역 업무사례", href: gyeongnamPath("경남법무사업무") },
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
      "상속인·임원 등 관련 인원 수",
      "준비된 서류(사진 가능)",
    ],
    consultationPoints: [
      "가까운 사무소인지도 중요하지만, 누가 직접 검토하고 비용·진행을 얼마나 구체적으로 설명하는지도 확인하세요.",
      "서류가 모두 준비되지 않아도 됩니다.",
      "김해·양산·창원 등 가까운 경남은 방문·비대면 중 편한 방식을 먼저 선택할 수 있습니다.",
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

export function buildAllGyeongnamPageData(
  published: GyeongnamLandingDef[],
): PageData[] {
  const catalog = new Map(published.map((d) => [d.slug, d]));
  return published.map((d) => buildGyeongnamPageData(d, catalog));
}
