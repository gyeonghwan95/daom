import { consultationCopy } from "@/lib/consultation";

export type ConversionPageType =
  | "service"
  | "situation"
  | "diagnosis-result"
  | "case"
  | "faq"
  | "glossary"
  | "tool"
  | "hub"
  | "default";

export type ConversionVariant = "mid" | "bottom";

export type ConversionMessage = {
  title: string;
  description: string;
  hint?: string;
};

const SERVICE_DIAGNOSIS_HREFS: Record<string, string> = {
  "inheritance-registration": "/상속등기자가진단",
  "inheritance-renunciation": "/상속포기자가진단",
  "qualified-acceptance": "/한정승인자가진단",
  "real-estate-registration": "/부동산등기자가진단",
  "ownership-transfer": "/소유권이전등기자가진단",
  "corporate-registration": "/법인등기자가진단",
  "company-establishment": "/법인설립자가진단",
  "director-change": "/임원변경등기자가진단",
  "personal-rehabilitation": "/개인회생자가진단",
  bankruptcy: "/개인파산자가진단",
};

const PAGE_MESSAGES: Record<
  ConversionPageType,
  Record<ConversionVariant, ConversionMessage>
> = {
  service: {
    mid: {
      title: "내 상황에 필요한 서류 확인하고 상담하기",
      description:
        "준비 서류를 먼저 살펴보신 뒤, 편한 방법으로 문의해 주시면 필요한 순서를 함께 정리해 드립니다.",
      hint: "아래에서 서류 확인·자가진단·상담 방법을 선택할 수 있습니다.",
    },
    bottom: {
      title: "절차·서류가 막막하시면",
      description: consultationCopy.default,
      hint: "전화 · 카카오톡 · 네이버 톡톡 중 편한 방법을 선택해 주세요.",
    },
  },
  situation: {
    mid: {
      title: "비슷한 상황이라면 상담 전 체크하기",
      description:
        "위 체크리스트를 보신 뒤, 자가진단이나 상담으로 다음 단계를 확인해 보세요. 사실관계에 따라 절차가 달라질 수 있습니다.",
      hint: "먼저 자가진단·서류 확인 후 연락하셔도 됩니다.",
    },
    bottom: {
      title: "상황이 비슷하시다면",
      description:
        "체크리스트와 같아도 서류·기한·관할은 사건마다 다릅니다. 부산 해운대·센텀 사무소에서 차분히 확인해 드립니다.",
      hint: "전화 · 카카오톡 · 네이버 톡톡 · 방문(예약) 상담이 가능합니다.",
    },
  },
  "diagnosis-result": {
    mid: {
      title: "결과를 바탕으로 상담하기",
      description:
        "진단 결과는 일반적인 안내입니다. 서류와 사실관계를 확인한 뒤 다음 절차를 함께 정리해 드립니다.",
      hint: "결과 화면을 캡처해 보내 주셔도 상담에 도움이 됩니다.",
    },
    bottom: {
      title: "결과를 바탕으로 상담하기",
      description:
        "전화·카카오톡·네이버 톡톡으로 연락 주시면 부산 해운대·센텀 사무소에서 서류와 사실관계를 함께 검토해 드립니다.",
      hint: "방문 상담은 예약 후 이용해 주세요.",
    },
  },
  case: {
    mid: {
      title: "유사 사례 상담하기",
      description:
        "사례와 비슷해도 사실관계·서류·기한에 따라 절차가 달라질 수 있습니다. 먼저 서류를 확인하신 뒤 상담해 보세요.",
      hint: "유사하다고 해서 같은 결과가 보장되지는 않습니다.",
    },
    bottom: {
      title: "비슷한 상황이시라면",
      description:
        "사례를 참고하신 뒤, 본인 상황을 알려주시면 다음에 무엇을 준비해야 하는지 함께 정리해 드립니다.",
      hint: "전화 · 카카오톡 · 네이버 톡톡 중 편한 방법을 선택해 주세요.",
    },
  },
  faq: {
    mid: {
      title: "답변만으로 부족하다면 상담하기",
      description:
        "FAQ는 일반적인 안내입니다. 본인 사건에 맞는 서류·기한·절차는 상담으로 확인하는 것이 좋습니다.",
      hint: "준비 서류를 먼저 보신 뒤 연락하셔도 됩니다.",
    },
    bottom: {
      title: "답변만으로 부족하다면",
      description: consultationCopy.default,
      hint: "전화 · 카카오톡 · 네이버 톡톡 · 방문(예약) 상담이 가능합니다.",
    },
  },
  glossary: {
    mid: {
      title: "내 상황에 해당하는지 확인하기",
      description:
        "용어 이해 후에도 적용 여부는 사실관계에 따라 달라집니다. 자가진단이나 상담으로 확인해 보세요.",
      hint: "관련 자가진단·FAQ를 먼저 보셔도 좋습니다.",
    },
    bottom: {
      title: "용어는 알겠는데, 내 사건은?",
      description:
        "기한·관할·서류는 사건마다 다릅니다. 해운대·센텀 사무소로 상황을 알려주시면 맞춤 안내를 드립니다.",
      hint: "전화 · 카카오톡 · 네이버 톡톡 중 편한 방법을 선택해 주세요.",
    },
  },
  tool: {
    mid: {
      title: "계산 결과, 함께 검토해 드립니다",
      description:
        "참고용 계산 결과입니다. 실제 기한·비용·절차는 사건별로 달라질 수 있으니 서류 확인 후 상담해 보세요.",
      hint: "자가진단·업무안내와 함께 보시면 도움이 됩니다.",
    },
    bottom: {
      title: "계산 결과, 함께 검토해 드립니다",
      description:
        "참고용 계산 결과입니다. 부산 다옴법무사사무소에 상황을 알려주시면 서류·기한을 함께 검토해 드립니다.",
      hint: "전화 · 카카오톡 · 네이버 톡톡 중 편한 방법을 선택해 주세요.",
    },
  },
  hub: {
    mid: {
      title: "지금 상담이 필요하신가요?",
      description: consultationCopy.inline,
      hint: "서류·자가진단을 먼저 확인하신 뒤 연락하셔도 됩니다.",
    },
    bottom: {
      title: "상담 문의",
      description: consultationCopy.default,
      hint: "전화 · 카카오톡 · 네이버 톡톡 · 방문(예약) 상담이 가능합니다.",
    },
  },
  default: {
    mid: {
      title: "지금 상담이 필요하신가요?",
      description: consultationCopy.inline,
      hint: "편한 방법으로 연락해 주세요.",
    },
    bottom: {
      title: "상담 문의",
      description: consultationCopy.default,
      hint: "전화 · 카카오톡 · 네이버 톡톡 중 편한 방법을 선택해 주세요.",
    },
  },
};

export function getConversionMessage(
  pageType: ConversionPageType,
  variant: ConversionVariant,
): ConversionMessage {
  return PAGE_MESSAGES[pageType][variant];
}

export function getDefaultDocumentsHref(pageType: ConversionPageType): string {
  switch (pageType) {
    case "case":
      return "#case-documents";
    case "diagnosis-result":
      return "#diagnosis-documents";
    case "tool":
      return "#tool-documents";
    case "glossary":
      return "#glossary-checks";
    case "situation":
    case "service":
    case "faq":
    default:
      return "#documents";
  }
}

export function getDefaultDiagnosisHref(pageType: ConversionPageType): string {
  if (pageType === "glossary" || pageType === "situation") {
    return "/자가진단";
  }
  return "/자가진단";
}

export function getDiagnosisHrefForService(serviceSlug: string): string {
  return SERVICE_DIAGNOSIS_HREFS[serviceSlug] ?? "/자가진단";
}

export type ConversionCTAConfig = {
  pageType: ConversionPageType;
  variant: ConversionVariant;
  title: string;
  description: string;
  hint?: string;
  documentsHref: string;
  diagnosisHref: string;
};

export function resolveConversionCTAConfig(input: {
  pageType: ConversionPageType;
  variant: ConversionVariant;
  title?: string;
  description?: string;
  hint?: string;
  documentsHref?: string;
  diagnosisHref?: string;
  serviceSlug?: string;
}): ConversionCTAConfig {
  const defaults = getConversionMessage(input.pageType, input.variant);

  return {
    pageType: input.pageType,
    variant: input.variant,
    title: input.title ?? defaults.title,
    description: input.description ?? defaults.description,
    hint: input.hint ?? defaults.hint,
    documentsHref: input.documentsHref ?? getDefaultDocumentsHref(input.pageType),
    diagnosisHref:
      input.diagnosisHref ??
      (input.serviceSlug
        ? getDiagnosisHrefForService(input.serviceSlug)
        : getDefaultDiagnosisHref(input.pageType)),
  };
}
