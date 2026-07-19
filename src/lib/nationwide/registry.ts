import type {
  NationwideNoticeConfig,
  NationwideServiceCard,
  NationwideServiceType,
} from "./types";

export const NATIONWIDE_TYPE_LABELS: Record<NationwideServiceType, string> = {
  "jurisdiction-exception": "관할 특례 검토",
  "bundled-jurisdiction": "복수 관할 묶음 검토",
  "expandable-jurisdiction": "관할 확인 후 이전",
  "remote-accept": "법정 관할 + 비대면 수임",
};

const BASE_STEPS: [string, string, string] = [
  "전화·카카오톡으로 지역·업무·일정 확인",
  "서류·공과금·법무사 보수를 구분해 안내",
  "법정 관할·특례 적용 여부를 확인한 뒤 신청",
];

export function getNationwideNotice(
  type: NationwideServiceType,
  options?: { ctaLabel?: string; ctaHref?: string },
): NationwideNoticeConfig {
  const ctaLabel = options?.ctaLabel ?? "내 지역도 진행 가능한지 확인하기";
  const ctaHref = options?.ctaHref ?? "/contact/inquiry?from=nationwide";

  if (type === "jurisdiction-exception") {
    return {
      type,
      badge: "전국 의뢰 가능",
      title: "부산에 방문하지 않아도 전국 상속·유증등기를 검토할 수 있습니다",
      paragraphs: [
        "서울·경기·인천·대구·대전·광주·울산·경남·경북·전남·전북·충남·충북·강원·제주 등 부동산 소재 지역과 관계없이 먼저 상담할 수 있습니다.",
        "상속·유증등기는 관할 특례가 적용되는 범위에서 부동산 소재지와 다른 지역의 등기소를 통한 신청이 가능한지 검토할 수 있습니다. 여러 지역에 부동산이 흩어져 있어도 서류 수집부터 신청 방식까지 한 번에 확인합니다.",
      ],
      steps: BASE_STEPS,
      caution:
        "세부 사건이 실제 관할 특례 적용 대상인지는 부동산 수·등기원인·신청 구조를 확인한 뒤 안내합니다. 아래 내용은 일반적인 안내이며 개별 사건은 서류 확인이 필요합니다.",
      ctaLabel,
      ctaHref,
    };
  }

  if (type === "bundled-jurisdiction") {
    return {
      type,
      badge: "전국 의뢰 가능",
      title: "여러 지역 부동산이라도 함께 신청할 수 있는지 먼저 검토합니다",
      paragraphs: [
        "당사자·등기목적·등기원인과 신청 구조가 일정한 요건을 충족하면 하나의 관할에서 함께 신청할 수 있는지 확인할 수 있습니다.",
        "무조건 일괄 접수된다고 단정하지 않으며, 사건별 요건을 확인한 뒤 가능한 방식을 안내합니다.",
      ],
      steps: BASE_STEPS,
      caution:
        "복수 관할 부동산의 공동담보·관련 등기는 요건에 따라 신청 방식이 달라질 수 있습니다. 개별 사건은 서류 확인이 필요합니다.",
      ctaLabel: options?.ctaLabel ?? "여러 지역 부동산 한 번에 문의하기",
      ctaHref,
    };
  }

  if (type === "expandable-jurisdiction") {
    return {
      type,
      badge: "전국 의뢰 가능",
      title: "지역이 달라지는 법인 본점이전도 비대면으로 상담할 수 있습니다",
      paragraphs: [
        "관할 외 본점이전등기는 종전 본점과 새 본점 소재지의 관할을 확인하여 진행합니다.",
        "부산으로 이전하는 법인뿐 아니라 부산에서 타지역으로 이전하는 법인도 전화·카카오톡으로 상담할 수 있습니다.",
      ],
      steps: BASE_STEPS,
      caution:
        "법인등기의 법정 관할은 유지됩니다. 신청 관할·등록면허세·결의 요건은 이전 경로에 따라 달라지며 개별 확인이 필요합니다.",
      ctaLabel: options?.ctaLabel ?? "방문 없이 진행 가능한지 확인하기",
      ctaHref,
    };
  }

  return {
    type,
    badge: "전국 의뢰 가능",
    title: "사무소와 거리가 있어도 비대면으로 진행할 수 있습니다",
    paragraphs: [
      "다옴법무사사무소는 부산에 있지만 타지역 의뢰도 전화·카카오톡·전자문서·우편 등을 활용하여 상담하고 진행할 수 있습니다.",
      "다만 신청은 사건별 법정 관할 법원 또는 등기소에 이루어집니다. 방문이 필요한 절차가 있으면 수임 전에 미리 안내합니다.",
    ],
    steps: BASE_STEPS,
    caution:
      "「전국 수임 가능」과 「전국 어느 법원·등기소에나 신청 가능」은 다릅니다. 관할 제한이 사라지는 것이 아니며, 개별 사건은 서류 확인이 필요합니다.",
    ctaLabel,
    ctaHref,
  };
}

/** 허브 카드 — 상세 페이지와 기존 업무 허브 연결 */
export const nationwideServiceCards: NationwideServiceCard[] = [
  {
    id: "inheritance-reg",
    name: "전국 상속등기",
    type: "jurisdiction-exception",
    typeLabel: NATIONWIDE_TYPE_LABELS["jurisdiction-exception"],
    visitNeed: "often-remote",
    visitLabel: "대부분 비대면 검토 가능",
    jurisdictionNote:
      "관할 특례 적용 여부를 사건별로 확인한 뒤 신청 등기소를 안내합니다.",
    documents: ["가족관계·제적 서류", "상속인 인감·위임", "부동산 등기부"],
    href: "/전국상속등기",
    summary: "부동산 소재지가 부산이 아니어도 상담·진행을 검토합니다.",
  },
  {
    id: "bequest-reg",
    name: "전국 유증등기",
    type: "jurisdiction-exception",
    typeLabel: NATIONWIDE_TYPE_LABELS["jurisdiction-exception"],
    visitNeed: "often-remote",
    visitLabel: "대부분 비대면 검토 가능",
    jurisdictionNote: "유언·유증 구조에 따라 관할 특례와 서류를 함께 확인합니다.",
    documents: ["유언서·공정증서", "수증자 서류", "등기부·대장"],
    href: "/전국유증등기",
    summary: "유언에 따른 부동산 이전을 지역과 관계없이 먼저 상담합니다.",
  },
  {
    id: "multi-prop",
    name: "여러 지역 상속부동산",
    type: "jurisdiction-exception",
    typeLabel: NATIONWIDE_TYPE_LABELS["jurisdiction-exception"],
    visitNeed: "case-by-case",
    visitLabel: "부동산 수·지역에 따라 안내",
    jurisdictionNote: "부동산별 등기부·시가·취득세 신고를 묶어 검토합니다.",
    documents: ["부동산 목록", "협의분할서", "지역별 시가·대장"],
    href: "/여러지역상속부동산등기",
    summary: "서울·부산·경기·제주 등에 흩어진 상속부동산을 한 곳에서 정리합니다.",
  },
  {
    id: "hq-transfer",
    name: "전국 법인 본점이전",
    type: "expandable-jurisdiction",
    typeLabel: NATIONWIDE_TYPE_LABELS["expandable-jurisdiction"],
    visitNeed: "often-remote",
    visitLabel: "결의·서류 확인 후 비대면 진행",
    jurisdictionNote: "종전·신규 본점 관할을 확인한 뒤 신청합니다.",
    documents: ["정관", "주주총회·이사회 의사록", "임대차·대장"],
    href: "/전국법인본점이전등기",
    summary: "서울↔부산·김해·양산 등 타지역 이전을 비대면으로 상담합니다.",
  },
  {
    id: "joint-collateral",
    name: "전국 공동담보·근저당",
    type: "bundled-jurisdiction",
    typeLabel: NATIONWIDE_TYPE_LABELS["bundled-jurisdiction"],
    visitNeed: "case-by-case",
    visitLabel: "요건 확인 후 안내",
    jurisdictionNote: "일괄 신청 가능 여부는 당사자·목적·원인 구조에 따라 달라집니다.",
    documents: ["담보 부동산 목록", "채권최고액·채무자 정보", "등기부"],
    href: "/전국공동담보등기",
    summary: "서로 다른 지역 부동산을 공동담보로 제공하는 경우를 검토합니다.",
  },
  {
    id: "remote-corp",
    name: "법인설립·변경등기",
    type: "remote-accept",
    typeLabel: NATIONWIDE_TYPE_LABELS["remote-accept"],
    visitNeed: "often-remote",
    visitLabel: "비대면 상담·진행 가능",
    jurisdictionNote: "신청은 본점 소재지 관할 등기소에 합니다.",
    documents: ["정관·인감", "임원 서류", "결의서"],
    href: "/법인등기",
    summary: "법정 관할은 지키되 타지역 법인도 비대면으로 상담합니다.",
  },
  {
    id: "remote-renunciation",
    name: "상속포기·한정승인",
    type: "remote-accept",
    typeLabel: NATIONWIDE_TYPE_LABELS["remote-accept"],
    visitNeed: "often-remote",
    visitLabel: "가정법원 관할 + 비대면 수임",
    jurisdictionNote: "가정법원 관할은 유지되며, 서류는 우편·전자로 조율할 수 있습니다.",
    documents: ["가족관계 서류", "재산·채무 개요", "신고서 준비자료"],
    href: "/services/inheritance-renunciation",
    summary: "3개월 검토 기간을 지키며 타지역 신고도 상담합니다.",
  },
  {
    id: "remote-rehab",
    name: "개인회생·개인파산",
    type: "remote-accept",
    typeLabel: NATIONWIDE_TYPE_LABELS["remote-accept"],
    visitNeed: "sometimes-visit",
    visitLabel: "관할 회생법원 + 단계별 안내",
    jurisdictionNote: "신청은 관할 회생·파산 법원에 이루어집니다.",
    documents: ["소득·채무 자료", "재산 목록", "진술서 개요"],
    href: "/부산개인회생",
    summary: "관할 법원은 정해져 있으나 초기 상담은 비대면으로 가능합니다.",
  },
];
