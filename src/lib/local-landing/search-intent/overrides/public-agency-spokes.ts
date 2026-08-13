import type { SearchIntentContent } from "../types";
import { buildSearchIntentContent } from "../factory";
import { searchIntentSeeds } from "../seeds";

function seedOf(slug: string) {
  const seed = searchIntentSeeds.find((s) => s.slug === slug);
  if (!seed) throw new Error(`Missing search-intent seed: ${slug}`);
  return seed;
}

function withHubLinks(base: SearchIntentContent): SearchIntentContent {
  return {
    ...base,
    relatedServiceLinks: [
      { href: "/공공기관등기업무", label: "공공기관 등기업무 종합안내" },
      { href: "/협업문의?partner=public", label: "공공기관·단체 업무 문의" },
      ...base.relatedServiceLinks.filter(
        (l) => l.href !== "/부산법무사" && !l.href.startsWith("/services/"),
      ),
      { href: "/부산법인법무사", label: "일반 법인등기 안내" },
      { href: "/부산부동산등기", label: "일반 부동산등기 안내" },
    ],
    relatedGuideLinks: [
      { href: "/공공기관등기업무", label: "기관 담당자 체크리스트" },
      { href: "/partners", label: "협업문의 종합안내" },
      { href: "/공공기관법률교육", label: "공공기관 법률교육" },
      ...base.relatedGuideLinks.filter(
        (l) =>
          l.href !== "/부산법무사추천" &&
          l.href !== "/search-guides",
      ),
    ],
  };
}

/** title/H1/meta는 factory 유지(UNKNOWN_PERFORMANCE 보호). prose·FAQ만 보강. */
export const 공공기관법인등기Override: SearchIntentContent = withHubLinks({
  ...buildSearchIntentContent(seedOf("공공기관법인등기")),
  proseSections: [
    {
      id: "legal-form",
      title: "기관 법적 형태부터 확인합니다",
      paragraphs: [
        "공기업·재단·출연기관·조합·비영리법인은 등기 대상과 첨부서류가 다릅니다. 모든 공공기관이 상법상 회사등기 대상이라고 단정할 수 없습니다.",
        "담당자가 ‘기관 대표가 바뀌었다’, ‘이사가 교체됐다’, ‘주소가 바뀌었다’고 검색하는 경우에도, 먼저 등기부 상의 법인 명칭·본점·임원 기재가 있는지를 확인하는 것이 안전합니다.",
        "일반 설립·임원·본점 절차의 상세 안내는 부산 법인 법무사·임원변경등기 페이지를 참고하시고, 이 페이지는 기관 내부 의결·공문·기한이 겹치는 특수상황 확인용입니다.",
      ],
    },
    {
      id: "officer-deadline",
      title: "임원·대표 변경 시 담당자가 보는 순서",
      paragraphs: [
        "의결일·임명일, 정관상 임기, 등기사항증명서의 현 임원, 취임·사임 승낙 서류를 나란히 둡니다. 여러 명이 동시에 바뀌면 의사록 문언과 등기 신청 취지가 일치해야 보정을 줄일 수 있습니다.",
        "기한이 있는 변경등기는 내부 결재가 늦어질수록 과태료 검토가 필요할 수 있습니다. 확정 금액은 사건 확인 후 안내합니다.",
      ],
    },
  ],
  faqs: [
    ...buildSearchIntentContent(seedOf("공공기관법인등기")).faqs.slice(0, 5),
    {
      question: "재단이나 출연기관도 임원변경등기를 하나요?",
      answer:
        "법인등기 대상인 재단·사단·특수법인이면 이사·대표 변경이 등기 사항인 경우가 많습니다. 근거 법령과 정관이 기관마다 달라 형태를 알려 주시면 필요 여부를 안내합니다.",
    },
    {
      question: "공기업 주소만 바뀌어도 등기가 필요한가요?",
      answer:
        "본점·주사무소 소재지가 등기사항이면 이전등기 검토 대상일 수 있습니다. 사업장 주소만 바뀌고 등기 본점은 그대로인 경우도 있어, 등기부와 사업자등록을 함께 확인합니다.",
    },
    {
      question: "일반 회사 법인등기 안내와 무엇이 다른가요?",
      answer:
        "신청서 작성·접수 절차는 유사할 수 있으나, 기관은 이사회·공문·인가 요건이 추가로 붙는 경우가 많습니다. 일반 절차 상세는 부산 법인 법무사 페이지, 기관 특수상황은 공공기관 등기업무 종합안내를 이용하세요.",
    },
  ],
  bottomCtaText:
    "기관 법적 형태, 변경 사항, 의결일만 알려 주셔도 등기 필요 여부와 준비자료를 안내할 수 있습니다. 공공기관·단체 업무 문의서로 남겨 주세요.",
});

export const 공공기관부동산등기Override: SearchIntentContent = withHubLinks({
  ...buildSearchIntentContent(seedOf("공공기관부동산등기")),
  proseSections: [
    {
      id: "property-start",
      title: "기관이 토지·건물을 취득·신축·처분할 때",
      paragraphs: [
        "재산관리·시설 담당자가 ‘기관 땅 명의 이전’, ‘공공기관 건물 명의 변경’으로 검색하는 상황은 대개 소유권이전 또는 소유권보존 등기 검토입니다.",
        "공유재산·국유재산은 취득·처분 근거와 승인 서류가 등기원인과 맞아야 합니다. 행정 내부 절차와 등기소 신청은 구분해 안내하며, 행정처분을 대신 수행한다고 하지 않습니다.",
        "신축 공공건물은 사용승인·건축물대장 정리 후 보존등기를 검토합니다. 일반 신축 보존 절차는 신축건물 보존등기 안내를, 기관 특수서류는 공공기관 등기업무 종합안내를 참고하세요.",
      ],
    },
    {
      id: "mortgage",
      title: "근저당 설정·말소",
      paragraphs: [
        "기관 소유 부동산에 담보를 설정하거나 기존 근저당을 말소하는 경우, 채권자 서류와 선순위 권리를 함께 확인합니다. 말소만 필요한 사안은 근저당말소등기 안내와 연결됩니다.",
      ],
    },
  ],
  faqs: [
    ...buildSearchIntentContent(seedOf("공공기관부동산등기")).faqs.slice(0, 5),
    {
      question: "공유재산 등기도 법무사에게 맡길 수 있나요?",
      answer:
        "신청등기로 진행하는 소유권이전·보존·말소 등은 검토할 수 있습니다. 촉탁으로만 처리해야 하는지는 원인과 기관 성격에 따라 달라 사전 확인이 필요합니다.",
    },
    {
      question: "여러 필지를 한 번에 문의할 수 있나요?",
      answer:
        "가능합니다. 필지 수, 소재지(구·군 단위), 권리관계만 알려 주셔도 범위 안내가 됩니다. 민감 원본은 초기 문의에 보내지 않으셔도 됩니다.",
    },
  ],
  bottomCtaText:
    "취득·보존·처분·담보 중 어떤 등기인지와 대상 부동산만 알려 주시면 준비자료부터 안내합니다.",
});

export const 공공기관이전등기Override: SearchIntentContent = withHubLinks({
  ...buildSearchIntentContent(seedOf("공공기관이전등기")),
  proseSections: [
    {
      id: "compensation",
      title: "보상·협의취득과 소유권이전",
      paragraphs: [
        "보상 담당자가 토지보상·협의취득·공익사업 소유권이전을 검색할 때는, 보상 협의서·사업 인가·고시문과 등기부 표시가 일치하는지가 핵심입니다.",
        "수용·재결 자체는 사업시행·행정·송무 영역과 겹칠 수 있어, 이 페이지는 등기 준비사항과 신청 실무를 안내합니다. 소송 본안 대리를 약속하지 않습니다.",
        "일반 매매 이전 절차는 소유권이전등기 안내를, 기관·보상 특수서류는 공공기관 등기업무 종합안내를 함께 보시면 됩니다.",
      ],
    },
  ],
  faqs: [
    ...buildSearchIntentContent(seedOf("공공기관이전등기")).faqs.slice(0, 5),
    {
      question: "보상으로 토지를 취득하면 바로 등기할 수 있나요?",
      answer:
        "원인서류(협의서·계약·인가·고시)와 공부상 표시, 세금, 관할을 확인한 뒤 신청 또는 촉탁 여부를 검토합니다. 서류가 갖춰지기 전에도 일정만 먼저 문의할 수 있습니다.",
    },
    {
      question: "사업시행자 명의 이전과 개인 매매 이전은 다른가요?",
      answer:
        "등기 원인은 다를 수 있으나, 등기부에 소유권이전을 반영한다는 점은 같습니다. 공공사업은 승인·고시 문서가 추가로 필요한 경우가 많습니다.",
    },
  ],
  bottomCtaText:
    "보상 일정, 대상 필지, 보유한 협의·인가 자료만 알려 주셔도 등기 준비 순서를 안내할 수 있습니다.",
});

export const 공공기관촉탁등기Override: SearchIntentContent = withHubLinks({
  ...buildSearchIntentContent(seedOf("공공기관촉탁등기")),
  proseSections: [
    {
      id: "what-commissioned",
      title: "촉탁등기가 무엇인지",
      paragraphs: [
        "등기는 권리자 등이 신청하는 방식과, 법령상 사유가 있을 때 법원·관공서 등이 등기소에 촉탁하는 방식이 있습니다. 신청 주체와 제출 문서가 다를 수 있습니다.",
        "지자체·공공기관 업무에서 공유재산 취득·처분 등과 관련해 촉탁이 거론되는 경우가 있습니다. 해당 여부는 기관 성격, 등기 원인, 관련 법령, 관할 등기소 실무에 따라 달라집니다.",
      ],
    },
    {
      id: "scrivener-scope",
      title: "법무사가 지원 가능한 범위",
      paragraphs: [
        "촉탁 요건·관할·첨부서류 검토와, 신청등기로 진행해야 하는 사안의 대리·서류 작성은 상담할 수 있습니다. 관공서를 대신해 모든 촉탁등기를 대행한다고 안내하지 않습니다.",
        "담당자가 확인할 자료는 등기 목적, 원인서류, 공문·결정서, 등기부·대장입니다. 종합 비교표는 공공기관 등기업무 페이지에 있습니다.",
      ],
    },
  ],
  faqs: [
    ...buildSearchIntentContent(seedOf("공공기관촉탁등기")).faqs.slice(0, 4),
    {
      question: "촉탁등기와 일반 신청등기는 어떻게 다른가요?",
      answer:
        "신청 주체, 제출 문서, 공문·결정서 연계 여부가 다를 수 있습니다. 확실하지 않으면 보유 서류와 등기 목적을 알려 주시면 신청·촉탁 중 어떤 검토가 필요한지 안내합니다.",
    },
    {
      question: "관공서 촉탁등기를 전부 대행하나요?",
      answer:
        "그렇지 않습니다. 촉탁 자체는 기관의 행정행위에 해당하는 경우가 있어, 법무사는 요건 검토와 신청등기 실무를 중심으로 지원합니다.",
    },
  ],
  bottomCtaText:
    "촉탁인지 신청인지 아직 모르셔도 됩니다. 등기 목적과 보유 공문만 알려 주시면 확인 순서를 안내합니다.",
});

export const 공기업등기Override: SearchIntentContent = withHubLinks({
  ...buildSearchIntentContent(seedOf("공기업등기")),
  proseSections: [
    {
      id: "soe-note",
      title: "공기업 담당자가 한 해에 반복 확인하는 등기",
      paragraphs: [
        "정부 출자 공기업은 임원 임기 도래, 기관장 교체, 본점·사업소 이전, 자산 취득·처분이 연간 계획에 묶여 있는 경우가 많습니다. 인사 발령일과 등기 접수일을 같이 보는 것이 과태료·보정 위험을 줄입니다.",
        "유형별 전용 랜딩을 추가로 만들지 않습니다. 법인 변경은 공공기관 법인등기, 자산은 공공기관 부동산등기, 문의·견적은 협업 문의서를 이용하세요.",
        "특정 공사·공단의 지정·전담 법무사처럼 보이지 않게 안내합니다. 거래 관계가 없는 기관명을 내세우지 않습니다.",
      ],
    },
    {
      id: "soe-docs",
      title: "공기업 내부에서 먼저 모으면 좋은 자료",
      paragraphs: [
        "정관, 이사회 의사록, 임명·사임 관련 공문, 법인 등기사항증명서, 부동산이 있으면 등기부·대장과 취득·처분 승인 문서를 함께 둡니다. 민감 원본은 초기 문의에 보내지 않아도 됩니다.",
      ],
    },
  ],
  faqs: [
    {
      question: "공기업 임원이 바뀌면 항상 등기를 하나요?",
      answer:
        "법인등기 대상 공기업이면 대표·이사 변경이 등기 사항인 경우가 많습니다. 특수법인 근거가 있으면 정관·법령을 먼저 확인합니다.",
    },
    {
      question: "공기업 부동산 취득과 임원변경을 같이 문의할 수 있나요?",
      answer:
        "가능합니다. 일정만 다르면 순서를 나눠 안내합니다. 문의서에 업무 종류와 희망 일정을 적어 주세요.",
    },
    {
      question: "특정 공기업의 전담 법무사인가요?",
      answer:
        "그렇지 않습니다. 지정·전담·협력 기관처럼 표방하지 않으며, 사건별로 수행 가능 범위만 안내합니다.",
    },
  ],
});

export const 지방공기업등기Override: SearchIntentContent = withHubLinks({
  ...buildSearchIntentContent(seedOf("지방공기업등기")),
  proseSections: [
    {
      id: "local-soe",
      title: "지방공기업은 지자체 출자·공유재산 연계를 함께 봅니다",
      paragraphs: [
        "지방공사·공단은 설립 근거와 출자 지자체, 이사회 구성, 공유재산 관리와의 경계가 일반 회사와 다를 수 있습니다. 등기 주체 명칭이 기관 약칭·사업소명과 다른지도 확인합니다.",
        "시·구 승인 문서와 법인 의결이 둘 다 필요한 사안이 있어, 결재 일정과 등기기한을 따로 적어 두는 것이 좋습니다. 상세 체크리스트는 공공기관 등기업무 종합안내를 이용하세요.",
      ],
    },
    {
      id: "local-soe-re",
      title: "지방공기업 부동산이 섞일 때",
      paragraphs: [
        "자체 소유 부동산인지, 지자체 공유재산인지에 따라 신청·촉탁 검토가 달라질 수 있습니다. 재산 구분부터 알려 주시면 다음 확인 순서를 안내합니다.",
      ],
    },
  ],
  faqs: [
    {
      question: "지방공사와 시 공유재산을 같은 건으로 봐도 되나요?",
      answer:
        "등기 주체와 재산 구분이 다를 수 있습니다. 법인 명의 자산인지, 지자체 공유재산인지를 먼저 알려 주세요.",
    },
    {
      question: "출자 지자체 승인 문서가 없어도 문의할 수 있나요?",
      answer:
        "가능합니다. 어떤 단계(내부 검토·의결·승인 대기)인지만 알려 주시면 다음에 확인할 서류를 안내합니다.",
    },
    {
      question: "지방공기업만 다루는 별도 사무소 페이지가 있나요?",
      answer:
        "없습니다. 공공기관 등기업무 종합안내와 이 페이지에서 지방공기업 특수사항을 보고, 일반 법인절차는 부산 법인 법무사 안내를 이용하세요.",
    },
  ],
});

export const 촉탁등기Override: SearchIntentContent = withHubLinks({
  ...buildSearchIntentContent(seedOf("촉탁등기")),
  proseSections: [
    {
      id: "general-commissioned",
      title: "촉탁등기 검색 시 먼저 볼 것",
      paragraphs: [
        "촉탁은 권리자가 신청하는 일반 등기와 달리, 법령상 사유가 있을 때 법원이나 관공서 등이 등기소에 촉탁하는 방식입니다. 이 페이지는 개념과 확인 순서를 안내합니다.",
        "공공기관·지자체 맥락의 비교표와 업무범위(DIRECT / SUPPORT / INFORMATION_ONLY)는 공공기관 촉탁등기·공공기관 등기업무 페이지에 있습니다.",
        "모든 관공서 촉탁을 대행한다는 표현은 사용하지 않습니다. 신청등기로 진행할 사안의 대리·서류 작성과, 촉탁 요건 검토를 구분해 상담합니다.",
      ],
    },
    {
      id: "when-to-ask",
      title: "담당자가 촉탁인지 모를 때",
      paragraphs: [
        "공문·결정서·원인계약서와 등기 목적만 알려 주셔도, 신청으로 볼지 촉탁 검토가 필요한지 확인 순서를 안내할 수 있습니다. 확정은 자료를 본 뒤에 합니다.",
      ],
    },
  ],
  faqs: [
    {
      question: "촉탁등기는 누가 등기소에 내나요?",
      answer:
        "법령상 촉탁 사유에 해당하면 법원·관공서 등이 등기소에 촉탁하는 방식입니다. 일반 신청등기는 권리자·의무자 또는 그 대리인이 신청합니다.",
    },
    {
      question: "법무사가 관공서 촉탁을 전부 대신하나요?",
      answer:
        "그렇지 않습니다. 촉탁 자체는 기관 행정행위에 해당할 수 있어, 요건 검토와 신청등기 실무를 중심으로 지원합니다.",
    },
    {
      question: "공공기관 촉탁 안내와 이 페이지의 차이는?",
      answer:
        "이 페이지는 촉탁 방식 일반 안내입니다. 기관 담당자용 비교표·업무범위는 공공기관 촉탁등기·공공기관 등기업무 페이지를 이용하세요.",
    },
  ],
});
