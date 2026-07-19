import type { ServiceConversionConfig } from "./types";
import { RELAXED_INTRO } from "./copy";

const TRUST_MESSAGE =
  "다옴법무사사무소는 상담 단계에서 사건의 기본 구조와 필요한 서류를 직접 확인한 뒤 진행 방향을 안내드립니다.";

const COMMON_FAQS = [
  {
    question: "법무사 상담 전에 서류를 다 준비해야 하나요?",
    answer:
      "아닙니다. 등기부등본이나 기본 증명서만 있어도 상담이 가능한 경우가 많습니다. 없는 서류는 상담 중에 무엇부터 준비하면 되는지 안내드립니다.",
  },
  {
    question: "등기 비용은 언제 확정되나요?",
    answer:
      "부동산 가액, 상속인 수, 변경 내용, 서류 준비 상태에 따라 달라집니다. 서류를 확인한 뒤 수임료와 등기 비용을 구분해 안내드리는 것이 가장 정확합니다.",
  },
  {
    question: "부산 외 지역 부동산도 가능한가요?",
    answer:
      "상담·진행을 검토할 수 있습니다. 상속·유증등기는 관할 특례 적용 여부를 확인하고, 그 외 업무는 법정 관할을 지키면서 비대면으로 수임할 수 있는지 안내합니다. 「전국 어느 등기소에나 접수」와는 의미가 다릅니다. 현재 상황을 상담으로 말씀해 주시면 가능 여부를 알려드립니다.",
  },
  {
    question: "셀프등기하다가 막힌 경우에도 상담 가능한가요?",
    answer:
      "가능합니다. 보정 요구, 첨부서류 누락, 협의서 형식 오류 등 어느 단계에서 막혔는지 알려주시면 다음 조치를 함께 정리해 드립니다.",
  },
  {
    question: "카카오톡으로 서류 사진만내도 되나요?",
    answer:
      "간단한 1차 확인은 가능합니다. 다만 최종 검토에는 선명한 사본이나 원본 확인이 필요할 수 있어, 상담 중에 어떤 형태가 적절한지 안내드립니다.",
  },
] as const;

function config(
  partial: Omit<
    ServiceConversionConfig,
    "trustMessage" | "additionalFaqs"
  > & {
    trustMessage?: string;
    additionalFaqs?: ServiceConversionConfig["additionalFaqs"];
  },
): ServiceConversionConfig {
  return {
    trustMessage: TRUST_MESSAGE,
    additionalFaqs: [...COMMON_FAQS],
    ...partial,
  };
}

export const serviceConversionConfigs: Record<string, ServiceConversionConfig> =
  {
    "inheritance-registration": config({
      key: "inheritance-registration",
      serviceName: "상속등기",
      mainKeyword: "부산 상속등기",
      conversionIntro:
        "상속등기는 가족관계, 협의 여부, 부동산 수에 따라 절차가 달라집니다. 서류가 아직 없어도 현재 상황부터 함께 확인해 드립니다.",
      painPoints: [
        "상속등기 기한이 지나 걱정되는 경우",
        "가족 간 협의가 아직 끝나지 않은 경우",
        "서류를 어디서부터 준비해야 할지 모르는 경우",
        "셀프등기를 하려다 보정이 걱정되는 경우",
        "상속인 중 일부가 연락이 안 되는 경우",
      ],
      preparationDocuments: [
        "사망자 기준 기본증명서·가족관계증명서",
        "상속인 인감증명서·신분증",
        "등기부등본",
        "상속재산분할협의서(공동상속인이 여러 명인 경우)",
        "토지·건축물 대장",
      ],
      costFactors: [
        "부동산 가액과 필지 수",
        "상속인 수와 협의 여부",
        "근저당·가압류 등 권리 정리 필요 여부",
        "해외 상속인 참여 여부",
        "서류 준비 상태",
      ],
      costGuideText:
        "등기 비용은 부동산 가액, 상속인 수, 협의 여부, 서류 준비 상태에 따라 달라질 수 있습니다. 정확한 금액은 서류 확인 후 안내드리는 것이 가장 안전합니다.",
      caseExamples: [
        {
          title: "상속인 중 일부가 해외에 있는 사례",
          body: "해외 거주 상속인의 위임·인증 절차를 먼저 정리한 뒤 국내 부동산 상속등기를 진행했습니다.",
        },
        {
          title: "등기부에 근저당이 남아 있는 사례",
          body: "상속등기 전 채무 구조를 확인하고, 말소·승계 순서를 함께 검토했습니다.",
        },
        {
          title: "형제 간 분할 협의가 지연된 사례",
          body: "협의서 초안과 필요 서류를 먼저 정리해 등기 일정을 맞췄습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/inheritance-renunciation", label: "상속포기" },
        { href: "/services/qualified-acceptance", label: "한정승인" },
        { href: "/부산상속등기", label: "부산 상속등기" },
        { href: "/상속등기비용", label: "상속등기 비용" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "내 상황도 해당되는지 애매하다면",
        description:
          "등기부등본이나 기본 증명서가 있으면 검토가 수월합니다. 지금 알고 계신 상황만 알려주셔도 필요한 순서를 정리해 드립니다.",
        buttonLabel: "내 상황 먼저 확인하기",
      },
      ctaMessages: [
        "내 상황 먼저 확인하기",
        "준비서류 물어보기",
        "등기 가능 여부 확인하기",
        "비용 기준 확인하기",
      ],
      diagnosisHref: "/상속등기자가진단",
      inquiryField: "inheritance-registration",
    }),

    "inheritance-renunciation": config({
      key: "inheritance-renunciation",
      serviceName: "상속포기",
      mainKeyword: "부산 상속포기",
      conversionIntro:
        "상속채무가 걱정된다면 기간 계산이 가장 중요합니다. 사망일, 상속 사실을 안 날, 채무 확인 여부를 기준으로 먼저 검토해드립니다.",
      painPoints: [
        "채무가 재산보다 많을 것 같아 불안한 경우",
        "상속포기 기한을 놓칠까 걱정되는 경우",
        "가족에게 상속이 넘어가는 영향이 걱정되는 경우",
        "한정승인과 어떤 절차가 맞는지 모르는 경우",
        "법원 신고 서류가 생소한 경우",
      ],
      preparationDocuments: [
        "피상속인 사망 사실 확인 서류",
        "상속인 관계 확인 서류",
        "채무·재산 목록(알고 있는 범위)",
        "상속포기 신고서 작성에 필요한 인적사항",
      ],
      costFactors: [
        "상속인 수",
        "관할 가정법원",
        "채무 조사 범위",
        "한정승인 병행 검토 여부",
        "가족 간 협의 필요 여부",
      ],
      costGuideText:
        "상속포기·한정승인 비용은 상속인 수, 채무 조사 범위, 관할 법원에 따라 달라질 수 있습니다. 기한 전에 1차 검토만 받으셔도 됩니다.",
      caseExamples: [
        {
          title: "채무 규모를 먼저 확인한 사례",
          body: "재산보다 채무가 많다고 판단되어 상속포기 기한 내 신고를 진행했습니다.",
        },
        {
          title: "한정승인과 비교 검토한 사례",
          body: "채무 목록을 정리한 뒤 상속포기와 한정승인 중 적합한 절차를 선택했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/inheritance-registration", label: "상속등기" },
        { href: "/services/qualified-acceptance", label: "한정승인" },
        { href: "/부산상속포기", label: "부산 상속포기" },
        { href: "/상속포기비용", label: "상속포기 비용" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "기한 계산이 막막하다면",
        description:
          "사망일과 상속 사실을 안 날짜만 알려주셔도 1차 검토가 가능합니다. 서류가 없어도 상담을 시작할 수 있습니다.",
        buttonLabel: "기한 먼저 확인하기",
      },
      ctaMessages: ["기한 먼저 확인하기", "상속포기 가능 여부 물어보기"],
      diagnosisHref: "/상속포기자가진단",
      inquiryField: "inheritance-renunciation",
    }),

    "qualified-acceptance": config({
      key: "qualified-acceptance",
      serviceName: "한정승인",
      mainKeyword: "부산 한정승인",
      conversionIntro:
        "상속채무가 걱정된다면 기간 계산이 가장 중요합니다. 사망일, 상속 사실을 안 날, 채무 확인 여부를 기준으로 먼저 검토해드립니다.",
      painPoints: [
        "채무 규모를 아직 파악하지 못한 경우",
        "단순승인으로 넘어갈까 걱정되는 경우",
        "재산은 필요하지만 채무는 제한하고 싶은 경우",
        "상속포기와 차이가 헷갈리는 경우",
        "채무 조사 방법을 모르는 경우",
      ],
      preparationDocuments: [
        "피상속인 사망 관련 서류",
        "상속인 관계 확인 서류",
        "알고 있는 채무·재산 목록",
        "금융거래 조회에 필요한 기본 정보",
      ],
      costFactors: [
        "채무 조사 범위",
        "상속인 수",
        "관할 가정법원",
        "재산 정리 필요 여부",
        "이후 상속등기 병행 여부",
      ],
      costGuideText:
        "한정승인 비용은 채무 조사 범위와 상속인 수에 따라 달라질 수 있습니다. 기한 전 1차 상담만으로도 방향을 정하는 데 도움이 됩니다.",
      caseExamples: [
        {
          title: "채무 목록 정리 후 한정승인한 사례",
          body: "알려진 채무를 정리한 뒤 한정승인 범위를 검토하고 신고했습니다.",
        },
        {
          title: "상속등기와 순서를 맞춘 사례",
          body: "한정승인 신고 후 상속등기 일정을 함께 계획했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/inheritance-renunciation", label: "상속포기" },
        { href: "/services/inheritance-registration", label: "상속등기" },
        { href: "/부산한정승인", label: "부산 한정승인" },
        { href: "/한정승인비용", label: "한정승인 비용" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "한정승인이 맞는지 애매하다면",
        description:
          "채무가 얼마나 있는지 아직 모르더라도, 지금 알고 있는 정보만으로 1차 검토가 가능합니다.",
        buttonLabel: "절차 비교 먼저 확인하기",
      },
      ctaMessages: ["절차 비교 먼저 확인하기", "채무 조사 방법 물어보기"],
      diagnosisHref: "/한정승인자가진단",
      inquiryField: "inheritance-renunciation",
    }),

    "real-estate-registration": config({
      key: "real-estate-registration",
      serviceName: "부동산등기",
      mainKeyword: "부산 부동산등기",
      conversionIntro:
        "잔금일이 정해져 있거나 근저당 말소가 함께 필요한 경우에는 미리 확인하는 것이 안전합니다.",
      painPoints: [
        "잔금일이 다가와 일정이 촉박한 경우",
        "근저당 말소가 함께 필요한 경우",
        "매도인·매수인 서류 협조가 어려운 경우",
        "전세·임차 관계가 복잡한 경우",
        "등기부상 권리관계를 해석하기 어려운 경우",
      ],
      preparationDocuments: [
        "매매계약서 또는 원인서류",
        "등기부등본",
        "잔금일·잔금 영수 관련 자료",
        "근저당 말소 여부 확인 자료",
        "인감증명서·신분증",
      ],
      costFactors: [
        "부동산 가액",
        "근저당 설정·말소 병행 여부",
        "필지·건물 수",
        "취득세·등록면허세",
        "서류 준비 상태",
      ],
      costGuideText:
        "부동산등기 비용은 가액, 권리 정리 범위, 세금에 따라 달라집니다. 계약서와 등기부를 함께 보면 범위를 빠르게 잡을 수 있습니다.",
      caseExamples: [
        {
          title: "잔금일 직전 근저당 말소가 필요한 사례",
          body: "말소와 소유권이전 순서를 맞춰 일정을 조율했습니다.",
        },
        {
          title: "매도인 서류 협조가 늦어진 사례",
          body: "필요 서류 목록을 정리해 쌍방 일정에 맞췄습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/ownership-transfer", label: "소유권이전등기" },
        { href: "/부산근저당말소등기", label: "근저당권 말소등기" },
        { href: "/부산신축건물보존등기", label: "신축건물 보존등기" },
        { href: "/부산전세권설정등기", label: "전세권설정등기" },
        { href: "/부산부동산등기", label: "부산 부동산등기" },
      ],
      midCta: {
        title: "잔금일 전에 확인하고 싶다면",
        description:
          "계약서와 등기부등본만 있어도 필요한 순서와 서류를 1차로 정리해 드릴 수 있습니다.",
        buttonLabel: "등기 가능 여부 확인하기",
      },
      ctaMessages: [
        "등기 가능 여부 확인하기",
        "준비서류 물어보기",
        "잔금일 일정 맞추기",
      ],
      diagnosisHref: "/부동산등기자가진단",
      inquiryField: "real-estate-registration",
    }),

    "ownership-transfer": config({
      key: "ownership-transfer",
      serviceName: "소유권이전등기",
      mainKeyword: "부산 소유권이전등기",
      conversionIntro:
        "잔금일이 정해져 있거나 근저당 말소가 함께 필요한 경우에는 미리 확인하는 것이 안전합니다.",
      painPoints: [
        "잔금과 등기 일정을 맞춰야 하는 경우",
        "근저당 말소가 선행되어야 하는 경우",
        "공동명의·지분이전이 포함된 경우",
        "신축·분양 아파트 첫 등기인 경우",
        "매도인이 서류 제출을 미루는 경우",
      ],
      preparationDocuments: [
        "매매계약서",
        "등기부등본",
        "잔금 영수·이체 내역",
        "인감증명서·신분증",
        "근저당 말소 관련 서류(해당 시)",
      ],
      costFactors: [
        "부동산 가액",
        "지분 이전 여부",
        "근저당 말소 병행",
        "취득세",
        "필지 수",
      ],
      costGuideText:
        "소유권이전등기 비용은 가액, 지분 구조, 말소 등기 병행 여부에 따라 달라집니다. 잔금일 전에 1차 검토를 권합니다.",
      caseExamples: [
        {
          title: "잔금일 직전 근저당 말소가 필요한 사례",
          body: "말소 접수와 이전등기 일정을 맞춰 진행했습니다.",
        },
        {
          title: "신축 아파트 첫 소유권이전 사례",
          body: "분양계약·사용승인·대지권 관계를 함께 확인했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/real-estate-registration", label: "부동산등기" },
        { href: "/부산근저당말소등기", label: "근저당권 말소등기" },
        { href: "/부산소유권이전등기", label: "부산 소유권이전등기" },
        { href: "/소유권이전등기서류", label: "소유권이전등기 필요서류" },
        { href: "/부산부동산등기", label: "부산 부동산등기" },
      ],
      midCta: {
        title: "잔금 전에 순서가 걱정된다면",
        description:
          "말소등기가 필요한지, 잔금 전에 무엇을 준비해야 하는지 먼저 확인해 보셔도 됩니다.",
        buttonLabel: "준비서류 물어보기",
      },
      ctaMessages: ["준비서류 물어보기", "잔금일 일정 맞추기"],
      diagnosisHref: "/소유권이전등기자가진단",
      inquiryField: "real-estate-registration",
    }),

    "corporate-registration": config({
      key: "corporate-registration",
      serviceName: "법인등기",
      mainKeyword: "부산 법인등기",
      conversionIntro:
        "법인등기는 기한을 놓치면 과태료가 발생할 수 있습니다. 변경일자와 등기 필요 여부부터 확인해보셔도 됩니다.",
      painPoints: [
        "임원변경·본점이전 기한이 다가온 경우",
        "정관 변경이 필요한데 순서를 모르는 경우",
        "과태료를 이미 받았거나 걱정되는 경우",
        "주주총회·이사회 결의서 준비가 어려운 경우",
        "본점 이전 시 관할 변경이 헷갈리는 경우",
      ],
      preparationDocuments: [
        "법인등기부등본",
        "정관",
        "주주명부",
        "변경하려는 내용(임원·본점·목적 등)",
        "주주총회·이사회 의사록",
      ],
      costFactors: [
        "변경 유형(임원·본점·목적 등)",
        "본점 관내·관외 이동 여부",
        "과태료 발생 여부",
        "정관 개정 필요 여부",
        "서류 준비 상태",
      ],
      costGuideText:
        "법인등기 비용은 변경 종류, 본점 이동 범위, 과태료 여부에 따라 달라집니다. 변경일자만 알려주셔도 1차 검토가 가능합니다.",
      caseExamples: [
        {
          title: "법인 임원변경 기한을 놓친 사례",
          body: "과태료 범위를 확인한 뒤 변경등기 순서를 정리했습니다.",
        },
        {
          title: "본점이전과 임원변경이 겹친 사례",
          body: "접수 순서와 필요 결의서를 함께 정리했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/company-establishment", label: "법인설립등기" },
        { href: "/services/director-change", label: "임원변경등기" },
        { href: "/부산법인등기", label: "부산 법인등기" },
        { href: "/법인등기비용", label: "법인등기 비용" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "기한이 걱정된다면",
        description:
          "변경일자와 등기부등본만 있어도 과태료·필요 서류를 1차로 확인할 수 있습니다.",
        buttonLabel: "등기 가능 여부 확인하기",
      },
      ctaMessages: ["등기 가능 여부 확인하기", "기한·과태료 확인하기"],
      diagnosisHref: "/법인등기자가진단",
      inquiryField: "corporate-registration",
    }),

    "company-establishment": config({
      key: "company-establishment",
      serviceName: "법인설립등기",
      mainKeyword: "부산 법인설립등기",
      conversionIntro:
        "법인등기는 기한을 놓치면 과태료가 발생할 수 있습니다. 설립 형태와 자본금 구조부터 확인해보셔도 됩니다.",
      painPoints: [
        "1인 법인·다인 법인 중 선택이 어려운 경우",
        "정관·임원 구성을 어떻게 할지 모르는 경우",
        "설립 후 사업자등록·계좌 개설 순서가 헷갈리는 경우",
        "자본금·지분 구조를 정하지 못한 경우",
        "본점 소재지를 어디로 할지 고민되는 경우",
      ],
      preparationDocuments: [
        "정관 초안",
        "발기인·임원 인적사항",
        "본점 소재지 관련 자료",
        "자본금 납입 계획",
        "회사명·목적 사업 내용",
      ],
      costFactors: [
        "법인 형태(주식·유한 등)",
        "자본금 규모",
        "임원 수",
        "본점 소재지",
        "정관 복잡도",
      ],
      costGuideText:
        "설립등기 비용은 법인 형태, 자본금, 임원 구성에 따라 달라집니다. 사업 계획만 있어도 1차 상담이 가능합니다.",
      caseExamples: [
        {
          title: "1인 주식회사 설립을 검토한 사례",
          body: "정관·임원 구성을 정리한 뒤 설립등기를 진행했습니다.",
        },
        {
          title: "센텀 소재 법인 설립 사례",
          body: "본점 소재지와 사업자등록 순서를 함께 안내했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/corporate-registration", label: "법인등기" },
        { href: "/services/director-change", label: "임원변경등기" },
        { href: "/부산법인설립등기", label: "부산 법인설립등기" },
        { href: "/법인설립등기비용", label: "법인설립등기 비용" },
        { href: "/부산법인등기", label: "부산 법인등기" },
      ],
      midCta: {
        title: "설립 전에 구조부터 물어보고 싶다면",
        description:
          "사업 내용만 알려주셔도 법인 형태와 필요 서류를 1차로 정리해 드릴 수 있습니다.",
        buttonLabel: "설립 구조 먼저 확인하기",
      },
      ctaMessages: ["설립 구조 먼저 확인하기", "준비서류 물어보기"],
      diagnosisHref: "/법인설립자가진단",
      inquiryField: "corporate-registration",
    }),

    "director-change": config({
      key: "director-change",
      serviceName: "임원변경등기",
      mainKeyword: "부산 임원변경등기",
      conversionIntro:
        "법인등기는 기한을 놓치면 과태료가 발생할 수 있습니다. 변경일자와 등기 필요 여부부터 확인해보셔도 됩니다.",
      painPoints: [
        "임원 퇴임·취임일이 지났는데 등기를 못 한 경우",
        "과태료가 걱정되는 경우",
        "주주총회·이사회 결의서 형식이 헷갈리는 경우",
        "대표이사만 바뀌었는데 다른 임원도 같이 바뀌었는지 모르는 경우",
        "본점이전과 임원변경이 겹친 경우",
      ],
      preparationDocuments: [
        "법인등기부등본",
        "정관",
        "주주명부",
        "주주총회·이사회 의사록",
        "신임·퇴임 임원 인감증명서",
      ],
      costFactors: [
        "변경 임원 수",
        "과태료 발생 여부",
        "정관 개정 필요 여부",
        "본점이전 병행 여부",
        "서류 준비 상태",
      ],
      costGuideText:
        "임원변경등기 비용은 변경 인원, 과태료, 정관 개정 필요 여부에 따라 달라집니다. 변경일자만으로도 1차 검토가 가능합니다.",
      caseExamples: [
        {
          title: "법인 임원변경 기한을 놓친 사례",
          body: "과태료와 변경등기 순서를 함께 정리했습니다.",
        },
        {
          title: "대표이사 교체와 본점이전이 겹친 사례",
          body: "결의서·접수 순서를 맞춰 진행했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/corporate-registration", label: "법인등기" },
        { href: "/services/company-establishment", label: "법인설립등기" },
        { href: "/부산임원변경등기", label: "부산 임원변경등기" },
        { href: "/임원변경등기과태료", label: "임원변경등기 과태료" },
        { href: "/부산법인등기", label: "부산 법인등기" },
      ],
      midCta: {
        title: "과태료가 걱정된다면",
        description:
          "변경일자와 등기부등본을 보내주시면 기한·과태료 여부를 1차로 확인해 드립니다.",
        buttonLabel: "기한·과태료 확인하기",
      },
      ctaMessages: ["기한·과태료 확인하기", "결의서 형식 물어보기"],
      diagnosisHref: "/임원변경등기자가진단",
      inquiryField: "corporate-registration",
    }),

    "personal-rehabilitation": config({
      key: "personal-rehabilitation",
      serviceName: "개인회생",
      mainKeyword: "부산 개인회생",
      conversionIntro:
        "채무 문제는 혼자 판단하기 어렵습니다. 소득, 재산, 채무 규모를 기준으로 회생과 파산 중 어떤 절차가 맞는지 검토해드립니다.",
      painPoints: [
        "채무가 얼마나 되는지 정리가 안 된 경우",
        "회생과 파산 중 무엇이 맞는지 모르는 경우",
        "소득이 있어 회생 가능 여부가 궁금한 경우",
        "가족·배우자 재산 영향이 걱정되는 경우",
        "추심·압류가 진행 중인 경우",
      ],
      preparationDocuments: [
        "채무 목록(알고 있는 범위)",
        "소득 증빙(급여·사업 소득)",
        "재산 목록",
        "최근 3개월 거래 내역(가능한 범위)",
        "신분증",
      ],
      costFactors: [
        "채무 규모·채권자 수",
        "소득 유형",
        "재산 규모",
        "회생·파산 절차 선택",
        "추가 조사 필요 여부",
      ],
      costGuideText:
        "개인회생 비용은 채무 규모, 소득·재산 구조, 절차 유형에 따라 달라집니다. 서류가 완벽하지 않아도 1차 상담이 가능합니다.",
      caseExamples: [
        {
          title: "영업소득자 회생 가능 여부를 검토한 사례",
          body: "소득·채무 구조를 정리한 뒤 회생 신청 가능성을 검토했습니다.",
        },
        {
          title: "추심 진행 중 긴급 상담한 사례",
          body: "현재 절차와 신청 일정을 함께 정리했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/bankruptcy", label: "개인파산" },
        { href: "/부산개인회생", label: "부산 개인회생" },
        { href: "/개인회생비용", label: "개인회생 비용" },
        { href: "/부산회생법원개인회생", label: "부산회생법원 개인회생" },
        { href: "/개인회생자가진단", label: "개인회생 자가진단" },
      ],
      midCta: {
        title: "혼자 판단하기 어렵다면",
        description:
          "채무 목록이 정리되지 않았더라도, 알고 있는 범위만으로 1차 검토가 가능합니다.",
        buttonLabel: "회생 가능 여부 확인하기",
      },
      ctaMessages: ["회생 가능 여부 확인하기", "채무 정리 방법 물어보기"],
      diagnosisHref: "/개인회생자가진단",
      inquiryField: "personal-rehabilitation",
    }),

    bankruptcy: config({
      key: "bankruptcy",
      serviceName: "개인파산",
      mainKeyword: "부산 개인파산",
      conversionIntro:
        "채무 문제는 혼자 판단하기 어렵습니다. 소득, 재산, 채무 규모를 기준으로 회생과 파산 중 어떤 절차가 맞는지 검토해드립니다.",
      painPoints: [
        "채무가 소득·재산보다 훨씬 많은 경우",
        "회생이 어렵다고 들은 경우",
        "면책 가능 여부가 궁금한 경우",
        "가족에게 영향이 갈까 걱정되는 경우",
        "어떤 재산이 속하는지 모르는 경우",
      ],
      preparationDocuments: [
        "채무 목록",
        "재산 목록",
        "소득 증빙(있는 경우)",
        "최근 거래 내역(가능한 범위)",
        "신분증",
      ],
      costFactors: [
        "채무·재산 규모",
        "채권자 수",
        "회생 병행 검토 여부",
        "추가 조사 범위",
        "관할 법원",
      ],
      costGuideText:
        "개인파산 비용은 채무·재산 구조와 사건 복잡도에 따라 달라집니다. 회생과 비교 검토도 함께 가능합니다.",
      caseExamples: [
        {
          title: "회생과 파산을 비교 검토한 사례",
          body: "소득이 없어 파산이 적합하다고 판단되어 절차를 안내했습니다.",
        },
        {
          title: "재산 목록 정리가 필요했던 사례",
          body: "재산·채무를 분류한 뒤 신청 준비 순서를 정리했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/personal-rehabilitation", label: "개인회생" },
        { href: "/부산파산", label: "부산 개인파산" },
        { href: "/개인파산비용", label: "개인파산 비용" },
        { href: "/부산회생법원개인파산", label: "부산회생법원 개인파산" },
        { href: "/개인파산자가진단", label: "개인파산 자가진단" },
      ],
      midCta: {
        title: "파산이 맞는지 먼저 알고 싶다면",
        description:
          "채무·재산 정보가 완전하지 않아도, 알고 있는 범위로 1차 검토가 가능합니다.",
        buttonLabel: "절차 비교 먼저 확인하기",
      },
      ctaMessages: ["절차 비교 먼저 확인하기", "면책 가능 여부 물어보기"],
      diagnosisHref: "/개인파산자가진단",
      inquiryField: "personal-rehabilitation",
    }),

    "부산신축건물보존등기": config({
      key: "부산신축건물보존등기",
      serviceName: "신축건물 보존등기",
      mainKeyword: "부산 신축건물 보존등기",
      conversionIntro:
        "신축건물 보존등기는 건축물대장, 사용승인, 대지권 관계에 따라 준비서류가 달라질 수 있습니다. 건축주·시행사·건축사무소와의 협업도 가능합니다.",
      painPoints: [
        "사용승인 후 보존등기 시기가 헷갈리는 경우",
        "집합건물·대지권 설정이 복잡한 경우",
        "건축사무소·시행사와 역할 분담이 필요한 경우",
        "셀프 준비 중 첨부서류 형식이 맞는지 모르는 경우",
        "상가·오피스텔·공동주택 유형이 다른 경우",
      ],
      preparationDocuments: [
        "건축물대장",
        "사용승인 관련 서류",
        "토지·건축물 등기부등본",
        "대지권 관계 서류",
        "건축주·소유자 인적사항",
      ],
      costFactors: [
        "건물 유형(집합·일반)",
        "필지·호수 수",
        "대지권 설정 방식",
        "공동 건축 여부",
        "서류 준비 상태",
      ],
      costGuideText:
        "보존등기 비용은 건물 유형, 호수, 대지권 구조에 따라 달라집니다. 건축물대장과 사용승인 서류만으로도 1차 검토가 가능합니다.",
      caseExamples: [
        {
          title: "신축 오피스텔 보존등기를 준비한 사례",
          body: "대지권·전유부분 구조를 확인한 뒤 첨부서류를 정리했습니다.",
        },
        {
          title: "건축사무소와 역할을 나눈 사례",
          body: "건축주 측 준비 서류와 법무사 검토 범위를 구분해 진행했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/ownership-transfer", label: "소유권이전등기" },
        { href: "/services/real-estate-registration", label: "부동산등기" },
        { href: "/공공기관등기업무", label: "공공기관 등기업무" },
        { href: "/부산부동산등기", label: "부산 부동산등기" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "사용승인 후 무엇부터 할지 모르겠다면",
        description:
          "건축물대장과 사용승인 서류를 기준으로 필요한 순서를 먼저 정리해 드릴 수 있습니다.",
        buttonLabel: "보존등기 가능 여부 확인하기",
      },
      ctaMessages: ["보존등기 가능 여부 확인하기", "준비서류 물어보기"],
      inquiryField: "preservation-registration",
    }),

    "부산근저당설정등기": config({
      key: "부산근저당설정등기",
      serviceName: "근저당권설정등기",
      mainKeyword: "부산 근저당권설정등기",
      conversionIntro:
        "잔금일이 정해져 있거나 근저당 설정·말소가 함께 필요한 경우에는 미리 확인하는 것이 안전합니다.",
      painPoints: [
        "대출 실행일과 등기 일정을 맞춰야 하는 경우",
        "채권최고액·채무자 범위가 헷갈리는 경우",
        "공동담보·순위 설정이 필요한 경우",
        "금융기관 제출 서류 형식이 다른 경우",
        "설정 후 말소 일정까지 함께 계획해야 하는 경우",
      ],
      preparationDocuments: [
        "근저당권설정계약서",
        "등기부등본",
        "설정·접수에 필요한 인감증명서",
        "대출 관련 은행 서류",
        "담보 부동산 목록",
      ],
      costFactors: [
        "채권최고액",
        "담보 부동산 수",
        "순위·공동담보 구조",
        "등록면허세",
        "금융기관 요구사항",
      ],
      costGuideText:
        "근저당 설정 비용은 채권최고액, 담보 수, 순위 구조에 따라 달라집니다. 계약서와 등기부를 함께 보면 빠르게 범위를 잡을 수 있습니다.",
      caseExamples: [
        {
          title: "대출 실행일에 맞춘 설정등기 사례",
          body: "은행 제출 기한에 맞춰 접수 일정을 조율했습니다.",
        },
        {
          title: "복수 담보 설정 사례",
          body: "담보 목록과 순위를 정리한 뒤 설정등기를 진행했습니다.",
        },
      ],
      relatedServices: [
        { href: "/부산근저당말소등기", label: "근저당권 말소등기" },
        { href: "/services/ownership-transfer", label: "소유권이전등기" },
        { href: "/services/real-estate-registration", label: "부동산등기" },
        { href: "/부산부동산등기", label: "부산 부동산등기" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "대출 실행 전에 확인하고 싶다면",
        description:
          "설정계약서와 등기부등본만 있어도 필요한 순서를 1차로 정리할 수 있습니다.",
        buttonLabel: "설정등기 일정 확인하기",
      },
      ctaMessages: ["설정등기 일정 확인하기", "준비서류 물어보기"],
      inquiryField: "mortgage",
    }),

    "부산근저당말소등기": config({
      key: "부산근저당말소등기",
      serviceName: "근저당권말소등기",
      mainKeyword: "부산 근저당권말소등기",
      conversionIntro:
        "잔금일이 정해져 있거나 근저당 말소가 함께 필요한 경우에는 미리 확인하는 것이 안전합니다.",
      painPoints: [
        "잔금일 전에 말소가 완료되어야 하는 경우",
        "채권자·금융기관 협조가 늦어지는 경우",
        "말소와 소유권이전 순서가 헷갈리는 경우",
        "일부 말소·순위 변경이 필요한 경우",
        "말소 서류를 어디서 받아야 할지 모르는 경우",
      ],
      preparationDocuments: [
        "등기부등본",
        "근저당 말소에 필요한 은행·채권자 서류",
        "말소 위임 관련 서류",
        "소유자 인감증명서",
        "잔금·이전 일정 관련 자료",
      ],
      costFactors: [
        "말소 건수",
        "채권자 수",
        "잔금·이전등기 병행 여부",
        "서류 수령 속도",
        "필지 수",
      ],
      costGuideText:
        "말소등기 비용은 말소 건수, 채권자 협조, 병행 등기 여부에 따라 달라집니다. 잔금일이 있다면 먼저 일정을 확인하는 것이 좋습니다.",
      caseExamples: [
        {
          title: "잔금일 직전 근저당 말소가 필요한 사례",
          body: "금융기관 서류 수령 일정에 맞춰 말소 접수를 진행했습니다.",
        },
        {
          title: "말소 후 소유권이전을 연속 진행한 사례",
          body: "순서와 일정을 맞춰 매수인 잔금일에 대응했습니다.",
        },
      ],
      relatedServices: [
        { href: "/부산근저당설정등기", label: "근저당권 설정등기" },
        { href: "/services/ownership-transfer", label: "소유권이전등기" },
        { href: "/services/real-estate-registration", label: "부동산등기" },
        { href: "/부산부동산등기", label: "부산 부동산등기" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "잔금 전 말소 일정이 걱정된다면",
        description:
          "등기부와 잔금일만 알려주셔도 말소·이전 순서를 1차로 정리해 드릴 수 있습니다.",
        buttonLabel: "말소 일정 확인하기",
      },
      ctaMessages: ["말소 일정 확인하기", "준비서류 물어보기"],
      inquiryField: "mortgage",
    }),

    "head-office-transfer": config({
      key: "head-office-transfer",
      serviceName: "본점이전등기",
      mainKeyword: "부산 본점이전등기",
      conversionIntro:
        "법인등기는 기한을 놓치면 과태료가 발생할 수 있습니다. 본점 이동 범위(관내·관외)부터 확인해보셔도 됩니다.",
      painPoints: [
        "본점 이전 후 등기 기한이 지나가는 경우",
        "관내·관외 이동에 따라 절차가 다른지 모르는 경우",
        "임대차·사업자등록 주소와 본점이 다른 경우",
        "주주총회 결의가 필요한지 헷갈리는 경우",
        "과태료가 걱정되는 경우",
      ],
      preparationDocuments: [
        "법인등기부등본",
        "정관",
        "주주명부",
        "본점 이전 결의서",
        "새 본점 소재지 관련 자료",
      ],
      costFactors: [
        "관내·관외 이동 여부",
        "정관 개정 필요 여부",
        "과태료 발생 여부",
        "임원변경 병행 여부",
        "서류 준비 상태",
      ],
      costGuideText:
        "본점이전등기 비용은 이동 범위, 정관 개정, 과태료 여부에 따라 달라집니다. 이전일자만으로도 1차 검토가 가능합니다.",
      caseExamples: [
        {
          title: "센텀으로 본점을 옮긴 사례",
          body: "관할 변경과 사업자등록 순서를 함께 안내했습니다.",
        },
        {
          title: "본점이전과 임원변경이 겹친 사례",
          body: "결의서와 접수 순서를 맞춰 진행했습니다.",
        },
      ],
      relatedServices: [
        { href: "/services/corporate-registration", label: "법인등기" },
        { href: "/services/director-change", label: "임원변경등기" },
        { href: "/부산법인등기", label: "부산 법인등기" },
        { href: "/본점이전등기비용", label: "본점이전등기 비용" },
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
      ],
      midCta: {
        title: "본점 이전 후 등기가 필요한지 모르겠다면",
        description:
          "이전일자와 새 주소만 알려주셔도 등기 필요 여부와 기한을 1차로 확인할 수 있습니다.",
        buttonLabel: "본점이전 등기 확인하기",
      },
      ctaMessages: ["본점이전 등기 확인하기", "기한·과태료 확인하기"],
      diagnosisHref: "/법인등기자가진단",
      inquiryField: "corporate-registration",
    }),

    "payment-order-certified-mail": config({
      key: "payment-order-certified-mail",
      serviceName: "지급명령·내용증명",
      mainKeyword: "부산 지급명령·내용증명",
      conversionIntro:
        "채권 회수는 증거·시효·상대방 주소에 따라 내용증명, 지급명령, 소장 중 경로가 달라집니다. 먼저 정리만 받아보셔도 됩니다.",
      painPoints: [
        "독촉만으로는 효과가 없어 보이는 경우",
        "소멸시효가 걱정되는 경우",
        "지급명령과 소송 중 무엇이 맞는지 모르는 경우",
        "증거가 충분한지 확신이 없는 경우",
        "상대방 주소·연락처가 불명확한 경우",
      ],
      preparationDocuments: [
        "계약서·차용증·영수증",
        "이체 내역·메시지·녹취 등 증거",
        "상대방 인적사항·주소",
        "독촉·협의 기록",
        "채권 발생 경위 정리 메모",
      ],
      costFactors: [
        "채권 금액",
        "증거 정리 범위",
        "지급명령·소송 선택",
        "송달 가능 여부",
        "강제집행까지 검토 여부",
      ],
      costGuideText:
        "채권 회수 비용은 금액, 증거 상태, 선택하는 절차에 따라 달라집니다. 증거 목록만 정리해도 1차 검토가 가능합니다.",
      caseExamples: [
        {
          title: "내용증명 후 지급명령을 검토한 사례",
          body: "시효와 증거를 정리한 뒤 지급명령 신청 가능성을 검토했습니다.",
        },
        {
          title: "증거가 부족해 사실관계 정리가 필요했던 사례",
          body: "채권 발생 경위를 정리한 뒤 다음 절차를 안내했습니다.",
        },
      ],
      relatedServices: [
        { href: "/지급명령자가진단", label: "지급명령 자가진단" },
        { href: "/내용증명자가진단", label: "내용증명 자가진단" },
        { href: "/부산지방법원지급명령", label: "부산지방법원 지급명령" },
        { href: "/민사소송", label: "민사소송 허브" },
        { href: "/contact", label: "상담 문의" },
      ],
      midCta: {
        title: "무엇부터 해야 할지 모르겠다면",
        description:
          "채권 금액과 가지고 있는 증거만 알려주셔도 내용증명·지급명령·소장 중 1차 방향을 정리해 드릴 수 있습니다.",
        buttonLabel: "회수 절차 먼저 확인하기",
      },
      ctaMessages: ["회수 절차 먼저 확인하기", "증거 정리 방법 물어보기"],
      diagnosisHref: "/지급명령자가진단",
      inquiryField: "civil-debt",
    }),
  };

/** 서비스 slug·랜딩 slug·상황 slug → 전환 설정 */
const CONVERSION_KEY_ALIASES: Record<string, string> = {
  "payment-order": "payment-order-certified-mail",
  "certified-mail": "payment-order-certified-mail",
  본점이전등기: "head-office-transfer",
};

export function getServiceConversionConfig(
  key: string,
): ServiceConversionConfig | null {
  const normalized = CONVERSION_KEY_ALIASES[key] ?? key;
  return serviceConversionConfigs[normalized] ?? null;
}

export function getConversionFaqsForPage(
  slug: string,
  path: string,
): ServiceConversionConfig["additionalFaqs"] {
  const bySlug = getServiceConversionConfig(slug);
  if (bySlug) return bySlug.additionalFaqs;

  const pathKey = path.replace(/^\//, "");
  const byPath = getServiceConversionConfig(pathKey);
  return byPath?.additionalFaqs ?? [];
}
