/**
 * Local Champion content overlays for seo-landing region-lawyer pages.
 * Replaces generic template sections with verified local context.
 * regionId matches seo/regions.ts entity ids.
 */
import type { PageFaqItem, PageSection } from "@/lib/pageData/types";

export type LocalChampionOverlay = {
  regionId: string;
  slug: string;
  introParagraphs: string[];
  sections: PageSection[];
  faqs?: PageFaqItem[];
  serviceLinks?: { href: string; label: string }[];
};

export const LOCAL_CHAMPION_OVERLAYS: Record<string, LocalChampionOverlay> = {
  "hood-millak": {
    regionId: "hood-millak",
    slug: "민락동법무사",
    introParagraphs: [
      "민락동·민락역 생활권에서 법무사 업무를 찾을 때는 먼저 부동산 매매·전세인지, 상속 명의이전인지, 법인 변경인지부터 나누는 것이 좋습니다. 절차와 관할은 업무 종류에 따라 달라집니다.",
      "민락은 수영구 광안·남천·망미와 맞닿은 해안 주거·상권입니다. 오피스텔·근린상가·아파트의 잔금일 등기, 전세금 반환 후 말소, 공동상속 후 명의 정리처럼 ‘어떤 등기인지’를 먼저 확인하면 준비 서류가 정리됩니다.",
      "민락역은 2호선 역세권으로, 역 이름과 동 이름을 함께 검색하셔도 같은 생활권 안내를 보시면 됩니다. 법률 절차 본문은 아래 업무 페이지에서 확인하고, 여기서는 민락 생활권에 맞는 분기만 돕습니다.",
    ],
    sections: [
      {
        title: "민락 생활권에서 법무사 업무를 알아보는 경우",
        body: "아파트·오피스텔 매매 잔금과 소유권이전, 전세권 설정·말소, 부모님 사망 후 명의이전, 소규모 상가·권리금 관련 등기처럼 목적이 다릅니다. 계약 유형과 부동산 주소만 알려주셔도 다음 안내로 연결할 수 있습니다.",
        links: [
          { href: "/수영구부동산등기", label: "수영구 부동산등기" },
          { href: "/부산상속등기", label: "부산 상속등기" },
          { href: "/부산잔금일법무사", label: "잔금일 등기·대출 연동" },
        ],
      },
      {
        title: "민락역·인접 생활권과의 구분",
        body: "광안리·남천·망미 등 인접동 사건은 관할·생활권 안내만 다를 수 있습니다. 소재지 행정동을 기준으로 등기 관할을 확인하며, 역 이름만으로 절차가 달라지지는 않습니다.",
        links: [
          { href: "/광안리법무사", label: "광안리·광안동 안내" },
          { href: "/남천동법무사", label: "남천동 안내" },
          { href: "/수영구법무사", label: "수영구 종합 안내" },
        ],
      },
      {
        title: "비용·기한을 미리 볼 때",
        body: "등기 원인(매매·상속·증여)과 근저당·전세권 유무, 상속인 수에 따라 법무사 보수와 세금·공과금 구성이 달라집니다. 확정 금액은 서류 확인 후 항목별로 안내합니다.",
        links: [
          { href: "/부산법무사비용", label: "부산 법무사 비용 구성" },
          { href: "/부산법무사상담", label: "상담 전 준비" },
        ],
      },
    ],
    faqs: [
      {
        question: "민락역과 민락동 법무사 안내는 다른 페이지인가요?",
        answer:
          "같은 생활권을 봅니다. 역 이름으로 검색하셔도 이 페이지와 연결되는 업무 안내를 확인하시면 됩니다. 별도 역 전용 URL을 만들지 않습니다.",
      },
      {
        question: "민락 오피스텔·상가 매매도 상담할 수 있나요?",
        answer:
          "가능합니다. 임대차 승계·권리금·근저당 말소 여부를 등기부와 계약서로 먼저 확인합니다.",
      },
    ],
    serviceLinks: [
      { href: "/부산법무사", label: "부산 법무사 — 업무 선택 안내" },
      { href: "/수영구부동산등기", label: "수영구 부동산등기" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/부산법인법무사", label: "부산 법인 업무 안내" },
    ],
  },
  "hood-yangjeong": {
    regionId: "hood-yangjeong",
    slug: "양정동법무사",
    introParagraphs: [
      "양정동·양정역 생활권에서는 주택·상가 매매등기, 공동상속 후 명의 정리, 전세·임대 관련 등기 문의가 이어집니다. 서면·전포·개금과 맞닿은 부산진구 주거 밀집지입니다.",
      "‘양정 법무’처럼 짧게 검색하셔도 같은 생활권 안내입니다. 역 이름(양정역)과 동 이름(양정동)은 하나의 Local Cluster로 보시면 됩니다.",
      "업무를 아직 모르셔도 부동산 주소·계약 종류·사망일·법인 변경 일자만 알려주시면 상속·매매·법인 중 어디부터 볼지 가릴 수 있습니다.",
    ],
    sections: [
      {
        title: "양정 생활권에서 먼저 확인할 업무 분기",
        body: "매매·증여 잔금과 소유권이전, 상속인 협의 후 명의이전, 법인 임원·본점 변경, 개인회생 자료 정리처럼 준비 서류가 다릅니다. 양정·개금·연지 등 인접동도 소재지 기준으로 관할을 확인합니다.",
        links: [
          { href: "/부산진구부동산등기", label: "부산진구 부동산등기" },
          { href: "/연지동법무사", label: "연지·초읍 생활권" },
          { href: "/개금동법무사", label: "개금·가야 생활권" },
        ],
      },
      {
        title: "양정역 역세권 검색과의 관계",
        body: "양정역은 1·2호선 환승역입니다. 역세권 주거·상가 등기도 소재지와 등기 원인을 기준으로 안내하며, 역 전용 페이지를 새로 만들지 않습니다.",
        links: [
          { href: "/서면법무사", label: "서면·부전 상권" },
          { href: "/부산진구법무사", label: "부산진구 종합" },
        ],
      },
      {
        title: "잔금·대출이 있는 매매의 경우",
        body: "잔금대출이 포함된 매매는 매도인 근저당 말소, 소유권이전, 매수인 신규 근저당 설정 순서를 은행과 맞춰야 합니다. ‘부산 은행 등기’ 검색과 같은 실무 흐름입니다.",
        links: [
          { href: "/부산잔금대출근저당", label: "잔금대출·근저당 연동" },
          { href: "/부산근저당말소등기", label: "근저당 말소" },
        ],
      },
    ],
    faqs: [
      {
        question: "양정역 법무사는 어디서 보나요?",
        answer:
          "양정역 검색도 이 양정동 생활권 안내와 같은 Cluster입니다. 소재지와 업무 종류를 알려주시면 됩니다.",
      },
    ],
    serviceLinks: [
      { href: "/부산법무사", label: "부산 법무사 — 업무 선택 안내" },
      { href: "/부산진구부동산등기", label: "부산진구 부동산등기" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/부산법인법무사", label: "부산 법인 업무 안내" },
    ],
  },
  "dongnae-gu": {
    regionId: "dongnae-gu",
    slug: "동래구법무사",
    introParagraphs: [
      "동래구에서 법무사 업무를 찾을 때는 온천·사직·명륜·복천 등 어느 생활권인지, 상속인지 매매등기인지부터 나누는 것이 좋습니다.",
      "‘복산동 법무사’처럼 검색하시는 경우, 공식 행정동 명칭(복천동·온천동 등)과 다를 수 있습니다. 소재지 주소를 기준으로 관할과 안내 페이지를 연결합니다.",
      "동래역·미남·사직 등 역세권 검색도 동래구 Host와 동네 허브(동래역·사직동 등)에서 같은 Cluster로 안내합니다.",
    ],
    sections: [
      {
        title: "동래 생활권에서 자주 확인하는 업무",
        body: "재건축·구축 아파트 상속, 공동상속인 협의, 매매 잔금과 근저당 말소, 한정승인 검토처럼 목적에 따라 서류가 달라집니다.",
        links: [
          { href: "/동래구상속등기", label: "동래구 상속등기" },
          { href: "/동래역법무사", label: "동래역 생활권" },
          { href: "/사직동법무사", label: "사직동·재건축" },
        ],
      },
      {
        title: "‘복산동’ 검색과 동래권 안내",
        body: "부산 동래권에서 ‘복산동’으로 검색하시는 경우 공식 행정동(복천동 등)과 다를 수 있습니다. 별도 ‘복산동법무사’ URL을 만들지 않고, 이 동래구 안내와 인접 동네 허브에서 소재지 기준으로 연결합니다.",
        links: [
          { href: "/온천동법무사", label: "온천동 안내" },
          { href: "/부산한정승인", label: "한정승인" },
        ],
      },
    ],
    faqs: [
      {
        question: "복산동 법무사는 어디서 보나요?",
        answer:
          "공식 행정동과 검색어가 다를 수 있어, 동래구 Host에서 소재지를 확인한 뒤 온천·사직·동래역 등 인접 안내로 연결합니다. 지역명만 바꾼 별도 페이지는 만들지 않습니다.",
      },
    ],
    serviceLinks: [
      { href: "/부산법무사", label: "부산 법무사 — 업무 선택 안내" },
      { href: "/동래구상속등기", label: "동래구 상속등기" },
      { href: "/동래구부동산등기", label: "동래구 부동산등기" },
      { href: "/부산법인법무사", label: "부산 법인 업무 안내" },
    ],
  },
};

export function getLocalChampionOverlay(
  regionId?: string,
  slug?: string,
): LocalChampionOverlay | undefined {
  if (regionId && LOCAL_CHAMPION_OVERLAYS[regionId]) {
    return LOCAL_CHAMPION_OVERLAYS[regionId];
  }
  if (slug) {
    return Object.values(LOCAL_CHAMPION_OVERLAYS).find((o) => o.slug === slug);
  }
  return undefined;
}

export function stripLocalNames(text: string): string {
  return text
    .replace(/민락(동|역)?/g, "")
    .replace(/양정(동|역)?/g, "")
    .replace(/장산(역)?/g, "")
    .replace(/전포(동|역)?/g, "")
    .replace(/복산(동)?/g, "")
    .replace(/다옴법무사사무소/g, "")
    .replace(/안윤정/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
