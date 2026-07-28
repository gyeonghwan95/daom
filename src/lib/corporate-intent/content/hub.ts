import type { CorporatePageContent } from "../types";
import {
  CORPORATE_HUB_LINKS,
  CORPORATE_OFFICE_LINE,
  CORPORATE_SCOPE_NOTICE,
} from "./shared";

export const corporateHubPage: CorporatePageContent = {
  slug: "법인변경등기",
  kind: "hub",
  title: "법인 변경등기 안내",
  metaTitle: "법인 변경등기｜임원·본점·목적·증자·해산 절차별 안내",
  metaDescription:
    "법인 변경등기는 임원·본점·사업목적·자본금·해산 등 사유마다 결의기관과 서류가 다릅니다. 부산 법인의 변경등기 유형별 안내와 상담 연결 — 다옴법무사.",
  h1: "법인 변경등기 — 어떤 변경이 필요한지부터 확인하세요",
  eyebrow: "부산 법인등기 · 변경등기 허브",
  heroIntro:
    "법인 변경등기는 ‘등기 한 번’이 아니라, 변경 사유마다 결의 방식·첨부서류·기한이 달라집니다.",
  heroParagraphs: [
    "대표이사 교체, 본점 이전, 사업목적 추가, 유상증자, 해산·청산까지 모두 ‘변경등기’ 범주이지만 실무 절차는 서로 다릅니다. 등기사항증명서와 정관을 기준으로 필요한 등기 종류를 먼저 구분하는 것이 중요합니다.",
    "이 페이지는 기존 `/부산법인등기`, `/부산임원변경등기` 등 안내와 연결되는 변경등기 전용 허브입니다. 검색 의도에 맞는 세부 페이지로 이동해 확인하세요.",
  ],
  officeLine: CORPORATE_OFFICE_LINE,
  scopeNotice: CORPORATE_SCOPE_NOTICE,
  conclusion:
    "법인 변경등기는 변경 항목(임원·본점·목적·자본금·해산 등)별로 결의기관과 첨부서류가 다르며, 결의 후 법정 기한 내 등기하지 않으면 과태료가 부과될 수 있습니다. 먼저 등기사항증명서로 현재 등기 상태를 확인한 뒤 해당 유형 페이지를 참고하세요.",
  primaryKeyword: "법인 변경등기",
  secondaryKeywords: [
    "부산 법인 변경등기",
    "법인등기 변경",
    "임원변경등기",
    "본점이전등기",
    "목적변경등기",
    "유상증자 등기",
  ],
  questionKeywords: [
    "법인 변경등기 종류",
    "변경등기 기한",
    "변경등기 필요 서류",
    "변경등기 과태료",
  ],
  searchIntent:
    "법인 변경등기 전반의 종류와 절차 차이를 파악하고, 자신의 상황에 맞는 세부 안내로 이동하려는 검색",
  whoNeedsThis: [
    "등기부와 실제 회사 운영(대표·주소·업종)이 다른 법인",
    "투자·M&A·조직 개편으로 여러 변경이 겹치는 경우",
    "어떤 변경등기부터 해야 할지 순서가 헷갈리는 대표",
  ],
  whenAndDeadline: [
    "임원·본점·목적 등 각 변경은 결의일 기준 등기 기한이 따로 적용됩니다.",
    "여러 변경을 한 번에 하려면 결의·서류를 묶어 설계할 수 있으나, 사유별 요건을 충족해야 합니다.",
  ],
  decisionBodies: [
    "정관에 따라 주주총회·이사회·대표이사 결의 요건이 달라집니다.",
    "본점이전·목적변경·증자·해산은 보통 주주총회 결의가 필요한 경우가 많습니다.",
    "임원 변경은 취임·사임 유형에 따라 이사회만으로 가능한지 정관을 확인해야 합니다.",
  ],
  documents: [
    "등기사항전부증명서(최신)",
    "정관",
    "변경 사유별 의사록·취임승낙서·사임서",
    "본점이전 시 임대차·건축물대장",
    "증자 시 신주인수·납입 증빙",
  ],
  procedures: [
    "등기사항증명서·정관으로 변경 항목 확인",
    "결의기관·의결 정족수 검토",
    "필요 서류 작성·인감 준비",
    "관할 등기소 접수",
    "등기 완료 후 사업자등록·계약서·통장 정보 정리",
  ],
  costFactors: [
    "변경 항목 수(단일 vs 복수 동시)",
    "자본금·본점 관할 변경 여부",
    "정관 개정 범위",
    "보정·재접수 발생",
  ],
  penaltyRisks: [
    "결의 후 등기 기한 경과 시 과태료",
    "등기 없이 대외 거래 시 신뢰·금융 거래 문제",
    "해산·청산 단계 누락 시 법인 존속 지속",
  ],
  commonConfusions: [
    "사업자등록 변경과 법인 변경등기를 혼동하는 경우",
    "주식 양도 계약과 주주·임원 등기 변경을 동일시하는 경우",
    "관할 내 본점이전과 관할 외 이전의 절차 차이를 무시하는 경우",
  ],
  diyErrors: [
    "결의 요건 미충족 상태로 접수",
    "사임·취임 중 한쪽만 등기",
    "등기 완료 전 사업자등록·통장만 변경",
  ],
  faqs: [
    {
      question: "변경등기와 설립등기는 다른가요?",
      answer:
        "설립등기는 법인을 처음 만드는 등기이고, 변경등기는 설립 후 등기사항을 바꾸는 등기입니다. `/부산법인설립등기` 페이지에서 설립 절차를 확인할 수 있습니다.",
    },
    {
      question: "여러 변경을 한 번에 등기할 수 있나요?",
      answer:
        "결의·서류가 갖춰지면 동시 접수가 가능한 경우가 많습니다. 다만 사유별 요건을 각각 충족해야 합니다.",
    },
    {
      question: "부산 법인만 해당되나요?",
      answer:
        "본점 소재지가 부산이면 부산 관할 등기소 기준으로 안내합니다. 타 지역 본점이전은 `/전국법인본점이전등기`를 참고하세요.",
    },
  ],
  relatedLinks: [
    CORPORATE_HUB_LINKS.main,
    CORPORATE_HUB_LINKS.registry,
    CORPORATE_HUB_LINKS.pillar,
    CORPORATE_HUB_LINKS.establishment,
    CORPORATE_HUB_LINKS.director,
    CORPORATE_HUB_LINKS.contact,
  ],
  ctaTitle: "변경 항목부터 확인하기",
  ctaText:
    "등기사항증명서와 정관을 기준으로 어떤 변경등기가 필요한지 모르셔도 현재 상황부터 남겨주세요.",
  topicClusters: [
    {
      title: "임원·대표 변경",
      intro: "대표이사 교체, 임기 만료, 사임·후임 미정 등 상황별로 필요 서류가 다릅니다.",
      links: [
        {
          href: "/부산대표이사변경등기",
          label: "부산 대표이사 변경등기",
          description: "대표권 이전·은행·거래처 연계 정리",
        },
        {
          href: "/부산임원임기만료등기",
          label: "부산 임원 임기만료 등기",
          description: "임기 경과 후 중임·퇴임 정리",
        },
        {
          href: "/부산임원변경등기",
          label: "부산 임원변경등기 종합",
          description: "취임·사임·주소변경 전반",
        },
        {
          href: "/대표자사망시법인등기",
          label: "대표자 사망 시 법인등기",
          description: "승계·임원 정비 순서",
        },
      ],
    },
    {
      title: "본점·사업목적·지점",
      intro: "관할 내·외 이전, 목적 추가, 지점 설치·폐지는 절차가 다릅니다.",
      links: [
        {
          href: "/부산본점이전등기",
          label: "부산 법인 본점이전등기",
          description: "관할 변경 여부·세무 연계",
        },
        {
          href: "/부산사업목적변경등기",
          label: "부산 사업목적 변경등기",
          description: "업종 추가·정관 개정",
        },
        {
          href: "/전국법인본점이전등기",
          label: "전국 법인 본점이전등기",
          description: "타 지역 관할 이전",
        },
        {
          href: "/faq/corporate-address-change-faq",
          label: "본점이전 FAQ",
          description: "사업자등록 연계",
        },
      ],
    },
    {
      title: "자본금·주식",
      intro: "유상증자는 등기사항 변경이며, 주식 양도 계약과 구분해야 합니다.",
      links: [
        {
          href: "/부산유상증자등기",
          label: "부산 유상증자 등기",
          description: "신주발행·납입·등기 순서",
        },
        {
          href: "/faq/capital-increase-registration-faq",
          label: "증자등기 FAQ",
          description: "유상·무상 증자 비교",
        },
      ],
    },
    {
      title: "해산·청산·과태료",
      intro: "사업자등록 폐업과 법인 해산·청산은 별개입니다.",
      links: [
        {
          href: "/부산법인해산청산등기",
          label: "부산 법인 해산·청산등기",
          description: "해산 결의부터 말소까지",
        },
        {
          href: "/부산법인등기과태료",
          label: "부산 법인등기 과태료",
          description: "지연 등기·예방 체크",
        },
        {
          href: "/임원변경등기과태료",
          label: "임원변경등기 과태료",
          description: "임원 변경 지연 시",
        },
      ],
    },
    {
      title: "특수·비영리법인",
      intro: "주식회사와 달리 허가·인가 후 등기하는 법인 유형입니다.",
      links: [
        {
          href: "/특수비영리법인등기",
          label: "특수·비영리법인 종합 허브",
          description: "사단·재단·협동조합·농업법인",
        },
        {
          href: "/부산비영리법인변경등기",
          label: "비영리법인 변경등기",
          description: "임원·목적·주사무소",
        },
        {
          href: "/비영리법인임원변경등기",
          label: "비영리법인 임원변경등기",
          description: "사단·재단 임원 변경",
        },
      ],
    },
  ],
};
