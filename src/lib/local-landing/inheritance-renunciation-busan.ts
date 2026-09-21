import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import type { ServiceFaq } from "@/types/service";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import {
  busanRenunciationHubDescription,
  busanRenunciationHubH1,
  busanRenunciationHubMetaTitle,
  busanRenunciationHubReviewedLabel,
} from "./renunciation-hub-identity";
import {
  renunciationChampionExtraFaqs,
  renunciationChampionExtraSummaryParagraphs,
  renunciationChampionExtraWhenNeeded,
} from "./renunciation-champion-modules";

/**
 * `/부산상속포기` — 「부산 상속포기 법무사」 대표 (한정승인·등기와 의도 분리).
 * title/H1 고정. 검토일은 renunciation-hub-identity.ts에서 관리한다.
 */
export {
  busanRenunciationHubDescription,
  busanRenunciationHubH1,
  busanRenunciationHubMetaTitle,
  busanRenunciationHubReviewedLabel,
  busanRenunciationHubReviewedOn,
} from "./renunciation-hub-identity";
export function buildBusanInheritanceRenunciationPage(
  config: LocalLandingConfig,
): LocalLandingPage {
  const faqs: ServiceFaq[] = [
    {
      question: "상속포기와 한정승인의 차이는?",
      answer:
        "포기는 상속 자체를 받지 않고, 한정승인은 상속하되 채무를 상속재산 한도로만 부담합니다. 재산이 전혀 없거나 받지 않기로 한 때 포기를 검토하는 경우가 많습니다.",
    },
    {
      question: "포기하면 다음 순위에게 넘어가나요?",
      answer:
        "가족구성에 따라 다릅니다. 배우자·자녀가 공동상속인인데 자녀만 전부 포기하면 배우자가 단독상속인이 되는 경우가 있어, 곧바로 부모·형제에게 넘어간다고 보지 않습니다. 배우자와 자녀가 모두 포기하면 그다음 순위를 확인합니다. 개별 사정은 상담에서 확인합니다.",
    },
    {
      question: "기한은 얼마인가요?",
      answer:
        "상속 개시를 안 날부터 3개월 이내 가정법원 신고가 원칙입니다. 임박·경과 시에는 사실관계를 먼저 확인합니다.",
    },
    {
      question: "일부만 포기할 수 있나요?",
      answer:
        "상속인마다 선택이 달라질 수 있습니다. 다만 효과와 후순위 문제를 함께 설명드려야 합니다.",
    },
    {
      question: "포기 후에도 등기가 필요한가요?",
      answer:
        "본인이 포기하면 그 상속분에 대한 상속등기는 하지 않습니다. 다른 상속인이 등기할 수는 있습니다.",
    },
    {
      question: "상담 전 준비물은?",
      answer:
        "사망일(인지일), 상속인 구성, 확인된 재산·채무, 이미 처분한 내역을 메모해 오시면 됩니다.",
    },
    {
      question: "한정승인 대신 포기를 고르는 경우는?",
      answer:
        "남겨 둘 재산이 거의 없고 상속 자체를 받지 않기로 한 때 포기를 검토하는 경우가 많습니다. 재산이 남아 채무만 제한하려면 한정승인을 함께 비교합니다.",
    },
    {
      question: "이미 예금을 썼다면?",
      answer:
        "단순승인으로 볼 여지가 있는지 사실관계를 먼저 확인합니다. 처분·인출 시기와 용도에 따라 선택이 달라질 수 있어 단정하지 않습니다.",
    },
    {
      question: "포기와 한정승인을 같은 가족에서 병행할 수 있나요?",
      answer:
        "상속인마다 선택이 달라질 수 있습니다. 다만 후순위 효과·협의·등기 일정이 겹치므로 가족끼리 먼저 조율하는 것이 좋습니다.",
    },
    {
      question: "포기 신고 후 다른 상속인 등기는?",
      answer:
        "본인이 포기한 상속분에 대한 등기는 하지 않습니다. 다른 상속인은 자신의 지분 범위에서 등기·협의를 진행할 수 있습니다.",
    },
    ...renunciationChampionExtraFaqs,
  ];

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "service-region",
    serviceSlug: config.serviceSlug,
    title: "부산 상속포기 법무사",
    metaTitle: busanRenunciationHubMetaTitle,
    h1: busanRenunciationHubH1,
    description: busanRenunciationHubDescription,
    summaryParagraphs: [
      "부산 상속포기 법무사를 찾는 분들은 대개 ‘빚만 남는 것 같다’고 느낄 때입니다. 포기는 되돌리기 어려운 선택이므로, 한정승인·단순승인과 비교한 뒤 결정하는 것이 안전합니다.",
      "다옴법무사사무소는 가정법원 신고 서류와 가족 조율 포인트를 안내합니다. 재산이 남아 채무만 제한하려면 부산 한정승인을 함께 보세요.",
      "배우자와 자녀의 선택이 다르거나, 남은 상속인에게 채무가 이어지는 것이 부담이면 신고 전에 가족 회의 포인트를 정리하는 것이 좋습니다.",
      "포기 신고 후 다른 상속인이 등기·협의를 진행할 때는 ‘누가 어떤 상속분을 받는지’를 가족끼리 먼저 맞춰 두면 분쟁을 줄일 수 있습니다. 안심상속 원스톱서비스 등으로 채무·재산을 조회한 뒤 선택하는 것이 안전합니다.",
      ...renunciationChampionExtraSummaryParagraphs,
    ],
    primaryKeywords: [
      "부산 상속포기 법무사",
      "부산 상속포기",
      "상속포기 3개월",
    ],
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement:
      "상속포기를 검색하는 이유는 대개 채무가 재산보다 크다고 느껴지거나, 가족 중 일부가 상속을 받지 않으려 할 때입니다. ‘나만 포기하면 끝’이 아닌 경우가 많아, 누가 상속인인지부터 맞춰야 합니다. 배우자·자녀가 함께 상속인인데 자녀만 전부 포기하면 배우자가 단독상속인이 될 수 있고(대법원 2023. 3. 23.자 2020그42 전원합의체 결정), 배우자와 자녀가 모두 포기하면 그다음 순위를 봅니다. 상담에서는 인지일·상속인 명단·확인된 채무·처분 이력을 보고 포기와 한정승인 중 무엇을 할지 가릅니다. 이미 예금을 쓰거나 부동산을 처분했다면 단순승인으로 볼 여지가 있는지 먼저 점검합니다. 미성년 포기는 특별대리 등 추가 절차가 필요할 수 있고, 해외 거주 상속인이 있으면 위임·인증 일정이 3개월과 겹치는지 확인합니다. 가정법원 신고와 부동산 등기는 접수처가 다릅니다. 실제 결과는 개별 사정에 따라 달라질 수 있습니다.",
    whenNeeded: [
      "채무가 재산보다 많아 상속을 받지 않으려 할 때",
      "가족 일부만 포기하고 일부만 승인하려 할 때",
      "3개월 기한이 임박했을 때",
      "누가 포기하면 남은 상속인 효과가 어떻게 되는지 확인하고 싶을 때",
      "미성년·해외 상속인의 포기를 검토할 때",
      ...renunciationChampionExtraWhenNeeded,
    ],
    jurisdictionGuide: {
      title: "부산 상속포기 관할",
      address: "관할 가정법원",
      accessNote: "피상속인 마지막 주소지 등을 기준으로 관할이 정해집니다.",
      jurisdictionNote: "상속포기는 가정법원 신고 사건입니다. 부동산 등기와 접수처가 다릅니다.",
      practicalNotes: [
        "3개월 기한을 달력에 표시하세요.",
        "후순위 상속인에게 미리 알려 갈등을 줄이세요.",
        "처분·인출 이력이 있으면 먼저 말씀해 주세요.",
      ],
    },
    consultationCase: {
      title: "채무 과다 상속포기 상담",
      summary:
        "재송동 인근 의뢰인이 채무가 재산보다 많은 상황에서 상담하셨습니다. 후순위 효과를 안내한 뒤 상속포기 신고를 준비한 사례입니다.",
      href: "/services/cases/jaesong-inheritance-renunciation-consultation",
    },
    consultationCases: [
      {
        title: "채무 과다 상속포기 상담",
        summary:
          "재송동 인근 의뢰인이 채무가 재산보다 많은 상황을 상담하셨습니다. 후순위 효과를 안내한 뒤 상속포기 신고를 준비한 사례입니다.",
        href: "/services/cases/jaesong-inheritance-renunciation-consultation",
      },
    ],
    legalIssues: [
      "상속포기는 가정법원 신고로 효력이 생깁니다. 신고 수리 전에는 효과가 확정되지 않을 수 있습니다.",
      "배우자·자녀가 공동상속인일 때 일부만 포기하면 남은 상속인의 지위가 달라질 수 있어, 가족 조율이 필요합니다.",
      "단순승인으로 볼 행위(처분·인출 등)가 있으면 포기가 제한될 수 있습니다.",
      "한정승인과 달리 상속 자체를 받지 않으므로, 남겨 둘 재산이 있으면 선택이 달라질 수 있습니다.",
      "미성년·해외 상속인은 특별대리·위임·인증이 추가될 수 있어 3개월 기한과 겹치지 않게 일정을 잡습니다.",
      "포기 후에도 다른 상속인의 등기·협의·세금 신고는 별도로 진행될 수 있어, 가족 간 역할 분담을 미리 정하는 것이 좋습니다.",
      "이미 예금·부동산을 처분했다면 단순승인으로 볼 여지가 있는지 먼저 점검해야 포기·한정승인 선택이 달라질 수 있습니다.",
    ],
    precautions: [
      "이 안내는 일반 법률정보이며 개별 사건의 법률 자문·결과 보장이 아닙니다.",
      "기한·처분 이력·후순위 효과는 상담 시 사실관계에 따라 다시 확인합니다.",
      "검토·작성: 안윤정 법무사(다옴법무사사무소). 검토일 2026-09-20.",
    ],
    procedures: [
      "상담에서 사망일·인지일·가족관계·처분 이력을 확인합니다.",
      "재산·채무를 조회해 포기와 한정승인을 비교합니다.",
      "누가 포기하는지와 남은 상속인 효과(배우자 단독인지, 다음 순위인지)를 정리합니다.",
      "신고서·가족관계 서류·위임 자료를 준비합니다.",
      "관할 가정법원에 신고합니다.",
      "보정 안내가 있으면 대응하고 심판·수리를 확인합니다.",
      "다른 상속인의 등기·협의가 있으면 후속 일정을 안내합니다.",
    ],
    documents: [
      "피상속인·상속인 가족관계증명서",
      "기본증명서",
      "신고서·첨부서류",
      "처분·인출 이력 메모(해당 시)",
      "위임장(수임 시)",
    ],
    costGuide:
      "상속포기 수임료는 상속인 수·미성년·해외 여부·동시 진행 건수에 따라 달라집니다. 법원 수수료는 별도이며, 확정 금액은 상담 후 견적합니다. 한정승인·상속등기를 같은 가족에서 병행하면 항목별로 견적을 나눠 안내합니다. 기한이 임박해 긴급 접수가 필요하면 일정에 따라 달라질 수 있습니다. 이해를 위한 가상 예시로, 상속인 4명 중 2명만 포기하고 2명은 한정승인을 검토하면 신고서·첨부서류가 각각 달라집니다. 실제 결과는 개별 사정에 따라 달라질 수 있습니다.",
    costFactors: ["상속인 수", "특별대리 필요", "기한 임박 여부", "병행 절차"],
    faqs,
    lawyerOpinion: `${lawyerProfileMeta.fullTitle}는 상속포기 상담에서 후순위 효과를 빠뜨리지 않도록 먼저 설명합니다. 재산이 남아 채무만 제한할 때는 한정승인도 함께 비교합니다. 다옴법무사사무소는 3개월 기한·처분 이력·가족 조율 포인트를 같은 상담에서 정리합니다. 작성·검토: ${lawyerProfileMeta.fullTitle}(다옴법무사사무소). 최종확인일 ${busanRenunciationHubReviewedLabel}.`,
    directionsNote: `사무소는 ${officeLocation.fullAddress}입니다.`,
    ctaDescription:
      "3개월 기한·후순위를 먼저 확인하고 싶으시면 사망일·상속인 구성·확인된 채무만 남겨 주세요.",
    relatedBlogHrefs: [],
    extraPageSections: [
      {
        title: "상속포기 전에 먼저 확인할 것",
        body: "기한·가족관계·처분 이력을 맞추기 전에 등기부터 진행하면 선택이 꼬일 수 있습니다. 아래 항목만 적어도 1차 방향을 나눌 수 있습니다.",
        items: [
          "상속개시일(사망일)과 내가 상속 사실을 안 날",
          "현재 상속인 — 배우자 유무",
          "현재 상속인 — 자녀 유무",
          "자녀·배우자가 모두 포기할 때 다음 순위 친족",
          "알고 있는 재산 규모",
          "알고 있는 채무 규모(대출·보증·세금)",
          "예금 인출·부동산 처분 여부",
          "미성년 상속인 여부",
          "해외 거주 상속인 여부",
          "3개월이 임박했는지, 이미 지났는지",
        ],
      },
      {
        title: "3개월은 언제부터 계산하나요",
        body: "원칙적으로 상속 개시를 안 날부터 3개월 안에 가정법원에 신고합니다(민법 제1019조). 사망일과 인지일이 다를 수 있어 달력에 둘 다 적습니다. 기한이 지났다고 해서 언제나 방법이 없는 것은 아니며, 뒤늦게 채무를 알게 된 경우에는 특별한정승인 검토 여지가 있을 수 있습니다. 개별 결과는 사실관계에 따릅니다.",
        items: [
          "사망일과 인지일을 구분해 기록",
          "기한이 며칠 남았는지 표시",
          "이미 지났다면 특별한정승인 안내도 함께 확인",
        ],
        links: [
          {
            href: "/tools/inheritance-renunciation-deadline",
            label: "상속포기 3개월 기한 확인 도구",
          },
          { href: "/특별한정승인", label: "특별한정승인 안내" },
        ],
      },
      {
        title: "가족 구성에 따라 누가 포기하면 어떻게 되나요",
        body: "‘자녀가 전부 포기하면 무조건 부모·형제·손자녀에게 넘어간다’고 단정하지 않습니다. 배우자·자녀가 공동상속인인 상태에서 자녀 전원이 포기하면 배우자가 단독상속인이 되는 경우가 있습니다(대법원 2023. 3. 23.자 2020그42 전원합의체 결정). 배우자와 자녀가 모두 포기하면 그다음 순위를 확인합니다. 아래는 상담 전 점검표이며, 개별 사정은 가족관계증명서로 확인합니다.",
        items: [
          "배우자 + 자녀: 자녀만 전부 포기하면 배우자 단독상속 여부를 먼저 본다",
          "배우자와 자녀 모두 포기 검토: 직계존속·형제 등 다음 순위를 확인한다",
          "배우자 없음 + 자녀: 자녀 전원 포기 후 다음 순위를 확인한다",
          "미성년 자녀 포함: 부모만 포기해도 자녀 몫이 남을 수 있어 특별대리를 본다",
          "해외 거주 상속인 포함: 위임·인증 일정이 3개월과 겹치는지 본다",
        ],
      },
      {
        title: "상속포기 전에 하면 위험할 수 있는 행동",
        body: "상속재산을 처분·인출·사용하면 단순승인으로 볼 여지가 생길 수 있습니다(민법 제1026조). 다만 행위의 종류·시기·용도에 따라 판단이 달라지므로, 한 번 인출했다고 언제나 포기가 불가능하다고 단정하지 않습니다. 이미 한 일이 있으면 시기와 용도를 메모해 상담합니다.",
        items: [
          "피상속인 예금 인출·이체",
          "상속재산 임의 처분·매도",
          "채권 회수·채무 변제",
          "차량·가재도구를 개인적으로 사용",
        ],
      },
      {
        title: "상속포기와 한정승인 중 무엇을 볼까",
        body: "받을 재산이 거의 없고 상속 자체를 받지 않기로 하면 포기를 검토합니다. 재산은 남기고 채무만 한도로 제한하려면 한정승인입니다. 재산·채무를 아직 모르면 조회 후 고르는 편이 안전합니다. 한정승인 상세는 별도 안내로 이어집니다.",
        items: [
          "채무가 분명하고 재산을 받지 않기로 함 → 상속포기",
          "재산이 남아 채무만 제한하고 싶음 → 한정승인",
          "규모를 모름 → 조회 후 선택",
          "기한이 지났고 뒤늦게 채무를 앎 → 특별한정승인 검토",
        ],
        links: [
          { href: "/부산한정승인", label: "한정승인 절차 비교" },
          { href: "/특별한정승인", label: "특별한정승인 안내" },
        ],
      },
      {
        title: "부산에서 실제 신청은 어떻게 진행되나요",
        body: `다옴법무사사무소는 ${officeLocation.fullAddress}에 있으며, 안윤정 법무사가 가정법원 신고 서류와 가족 조율 포인트를 안내합니다. 상담 → 가족관계·사망일 확인 → 재산·채무·처분내역 확인 → 포기 가능성 검토 → 서류 준비 → 가정법원 신고 → 보정 대응 → 심판 확인 → 필요한 후속 안내 순입니다. 소송 대리·세무 확정은 업무 범위가 아닙니다.`,
        items: [
          "전화·카카오톡·예약 방문 중 편한 채널로 시작",
          "사망일·상속인·확인된 채무만 있어도 1차 확인 가능",
          "관할은 피상속인 최후 주소지 등을 기준으로 확인",
        ],
        links: [
          {
            href: "/부산가정법원상속포기",
            label: "부산가정법원 상속포기 관할·접수 안내",
          },
        ],
      },
    ],
    relatedServiceLinks: [
      { href: "/부산상속법무사", label: "부산 상속 법무사 — 절차 선택" },
      { href: "/부산한정승인", label: "부산 한정승인 — 채무 한도 승인" },
      { href: "/상속포기비용", label: "상속포기 비용이 궁금할 때" },
      { href: "/tools/inheritance-renunciation-deadline", label: "3개월 기한 확인 도구" },
      { href: "/부산가정법원상속포기", label: "부산가정법원 관할·접수 안내" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/상속", label: "상속 종합 허브" },
      { href: "/contact/inquiry?field=inheritance-renunciation", label: "상속포기 3개월 기한·가족관계 확인" },
    ],
    relatedRegionLinks: [
      { href: "/동래구상속포기", label: "동래구 상속포기" },
      { href: "/북구상속포기", label: "북구 상속포기" },
    ],
  };
}
