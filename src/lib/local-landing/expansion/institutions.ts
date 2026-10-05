import type { ServiceFaq } from "@/types/service";

export type InstitutionTopic = {
  key: string;
  institutionName: string;
  institutionType: "court" | "registry" | "family-court";
  address: string;
  accessNote: string;
  jurisdictionNote: string;
  relatedServiceSlugs: string[];
  practicalNotes: string[];
  documentTips: string[];
  primaryServiceSlug: string;
};

export const institutionTopics: Record<string, InstitutionTopic> = {
  "busan-district-court": {
    key: "busan-district-court",
    institutionName: "부산지방법원",
    institutionType: "court",
    address: "부산광역시 연제구 법원로 31",
    accessNote: "연산·거제 생활권. 부산지방법원 본원입니다. 동부지원은 해운대 재송동에 있습니다.",
    jurisdictionNote:
      "민사·형사 1심 및 보전처분 등 관련 서류 접수가 이뤄집니다. 해운대·기장 일부는 동부지원, 강서·사하 일부는 서부지원 관할일 수 있습니다.",
    relatedServiceSlugs: [
      "inheritance-registration",
      "personal-rehabilitation",
      "bankruptcy",
    ],
    practicalNotes: [
      "민사·가사·회생 관련 서류는 사건별 양식과 제출 부수가 다릅니다.",
      "접수 전 인감·위임장·신분증 등 기본 서류를 빠뜨리지 않도록 체크리스트를 만드는 것이 좋습니다.",
      "법원 방문 시간과 접수 마감 시각은 사건 유형별로 다를 수 있으니 당일 확인이 필요합니다.",
    ],
    documentTips: [
      "신청서·위임장·인감증명서",
      "사건별 첨부 서류(등기부등본, 가족관계증명서 등)",
      "수수료 납부 영수증",
    ],
    primaryServiceSlug: "inheritance-registration",
  },
  "busan-registry-office": {
    key: "busan-registry-office",
    institutionName: "부산지방법원 등기국",
    institutionType: "registry",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "연산역·동래역 인근. 부동산·법인 등기 접수의 중심 기관입니다.",
    jurisdictionNote:
      "부산 전역 상업등기·선박등기·동산·채권담보등기와 중구·서구·동구·영도구·부산진구·동래구·연제구·금정구 부동산등기가 접수됩니다. 해운대·기장은 동부지원 등기과, 남구·수영구는 남부산등기소, 사하·강서는 서부지원 등기과, 북구·사상은 북부산등기소입니다. 2021년 부산진등기소·중부산등기소 사무가 등기국으로 통합되었습니다.",
    relatedServiceSlugs: [
      "inheritance-registration",
      "real-estate-registration",
      "corporate-registration",
    ],
    practicalNotes: [
      "등기 신청서 작성 오류는 보정명령으로 이어져 기간이 늘어날 수 있습니다.",
      "채권자·상대방 동의서가 필요한 등기는 사전 협의가 중요합니다.",
      "전자등기(인터넷등기소) 가능 여부를 먼저 확인하면 방문 부담을 줄일 수 있습니다.",
    ],
    documentTips: [
      "등기신청서·인감증명서·등록세 영수증",
      "원인증서(매매계약서·협의분할서 등)",
      "토지·건물 등기사항증명서",
    ],
    primaryServiceSlug: "real-estate-registration",
  },
  "busan-east-branch-court": {
    key: "busan-east-branch-court",
    institutionName: "부산지방법원 동부지원",
    institutionType: "court",
    address: "부산광역시 해운대구 재반로112번길 20",
    accessNote: "해운대 재송동 청사입니다. 방문 전 사건번호·접수 창구를 확인하세요.",
    jurisdictionNote:
      "해운대·기장 등 동부 지역 관련 일부 민사·형사 사건이 관할됩니다. 정확한 관할은 사건 소재지·당사자 주소에 따라 달라집니다.",
    relatedServiceSlugs: ["personal-rehabilitation", "bankruptcy"],
    practicalNotes: [
      "지급명령·소송·보전처분 등 절차마다 관할 기준이 다릅니다.",
      "회생·파산은 부산회생법원이 별도이므로 사건 종류를 먼저 구분해야 합니다.",
    ],
    documentTips: ["소장·신청서", "증거서류", "인감증명서·위임장"],
    primaryServiceSlug: "personal-rehabilitation",
  },
  "busan-east-registry": {
    key: "busan-east-registry",
    institutionName: "부산지방법원 동부지원 등기과",
    institutionType: "registry",
    address: "부산광역시 해운대구 재반로112번길 20",
    accessNote: "동부지원 청사 내 등기 접수 창구를 이용합니다.",
    jurisdictionNote:
      "해운대구·기장군 부동산등기가 접수됩니다. 남구·수영구는 남부산등기소, 상업등기는 등기국 관할인 경우가 많습니다.",
    relatedServiceSlugs: ["real-estate-registration", "corporate-registration"],
    practicalNotes: [
      "관할 등기소 오접수는 반려·이송 사유가 될 수 있어 소재지 확인이 우선입니다.",
      "법인 본점 주소 변경 시 관할 등기소가 바뀔 수 있습니다.",
    ],
    documentTips: ["등기신청서", "정관·주주총회 의사록(법인)", "등록세 납부서"],
    primaryServiceSlug: "corporate-registration",
  },
  "busan-rehab-court": {
    key: "busan-rehab-court",
    institutionName: "부산회생법원",
    institutionType: "court",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "개인회생·법인회생·파산 전문 법원입니다.",
    jurisdictionNote:
      "부산·경남 일대 개인회생·개인파산·법인회생 사건을 관할합니다. 신청 전 채무·소득·재산 현황 정리가 필요합니다.",
    relatedServiceSlugs: ["personal-rehabilitation", "bankruptcy"],
    practicalNotes: [
      "신청서 기재 누락은 보정명령·기각으로 이어질 수 있습니다.",
      "최근 대출·재산 처분 이력은 심사에 영향을 줄 수 있습니다.",
      "회생과 파산 중 선택은 소득·재산 구조에 따라 달라집니다.",
    ],
    documentTips: [
      "개인회생·파산 신청서",
      "채권자 목록·재산목록·수입지출목록",
      "소득증빙·재산증빙",
    ],
    primaryServiceSlug: "personal-rehabilitation",
  },
  "busan-family-court": {
    key: "busan-family-court",
    institutionName: "부산가정법원",
    institutionType: "family-court",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "가사 사건(상속포기·한정승인 등) 접수 기관입니다.",
    jurisdictionNote:
      "상속포기·한정승인·유류분·이혼 등 가사 사건을 관할합니다. 피상속인 주소지 기준으로 관할이 정해집니다.",
    relatedServiceSlugs: [
      "inheritance-renunciation",
      "qualified-acceptance",
      "inheritance-registration",
    ],
    practicalNotes: [
      "상속포기·한정승인은 상속 개시를 안 난 때부터 3개월 내 신고가 원칙입니다.",
      "가족관계증명서·재산목록 등 준비 서류가 사건에 따라 달라집니다.",
    ],
    documentTips: [
      "상속포기·한정승인 신고서",
      "가족관계증명서·기본증명서",
      "재산·채무 목록",
    ],
    primaryServiceSlug: "inheritance-renunciation",
  },
  "nam-busan-registry": {
    key: "nam-busan-registry",
    institutionName: "남부산등기소",
    institutionType: "registry",
    address: "부산광역시 남구 수영로 312",
    accessNote: "남구·수영구 부동산 관할. 해운대는 동부지원 등기과입니다.",
    jurisdictionNote:
      "남구·수영구 부동산등기가 접수됩니다. 해운대구·기장군은 동부지원 등기과 관할입니다.",
    relatedServiceSlugs: ["real-estate-registration", "ownership-transfer"],
    practicalNotes: [
      "아파트·상가 매매 시 저당권 말소 순서를 등기 일정과 맞추는 것이 중요합니다.",
      "전세권·근저당 등기부 권리 관계를 먼저 확인하세요.",
    ],
    documentTips: ["등기신청서", "매매계약서", "등록세 영수증"],
    primaryServiceSlug: "ownership-transfer",
  },
  "buk-busan-registry": {
    key: "buk-busan-registry",
    institutionName: "북부산등기소",
    institutionType: "registry",
    address: "부산광역시 북구 사상로583번길 14",
    accessNote: "북구·사상구 부동산 관할.",
    jurisdictionNote: "북구·사상구 부동산등기가 접수됩니다. 금정구는 등기국, 강서구는 서부지원 등기과 관할입니다.",
    relatedServiceSlugs: ["inheritance-registration", "real-estate-registration"],
    practicalNotes: [
      "토지·건물 지분등기는 협의서·분할 내용이 정확해야 합니다.",
      "농지·임야 등 특수 부동산은 추가 서류가 필요할 수 있습니다.",
    ],
    documentTips: ["등기사항증명서", "분할협의서", "인감증명서"],
    primaryServiceSlug: "inheritance-registration",
  },
  "jung-busan-registry": {
    key: "jung-busan-registry",
    institutionName: "중부산등기소(통합)",
    institutionType: "registry",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "2021년 부산지방법원 등기국으로 통합되었습니다. 현재 별도 접수 창구가 아닙니다.",
    jurisdictionNote:
      "중부산등기소는 2021년부터 부산지방법원 등기국으로 통합되었습니다. 동래·연제 등 기존 관할 부동산등기는 등기국에서 접수합니다. 이 페이지는 옛 명칭 검색자를 위한 안내입니다.",
    relatedServiceSlugs: ["corporate-registration", "director-change"],
    practicalNotes: [
      "법인 임원변경은 결의일로부터 등기 기한을 지키는 것이 중요합니다.",
      "본점 이전 시 정관 변경과 사업자등록 변경을 함께 검토하세요.",
    ],
    documentTips: ["등기신청서", "주주총회 의사록", "인감증명서"],
    primaryServiceSlug: "director-change",
  },
  "busanjin-registry": {
    key: "busanjin-registry",
    institutionName: "부산진등기소(통합)",
    institutionType: "registry",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "2021년 부산지방법원 등기국으로 통합되었습니다. 현재 별도 접수 창구가 아닙니다.",
    jurisdictionNote:
      "부산진등기소는 2021년부터 부산지방법원 등기국으로 통합되었습니다. 부산진구·서면 일대 부동산등기는 등기국에서 접수합니다. 이 페이지는 옛 명칭 검색자를 위한 안내입니다.",
    relatedServiceSlugs: ["real-estate-registration", "ownership-transfer"],
    practicalNotes: [
      "상가·오피스텔 매매는 용도·대지권 비율 확인이 필요합니다.",
      "상속 후 매매까지 일정이 겹치면 세금·등기 순서를 함께 검토하세요.",
    ],
    documentTips: ["등기부등본", "계약서", "취득세 신고서"],
    primaryServiceSlug: "ownership-transfer",
  },
};

export type ConversionTopic = {
  key: string;
  title: string;
  serviceSlug: string;
  focusKeywords: string[];
  costFactors: string[];
  timelineNotes: string[];
  documentList: string[];
  uniqueProblemStatement?: string;
  uniqueFaqs?: ServiceFaq[];
  relatedServiceLinks?: { href: string; label: string }[];
  skipMortgageExample?: boolean;
  ctaDescription?: string;
  /** "guide"는 서류·기간·과태료 안내 페이지 — 비용 템플릿 문구를 쓰지 않는다. */
  kind?: "cost" | "guide";
  metaTitle?: string;
  h1?: string;
  description?: string;
  summaryParagraphs?: string[];
  whenNeeded?: string[];
  checkPoints?: string[];
  procedures?: string[];
  costNote?: string;
  sections?: {
    title: string;
    body: string;
    items?: string[];
    links?: { href: string; label: string }[];
  }[];
  consultationCases?: { title: string; summary: string }[];
};

export const conversionTopics: Record<string, ConversionTopic> = {
  "lawyer-fee-busan": {
    key: "lawyer-fee-busan",
    title: "부산 법무사 비용·수임료",
    serviceSlug: "inheritance-registration",
    focusKeywords: [
      "부산 법무사 비용",
      "부산 법무사 수수료",
      "부산 법무사 수임료",
      "부산 법무사 보수",
      "법무사 상담 비용",
      "등기 비용 문의",
      "법무사 견적 준비서류",
      "세금과 법무사 수임료 차이",
    ],
    costFactors: [
      "법무사 보수(수임료)와 취득세·등록면허세·국민주택채권·인지·등기신청수수료는 성격이 다릅니다.",
      "같은 업무라도 부동산 가액, 상속인 수, 법인 변경사항, 채권자 수, 말소·보정 병행 여부에 따라 달라집니다.",
      "전화로는 대략적인 구성 안내가 가능한 경우가 있고, 서류 확인 후에야 비용이 정해지는 경우도 있습니다.",
      "확정되지 않은 금액을 임의로 공시하지 않으며, 사건별 확인이 필요한 항목은 그렇게 표시합니다.",
      "지나치게 낮은 금액만으로 선택할 때는 포함 범위(말소·보정·출장·복대리)를 확인하세요.",
      "견적 시 알려 주시면 좋은 정보: 등기부·계약·기한·명의·대출·채무 규모·확인하고 싶은 항목.",
    ],
    timelineNotes: [
      "초기 문의에서는 보수와 공과금의 대략적 구성을 안내할 수 있습니다. 확정 견적은 사건 내용 확인 후입니다.",
      "대한법무사협회 보수 기준은 참고용이며 사건별 조정이 있을 수 있습니다. → /부산법무사보수표",
      "비용 안내를 받은 뒤에는 포함 항목·별도 항목·추가 가능 사유를 다시 확인하는 것이 좋습니다.",
    ],
    documentList: [
      "등기부등본 또는 부동산·법인 정보",
      "계약서·가족관계·법인 결의서류(해당 시)",
      "기한 메모(잔금일·취임일·상속 개시일)",
      "대출·말소·채무 관련 자료",
      "확인하고 싶은 비용 항목(보수·세금·공과금)",
    ],
    relatedServiceLinks: [
      { href: "/부산법무사상담", label: "상담 전 준비서류 안내" },
      { href: "/부산법무사보수표", label: "협회 보수 기준 참고" },
      { href: "/상속등기비용", label: "상속등기 비용 구조" },
      { href: "/부동산등기비용", label: "부동산등기 비용" },
      { href: "/법인설립등기비용", label: "법인설립 비용" },
      { href: "/개인회생비용", label: "개인회생 비용" },
    ],
  },
  "lawyer-fee-table": {
    key: "lawyer-fee-table",
    title: "부산 법무사 보수표",
    metaTitle: "부산 법무사 보수표 | 협회 보수기준 보는 법 | 다옴법무사사무소",
    h1: "부산 법무사 보수표",
    description:
      "대한법무사협회 법무사보수기준이 무엇을 정하고 무엇을 정하지 않는지 정리했습니다. 기본보수·가산보수와 세금·공과금을 구분하고, 보수표 숫자를 확정 견적으로 쓰지 않는 이유를 설명합니다.",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["법무사 보수표", "대한법무사협회", "수임료 기준"],
    costFactors: [
      "협회 보수 기준을 참고하되 사건별 난이도에 따라 달라집니다.",
      "기본보수 상한과 가산보수·실비·세금은 성격이 다릅니다. 표 숫자를 확정 견적으로 쓰지 않습니다.",
      "복잡한 채무·지분·해외 상속인이 있으면 추가 준비 범위가 생길 수 있습니다.",
    ],
    timelineNotes: [
      "대한법무사협회 「법무사보수기준」 2024. 9. 12. 시행본을 2026-08-26 기준으로 확인했습니다.",
      "견적은 사건 내용 확인 후 항목별로 안내합니다.",
    ],
    documentList: ["사건 관련 서류", "등기부등본"],
    skipMortgageExample: true,
    relatedServiceLinks: [
      { href: "/부산법무사비용", label: "비용 구성 전체 안내" },
    ],
  },
  "inheritance-reg-cost": {
    key: "inheritance-reg-cost",
    title: "상속등기 비용",
    metaTitle: "상속등기 비용 | 법무사 보수·세금·등기신청수수료 | 다옴법무사사무소",
    h1: "상속등기 비용",
    description:
      "상속등기 비용을 법무사 보수, 취득세 등 법정 공과금, 등기신청수수료, 국민주택채권, 추가 업무 비용으로 나눠 설명합니다. 상속인 수·부동산 수·협의분할 여부에 따라 달라지는 부분도 함께 정리했습니다.",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["상속등기 비용", "상속등기 수수료", "상속등기 수임료"],
    costFactors: [
      "상속인 수와 협의분할 여부",
      "부동산 수·소재지·과세표준",
      "해외·미성년 상속인·추가 증명서류",
      "근저당 말소 등 병행 등기",
    ],
    timelineNotes: [
      "등록면허세·취득세(해당 시)·등기신청수수료와 법무사 보수를 구분해 안내합니다.",
      "고정 만 원 금액을 공시하지 않으며, 주소·상속인 구성 확인 후 항목을 나눕니다.",
    ],
    documentList: ["등기부등본", "상속인 구성 메모", "사망일·협의 여부"],
    skipMortgageExample: true,
    uniqueProblemStatement:
      "부산에서 상속등기 비용을 알아볼 때 단순히 법무사 보수만 비교하면 실제 필요한 전체 금액을 판단하기 어렵습니다. 상속인 수와 부동산 수, 협의분할 여부 등에 따라 필요한 절차와 공과금이 달라질 수 있기 때문입니다. 그래서 견적에서는 법무사 보수와 세금·공과금을 나눠 설명합니다.",
    uniqueFaqs: [
      {
        question: "상속인이 많으면 비용이 늘어나나요?",
        answer:
          "인감·협의·위임이 늘면 준비 범위가 커질 수 있습니다. 부동산 가액과 건수도 함께 봅니다.",
      },
      {
        question: "세금과 법무사 비용은 같은 금액인가요?",
        answer:
          "아닙니다. 취득세·등록면허세와 법무사 보수는 성격이 다릅니다.",
      },
    ],
    relatedServiceLinks: [
      { href: "/부산상속등기", label: "상속등기 절차 보기" },
      { href: "/왜상속등기비용이다를까", label: "왜 금액이 달라지는지" },
      { href: "/부산법무사비용", label: "법무사 비용 구성" },
    ],
    ctaDescription:
      "부동산 주소와 상속인 수만 남겨 주셔도, 어떤 항목을 나눠 볼지 먼저 안내합니다. 확정 금액은 등기부 확인 후입니다.",
  },
  "renunciation-cost": {
    key: "renunciation-cost",
    title: "상속포기 비용",
    metaTitle: "상속포기 비용 | 법원 인지대·송달료·법무사 보수 | 다옴법무사사무소",
    h1: "상속포기 비용",
    description:
      "상속포기 비용은 가정법원에 내는 인지대·송달료와 서류 작성 보수로 나뉩니다. 신고인 수, 미성년·해외 상속인, 특별대리인 필요 여부에 따라 달라지는 부분을 정리했습니다.",
    serviceSlug: "inheritance-renunciation",
    focusKeywords: ["상속포기 비용", "상속포기 수임료", "가정법원 수수료"],
    costFactors: [
      "신청인 수·공동 신고 여부",
      "미성년·해외 상속인",
      "특별대리인 선임 필요",
      "기한 임박·보정 가능성",
    ],
    timelineNotes: [
      "가정법원 신고 실비와 법무사 보수가 별도입니다. 취득세 견적 구조와는 다릅니다.",
    ],
    documentList: ["가족관계증명서", "사망일·인지일", "처분·인출 메모(해당 시)"],
    skipMortgageExample: true,
    uniqueProblemStatement:
      "신청 가능성·3개월 기한·가족관계는 부산 상속포기 안내에서 먼저 확인하세요. 여기서는 상속포기 비용이 무엇 때문에 달라지는지를 설명합니다. 가정법원 실비와 신청인 구성이 중심이며, 부동산 취득세 견적 구조와는 다릅니다.",
    relatedServiceLinks: [
      { href: "/부산상속포기", label: "3개월 기한·가족관계는 상속포기 안내에서 먼저 확인" },
      { href: "/한정승인비용", label: "한정승인 비용과 비교" },
    ],
    ctaDescription:
      "사망일과 포기하려는 인원만 알려 주셔도 법원 실비와 보수 항목을 나눠 드립니다.",
  },
  "qualified-cost": {
    key: "qualified-cost",
    title: "한정승인 비용",
    metaTitle: "한정승인 비용 | 법원 비용·공고비·법무사 보수 | 다옴법무사사무소",
    h1: "한정승인 비용",
    description:
      "한정승인 비용은 가정법원 인지대·송달료, 수리 후 신문 공고비, 재산·채무 목록 작성 보수로 나뉩니다. 조사 범위와 상속인 구성, 이후 상속등기 병행 여부에 따라 달라집니다.",
    serviceSlug: "qualified-acceptance",
    focusKeywords: ["한정승인 비용", "한정승인 수임료"],
    costFactors: [
      "재산·채무 조사 범위",
      "상속인 수·미성년·해외 여부",
      "처분 이력 확인",
      "이후 상속등기 병행 여부",
    ],
    timelineNotes: [
      "한정승인 신고와 상속등기 공과금은 항목을 나눕니다. 병행 시 단계별 안내가 가능합니다.",
    ],
    documentList: ["재산목록 초안", "채무 목록", "가족관계 서류"],
    skipMortgageExample: true,
    uniqueProblemStatement:
      "한정승인 비용은 재산·채무 목록을 어디까지 조사하는지에 따라 준비 범위가 달라집니다. 신고 후에 부동산 등기까지 진행하면 등록면허세 등 등기 항목은 별도입니다.",
    relatedServiceLinks: [
      { href: "/부산한정승인", label: "한정승인 절차 보기" },
      { href: "/상속포기비용", label: "포기 비용과 비교" },
    ],
  },
  "company-est-cost": {
    key: "company-est-cost",
    title: "법인설립등기 비용",
    metaTitle: "법인설립등기 비용 | 등록면허세·수수료·법무사 보수 | 다옴법무사사무소",
    h1: "법인설립등기 비용",
    description:
      "법인설립등기 비용은 자본금에 연동되는 등록면허세·지방교육세, 등기신청수수료, 법무사 보수로 나뉩니다. 자본금·임원 수·정관 인증 필요 여부에 따라 달라지는 부분을 정리했습니다.",
    serviceSlug: "company-establishment",
    focusKeywords: ["법인설립등기 비용", "법인설립 수임료", "법인설립 수수료"],
    costFactors: [
      "자본금·회사 형태",
      "임원·주주 수",
      "본점·상호·목적 기재",
      "정관 인증 필요 여부",
    ],
    timelineNotes: [
      "등록면허세 등 공과금과 법무사 보수를 구분해 안내합니다. 사업자등록은 등기 완료 후 별도입니다.",
    ],
    documentList: ["자본금·임원 구성", "본점 주소", "사업목적"],
    skipMortgageExample: true,
    uniqueProblemStatement:
      "법인설립 비용은 자본금과 임원 수, 정관·공과금 구성에 따라 달라집니다. 견적에서는 법무사 보수와 등록면허세 등 공과금을 나눠 설명합니다. 설립 직후 변경이 예정돼 있으면 그 항목은 따로 안내합니다.",
    relatedServiceLinks: [
      { href: "/부산법인설립등기", label: "설립 절차 보기" },
      { href: "/법인등기비용", label: "변경등기 비용" },
    ],
    ctaDescription:
      "자본금·임원 수·본점 주소만 알려 주셔도 공과금과 보수 항목을 나눠 드립니다.",
  },
  "director-penalty": {
    key: "director-penalty",
    title: "임원변경등기 과태료",
    kind: "guide",
    metaTitle: "임원변경등기 과태료 | 2주 기한·기산일·중임등기 | 다옴법무사사무소",
    h1: "임원변경등기 과태료와 2주 기한",
    description:
      "주식회사 임원 변경은 변경일부터 2주 안에 본점 소재지에서 등기해야 하고, 늦으면 법원이 과태료를 부과할 수 있습니다. 기산일 계산, 중임등기, 이미 늦었을 때 할 일을 정리했습니다.",
    serviceSlug: "director-change",
    focusKeywords: ["임원변경등기 과태료", "등기 지연"],
    costFactors: ["변경 사유 발생일", "접수 지연 기간", "변경 항목 수"],
    timelineNotes: ["결의 후 신속 접수로 과태료를 피하는 것이 좋습니다."],
    documentList: [
      "주주총회 또는 이사회 의사록",
      "취임승낙서(새로 취임하는 임원)",
      "사임서(사임하는 경우)",
      "취임 임원의 인감증명서·주민등록초본",
      "정관·주주명부",
    ],
    summaryParagraphs: [
      "주식회사의 이사·감사·대표이사가 바뀌면 변경일부터 2주 안에 본점 소재지 관할 등기소에 변경등기를 신청해야 합니다(상법). 기한을 넘기면 법원이 대표이사 등 개인에게 과태료를 부과할 수 있고, 금액은 지연 기간 등을 보고 법원이 정합니다.",
      "임기가 끝난 임원을 같은 사람으로 다시 선임한 경우에도 중임등기가 필요합니다. 등기부에 적힌 임기 만료일을 지나쳐 과태료 통지를 받는 경우가 많아, 등기부의 취임일과 정관상 임기를 먼저 대조합니다.",
    ],
    whenNeeded: [
      "임원 임기 만료일이 다가오거나 이미 지났을 때",
      "대표이사·이사가 사임하거나 새로 취임할 때",
      "같은 임원을 다시 선임(중임)했는데 등기를 하지 않았을 때",
      "법원에서 과태료 관련 통지를 받았을 때",
    ],
    checkPoints: [
      "등기부상 취임일과 정관상 임기",
      "변경 효력이 생긴 날(취임승낙·사임서 도달·임기 만료일)",
      "이사 정원이 부족해 후임 취임 때까지 기존 임원이 권리의무를 유지하는지",
      "의사록 공증이 필요한 결의인지",
    ],
    procedures: [
      "등기부·정관으로 임기와 변경 사유 확인",
      "기산일과 2주 기한 계산",
      "주주총회·이사회 의사록과 취임승낙서 등 준비",
      "본점 소재지 관할 등기소에 변경등기 신청",
      "완료 후 등기부로 반영 확인",
    ],
    costNote:
      "과태료는 법원이 정하는 것이어서 법무사가 금액을 줄이거나 면제받게 할 수 없습니다. 변경등기 자체에는 등록면허세·지방교육세와 등기신청수수료, 법무사 보수가 들며, 변경 항목 수에 따라 달라집니다.",
    sections: [
      {
        title: "2주 기한은 언제부터 계산하나요?",
        body: "기한은 결의한 날이 아니라 변경의 효력이 생긴 날부터 계산하는 것이 원칙입니다. 새 임원은 선임 결의와 취임승낙이 모두 있어야 취임 효력이 생기고, 사임은 사임 의사가 회사에 도달한 때 효력이 생깁니다.",
        items: [
          "임기 만료: 정관·선임 결의에서 정한 임기가 끝난 날",
          "취임: 선임 결의 후 본인이 취임을 승낙한 날",
          "사임: 사임서가 회사에 도달한 날",
          "이사 정원이 부족하면 후임이 취임할 때까지 퇴임등기를 할 수 없는 경우가 있어 기산일이 달라질 수 있습니다",
        ],
        links: [
          { href: "/tools/director-change-penalty-deadline", label: "임원변경 등기기한 계산" },
          { href: "https://www.law.go.kr/법령/상법", label: "국가법령정보센터 상법" },
        ],
      },
      {
        title: "이미 기한이 지났다면",
        body: "기한이 지났더라도 변경등기는 해야 합니다. 등기를 미룰수록 지연 기간이 길어지므로, 의사록과 취임승낙서를 확인해 바로 신청하는 것이 일반적인 대응입니다. 과태료 통지를 받은 뒤의 이의 절차는 법원 안내를 따르며, 법무사가 과태료 감면을 약속할 수는 없습니다.",
      },
    ],
    uniqueFaqs: [
      {
        question: "임원을 그대로 다시 선임해도 등기해야 하나요?",
        answer:
          "네. 임기 만료 후 같은 사람을 다시 선임하면 중임등기를 해야 합니다. 등기하지 않으면 임기 만료일 기준으로 지연이 계산될 수 있습니다.",
      },
      {
        question: "과태료는 회사가 내나요?",
        answer:
          "상법상 과태료는 등기 신청 의무가 있는 대표이사 등 개인에게 부과되는 것이 일반적입니다. 구체적인 부과 대상과 금액은 법원 통지서로 확인합니다.",
      },
      {
        question: "과태료 금액은 얼마인가요?",
        answer:
          "상법이 정한 상한 안에서 법원이 지연 기간 등을 고려해 정합니다. 사건마다 달라 이 페이지에서 금액을 단정하지 않습니다.",
      },
    ],
    relatedServiceLinks: [
      { href: "/부산임원변경등기", label: "부산 임원변경등기 절차" },
      { href: "/부산법인등기", label: "부산 법인등기 안내" },
      { href: "/법인등기비용", label: "법인 변경등기 비용" },
    ],
    consultationCases: [
      {
        title: "중임등기를 놓친 경우 — 이해를 위한 예시",
        summary:
          "임기 만료 후 같은 대표이사를 다시 선임했지만 등기를 하지 않은 경우, 등기부상 임기 만료일과 재선임 결의일을 확인해 중임등기를 신청하는 흐름입니다. 실제 사건 기록이 아닙니다.",
      },
      {
        title: "사임과 신규 취임이 겹친 경우 — 이해를 위한 예시",
        summary:
          "이사 한 명이 사임하고 새 이사가 취임하면 사임서 도달일과 취임승낙일을 각각 확인해 한 번에 변경등기를 신청할 수 있는지 봅니다. 실제 사건 기록이 아닙니다.",
      },
    ],
    ctaDescription:
      "등기부와 임원이 바뀐 날짜만 알려 주셔도 기한이 지났는지, 어떤 서류가 필요한지 먼저 안내합니다.",
  },
  "ownership-docs": {
    key: "ownership-docs",
    title: "소유권이전등기 서류",
    kind: "guide",
    metaTitle: "소유권이전등기 서류 | 매도인·매수인 준비물 | 다옴법무사사무소",
    h1: "매매 소유권이전등기 필요서류",
    description:
      "아파트·주택 매매 소유권이전등기에 필요한 서류를 매도인·매수인·공통 서류로 나눠 정리했습니다. 잔금일부터 60일 안의 등기 신청 기한과 취득세 신고 순서도 함께 설명합니다.",
    serviceSlug: "ownership-transfer",
    focusKeywords: ["소유권이전등기 서류", "매매 등기"],
    costFactors: ["매매·증여·상속 원인별 서류 상이"],
    timelineNotes: ["취득세 신고 기한과 등기 접수 순서를 맞추세요."],
    documentList: [
      "매도인: 등기필증(권리증) 또는 등기필정보",
      "매도인: 부동산 매도용 인감증명서(또는 본인서명사실확인서)",
      "매도인: 주민등록초본(등기부 주소와 다를 때 주소 변동 포함)",
      "매수인: 주민등록등본·초본, 가족관계증명서(취득세 확인용)",
      "공통: 매매계약서, 부동산거래계약 신고필증",
      "공통: 토지·건축물대장, 취득세 납부 영수증, 국민주택채권 매입",
    ],
    summaryParagraphs: [
      "매매로 소유권을 넘길 때는 매도인이 준비할 서류와 매수인이 준비할 서류가 다릅니다. 매도인의 등기필증과 매도용 인감증명서가 빠지면 잔금일에 등기를 접수할 수 없어, 잔금 전에 서류를 미리 맞추는 것이 중요합니다.",
      "부동산등기 특별조치법상 매매는 잔금 지급일부터 60일 안에 소유권이전등기를 신청해야 하고, 취득세도 취득일부터 60일 안에 신고·납부합니다. 실무에서는 대출 실행과 근저당 설정 때문에 잔금일 당일 접수하는 경우가 많습니다.",
    ],
    whenNeeded: [
      "잔금일을 앞두고 서류를 미리 확인하고 싶을 때",
      "등기필증(권리증)을 잃어버렸을 때",
      "매도인 주소가 등기부와 달라 주소 변경이 함께 필요할 때",
      "대출 상환·근저당 말소와 이전등기를 같은 날 처리해야 할 때",
    ],
    checkPoints: [
      "매도인 등기필증 보유 여부(분실 시 확인서면 등 대체 절차)",
      "인감증명서 용도(부동산 매도용)와 매수인 인적사항 기재",
      "등기부 주소와 현재 주소 일치 여부",
      "근저당 말소·새 근저당 설정이 같은 날 필요한지",
    ],
    procedures: [
      "계약서·등기부로 매도인·매수인과 권리관계 확인",
      "잔금일 전 매도인·매수인 서류 목록 안내",
      "취득세 신고·납부, 국민주택채권 매입",
      "잔금일 등기소 접수(말소·설정 병행 시 함께)",
      "등기 완료 후 등기필정보 전달",
    ],
    costNote:
      "서류 발급 수수료는 발급 기관에 따로 내고, 이전등기에는 취득세·지방교육세·국민주택채권·등기신청수수료와 법무사 보수가 듭니다. 금액 구조는 소유권이전등기 비용 안내에서 나눠 설명합니다.",
    sections: [
      {
        title: "등기필증을 잃어버렸다면",
        body: "등기필증(권리증)은 재발급되지 않습니다. 매도인이 등기소에 직접 출석해 확인을 받거나, 법무사가 매도인 본인임을 확인하는 서면을 작성하는 방식으로 대체합니다. 대체 절차에는 시간이 더 들 수 있어 잔금일 전에 알려 주셔야 합니다.",
        links: [{ href: "/부산등기권리증분실", label: "등기권리증 분실 시 절차" }],
      },
      {
        title: "증여·상속은 서류가 다릅니다",
        body: "같은 소유권이전등기라도 원인이 증여면 증여계약서와 증여세 확인이, 상속이면 피상속인의 가족관계 서류와 상속재산분할협의서가 필요합니다. 원인에 맞는 안내를 먼저 확인하세요.",
        links: [
          { href: "/부산증여등기", label: "증여등기 안내" },
          { href: "/상속등기필요서류", label: "상속등기 필요서류" },
          { href: "/소유권이전등기비용", label: "소유권이전등기 비용" },
        ],
      },
    ],
    uniqueFaqs: [
      {
        question: "매도인 인감증명서는 아무거나 떼면 되나요?",
        answer:
          "부동산 매도용으로 발급받아야 하고, 매수인의 성명·주소·주민등록번호가 기재됩니다. 매수인이 여러 명이면 모두 기재됩니다.",
      },
      {
        question: "등기는 잔금일에 꼭 해야 하나요?",
        answer:
          "법정 신청 기한은 잔금 지급일부터 60일이지만, 대출과 근저당 설정이 함께 있으면 잔금일 당일 접수하는 것이 일반적입니다. 중간에 다른 권리가 끼어드는 위험을 줄이기 위해서입니다.",
      },
    ],
    relatedServiceLinks: [
      { href: "/부산소유권이전등기", label: "부산 소유권이전등기 절차" },
      { href: "/소유권이전등기비용", label: "소유권이전등기 비용" },
      { href: "/부산부동산등기", label: "부산 부동산등기 안내" },
    ],
    consultationCases: [
      {
        title: "매도인 주소가 바뀐 경우 — 이해를 위한 예시",
        summary:
          "등기부 주소와 현재 주소가 다르면 주소 변동이 나온 초본으로 등기명의인 표시변경을 함께 신청합니다. 실제 사건 기록이 아닙니다.",
      },
      {
        title: "말소와 이전이 같은 날인 경우 — 이해를 위한 예시",
        summary:
          "매도인 대출을 잔금으로 갚고 근저당을 말소하면서 매수인 명의 이전과 새 근저당 설정을 같은 날 접수하는 흐름입니다. 실제 사건 기록이 아닙니다.",
      },
    ],
    ctaDescription:
      "잔금일과 등기부, 대출 여부만 알려 주셔도 매도인·매수인이 각각 준비할 서류를 나눠 안내합니다.",
  },
  "inheritance-docs": {
    key: "inheritance-docs",
    title: "상속등기 필요서류",
    kind: "guide",
    metaTitle: "상속등기 필요서류 | 피상속인·상속인·부동산 서류 | 다옴법무사사무소",
    h1: "상속등기 필요서류",
    description:
      "상속등기에 필요한 서류를 피상속인 서류, 상속인 서류, 부동산·세금 서류로 나눠 정리했습니다. 협의분할, 미성년 상속인, 해외 거주 상속인이 있을 때 추가되는 서류도 함께 설명합니다.",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["상속등기 필요서류", "상속등기 서류"],
    costFactors: ["상속인 협의 여부", "해외 상속인 유무"],
    timelineNotes: ["서류 준비가 되면 등기 기간이 단축됩니다."],
    documentList: [
      "피상속인: 기본증명서·가족관계증명서·혼인관계증명서·입양관계증명서·친양자입양관계증명서(모두 상세)",
      "피상속인: 말소자 주민등록초본, 필요 시 제적등본",
      "상속인: 가족관계증명서·기본증명서, 주민등록초본 또는 등본",
      "협의분할 시: 상속재산분할협의서, 상속인 전원의 인감증명서(또는 본인서명사실확인서)",
      "부동산: 토지·건축물대장, 취득세 신고·납부 영수증, 국민주택채권 매입",
    ],
    summaryParagraphs: [
      "상속등기 서류는 누가 상속인인지 증명하는 서류, 상속인이 누구에게 어떻게 나눌지 정한 서류, 부동산과 세금 서류로 나뉩니다. 피상속인의 가족관계 서류는 상속인 전원을 확정하는 근거라 '상세' 증명서로 발급해야 합니다.",
      "상속인이 여럿이고 한 사람 명의로 정리하려면 상속재산분할협의서에 상속인 전원이 인감을 날인하고 인감증명서를 첨부합니다. 상속인 중 미성년자나 해외 거주자가 있으면 서류가 추가되므로 먼저 알려 주시는 것이 좋습니다.",
    ],
    whenNeeded: [
      "부모님 사망 후 집 명의를 바꾸려고 서류를 준비할 때",
      "상속인 중 한 명에게 부동산을 몰아주는 협의를 했을 때",
      "상속인 중 미성년자나 해외 거주자가 있을 때",
      "오래전에 돌아가신 분 명의의 부동산을 정리할 때",
    ],
    checkPoints: [
      "피상속인 가족관계 서류를 '상세'로 발급했는지",
      "상속인 전원이 확정됐는지(전혼 자녀·사망한 상속인의 대습상속 등)",
      "협의분할이면 상속인 전원의 인감 날인과 인감증명서",
      "미성년 상속인과 친권자가 함께 상속인이면 특별대리인 선임 필요",
    ],
    procedures: [
      "피상속인 서류로 상속인 전원 확정",
      "법정상속분대로 할지 협의분할할지 결정",
      "분할협의서 작성·인감 날인, 상속인 서류 수집",
      "취득세 신고·납부와 국민주택채권 매입",
      "부동산 소재지 관할 등기소에 상속등기 신청",
    ],
    costNote:
      "서류 발급 수수료는 발급 기관에 따로 냅니다. 상속등기에는 취득세 등 공과금, 등기신청수수료, 국민주택채권과 법무사 보수가 들며, 구조는 상속등기 비용 안내에서 나눠 설명합니다.",
    sections: [
      {
        title: "상황별로 추가되는 서류",
        body: "기본 서류 외에 아래 상황이면 서류가 더 필요합니다. 해당 여부를 먼저 확인하면 보정 없이 한 번에 접수할 가능성이 높아집니다.",
        items: [
          "미성년 상속인과 친권자가 함께 상속인: 가정법원의 특별대리인 선임 심판서",
          "재외국민 상속인: 재외공관에서 받은 인감증명서 또는 서명인증서, 재외국민등록부등본",
          "외국 국적 상속인: 본국 관공서 서명인증 또는 공증, 아포스티유·번역문",
          "2008년 이전 신분관계 확인이 필요하면: 피상속인 제적등본",
          "상속포기한 상속인이 있으면: 가정법원 상속포기 신고 수리 증명",
        ],
      },
      {
        title: "서류를 준비하기 전에 확인할 기한",
        body: "상속등기 자체에는 일반적인 신청기한이나 지연 과태료가 정해져 있지 않습니다. 다만 상속 취득세는 상속개시일이 속한 달의 말일부터 6개월(외국에 주소를 둔 상속인이 있으면 9개월) 안에 신고·납부해야 하고, 늦으면 가산세가 붙습니다. 빚이 많아 상속포기나 한정승인을 검토한다면 상속개시를 안 날부터 3개월 기한이 먼저입니다.",
        links: [
          { href: "/상속등기기간", label: "상속등기 기간과 기한" },
          { href: "/부산상속포기", label: "상속포기 3개월 기한" },
        ],
      },
    ],
    uniqueFaqs: [
      {
        question: "가족관계증명서는 일반으로 떼도 되나요?",
        answer:
          "피상속인 서류는 '상세'로 발급해야 합니다. 일반 증명서에는 상속인 확정에 필요한 정보가 빠질 수 있어 보정 사유가 됩니다.",
      },
      {
        question: "상속인 중 한 명이 해외에 있으면 어떻게 하나요?",
        answer:
          "국적과 거주국에 따라 재외공관 인감·서명인증, 현지 공증과 아포스티유 등 준비 방법이 다릅니다. 국적과 거주 국가를 먼저 알려 주시면 맞는 방법을 안내합니다.",
      },
    ],
    relatedServiceLinks: [
      { href: "/부산상속등기", label: "부산 상속등기 절차" },
      { href: "/상속등기비용", label: "상속등기 비용" },
      { href: "/상속등기기간", label: "상속등기 기간과 기한" },
    ],
    consultationCases: [
      {
        title: "상속인 3명이 한 명에게 몰아주는 경우 — 이해를 위한 예시",
        summary:
          "피상속인 상세 증명서로 상속인 3명을 확정한 뒤, 분할협의서에 3명이 인감을 날인하고 인감증명서를 첨부해 한 명 명의로 등기하는 흐름입니다. 실제 사건 기록이 아닙니다.",
      },
      {
        title: "해외 거주 상속인이 있는 경우 — 이해를 위한 예시",
        summary:
          "해외 상속인의 국적을 먼저 확인해 재외공관 서명인증 또는 현지 공증 방식을 정하고, 우편으로 서류를 받아 접수하는 흐름입니다. 실제 사건 기록이 아닙니다.",
      },
    ],
    ctaDescription:
      "상속인 수와 해외·미성년 상속인 여부만 알려 주셔도 어떤 서류를 누가 준비할지 나눠 안내합니다.",
  },
  "inheritance-period": {
    key: "inheritance-period",
    title: "상속등기 기간",
    kind: "guide",
    metaTitle: "상속등기 기간 | 취득세 6개월·포기 3개월 기한 구분 | 다옴법무사사무소",
    h1: "상속등기 기간과 기한",
    description:
      "상속등기 자체에는 일반적인 신청기한이나 과태료가 없습니다. 상속 취득세 신고 6개월, 상속포기·한정승인 3개월 기한이 각각 무엇인지와 서류 준비부터 완료까지 걸리는 기간을 정리했습니다.",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["상속등기 기간", "상속 신고 기한"],
    costFactors: ["서류 준비 속도", "보정 여부", "저당권 정리"],
    timelineNotes: [],
    documentList: [
      "피상속인 기본증명서·가족관계증명서(상세)",
      "상속인 가족관계증명서·주민등록초본",
      "협의분할 시 분할협의서와 인감증명서",
      "부동산 등기부등본·대장",
    ],
    summaryParagraphs: [
      "'상속등기는 언제까지 해야 하나요?'라는 질문에는 서로 다른 기한이 섞여 있습니다. 일반적인 상속에서 상속등기 자체에는 신청기한이나 지연 과태료가 정해져 있지 않습니다. 기한이 있는 것은 상속 취득세 신고·납부와, 빚 때문에 검토하는 상속포기·한정승인입니다.",
      "상속 취득세는 상속개시일이 속한 달의 말일부터 6개월(외국에 주소를 둔 상속인이 있으면 9개월) 안에 신고·납부해야 하고, 늦으면 가산세가 붙습니다. 상속포기·한정승인은 상속개시가 있음을 안 날부터 3개월 안에 가정법원에 신고해야 합니다.",
    ],
    whenNeeded: [
      "부모님 사망 후 언제까지 무엇을 해야 하는지 정리하고 싶을 때",
      "취득세 신고 기한이 얼마나 남았는지 확인하고 싶을 때",
      "상속포기·한정승인을 검토해야 하는지 판단이 필요할 때",
      "상속등기를 오래 미뤄 둔 부동산을 정리하려 할 때",
    ],
    checkPoints: [
      "상속개시일(사망일)과 그 달의 말일",
      "외국에 주소를 둔 상속인이 있는지(취득세 기한 9개월)",
      "채무가 재산보다 많을 가능성(포기·한정승인 3개월)",
      "상속세 신고 대상인지(세무 확인 필요)",
    ],
    procedures: [
      "사망일 기준으로 취득세·상속포기 기한 정리",
      "채무 여부를 보고 승인·포기·한정승인 방향 결정",
      "상속인 확정과 분할협의서 작성",
      "취득세 신고·납부",
      "관할 등기소에 상속등기 신청",
    ],
    costNote:
      "기한을 넘긴 취득세에는 무신고·납부지연 가산세가 붙을 수 있습니다. 상속등기 비용은 공과금·등기신청수수료·국민주택채권과 법무사 보수로 나뉘며, 상속등기 비용 안내에서 구조를 설명합니다.",
    sections: [
      {
        title: "상속 관련 기한 한눈에 보기",
        body: "같은 '상속 기한'이라도 근거와 결과가 다릅니다. 아래 기한은 일반적인 경우이며, 구체적인 사건은 상속개시일과 상속인 구성을 확인해 계산합니다.",
        items: [
          "상속포기·한정승인: 상속개시가 있음을 안 날부터 3개월 안에 가정법원 신고(민법 제1019조 제1항)",
          "상속 취득세: 상속개시일이 속한 달의 말일부터 6개월, 외국에 주소를 둔 상속인이 있으면 9개월(지방세법 제20조 제1항). 늦으면 가산세",
          "상속세: 상속개시일이 속한 달의 말일부터 6개월, 피상속인이나 상속인 전원이 외국에 주소를 두면 9개월(세무 영역)",
          "상속등기: 일반적인 신청기한과 지연 과태료 규정 없음",
        ],
        links: [
          { href: "/faq/when-to-file-inheritance-registration", label: "상속등기는 언제까지 해야 하나요?" },
          { href: "/tools/inheritance-registration-deadline", label: "상속 기한 계산" },
          { href: "https://www.law.go.kr/법령/지방세법", label: "국가법령정보센터 지방세법" },
        ],
      },
      {
        title: "서류 준비부터 등기 완료까지 걸리는 기간",
        body: "상속인이 확정되고 서류가 모두 갖춰지면 취득세 신고와 등기 접수는 비교적 빠르게 진행됩니다. 시간이 오래 걸리는 것은 대부분 서류 수집과 상속인 간 협의 단계입니다. 등기소 처리 기간은 접수 상황과 보정 여부에 따라 달라집니다.",
        items: [
          "상속인이 한 명이거나 협의가 끝난 경우: 서류 수집 기간이 대부분",
          "해외 상속인이 있는 경우: 현지 공증·우편 기간이 추가",
          "미성년 상속인이 있는 경우: 특별대리인 선임 심판 기간이 추가",
          "보정명령이 나오면 보완 서류 제출까지 기간이 늘어남",
        ],
      },
      {
        title: "상속등기를 미루면 생길 수 있는 문제",
        body: "과태료가 없다고 해서 미뤄도 괜찮다는 뜻은 아닙니다. 그사이 상속인 중 한 명이 사망하면 그 상속인의 상속인까지 협의에 참여해야 하고, 등기 전에는 매도하거나 담보로 대출을 받기 어렵습니다.",
        links: [
          { href: "/상속등기필요서류", label: "상속등기 필요서류" },
          { href: "/상속등기비용", label: "상속등기 비용" },
        ],
      },
    ],
    uniqueFaqs: [
      {
        question: "상속등기를 6개월 안에 하지 않으면 과태료가 있나요?",
        answer:
          "일반적인 상속에서 상속등기 자체에는 신청기한이나 지연 과태료가 없습니다. 6개월은 상속 취득세 신고·납부 기한이며, 이 기한을 넘기면 과태료가 아니라 가산세가 붙습니다.",
      },
      {
        question: "3개월 기한은 상속등기 기한인가요?",
        answer:
          "아닙니다. 3개월은 상속포기·한정승인을 가정법원에 신고하는 기한입니다. 이 기간 안에 포기나 한정승인을 하지 않으면 단순승인으로 볼 수 있어, 채무가 걱정되면 먼저 확인해야 합니다.",
      },
      {
        question: "서류가 다 준비되면 얼마나 걸리나요?",
        answer:
          "취득세 신고와 등기 접수는 서류가 갖춰지면 빠르게 진행되지만, 등기소 처리 기간은 접수 상황과 보정 여부에 따라 달라 일정을 단정하지 않습니다.",
      },
    ],
    relatedServiceLinks: [
      { href: "/부산상속등기", label: "부산 상속등기 절차" },
      { href: "/부산상속포기", label: "상속포기 3개월 기한" },
      { href: "/상속등기비용", label: "상속등기 비용" },
    ],
    consultationCases: [
      {
        title: "사망 후 5개월이 지난 경우 — 이해를 위한 예시",
        summary:
          "사망일이 속한 달의 말일부터 6개월이 되는 날을 계산해 취득세 신고를 먼저 맞추고, 상속인 협의가 끝나는 대로 등기를 신청하는 흐름입니다. 실제 사건 기록이 아닙니다.",
      },
      {
        title: "오래전 상속을 정리하는 경우 — 이해를 위한 예시",
        summary:
          "등기를 하지 않은 사이 상속인 중 한 명이 사망했다면 그 상속인의 상속인까지 확정해 협의서를 받는 흐름입니다. 취득세 가산세 여부도 함께 확인합니다. 실제 사건 기록이 아닙니다.",
      },
    ],
    ctaDescription:
      "사망일과 상속인 구성, 채무가 있는지만 알려 주셔도 어떤 기한이 남아 있는지 먼저 정리해 드립니다.",
  },
};

export type BusinessZoneTopic = {
  key: string;
  title: string;
  zoneName: string;
  serviceSlug: string;
  zoneContext: string;
  commonCases: string[];
  relatedServiceSlugs: string[];
};

export const businessZoneTopics: Record<string, BusinessZoneTopic> = {
  centumCorp: {
    key: "centumCorp",
    title: "센텀 법인등기",
    zoneName: "센텀",
    serviceSlug: "corporate-registration",
    zoneContext: "센텀시티·재송 일대 IT·금융·스타트업 법인 밀집",
    commonCases: ["본점 이전", "임원변경", "목적 변경"],
    relatedServiceSlugs: ["company-establishment", "director-change"],
  },
  centumEst: {
    key: "centumEst",
    title: "센텀 법인설립등기",
    zoneName: "센텀",
    serviceSlug: "company-establishment",
    zoneContext: "센텀 스타트업·1인 법인 설립 수요",
    commonCases: ["1인 주식회사", "2인 이상 창업"],
    relatedServiceSlugs: ["corporate-registration", "director-change"],
  },
  munhyeonFinance: {
    key: "munhyeonFinance",
    title: "문현금융단지 법인등기",
    zoneName: "문현금융단지",
    serviceSlug: "corporate-registration",
    zoneContext: "금융·법률·전문서비스 업체 집중",
    commonCases: ["사옥 매매 후 본점 이전", "임원 변경"],
    relatedServiceSlugs: ["director-change", "real-estate-registration"],
  },
  bifc: {
    key: "bifc",
    title: "부산국제금융센터 법인등기",
    zoneName: "부산국제금융센터",
    serviceSlug: "corporate-registration",
    zoneContext: "BIFC 입주 금융·법인 사무소",
    commonCases: ["본점 소재지 등기", "임원 변경"],
    relatedServiceSlugs: ["director-change"],
  },
  myeongji: {
    key: "myeongji",
    title: "명지국제신도시 법인등기",
    zoneName: "명지국제신도시",
    serviceSlug: "company-establishment",
    zoneContext: "신도시 입주 기업·상가 법인",
    commonCases: ["신규 설립", "지점 설치"],
    relatedServiceSlugs: ["corporate-registration"],
  },
  ecodelta: {
    key: "ecodelta",
    title: "에코델타시티 법인등기",
    zoneName: "에코델타시티",
    serviceSlug: "company-establishment",
    zoneContext: "스마트시티·친환경 단지 입주 기업",
    commonCases: ["설립 등기", "본점 이전"],
    relatedServiceSlugs: ["corporate-registration"],
  },
  jeonggwan: {
    key: "jeonggwan",
    title: "정관 법인등기",
    zoneName: "정관·정관신도시",
    serviceSlug: "corporate-registration",
    zoneContext: "기장군 정관 일대 산업·물류·제조 법인",
    commonCases: ["공장 법인 설립", "본점 이전"],
    relatedServiceSlugs: ["company-establishment"],
  },
  myeongrye: {
    key: "myeongrye",
    title: "명례산업단지 법인등기",
    zoneName: "명례일반산업단지",
    serviceSlug: "corporate-registration",
    zoneContext: "기장군 명례 일반산업단지 80여 개 기업",
    commonCases: ["임원변경", "본점 주소 변경", "증자 등기"],
    relatedServiceSlugs: ["director-change"],
  },
};

export type RealEstateDevTopic = {
  key: string;
  title: string;
  serviceSlug: string;
  topicContext: string;
  legalPoints: string[];
  relatedServiceSlugs: string[];
};

export const realEstateDevTopics: Record<string, RealEstateDevTopic> = {
  redevelopment: {
    key: "redevelopment",
    title: "부산 재개발등기",
    serviceSlug: "real-estate-registration",
    topicContext: "재개발 조합원 지위·분양권·신축 아파트 등기",
    legalPoints: [
      "조합 설립·사업시행 단계별 권리 관계가 다릅니다.",
      "종전 권리와 신축 분양 권리의 연결이 핵심입니다.",
    ],
    relatedServiceSlugs: ["ownership-transfer", "inheritance-registration"],
  },
  reconstruction: {
    key: "reconstruction",
    title: "부산 재건축등기",
    serviceSlug: "real-estate-registration",
    topicContext: "노후 아파트 재건축 후 소유권 이전",
    legalPoints: ["재건축 사업성·조합원 지위 확인", "신축 입주 후 등기 일정"],
    relatedServiceSlugs: ["ownership-transfer"],
  },
  newApt: {
    key: "newApt",
    title: "부산 신축아파트 소유권이전등기",
    serviceSlug: "ownership-transfer",
    topicContext: "분양·입주 후 최초 등기",
    legalPoints: ["분양계약·대출·중도금 일정과 등기 연동", "공동주택 대지권 확인"],
    relatedServiceSlugs: ["real-estate-registration"],
  },
  officetel: {
    key: "officetel",
    title: "부산 오피스텔 소유권이전등기",
    serviceSlug: "ownership-transfer",
    topicContext: "오피스텔·도시형생활주택 매매",
    legalPoints: ["용도·전입·세금 처리가 주택과 다를 수 있음", "등기부 권리 관계 확인"],
    relatedServiceSlugs: ["real-estate-registration"],
  },
  commercial: {
    key: "commercial",
    title: "부산 상가등기",
    serviceSlug: "real-estate-registration",
    topicContext: "상가·점포 매매·상속",
    legalPoints: ["임대차·권리금·시설물 포함 여부", "대지권·건물 지분"],
    relatedServiceSlugs: ["ownership-transfer"],
  },
  landInheritance: {
    key: "landInheritance",
    title: "부산 토지상속등기",
    serviceSlug: "inheritance-registration",
    topicContext: "토지·임야·농지 상속",
    legalPoints: ["분할·협의", "농지취득자격", "다수 상속인"],
    relatedServiceSlugs: ["qualified-acceptance"],
  },
  gijangLand: {
    key: "gijangLand",
    title: "기장 토지상속등기",
    serviceSlug: "inheritance-registration",
    topicContext: "기장군 토지·전원주택 상속",
    legalPoints: ["관할 등기소 거리", "농지·임야 특수 규정"],
    relatedServiceSlugs: ["inheritance-renunciation"],
  },
  haeundaeRedev: {
    key: "haeundaeRedev",
    title: "해운대 재개발 상속등기",
    serviceSlug: "inheritance-registration",
    topicContext: "해운대구 재개발·재건축 지역 상속",
    legalPoints: ["조합원 지위 승계", "신축 전후 권리 변동"],
    relatedServiceSlugs: ["real-estate-registration"],
  },
};
