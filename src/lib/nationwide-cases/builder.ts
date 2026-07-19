import { createPageData } from "@/lib/pageData/template-helpers";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import type { PageData, PageSection } from "@/lib/pageData/types";
import {
  FAQS,
  PROPERTY_TYPES,
  SCENARIOS,
  pickByIds,
} from "./content-pools";
import { caseNationwidePath, type RegionLandingDef } from "./types";

const DISCLAIMER =
  "본 안내는 일반적인 정보이며, 개별 사건은 서류·관할·등기원인을 확인한 뒤 달라질 수 있습니다. 실제 수행하지 않은 사건을 성공사례처럼 단정하지 않습니다.";

const TRUST_ITEMS = [
  "안윤정 법무사 직접 확인",
  "비대면 필요서류 안내",
  "보수와 공과금 구분",
  "접수·보정·완료 진행상황 공유",
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function inquiryHref(def: RegionLandingDef): string {
  const region =
    def.parentRegion && def.regionName !== def.parentRegion
      ? `${def.parentRegion} ${def.regionName}`
      : def.regionName;
  const params = new URLSearchParams({
    from: "nationwide",
    region: region === "전국" ? "" : region,
    field: "inheritance-registration",
  });
  if (!params.get("region")) params.delete("region");
  return `/contact/inquiry?${params.toString()}`;
}

function linkLabel(slug: string, fallback: string): { href: string; label: string } {
  return { href: caseNationwidePath(slug), label: fallback };
}

function resolveRelatedLinks(
  slugs: string[],
  catalog: Map<string, RegionLandingDef>,
): { href: string; label: string }[] {
  return slugs
    .map((slug) => {
      if (slug === "부산상속등기") {
        return { href: "/부산상속등기", label: "부산 상속등기" };
      }
      const target = catalog.get(slug);
      if (!target) return linkLabel(slug, slug);
      return {
        href: caseNationwidePath(slug),
        label: target.primaryKeyword,
      };
    })
    .filter((l, i, arr) => arr.findIndex((x) => x.href === l.href) === i);
}

function sectionTitleVariants(def: RegionLandingDef, seed: number): string[] {
  const r = def.regionName;
  const pools = [
    [
      `${r} 상속등기, 부산 법무사에게 맡길 수 있을까`,
      `${r}에서 자주 문의되는 상황`,
      "상속인이 다른 지역에 거주하는 경우",
      "상속재산분할협의와 서류 준비",
      "취득세·국민주택채권·등기신청수수료",
      "비대면으로 진행하는 절차",
    ],
    [
      `${r} 소재 부동산의 관할 특례 검토`,
      `${r} 아파트·토지·상가가 섞인 경우`,
      "여러 지역 부동산을 함께 정리할 때",
      "법무사 보수와 공과금 구분",
      "원본서류 전달과 본인확인",
      "상담 전 확인하면 좋은 항목",
    ],
    [
      `${r} 상속등기 가능 여부부터 확인하기`,
      "부산 해운대 사무소에 비대면으로 맡기는 이유",
      `${r}과 타지역 상속인의 거리 문제`,
      "필요서류 체크리스트",
      "진행 상황 공유 방식",
      "타지역 법무사를 고를 때 확인할 사항",
    ],
    [
      `${r} 부동산 목록부터 맞추는 방법`,
      "관할 특례와 법정 관할의 차이",
      "일반적인 상담 유형",
      "해외 거주 상속인이 있는 경우",
      "비용 안내 방식",
      "관련 지역·업무로 이어가기",
    ],
  ];
  return pools[seed % pools.length]!;
}

function buildRemoteTableSection(): PageSection {
  return {
    title: "업무별 비대면 진행 범위(일반 안내)",
    body: "「100% 비대면」을 단정하지 않습니다. 사건별로 원본·관할·방문 가능성을 수임 전에 안내합니다.",
    items: [
      "상속·유증등기 — 비대면 상담 가능 · 원본 필요 가능 · 관할 특례 검토 · 전자·우편 여부는 사건별",
      "법인 본점이전 — 비대면 상담 가능 · 법정 관할 유지 · 이사회·주주총회 서류 확인",
      "공동근저당 — 비대면 상담 가능 · 공동담보목록·금융기관 서류 · 묶음 신청은 요건 확인",
      "상속포기·한정승인 등 — 법정 관할 유지 · 상담·서류 조율은 비대면 가능한 경우 많음",
    ],
  };
}

function buildHubExtraSections(def: RegionLandingDef): PageSection[] {
  if (def.kind !== "hub") return [];
  return [
    {
      title: "전국에서 상담할 수 있는 업무",
      body: "상속·유증등기, 여러 지역 상속부동산 정리, 법인 본점이전, 공동근저당, 비대면 수임 가능 업무를 구분해 안내합니다.",
      links: [
        { href: caseNationwidePath("전국상속등기법무사"), label: "전국 상속등기" },
        { href: caseNationwidePath("전국유증등기법무사"), label: "전국 유증등기" },
        {
          href: caseNationwidePath("전국법인본점이전등기"),
          label: "전국 법인 본점이전",
        },
      ],
    },
    {
      title: "관할 특례가 적용될 수 있는 업무",
      body: "상속·유증으로 인한 소유권이전등기는 법에서 정한 범위에서 특례를 검토할 수 있습니다. 「아무 등기소에나 신청」과는 다릅니다.",
    },
    {
      title: "법정 관할은 유지되지만 타지역 수임이 가능한 업무",
      body: "본점이전·일부 법인등기·회생 등은 신청 관할이 정해져 있어도 상담·서류 준비는 비대면으로 진행할 수 있는지 검토합니다.",
    },
    {
      title: "타지역 법무사를 선택할 때 확인할 사항",
      body: "가까운 사무소인지보다 누가 직접 사건을 검토하고, 비용과 진행 상황을 얼마나 구체적으로 설명하는지를 확인하는 것이 중요합니다.",
      links: [
        { href: caseNationwidePath("타지역법무사의뢰"), label: "타지역 법무사 의뢰 안내" },
      ],
    },
    {
      title: "법무사 보수와 공과금 구분",
      body: "처음 보이는 금액만 낮게 제시하기보다 실제 납부할 취득세·국민주택채권·등기신청수수료와 법무사 보수를 구분하여 안내합니다.",
    },
  ];
}

function buildServiceExtraSections(def: RegionLandingDef): PageSection[] {
  switch (def.slug) {
    case "전국유증등기법무사":
      return [
        {
          title: "상속등기와 유증등기의 차이",
          body: "유언에 따른 이전은 포괄·특정유증, 유언집행자, 이미 상속등기가 끝난 경우 등 쟁점이 달라집니다.",
          items: [
            "특정유증과 포괄유증",
            "유언공정증서·자필증서유언",
            "유언집행자 유무",
            "수증자가 법인인 경우",
            "해외 거주 수증자",
          ],
        },
      ];
    case "전국상속부동산일괄등기":
      return [
        {
          title: "여러 지역 부동산을 한 목록으로 관리하는 이유",
          body: "서울 아파트와 지방 토지, 부동산마다 다른 상속인, 일부만 먼저 매도하는 일정이 겹치면 누락이 생기기 쉽습니다.",
          items: [
            "부동산마다 상속받는 사람이 다른 경우",
            "일부는 협의분할·일부는 법정지분",
            "지역별 취득세 신고 일정",
            "여러 사무소가 아닌 한 사무소에서 관리",
          ],
        },
      ];
    case "전국법인본점이전등기":
      return [
        {
          title: "동일 관할과 타관할 이전의 차이",
          body: "종전 본점과 새 본점 소재지 관할을 확인합니다. 서울↔부산·경기·경남 이전처럼 지역이 달라져도 비대면 상담은 가능하지만 법정 관할은 유지됩니다.",
          items: [
            "이사회·주주총회",
            "정관 변경",
            "등록면허세",
            "임원변경·목적변경 동시 신청",
            "사업자등록 정정",
          ],
        },
      ];
    case "전국공동근저당권등기":
      return [
        {
          title: "공동근저당·공동담보목록 검토 포인트",
          body: "여러 지역 부동산을 공동담보로 제공하는 경우 당사자·등기목적·등기원인 구조에 따라 묶음 신청 가능 여부를 확인합니다.",
          items: [
            "담보 부동산 추가·일부 해지",
            "채권최고액·채무자 변경",
            "근저당권 이전·말소",
            "금융기관 서류·법인 소유 부동산",
          ],
        },
      ];
    case "전국비대면법무사":
      return [buildRemoteTableSection()];
    case "타지역법무사의뢰":
      return [
        {
          title: "거리가 있어도 맡기기 전 체크리스트",
          body: "관할 지역 법무사만 선임해야 하는지, 원본·본인확인·인감·진행 공유·추가 비용·방문 필요 여부를 수임 전에 확인합니다.",
        },
      ];
    default:
      return [];
  }
}

export function buildNationwideCasePageData(
  def: RegionLandingDef,
  catalog: Map<string, RegionLandingDef>,
): PageData {
  const seed = hashSlug(def.slug);
  const scenarios = pickByIds(SCENARIOS, def.scenarioIds);
  const faqs = pickByIds(FAQS, def.uniqueFaqIds);
  const properties = pickByIds(PROPERTY_TYPES, def.propertyTypeIds);
  const titles = sectionTitleVariants(def, seed);
  const regionLinks = resolveRelatedLinks(def.relatedRegionSlugs, catalog);
  const serviceLinks = resolveRelatedLinks(def.relatedServiceSlugs, catalog);
  const path = caseNationwidePath(def.slug);
  const inquiry = inquiryHref(def);

  const sections: PageSection[] = [
    {
      title: titles[0]!,
      body: def.localIntro,
      items: TRUST_ITEMS,
    },
    {
      title: titles[1]!,
      body: `${def.regionName} 소재 부동산이어도 부산 해운대 사무소에서 관할 특례·비대면 서류 전달을 검토할 수 있습니다. 지점이 있다는 의미가 아닙니다.`,
      items: scenarios.map((s) => `${s.title}: ${s.body}`),
    },
    {
      title: titles[2]!,
      body: "상속인 거주지와 부동산 소재지가 다르면 위임·인감·협의 일정 조율이 핵심입니다.",
      items: properties.map((p) => `${p.title} — ${p.body}`),
    },
    {
      title: titles[3]!,
      body: "협의분할 내용과 등기 신청 순서가 모순되지 않게 맞춥니다. 서류가 모두 없어도 개요만으로 먼저 상담할 수 있습니다.",
      items: [
        "가족관계·상속인 목록",
        "부동산 목록(주소·지번)",
        "등기부·권리제한 개요",
        "협의 여부·매도 일정",
      ],
    },
    {
      title: titles[4]!,
      body: "법무사 보수와 취득세·국민주택채권·등기신청수수료 등 공과금을 구분해 안내합니다. 서류 확인 전 확정액을 단정하지 않습니다.",
    },
    {
      title: titles[5]!,
      body: "① 지역·상속인 수 공유 ② 관할·서류 안내 ③ 보수·공과금 구분 ④ 원본 전달 ⑤ 접수·보정·완료 공유",
      links: [...serviceLinks, ...regionLinks].slice(0, 8),
    },
    ...buildHubExtraSections(def),
    ...buildServiceExtraSections(def),
  ];

  if (def.kind === "region-hub") {
    sections.unshift({
      title: "권역별로 상속등기 안내 찾기",
      body: "아래 검색·카드에서 서울·경기·인천 등 광역과 주요 시·구 안내로 이동할 수 있습니다. 부산은 기존 부산 상속등기 페이지로 연결합니다. 필터·검색 파라미터 URL은 색인 대상이 아니며 canonical은 이 허브입니다.",
      links: [
        { href: "/부산상속등기", label: "부산 상속등기 (기존 안내)" },
        {
          href: caseNationwidePath("전국상속등기법무사"),
          label: "전국 상속등기 법무사",
        },
      ],
    });
  }

  const breadcrumbMid =
    def.kind === "region" || def.kind === "region-hub"
      ? [
          { label: "업무 사례", href: "/업무사례" },
          {
            label: "지역별 상속등기",
            href: caseNationwidePath("지역별상속등기법무사"),
          },
        ]
      : [
          { label: "업무 사례", href: "/업무사례" },
          {
            label: "전국 업무사례",
            href: caseNationwidePath("전국업무사례"),
          },
        ];

  return createPageData({
    slug: def.slug,
    path,
    category: "case",
    title: def.primaryKeyword,
    metaTitle: buildMetaTitle(def.seoTitle),
    metaDescription: buildMetaDescription(def.metaDescription),
    h1: def.h1,
    intro: def.localIntro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      ...breadcrumbMid,
      { label: def.regionName === "전국" ? def.primaryKeyword : def.regionName },
    ],
    introParagraphs: [def.localIntro, def.disclosure, DISCLAIMER],
    procedures: [
      `${def.regionName} 부동산·상속인 거주 지역 공유`,
      "관할 특례·비대면 가능 범위 검토",
      "필요서류·공과금·보수 구분 안내",
      "원본 전달 후 접수·보정·완료 공유",
    ],
    documents: [
      "부동산 소재 지역·종류",
      "의뢰인·상속인 거주 지역",
      "상속인 수·협의 여부",
      "현재 준비된 서류(사진 가능)",
    ],
    consultationPoints: [
      "수임 전에 진행 가능 여부를 먼저 확인합니다.",
      "방문이 필요한 경우 미리 안내합니다.",
      "타지역이라는 이유만으로 비용을 올리지 않습니다.",
      "가까운 사무소인지보다 직접 검토·비용·진행 공유를 확인하세요.",
    ],
    faqs: faqs.map((f) => ({ question: f.title, answer: f.body })),
    consultationExample: {
      title: "일반적인 상담 유형",
      body: scenarios
        .slice(0, 2)
        .map((s) => `${s.title} — ${s.body}`)
        .join(" "),
    },
    sections,
    primaryKeywords: [def.primaryKeyword, ...def.secondaryKeywords],
    internalLinks: [
      ...serviceLinks.slice(0, 4),
      ...regionLinks.slice(0, 4),
      { href: inquiry, label: def.ctaTitle },
      { href: "/contact", label: "상담 안내" },
    ],
    ctaTitle: def.ctaTitle,
    ctaText: def.ctaDescription,
    includeFaqSchema: faqs.length > 0,
  });
}

export function buildAllNationwideCasePageData(
  published: RegionLandingDef[],
): PageData[] {
  const catalog = new Map(published.map((d) => [d.slug, d]));
  // include unpublished in catalog for link labels only if needed — use all defs from caller
  return published.map((def) => buildNationwideCasePageData(def, catalog));
}
