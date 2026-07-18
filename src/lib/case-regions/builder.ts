import {
  caseRegionPath,
  getChildrenOfDistrict,
  getDistrictMeta,
  getRelatedRegions,
  type CaseRegionEntry,
  type CaseRegionTrait,
  type DistrictKey,
} from "./index";
import { DISTRICT_METAS } from "./districts";
import { officeLocation } from "@/lib/office-location";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";

const SERVICE_LINKS = [
  { href: "/부산상속등기", label: "부산 상속등기" },
  { href: "/부산부동산등기", label: "부산 부동산등기" },
  { href: "/부산법인등기", label: "부산 법인등기" },
  { href: "/부산개인회생", label: "부산 개인회생" },
  { href: "/부산소유권이전등기", label: "소유권이전등기" },
  { href: "/부산임원변경등기", label: "임원변경등기" },
  { href: "/부산신축건물보존등기", label: "신축건물 보존등기" },
  { href: "/contact", label: "상담 문의" },
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(items: T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length];
}

function inquiriesFor(traits: CaseRegionTrait[], seed: number): string[] {
  const pool: Record<CaseRegionTrait, string[]> = {
    coastal: [
      "해안·관광 상권과 맞닿은 상가·주택 소유권이전",
      "계절 상권 점포의 권리관계 확인 후 등기",
      "해안 주거 단지의 상속·공동명의 정리",
    ],
    port: [
      "항만·물류 배후 사업장·창고 부동산등기",
      "물류 법인 본점·지점 변경등기",
      "항만 인근 토지·건축물 권리 확인",
    ],
    residential: [
      "아파트·다세대 소유권이전등기",
      "공동상속인 협의 후 상속등기",
      "근저당 설정·말소와 잔금일 일정 조율",
    ],
    commercial: [
      "상가·점포 매매에 따른 이전등기",
      "상가건물 구분소유권 관련 등기",
      "개인사업자·법인의 사업장 주소 변경등기",
    ],
    industrial: [
      "공장·창고 부동산 취득·이전등기",
      "산업단지 입주 기업 법인설립·변경등기",
      "담보 설정과 맞물린 사업장 등기 일정",
    ],
    newtown: [
      "신축·분양 주택의 소유권보존·이전등기",
      "신도시 입주 일정에 맞춘 잔금일 등기",
      "단지 내 상가·근린생활시설 등기",
    ],
    tourism: [
      "숙박·상가 등 관광 상권 부동산등기",
      "소규모 점포 권리와 소유권 정리",
      "관광지 인근 주택 매매등기",
    ],
    university: [
      "대학가 원룸·다가구 매매·상속등기",
      "임대사업 관련 소유권·담보등기",
      "교직원·학생 가족의 상속·이전 상담",
    ],
    finance: [
      "오피스·업무용 부동산 이전등기",
      "법인 임원변경·본점이전등기",
      "금융 일정과 맞춘 근저당 설정·말소",
    ],
    court: [
      "소송·조정 일정과 맞춘 등기·서류 준비",
      "회생·파산 절차와 병행되는 재산·등기 확인",
      "가정·상속 사건과 연결된 부동산등기",
    ],
    registry: [
      "등기소 접수·보정 일정 확인",
      "관할 등기소에 따른 신청 방식 점검",
      "완료서류·등기필정보 수령 일정 조율",
    ],
    station: [
      "역세권 아파트·오피스텔 이전등기",
      "역 인근 상가 매매등기",
      "교통 거점 생활권의 상속등기",
    ],
    market: [
      "시장·점포 권리와 건물등기 정리",
      "상가 임대차와 맞물린 소유권 확인",
      "전통시장 인근 주택 상속·매매등기",
    ],
    oldtown: [
      "원도심 단독·다가구 상속등기",
      "오래된 등기부 정리·표시변경 검토",
      "소규모 필지·상가의 권리관계 확인",
    ],
  };

  const collected: string[] = [];
  for (const trait of traits) {
    collected.push(...(pool[trait] ?? []));
  }
  if (collected.length < 4) {
    collected.push(
      "상속등기·상속포기·한정승인 상담",
      "부동산 매매·증여 이전등기",
      "법인설립·임원변경등기",
      "개인회생·파산 관련 상담",
    );
  }
  const unique = [...new Set(collected)];
  return [0, 1, 2, 3].map((i) => pick(unique, seed, i));
}

function caseVignettes(
  entry: CaseRegionEntry,
  seed: number,
): { title: string; body: string }[] {
  const place = entry.displayName;
  const templates = [
    {
      title: `${place} 아파트 상속등기 상담`,
      body: `${place}에 소재한 아파트를  Inherited 가족이 상속인 범위와 협의분할 여부를 먼저 확인한 사례입니다. 등기부등본과 가족관계 서류를 점검한 뒤, 공동상속인 연락이 가능한 범위에서 신청 순서를 안내했습니다. 실제 절차와 소요 기간은 상속인 수·채무 유무에 따라 달라질 수 있습니다.`,
    },
    {
      title: `${place} 잔금일 소유권이전등기`,
      body: `${place} 매매 잔금일에 맞춰 이전등기 일정을 조율한 상담입니다. 매도인·매수인 서류, 근저당 말소 여부, 대출 실행 일정을 함께 확인한 뒤 접수 가능 범위를 안내했습니다. 잔금일이 변경되면 등기 일정도 다시 맞춰야 합니다.`,
    },
    {
      title: `${place} 법인 임원변경등기`,
      body: `${place}에 본점을 둔 법인의 이사 임기만료에 따른 변경등기 문의입니다. 정관·주주총회(또는 이사회) 서류와 취임승낙 여부를 확인한 뒤 등기기한을 안내했습니다. 기한을 넘기면 과태료 이슈가 생길 수 있어 미리 일정을 잡는 것이 좋습니다.`,
    },
    {
      title: `${place} 상가 매매등기 점검`,
      body: `${place} 상가 매매를 앞두고 등기부 권리관계와 건축물대장 표시를 먼저 대조한 사례입니다. 근저당·가압류 유무와 잔금 후 접수 순서를 정리해 드렸습니다. 상가 종류와 권리 상태에 따라 준비서류가 달라집니다.`,
    },
    {
      title: `${place} 신축·보존등기 사전 확인`,
      body: `${place} 인근 신축 건물의 보존등기 준비 여부를 사용승인·건축물대장 상태를 기준으로 점검한 상담입니다. 일반건물·집합건물 구분과 대지권 표시를 확인한 뒤 다음 단계를 안내했습니다.`,
    },
    {
      title: `${place} 개인회생 상담과 재산 목록`,
      body: `${place} 거주 의뢰인이 개인회생을 검토하며 보유 부동산·차량 등 재산 목록 정리 방법을 문의한 사례입니다. 법원 제출 서류와 별도로, 등기·명의 상태를 확인해 상담 포인트를 정리했습니다. 인용 여부나 변제 결과는 사건마다 다릅니다.`,
    },
  ];

  // Fix typo Inherited
  const cleaned = templates.map((t) => ({
    ...t,
    body: t.body.replace("Inherited", "상속받은"),
  }));

  return [pick(cleaned, seed, 0), pick(cleaned, seed, 3)];
}

function checkBeforeConsult(seed: number): string[] {
  const items = [
    "최근 등기부등본(열람)으로 소유자·담보권 상태를 확인해 두세요.",
    "상속이면 피상속인·상속인 관계와 사망일을 정리해 주세요.",
    "매매·잔금이면 계약일·잔금일·대출 실행 여부를 알려 주세요.",
    "법인이면 본점 소재지·변경 사유·의결 진행 여부를 확인해 주세요.",
    "관할 등기소·법원은 사건 유형에 따라 달라질 수 있습니다.",
    "초기 상담에는 주민등록번호·등기필정보 등 민감 원본을 보내지 마세요.",
  ];
  return [0, 1, 2, 3].map((i) => pick(items, seed, i));
}

function faqFor(entry: CaseRegionEntry, seed: number) {
  const place = entry.displayName;
  const faqs = [
    {
      question: `${place}에서도 상담·진행이 가능한가요?`,
      answer: `가능합니다. 다옴법무사사무소는 ${officeLocation.shortAddress}에 있으며, ${place} 일대 의뢰인을 전화·카카오톡·방문·비대면으로 상담합니다. 관할과 일정은 사건별로 확인합니다.`,
    },
    {
      question: `${place} 사건은 반드시 방문해야 하나요?`,
      answer:
        "초기 상담은 전화·카카오톡으로도 가능합니다. 원본 제출·인감·전자증명 등 방식에 따라 방문이 필요할 수 있으며, 비대면으로 가능한 범위는 사건별로 안내합니다.",
    },
    {
      question: "사례와 비슷하면 결과도 같나요?",
      answer:
        "아니요. 본 페이지의 사례는 참고용이며, 사실관계·서류·관할·기한에 따라 절차와 결과가 달라질 수 있습니다. 허위 사건번호나 성공률을 제시하지 않습니다.",
    },
    {
      question: `${place} 관할 등기소는 어디인가요?`,
      answer: `${place} 소재 부동산이라도 물건·신청 유형에 따라 관할 등기소가 달라질 수 있습니다. 주소와 등기부 정보를 확인한 뒤 안내합니다.`,
    },
    {
      question: "견적은 바로 나오나요?",
      answer:
        "부동산 가액·상속인 수·권리관계·법인 규모·희망 일정에 따라 달라집니다. 개요를 확인한 뒤 항목별 범위를 안내합니다.",
    },
    {
      question: "기존 지역 안내 페이지와 무엇이 다른가요?",
      answer: `이 페이지는 업무 사례·상담 동선 중심으로 ${place} 검색 의도에 맞춰 정리한 안내입니다. 관련 구·군·생활권·업무 페이지와 함께 보시면 좋습니다.`,
    },
  ];
  return [0, 1, 2, 3, 4].map((i) => pick(faqs, seed, i));
}

function serviceLinksFor(traits: CaseRegionTrait[], seed: number) {
  const preferred = [...SERVICE_LINKS];
  if (traits.includes("industrial") || traits.includes("finance")) {
    preferred.unshift(
      { href: "/부산법인설립등기", label: "법인설립등기" },
      { href: "/부산기업법률자문", label: "기업 법률실무" },
    );
  }
  if (traits.includes("newtown")) {
    preferred.unshift({
      href: "/부산신축건물보존등기",
      label: "신축건물 보존등기",
    });
  }
  if (traits.includes("court")) {
    preferred.unshift({ href: "/부산개인회생", label: "개인회생" });
  }
  const unique = [...new Map(preferred.map((l) => [l.href, l])).values()];
  return [0, 1, 2, 3, 4, 5].map((i) => pick(unique, seed, i));
}

export function buildCaseRegionPageData(entry: CaseRegionEntry): PageData {
  const seed = hashSlug(entry.slug);
  const place = entry.displayName;
  const inquiries = inquiriesFor(entry.traits, seed);
  const vignettes = caseVignettes(entry, seed);
  const checks = checkBeforeConsult(seed);
  const faqs = faqFor(entry, seed);
  const related = getRelatedRegions(entry, 6);
  const services = serviceLinksFor(entry.traits, seed);

  const districtName = entry.parentDistrictKey
    ? getDistrictMeta(entry.parentDistrictKey as DistrictKey)?.name
    : null;

  const intro = `${place}에서 법무사 업무 사례와 상담 절차를 찾으시는 분을 위한 안내입니다. ${entry.context}`;

  const p1 = `${place} 일대에서는 ${inquiries[0]} , ${inquiries[1]} 문의가 이어집니다. 다옴법무사사무소 안윤정 법무사는 부산 해운대·센텀에서 ${place} 의뢰인의 상속등기·부동산등기·법인등기·개인회생 상담을 진행합니다. 확인되지 않은 실적이나 무조건적인 처리를 약속하지 않으며, 서류와 일정을 확인한 뒤 가능 범위를 안내합니다.`;

  const p2 = `${districtName ? `${districtName} 안에서 ` : ""}${place} 생활권은 주거·상권·업무 성격이 겹치는 경우가 많습니다. 같은 동이라도 물건 종류와 권리관계에 따라 관할·준비서류·접수 방식이 달라질 수 있어, 주소와 등기부 상태를 먼저 확인하는 것이 좋습니다.`;

  const p3 = `방문이 어려우면 전화·카카오톡으로 개요를 보내 주셔도 됩니다. 초기 상담에는 주민등록번호·등기필정보·인감증명서 등 민감 원본을 보내지 마세요. 필요한 자료와 전달 방법은 별도로 안내합니다. 사무소 위치는 ${officeLocation.fullAddress}입니다.`;

  const bodyChars = (intro + p1 + p2 + p3 + vignettes.map((v) => v.body).join(""))
    .length;

  // Ensure roughly 1500+ Korean chars by expanding if needed
  const p4 =
    bodyChars < 1400
      ? `${place} 관련 상담에서는 상속·매매·법인·회생 중 어떤 업무인지, 희망 일정, 대략적인 소재지만 알려주셔도 다음 확인 항목을 정리할 수 있습니다. 유사 사례를 참고하시되, 본인 사건은 반드시 개별 상담으로 확인해 주세요.`
      : `${place}에서도 비대면 상담과 방문 상담을 상황에 맞게 선택할 수 있습니다.`;

  const canonicalPath = entry.canonicalSlug
    ? caseRegionPath(entry.canonicalSlug)
    : caseRegionPath(entry.slug);

  const childNote =
    entry.kind === "district" && entry.parentDistrictKey
      ? getChildrenOfDistrict(entry.parentDistrictKey as DistrictKey)
          .slice(0, 8)
          .map((c) => c.name)
          .join(", ")
      : "";

  return createPageData({
    slug: entry.slug,
    path: caseRegionPath(entry.slug),
    category: "case",
    title: `${place} 법무사 업무 사례`,
    metaTitle: buildMetaTitle(
      `${place} 법무사 업무 사례 | 상속등기·부동산등기 상담 안내`,
    ),
    metaDescription: buildMetaDescription(
      `${place} 법무사 업무 사례와 상담 안내. 상속등기·부동산등기·법인등기·개인회생. 다옴법무사사무소 안윤정 법무사. ${entry.context.slice(0, 60)}`,
    ),
    h1: `${place} 법무사 업무 사례 | 상속등기·부동산등기 상담 안내`,
    intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무 사례", href: "/업무사례" },
      { label: "지역별 업무 사례", href: "/업무사례/지역별" },
      ...(districtName && entry.kind !== "district"
        ? [
            {
              label: `${districtName}`,
              href: caseRegionPath(
                getDistrictMeta(entry.parentDistrictKey as DistrictKey)!.slug,
              ),
            },
          ]
        : []),
      { label: `${place} 법무사` },
    ],
    introParagraphs: [intro, p1, p2, p3, p4],
    procedures: [
      "문의 개요(업무 종류·소재지·일정) 전달",
      "등기부·관할·서류 상태 확인",
      "진행 방식·견적 범위 안내",
      "신청·접수·보정·완료 공유",
    ],
    documents: [
      "업무 종류와 희망 일정",
      "부동산·법인 소재지(대략)",
      "상속인·당사자 관계(해당 시)",
      "최근 등기부 열람 정보(가능 시)",
    ],
    consultationPoints: checks,
    faqs,
    includeFaqSchema: true,
    consultationExample: {
      title: vignettes[0].title,
      body: vignettes[0].body,
    },
    sections: [
      {
        title: `${place}에서 자주 문의되는 업무`,
        body: `${place} 생활권 특성을 반영한 상담 유형입니다. 실제 가능 여부는 서류와 관할을 확인한 뒤 안내합니다.`,
        items: inquiries,
      },
      {
        title: "참고용 업무 사례",
        body: "개인정보는 비공개이며, 사건 유형과 점검 포인트 위주로 정리했습니다. 유사해도 결과가 같다고 단정하지 않습니다.",
        items: vignettes.map((v) => `${v.title}: ${v.body}`),
      },
      {
        title: "상담 전 확인할 내용",
        body: "초기 상담을 빠르게 진행하려면 아래 항목을 준비해 주세요.",
        items: checks,
      },
      {
        title: "방문·비대면 진행 안내",
        body: p3,
      },
      ...(childNote
        ? [
            {
              title: `${place}에서 이어지는 세부 지역`,
              body: `${place} 허브에서 아래 동·생활권 안내로 이동할 수 있습니다.`,
              items: childNote.split(", "),
            },
          ]
        : []),
      {
        title: "관련 지역",
        body: "가까운 구·군·생활권 안내입니다.",
        links: related.map((r) => ({
          href: caseRegionPath(r.slug),
          label: `${r.displayName} 법무사`,
        })),
      },
      {
        title: "관련 업무",
        body: "상속·부동산·법인·회생 등 업무별 안내입니다.",
        links: services,
      },
    ],
    primaryKeywords: [
      `${place} 법무사`,
      `${place} 법무사 사례`,
      `${place} 상속등기`,
      `${place} 부동산등기`,
      ...entry.keywords.slice(0, 3),
    ],
    internalLinks: [
      { href: "/업무사례/지역별", label: "지역별 업무 사례" },
      { href: "/cases", label: "전체 업무 사례" },
      ...related.slice(0, 4).map((r) => ({
        href: caseRegionPath(r.slug),
        label: `${r.displayName} 법무사`,
      })),
      ...services.slice(0, 2),
    ],
    ctaTitle: `${place} 법무사 상담이 필요하신가요?`,
    ctaText: `${place} 소재 업무라도 관할·서류·일정에 따라 진행 방식이 달라집니다. 상황을 알려주시면 다음 확인 항목부터 안내합니다.`,
  });
}

export function buildCaseRegionsHubPageData(): PageData {
  return createPageData({
    slug: "업무사례",
    path: "/업무사례",
    category: "case",
    title: "업무 사례",
    metaTitle: buildMetaTitle("업무 사례｜부산 법무사 지역·업무별 안내"),
    metaDescription: buildMetaDescription(
      "부산 법무사 업무 사례를 전체·지역별·업무별로 찾아보세요. 구·군·동·생활권 안내와 상속·부동산·법인·회생 사례를 연결합니다.",
    ),
    h1: "부산 법무사 업무 사례를 지역과 업무로 찾아보세요",
    intro:
      "실제 상담 흐름을 참고할 수 있는 업무 사례와, 부산 구·군·동·생활권별 안내를 한곳에서 연결합니다.",
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무 사례" },
    ],
    introParagraphs: [
      "전체 사례 탐색기에서 카테고리·상황별 사례를 확인하고, 지역별 안내에서 구·군·동·생활권을 검색할 수 있습니다.",
      "기존 사례 URL과 상담 기능은 그대로 유지됩니다.",
    ],
    faqs: [
      {
        question: "지역 페이지와 사례 탐색기는 무엇이 다른가요?",
        answer:
          "사례 탐색기는 실제 정리된 업무 사례를 카테고리로 찾습니다. 지역별 안내는 부산 구·군·동·생활권 검색 의도에 맞춘 상담·업무 안내입니다.",
      },
    ],
    includeFaqSchema: true,
    consultationExample: {
      title: "상담 전 확인",
      body: "업무 종류와 소재지, 희망 일정만 알려주셔도 다음 단계를 안내할 수 있습니다.",
    },
    sections: [
      {
        title: "바로가기",
        body: "목적에 맞는 경로를 선택해 주세요.",
        links: [
          { href: "/cases", label: "전체 업무 사례" },
          { href: "/업무사례/지역별", label: "지역별 업무 사례" },
          { href: "/업무사례/업무별", label: "업무별 업무 사례" },
        ],
      },
    ],
    primaryKeywords: ["부산 법무사 사례", "업무 사례", "지역별 법무사"],
    internalLinks: [
      { href: "/cases", label: "전체 업무 사례" },
      { href: "/업무사례/지역별", label: "지역별 업무 사례" },
      { href: "/업무사례/업무별", label: "업무별 업무 사례" },
      { href: "/services", label: "업무안내" },
    ],
    ctaTitle: "상담으로 확인해 보세요",
    ctaText:
      "사례·지역 안내와 비슷해도 세부 사항에 따라 절차가 달라질 수 있습니다.",
  });
}

export function buildCaseRegionsByAreaPageData(): PageData {
  return createPageData({
    slug: "업무사례-지역별",
    path: "/업무사례/지역별",
    category: "case",
    title: "지역별 업무 사례",
    metaTitle: buildMetaTitle("지역별 업무 사례｜부산 구·군·동·생활권 법무사 안내"),
    metaDescription: buildMetaDescription(
      "부산 16개 구·군과 동·생활권·산업단지·법원 인근 법무사 업무 사례 안내. 검색과 구·군 탭으로 지역을 찾아보세요.",
    ),
    h1: "부산 지역별 법무사 업무 사례 찾기",
    intro:
      "구·군을 고르거나 동·생활권 이름을 검색해 해당 지역 안내로 이동하세요. 상단 메뉴에는 지역명을 모두 나열하지 않습니다.",
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무 사례", href: "/업무사례" },
      { label: "지역별 업무 사례" },
    ],
    introParagraphs: [
      "해운대구·연제구·강서구 등 구·군 허브에서 동·생활권으로 내려가고, 동 페이지에서는 다시 구·군으로 연결됩니다.",
    ],
    faqs: [
      {
        question: "우리 동이 목록에 없으면요?",
        answer:
          "검색창에 동·생활권·역·산업단지 이름을 입력해 보세요. 없으면 상위 구·군 안내를 먼저 확인하거나 상담으로 문의해 주세요.",
      },
    ],
    includeFaqSchema: true,
    consultationExample: {
      title: "지역 검색 팁",
      body: "‘반여동’, ‘센텀’, ‘서면’, ‘동부지원’처럼 생활권·기관명으로도 찾을 수 있습니다.",
    },
    sections: [
      {
        title: "부산 구·군",
        body: "16개 구·군 허브로 이동합니다.",
        links: DISTRICT_METAS.map((d) => ({
          href: caseRegionPath(d.slug),
          label: d.name,
        })),
      },
    ],
    primaryKeywords: [
      "부산 지역별 법무사",
      "해운대구 법무사 사례",
      "부산 동 법무사",
    ],
    internalLinks: [
      { href: "/업무사례", label: "업무 사례 홈" },
      { href: "/cases", label: "전체 업무 사례" },
      { href: "/업무사례/부산법무사", label: "부산 법무사" },
      { href: "/contact", label: "상담 문의" },
    ],
    ctaTitle: "지역을 찾기 어려우신가요?",
    ctaText: "소재지와 업무 종류만 알려주시면 맞는 안내부터 연결해 드립니다.",
  });
}

export function buildCaseRegionsByServicePageData(): PageData {
  return createPageData({
    slug: "업무사례-업무별",
    path: "/업무사례/업무별",
    category: "case",
    title: "업무별 업무 사례",
    metaTitle: buildMetaTitle("업무별 업무 사례｜상속·부동산·법인·회생"),
    metaDescription: buildMetaDescription(
      "상속등기·부동산등기·법인등기·개인회생 등 업무별로 부산 법무사 사례와 안내를 연결합니다.",
    ),
    h1: "업무별로 사례와 안내를 찾아보세요",
    intro:
      "관심 업무를 고르면 관련 사례 탐색기와 대표 업무 페이지로 이동합니다.",
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무 사례", href: "/업무사례" },
      { label: "업무별 업무 사례" },
    ],
    introParagraphs: [
      "전체 사례는 사례 탐색기에서 카테고리·상황·지역 필터로 확인할 수 있습니다.",
    ],
    faqs: [
      {
        question: "업무별 메뉴와 지역별 메뉴를 같이 봐도 되나요?",
        answer:
          "네. 업무를 정한 뒤 지역 안내에서 관할·생활권을 확인하시면 상담 준비가 수월합니다.",
      },
    ],
    includeFaqSchema: true,
    consultationExample: {
      title: "업무 선택",
      body: "상속·부동산·법인·회생 중 해당하는 유형을 먼저 고르세요.",
    },
    sections: [
      {
        title: "업무 유형",
        body: "대표 업무와 사례 탐색기로 연결됩니다.",
        links: [
          { href: "/cases", label: "전체 사례 탐색기" },
          { href: "/부산상속등기", label: "상속등기" },
          { href: "/부산부동산등기", label: "부동산등기" },
          { href: "/부산법인등기", label: "법인등기" },
          { href: "/부산개인회생", label: "개인회생" },
          { href: "/부산소유권이전등기", label: "소유권이전등기" },
          { href: "/부산임원변경등기", label: "임원변경등기" },
          { href: "/services", label: "업무안내 전체" },
        ],
      },
    ],
    primaryKeywords: [
      "부산 법무사 업무별 사례",
      "상속등기 사례",
      "부동산등기 사례",
    ],
    internalLinks: [
      { href: "/cases", label: "전체 업무 사례" },
      { href: "/업무사례/지역별", label: "지역별 업무 사례" },
      { href: "/services", label: "업무안내" },
      { href: "/contact", label: "상담 문의" },
    ],
    ctaTitle: "업무 상담이 필요하신가요?",
    ctaText: "업무 종류와 상황을 알려주시면 다음 단계를 안내합니다.",
  });
}
