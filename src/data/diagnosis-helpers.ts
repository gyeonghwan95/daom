import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";
import { DIAGNOSIS_CTA_TEXT, DIAGNOSIS_SEO_KEYWORDS } from "./diagnosis-constants";
import type { DiagnosisOutcome } from "./diagnosis";

export function seoIntroParagraphs(serviceName: string, detail: string): string[] {
  return [
    `${serviceName}이 필요한지, 어떤 절차·필요서류·비용·기간이 예상되는지 막막하신 분을 위해 다옴법무사사무소가 자가진단을 준비했습니다. 부산·해운대·센텀·재송동·반여동에서 ${serviceName} 관련 법무사 상담을 찾으시는 분들이 많이 확인하는 질문으로 구성했습니다.`,
    detail,
    `질문에 답하시면 점수와 태그를 바탕으로 검토 필요·상담 권장·긴급 확인 필요 방향을 안내합니다. 가능/불가능처럼 단정하지 않으며, ${DIAGNOSIS_SEO_KEYWORDS.slice(0, 4).join(", ")} 지역 실제 상담 사례의 기한·과태료·주의사항도 함께 정리했습니다.`,
  ];
}

export function standardFaqs(serviceName: string): PageFaqItem[] {
  return [
    {
      question: `${serviceName} 자가진단만으로 절차를 시작해도 되나요?`,
      answer:
        "자가진단은 방향 안내용입니다. 등기부·가족관계·계약서 등을 확인한 뒤 절차를 확정하는 것이 안전합니다.",
    },
    {
      question: "부산에서 법무사 상담은 어떻게 받나요?",
      answer:
        "해운대구 센텀 사무소에서 전화·카카오톡·네이버 톡톡·방문(예약) 상담이 가능합니다.",
    },
    {
      question: `${serviceName} 비용은 어떻게 안내되나요?`,
      answer:
        "사건 복잡도·가액·인원·관할에 따라 달라집니다. 서류 확인 후 법무사 수임료와 공과금을 구분해 설명드립니다.",
    },
    {
      question: "기한을 놓치면 어떤 문제가 생기나요?",
      answer:
        "업무마다 과태료·권리 상실·추가 비용 등이 생길 수 있습니다. 상속·법인변경·임차권은 특히 기한 확인이 중요합니다.",
    },
  ];
}

export function standardRelatedLinks(
  serviceName: string,
  links: PageRelatedLink[],
): PageRelatedLink[] {
  return [
    { href: "/자가진단", label: "업무별 자가진단 모음" },
    ...links,
    { href: "/services", label: "업무안내 전체" },
    { href: "/faq", label: "자주 묻는 질문" },
    { href: "/contact", label: `${serviceName} 법무사 상담` },
    { href: "/location", label: "해운대·센텀 오시는 길" },
  ];
}

export function createStandardOutcomes(
  serviceName: string,
  recommendedService: string,
  documents: string[],
): DiagnosisOutcome[] {
  return [
    {
      id: "info",
      minScore: 0,
      maxScore: 24,
      title: `${serviceName} — 사전 정보 확인 단계`,
      summary: `답변을 종합하면 ${serviceName}을 바로 진행하기보다 서류·사실관계를 정리하는 단계로 보입니다. 가능·불가능을 단정하기 어려우며, 기한 여부를 한 번 더 확인하는 것이 좋습니다.`,
      riskLevel: "low",
      recommendedService,
      documents,
      nextSteps: [
        "관련 등기부·계약서·가족관계증명서를 준비합니다.",
        "필요서류 체크리스트와 관할을 확인합니다.",
        "비용·기간을 대략 파악합니다.",
      ],
      caution: "기한이 있는 사건인지 재확인하세요.",
      ctaMessage: "불확실한 부분만 가볍게 상담하셔도 됩니다.",
    },
    {
      id: "review",
      minScore: 25,
      maxScore: 49,
      title: `${serviceName} — 검토 필요`,
      summary: `현재 상황은 ${serviceName} 절차를 단계별로 검토해야 하는 유형으로 보입니다. 서류 한두 가지에 따라 순서·비용이 달라질 수 있습니다.`,
      riskLevel: "medium",
      recommendedService,
      documents,
      nextSteps: [
        "쟁점(기한·채무·상속인·등기부 사항)을 메모로 정리합니다.",
        "관할 법원·등기소를 확인합니다.",
        "준비 서류 목록을 맞춥니다.",
      ],
      caution: "답변에 기한·분쟁 요소가 있으면 지연하지 마세요.",
      ctaMessage: "서류를 보내주시면 절차 방향을 구체화해 드립니다.",
    },
    {
      id: "recommend",
      minScore: 50,
      maxScore: 74,
      title: `${serviceName} — 상담 권장`,
      summary: `답변상 ${serviceName} 관련해서 상속인·채무·기한·등기부 등을 함께 보며 순서를 잡는 것이 좋아 보입니다. 일반적인 안내를 넘어 사건별 검토가 필요한 단계입니다.`,
      riskLevel: "high",
      recommendedService,
      documents,
      nextSteps: [
        "핵심 서류를 모아 상담을 예약합니다.",
        "급한 기한(3개월·2주 등)을 확인합니다.",
        "선행 절차(포기·한정승인·말소 등) 필요 여부를 봅니다.",
      ],
      caution: "스스로 단정하기보다 서류 기반 확인이 필요합니다.",
      ctaMessage: DIAGNOSIS_CTA_TEXT,
    },
    {
      id: "urgent",
      minScore: 75,
      maxScore: 999,
      title: `${serviceName} — 긴급 확인 필요`,
      summary: `답변에 기한·채무·분쟁·과태료 등 긴급 요소가 포함되어 있습니다. ${serviceName}을 미루면 리스크가 커질 수 있어 우선 상담·서류 확인을 권합니다.`,
      riskLevel: "urgent",
      recommendedService,
      documents,
      nextSteps: [
        "오늘 중 가족관계·등기부·채무 관련 서류를 확인합니다.",
        "관할과 남은 기한을 적습니다.",
        "전화·카카오톡으로 상황을 남기고 다음 단계를 확정합니다.",
      ],
      caution: "기한 경과 시 되돌리기 어려운 경우가 많습니다.",
      ctaMessage: DIAGNOSIS_CTA_TEXT,
    },
  ];
}
