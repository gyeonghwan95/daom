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

function inquiryFieldFor(def: GyeongnamLandingDef): string {
  if (def.pageType.startsWith("corporate")) return "corporate-registration";
  if (
    def.pageType === "renunciation" ||
    def.pageType === "limited-acceptance"
  ) {
    return "inheritance-renunciation";
  }
  if (def.pageType === "rehabilitation") return "personal-rehabilitation";
  if (def.pageType === "preservation") return "preservation-registration";
  if (def.pageType === "mortgage-cancel" || def.pageType === "joint-mortgage") {
    return "mortgage";
  }
  if (
    def.pageType === "gift" ||
    def.pageType === "real-estate" ||
    def.pageType === "demolition"
  ) {
    return "real-estate-registration";
  }
  if (def.pageType === "payment-order") return "civil-debt";
  if (def.pageType === "region-hub") return "other";
  return "inheritance-registration";
}

function docsAndCostFor(def: GyeongnamLandingDef): {
  docsBody: string;
  docsItems: string[];
  costBody: string;
} {
  const r = def.regionName;
  if (def.pageType === "gift") {
    return {
      docsBody: `${r} 증여등기 비용·서류를 확인할 때 정액을 단정하지 않습니다. 주소·관계·지분·담보만 있어도 1차 목록을 안내합니다.`,
      docsItems: [
        "부동산 주소·지번",
        "증여자·수증자 관계",
        "이전 지분 비율",
        "근저당·임대차 여부",
        "현재 준비된 등기부·신분증(사진 가능)",
        ...def.propertyTypes.map((p) => `재산 유형: ${p}`),
      ],
      costBody:
        "법무사 보수와 취득세·지방교육세·등기신청수수료·증명서 비용을 구분해 안내합니다. 증여세 신고는 세무 영역으로 분리해 설명합니다.",
    };
  }
  if (def.pageType === "mortgage-cancel") {
    return {
      docsBody: `${r} 근저당 말소는 상환 사실과 은행 말소 서류·등기부 을구를 맞춰 봅니다. 서류가 덜 갖춰져도 주소와 상환 여부만으로 확인할 항목을 안내합니다.`,
      docsItems: [
        "부동산 주소",
        "은행·대출 상품 개요",
        "상환 완료 여부",
        "보유 중인 말소 관련 서류",
        "등기사항증명서(사진 가능)",
        ...def.propertyTypes.map((p) => `재산 유형: ${p}`),
      ],
      costBody:
        "법무사 보수와 등기신청수수료·증명서·우편 등 공과금을 구분해 안내합니다. 은행 수수료와 법무사 보수는 별개입니다.",
    };
  }
  if (def.pageType === "demolition" || def.pageType === "preservation") {
    return {
      docsBody: `${r} ${def.pageType === "demolition" ? "멸실" : "보존"}등기는 건축물대장·등기부·사용승인(해당 시)을 기준으로 목록을 잡습니다.`,
      docsItems: [
        "건물·토지 주소",
        "건축물대장",
        "등기사항증명서",
        def.pageType === "demolition" ? "철거·대장 말소 시점" : "사용승인 관련 자료",
        "현재 준비된 도면·사진",
        ...def.propertyTypes.map((p) => `자료 유형: ${p}`),
      ],
      costBody:
        "법무사 보수와 등록면허세·등기신청수수료·증명서 비용을 구분해 안내합니다. 현장·측량 등 추가 비용이 있으면 사전 고지합니다.",
    };
  }
  if (def.pageType === "rehabilitation") {
    return {
      docsBody: `${r} 개인회생 상담 전 월소득·채무 총액·부양가족·재산 개요만 있어도 신청 전 확인 항목을 정리할 수 있습니다.`,
      docsItems: [
        "월소득·가족 구성",
        "채무 종류·대략 총액",
        "보유 재산 개요",
        "급여압류·독촉 여부",
        "현재 준비된 명세·통장 내역(사진 가능)",
      ],
      costBody:
        "법무사 보수와 인지·송달·증명서 등 공과금을 구분해 안내합니다. 인가 가능성·변제율을 단정하지 않습니다.",
    };
  }
  if (def.pageType === "real-estate") {
    return {
      docsBody: `${r} 부동산등기는 원인(매매·증여·말소·보존 등)을 먼저 가린 뒤 서류 목록을 맞춥니다.`,
      docsItems: [
        "부동산 주소·지번",
        "등기 원인",
        "계약·잔금·대출 일정(해당 시)",
        "근저당·임차 여부",
        "현재 준비된 계약서·등기부(사진 가능)",
        ...def.propertyTypes.map((p) => `재산 유형: ${p}`),
      ],
      costBody:
        "법무사 보수와 취득세·등록면허세·등기신청수수료·국민주택채권·증명서 비용을 원인별로 구분해 안내합니다.",
    };
  }
  if (def.pageType === "renunciation" || def.pageType === "limited-acceptance") {
    return {
      docsBody: `${r} 상속포기·한정승인은 사망일(또는 안 날)·채무·재산 개요만으로도 기한과 준비자료를 먼저 안내할 수 있습니다.`,
      docsItems: [
        "사망일 또는 안 날",
        "상속인 수·거주지",
        "확인된 채무·재산 개요",
        "부동산 주소(있는 경우)",
        "현재 준비된 가족관계·조회 자료(사진 가능)",
      ],
      costBody:
        "법무사 보수와 인지·송달·증명서·우편 등 공과금을 구분해 안내합니다. 법원 관할·기한은 사건별로 확인합니다.",
    };
  }
  if (def.pageType === "corporate" || def.pageType === "corporate-relocation") {
    return {
      docsBody: `${r} 법인등기는 등기사항전부증명서와 변경(또는 설립) 항목만 있어도 서류·비용 확인 목록을 잡을 수 있습니다.`,
      docsItems: [
        "법인 등기사항전부증명서",
        "변경·설립하려는 내용",
        "정관(가능 시)",
        "본점 주소·임원 구성",
        "희망 일정",
      ],
      costBody:
        "법무사 보수와 등록면허세·등기신청수수료·공증(해당 시)·증명서 비용을 구분해 안내합니다. 공증 자체는 공증인 영역입니다.",
    };
  }
  if (def.pageType === "region-hub") {
    return {
      docsBody: `${r}에서 필요한 업무를 아직 모르셔도 상황만 남겨 주시면 됩니다. 비용은 업무가 정해진 뒤 보수와 공과금을 구분해 안내합니다.`,
      docsItems: [
        "부동산·본점 주소(있는 경우)",
        "지금 겪는 상황(사망 후 정리·이전·회사·회생 등)",
        "관심 업무(모르면 ‘잘 모르겠음’)",
        "방문·원격 중 희망 방식",
        "현재 가진 서류(사진 가능)",
        ...def.propertyTypes.map((p) => `관련 유형: ${p}`),
      ],
      costBody:
        "업무마다 비용 구조가 다릅니다. 정액을 미리 단정하지 않고, 상세 페이지에서 안내하는 확인 자료를 기준으로 견적에 필요한 항목을 정리합니다.",
    };
  }
  return {
    docsBody:
      "서류가 모두 없어도 부동산 소재지와 가족관계 개요만으로 먼저 확인할 자료를 안내합니다.",
    docsItems: [
      "부동산 주소·지번 목록",
      "상속인 수·거주지",
      "협의 여부·매도 일정",
      "현재 준비된 서류(사진 가능)",
      ...def.propertyTypes.map((p) => `재산 유형: ${p}`),
    ],
    costBody:
      "처음 보이는 금액만 낮게 안내하기보다 취득세·국민주택채권·등기신청수수료와 법무사 보수를 구분해 설명합니다. 출장이 필요하면 사전 고지합니다.",
  };
}

function sectionTitles(def: GyeongnamLandingDef, seed: number): string[] {
  const r = def.regionName;
  if (def.pageType === "gift") {
    return [
      `${r} 증여등기를 검토할 때`,
      "사무소 위치와 지점 오인 방지",
      "세금 검토와 등기 업무의 구분",
      `${r}에서 자주 확인하는 증여 상황`,
      "방문이 도움이 되는 경우",
      "서류 사진으로 먼저 확인하는 범위",
      "비용 확인에 필요한 정보",
      "관련 업무로 이어가기",
    ];
  }
  if (def.pageType === "mortgage-cancel") {
    return [
      `${r} 근저당 말소를 검토할 때`,
      "사무소 위치 안내",
      "상환과 등기 말소의 차이",
      "자주 확인하는 말소 상황",
      "방문이 필요한 경우",
      "비대면으로 먼저 볼 수 있는 서류",
      "비용 확인에 필요한 정보",
      "관련 담보·부동산 안내",
    ];
  }
  if (def.pageType === "demolition" || def.pageType === "preservation") {
    return [
      `${r} ${def.pageType === "demolition" ? "건물멸실" : "소유권보존"}등기 확인`,
      "사무소 위치 안내",
      "건축물대장과 등기부의 관계",
      "자주 확인하는 상황",
      "방문·현장 확인이 필요한 경우",
      "사진·파일로 먼저 확인할 자료",
      "비용 확인에 필요한 정보",
      "관련 부동산등기 안내",
    ];
  }
  if (def.pageType === "rehabilitation") {
    return [
      `${r} 개인회생을 검토할 때`,
      "사무소 위치 안내",
      "관할과 상담 범위",
      "소득·채무·재산으로 보는 상황",
      "방문 상담이 적합한 경우",
      "비대면으로 먼저 확인할 자료",
      "비용·기간에 영향을 주는 요소",
      "관련 안내로 이어가기",
    ];
  }
  if (def.pageType === "real-estate") {
    return [
      `${r} 부동산등기 업무를 고를 때`,
      "사무소 위치와 지점 안내",
      "매매·증여·말소·보존의 구분",
      `${r}에서 자주 확인하는 상황`,
      "방문 상담이 적합한 경우",
      "서류 사진으로 시작하는 방법",
      "비용 확인에 필요한 정보",
      "관련 상세 페이지",
    ];
  }
  if (def.pageType === "payment-order") {
    return [
      `${r}에서 돈을 받지 못했을 때`,
      "사무소 위치 안내",
      "지급명령과 소송대리의 구분",
      "자주 확인하는 미수금 상황",
      "방문이 필요한 경우",
      "증거자료로 먼저 확인하는 범위",
      "비용 확인에 필요한 정보",
      "관련 안내",
    ];
  }
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
  const inquiry = `/contact/inquiry?from=nationwide&region=${encodeURIComponent(region)}&field=${inquiryFieldFor(def)}`;

  const regionLinks = def.relatedRegionSlugs.map((slug) => {
    const target = catalog.get(slug);
    if (target) {
      return { href: gyeongnamPath(slug), label: target.primaryKeyword };
    }
    return resolveHref(slug);
  });
  const serviceLinks = def.relatedServiceSlugs.map(resolveHref);
  const docsCost = docsAndCostFor(def);

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
      body: docsCost.docsBody,
      items: docsCost.docsItems,
    },
    {
      title: titles[7]!,
      body: docsCost.costBody,
      links: [...regionLinks, ...serviceLinks].slice(0, 10),
    },
  ];

  if (def.pageType === "region-hub" && def.regionName === "양산") {
    sections.unshift({
      title: "양산에서 문의할 수 있는 업무",
      body: "양산시(물금읍·동면·원동면·상북면·하북면과 중앙·양주·삼성·강서·서창·소주·평산·덕계동)에서 법무사를 찾을 때는 ‘가까운 사무소’보다 필요한 업무를 먼저 고르는 것이 중요합니다. 상속등기·상속포기·한정승인, 매매·증여 등 부동산등기, 근저당 말소, 법인설립·임원·본점·자본금 변경, 건물멸실·소유권보존, 개인회생은 서류·관할·기한이 서로 다릅니다. 양산시 지점은 없으며 부산 해운대 사무소에서 방문·비대면 가능 범위를 사건별로 확인합니다. 웅상권(서창·소주·평산·덕계)이나 물금·동면 생활권 명칭만 바꾼 별도 법무사 페이지는 두지 않고, 아래에서 업무별로 연결합니다.",
      links: [
        { href: gyeongnamPath("양산상속등기법무사"), label: "양산 상속등기" },
        { href: gyeongnamPath("양산상속포기한정승인"), label: "양산 상속포기·한정승인" },
        { href: gyeongnamPath("양산부동산등기법무사"), label: "양산 부동산등기" },
        { href: gyeongnamPath("양산증여등기법무사"), label: "양산 증여등기" },
        { href: gyeongnamPath("양산법인등기법무사"), label: "양산 법인등기" },
        { href: gyeongnamPath("양산근저당말소"), label: "양산 근저당 말소" },
        { href: gyeongnamPath("양산건물멸실등기"), label: "양산 건물멸실등기" },
        { href: gyeongnamPath("양산개인회생법무사"), label: "양산 개인회생" },
      ],
    });
  } else if (def.pageType === "region-hub") {
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
        { href: gyeongnamPath("양산법무사업무"), label: "양산 법무사 업무" },
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
