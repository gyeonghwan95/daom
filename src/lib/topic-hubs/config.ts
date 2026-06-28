import type { TopicHubConfig } from "./types";
import { normalizeRouteSlug } from "@/lib/seo/slug";

export const topicHubConfigs: TopicHubConfig[] = [
  {
    slug: "상속",
    title: "부산 상속 법무 종합 안내",
    h1: "부산 상속등기·상속포기·한정승인 상담",
    description:
      "부산 상속등기·상속포기·한정승인·유증등기·상속채무 정리. 다옴법무사사무소 안윤정 법무사가 해운대·센텀에서 상속 절차·서류·비용·기한을 실무 기준으로 안내합니다.",
    primaryServiceSlug: "inheritance-registration",
    intro:
      "상속이 발생하면 등기·가정법원 신고·채무 조사를 어떤 순서로 진행해야 할지 막막한 경우가 많습니다. 부산에서는 해운대·센텀·연제·동래·기장 등 지역마다 관할 등기소와 가정법원이 달라질 수 있고, 상속인 수·부동산 유무·채무 규모에 따라 상속등기·상속포기·한정승인 중 선택이 달라집니다. 상속 개시 후 3개월 기한과 과태료 리스크도 함께 검토해야 합니다. 다옴법무사사무소는 부산 전역 상속 사건을 전화·카카오톡·방문(예약)으로 상담하며, 필요 서류와 비용을 항목별로 설명합니다.",
    ctaDescription:
      "상속 절차는 상속인 구성·채무·부동산 유무에 따라 필요한 서류와 순서가 달라질 수 있습니다. 다옴법무사사무소 안윤정 법무사가 현재 상황을 차분히 확인해드리겠습니다.",
    jurisdictionHref: "/부산가정법원상속",
    costHref: "/상속등기비용",
    documentsHref: "/상속등기필요서류",
    faqServiceSlugs: [
      "inheritance-registration",
      "inheritance-renunciation",
      "qualified-acceptance",
    ],
    relatedHubSlugs: ["부동산등기", "가족후견", "개인회생파산"],
    sections: [
      {
        title: "상속 절차별 안내",
        intro: "상속 개시 후 선택지는 단순승인·한정승인·상속포기·상속등기로 이어집니다. 채무가 우려되면 포기·한정승인을 먼저 검토하는 것이 안전합니다.",
        links: [
          { href: "/services/inheritance-registration", label: "부산 상속등기 절차 보기" },
          { href: "/services/inheritance-renunciation", label: "상속포기 신고 절차 확인" },
          { href: "/services/qualified-acceptance", label: "상속포기와 한정승인 차이 확인" },
          { href: "/faq/qualified-acceptance-vs-simple-acceptance", label: "특별한정승인·단순승인 비교 안내" },
          { href: "/faq/multiple-heirs-inheritance-registration", label: "상속재산분할협의서 작성 안내" },
          { href: "/faq/when-to-file-inheritance-registration", label: "협의분할·법정상속등기 기한 확인" },
          { href: "/services/inheritance-registration", label: "유증등기·유언 이후 등기 상담" },
        ],
      },
      {
        title: "비용·서류·기간",
        intro: "상속등기 비용은 부동산 가액·상속인 수·말소 등기 여부에 따라 달라집니다. 서류가 준비되면 등기 기간을 단축할 수 있습니다.",
        links: [
          { href: "/상속등기비용", label: "상속등기 비용·수수료 안내" },
          { href: "/상속등기필요서류", label: "상속등기 필요서류 체크리스트" },
          { href: "/상속등기기간", label: "상속등기 기간·3개월 기한 확인" },
          { href: "/faq/inheritance-registration-cost", label: "상속등기 비용 FAQ 확인" },
          { href: "/faq/inheritance-registration-with-mortgage", label: "저당권 있는 상속등기 안내" },
        ],
      },
      {
        title: "부산 지역·법원 안내",
        intro: "피상속인 주소지·부동산 소재지에 따라 관할 가정법원·등기소가 정해집니다. 방문 전 관할과 서류를 확인하세요.",
        links: [
          { href: "/부산상속등기", label: "부산 상속등기 지역 상담 안내" },
          { href: "/해운대구상속등기", label: "해운대·센텀 상속등기 안내" },
          { href: "/기장토지상속등기", label: "기장군 토지상속등기 안내" },
          { href: "/부산가정법원상속", label: "부산가정법원 상속포기·한정승인 안내" },
          { href: "/부산지방법원등기국", label: "부산지방법원 등기국 접수 절차 확인" },
        ],
      },
    ],
  },
  {
    slug: "법인등기",
    title: "부산 법인등기 종합 안내",
    h1: "부산 법인설립·임원변경·본점이전 등기 상담",
    description:
      "부산 법인설립등기·임원변경등기·본점이전·증자·해산청산. 센텀·문현·명지 법인 등기 실무. 다옴법무사사무소 안윤정 법무사.",
    primaryServiceSlug: "corporate-registration",
    intro:
      "법인 설립·임원 변경·본점 이전·정관 변경은 주주총회·이사회 결의와 등기신청서 작성이 맞아야 합니다. 결의 후 등기 기한을 넘기면 과태료가 부과될 수 있고, 정관과 등기부 불일치는 거래·대출에서 문제가 됩니다. 부산 센텀·문현금융단지·명지·에코델타시티 등 법인 밀집 지역에서는 스타트업 설립과 투자 유치 후 임원변경 수요가 많습니다. 다옴법무사사무소는 설립부터 변경·청산까지 단계별 서류와 비용을 안내합니다.",
    ctaDescription:
      "법인등기는 결의일·정관·임원 자격에 따라 필요 서류가 달라집니다. 다옴법무사사무소 안윤정 법무사가 현재 등기부와 정관을 확인해드리겠습니다.",
    jurisdictionHref: "/부산지방법원등기국",
    costHref: "/법인설립등기비용",
    documentsHref: "/faq/company-establishment-documents-faq",
    faqServiceSlugs: ["company-establishment", "director-change", "corporate-registration"],
    relatedHubSlugs: ["창업법무", "부동산등기"],
    sections: [
      {
        title: "설립·변경 등기",
        intro: "법인 설립·임원변경·본점이전·목적·상호 변경은 사건마다 결의 기관과 첨부 서류가 다릅니다.",
        links: [
          { href: "/services/company-establishment", label: "센텀 법인설립등기 상담 안내" },
          { href: "/services/director-change", label: "임원변경등기·대표이사 변경 절차" },
          { href: "/services/corporate-registration", label: "법인 본점이전·목적변경 등기 안내" },
          { href: "/faq/director-change-deadline-faq", label: "임원변경등기 기한·과태료 확인" },
          { href: "/임원변경등기과태료", label: "임원변경등기 과태료 예방 안내" },
          { href: "/faq/corporate-address-change-faq", label: "본점이전등기·사업자등록 연계 안내" },
          { href: "/faq/capital-increase-registration-faq", label: "증자등기·감자등기 절차 확인" },
        ],
      },
      {
        title: "부산 지역·산업단지",
        intro: "본점 소재지에 따라 관할 등기소가 정해집니다. 센텀·문현·명지 등 지역별 상담이 가능합니다.",
        links: [
          { href: "/부산법인등기", label: "부산 법인등기 종합 안내" },
          { href: "/센텀법인등기", label: "센텀 법인등기·본점 이전 안내" },
          { href: "/센텀법인설립등기", label: "센텀 법인설립등기 상담" },
          { href: "/문현금융단지법인등기", label: "문현금융단지 법인등기 안내" },
          { href: "/부산국제금융센터법인등기", label: "부산국제금융센터 법인등기 안내" },
          { href: "/부산지방법원등기국", label: "부산지방법원 등기국 법인 접수 안내" },
        ],
      },
      {
        title: "비용·서류",
        links: [
          { href: "/법인설립등기비용", label: "법인설립등기 비용 안내" },
          { href: "/faq/company-establishment-documents-faq", label: "법인설립 필요서류 확인" },
          { href: "/부산법무사보수표", label: "부산 법무사 보수표 참고 안내" },
        ],
        intro: "자본금·임원 수·변경 항목에 따라 수임료가 달라집니다. 등기 수수료·세금은 별도입니다.",
      },
    ],
  },
  {
    slug: "부동산등기",
    title: "부산 부동산등기 종합 안내",
    h1: "부산 부동산등기·소유권이전·매매등기 상담",
    description:
      "부산 부동산등기·소유권이전등기·매매·증여·상속·재개발·전세권 등기. 해운대·서면·남부산등기소 관할 안내. 다옴법무사사무소.",
    primaryServiceSlug: "real-estate-registration",
    intro:
      "부동산 매매·증여·상속·신축 입주 후 등기는 원인별로 필요 서류와 세금 부담이 다릅니다. 전세권·근저당·가압류가 등기부에 남아 있으면 말소 순서를 등기 일정과 맞춰야 하고, 재개발·재건축 지역은 조합원 지위와 분양권 연결이 핵심입니다. 부산은 남부산·북부산·중부산·부산진등기소로 관할이 나뉘므로 소재지 확인이 우선입니다. 다옴법무사사무소는 등기부 확인부터 접수·완료까지 안내합니다.",
    ctaDescription:
      "부동산등기는 매매·상속·증여 등 원인과 등기부 권리 관계에 따라 절차가 달라집니다. 등기부등본을 함께 확인해드리겠습니다.",
    jurisdictionHref: "/남부산등기소법무사",
    costHref: "/상속등기비용",
    documentsHref: "/소유권이전등기서류",
    faqServiceSlugs: ["real-estate-registration", "ownership-transfer"],
    relatedHubSlugs: ["상속", "임대차전세"],
    sections: [
      {
        title: "등기 유형별 안내",
        intro: "매매·증여·상속·신축 분양 등 원인에 따라 신청서와 첨부 서류가 달라집니다.",
        links: [
          { href: "/services/real-estate-registration", label: "부산 부동산등기 절차 보기" },
          { href: "/services/ownership-transfer", label: "부산 소유권이전등기 안내" },
          { href: "/services/inheritance-registration", label: "상속 원인 부동산등기 안내" },
          { href: "/소유권이전등기서류", label: "소유권이전등기 필요서류 확인" },
          { href: "/faq/ownership-transfer-documents", label: "매매등기·증여등기 서류 FAQ" },
          { href: "/faq/jeonse-registration-faq", label: "전세권설정·말소등기 안내" },
        ],
      },
      {
        title: "재개발·신축·상가",
        intro: "재개발·재건축·신축 아파트·오피스텔·상가는 권리 관계 확인이 중요합니다.",
        links: [
          { href: "/부산재개발등기", label: "부산 재개발등기 절차 안내" },
          { href: "/부산재건축등기", label: "부산 재건축등기 안내" },
          { href: "/부산신축아파트소유권이전등기", label: "신축아파트 소유권이전등기 안내" },
          { href: "/부산오피스텔소유권이전등기", label: "부산 오피스텔 등기 안내" },
          { href: "/부산상가등기", label: "부산 상가등기·매매 안내" },
          { href: "/부산토지상속등기", label: "부산 토지상속등기 안내" },
        ],
      },
      {
        title: "부산 지역·등기소",
        links: [
          { href: "/부산부동산등기", label: "부산 부동산등기 지역 상담" },
          { href: "/부산소유권이전등기", label: "부산 소유권이전등기 상담" },
          { href: "/해운대구부동산등기", label: "해운대 부동산등기 안내" },
          { href: "/남부산등기소법무사", label: "남부산등기소 소유권이전등기 안내" },
          { href: "/북부산등기소법무사", label: "북부산등기소 등기 접수 안내" },
          { href: "/부산진등기소법무사", label: "부산진등기소 상가·오피스 등기 안내" },
        ],
        intro: "부동산 소재지 기준 관할 등기소를 확인한 뒤 접수하세요.",
      },
    ],
  },
  {
    slug: "개인회생파산",
    title: "부산 개인회생·파산 종합 안내",
    h1: "부산 개인회생·개인파산·면책 상담",
    description:
      "부산 개인회생·개인파산·채무조정·면책·변제계획안. 부산회생법원 관할 안내. 다옴법무사사무소 안윤정 법무사.",
    primaryServiceSlug: "personal-rehabilitation",
    intro:
      "채무가 소득·재산을 압도할 때 개인회생과 개인파산 중 어느 절차가 유리한지는 사건마다 다릅니다. 부산·경남 일대 개인회생·파산은 부산회생법원 관할이며, 신청서·채권자목록·재산목록 기재 누락은 보정명령·기각으로 이어질 수 있습니다. 급여소득자·자영업자·소상공인마다 소득 증빙과 변제 계획 설계가 달라집니다. 다옴법무사사무소는 두 절차를 비교 상담하고 신청 전 준비사항을 정리해 드립니다.",
    ctaDescription:
      "개인회생·파산은 채무·소득·최근 변제 이력에 따라 적격 여부가 달라집니다. 다옴법무사사무소 안윤정 법무사가 현재 상황을 확인해드리겠습니다.",
    jurisdictionHref: "/부산회생법원법무사",
    costHref: "/부산법무사비용",
    documentsHref: "/faq/personal-rehabilitation-documents-faq",
    faqServiceSlugs: ["personal-rehabilitation", "bankruptcy"],
    relatedHubSlugs: ["공탁채권회수", "민사소송"],
    sections: [
      {
        title: "회생·파산 절차",
        intro: "회생은 변제 계획에 따른 면책, 파산은 재산 처분과 면책이 병행될 수 있습니다.",
        links: [
          { href: "/services/personal-rehabilitation", label: "부산회생법원 개인회생 상담 안내" },
          { href: "/services/bankruptcy", label: "부산 개인파산 절차 확인" },
          { href: "/부산개인회생", label: "부산 개인회생 지역 상담" },
          { href: "/부산개인파산", label: "부산 개인파산 상담 안내" },
          { href: "/부산회생법원법무사", label: "부산회생법원 접수 절차 안내" },
          { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "개인회생과 파산 차이 확인" },
          { href: "/blog/bankruptcy-vs-personal-rehabilitation", label: "회생·파산 비교 칼럼 보기" },
        ],
      },
      {
        title: "신청 서류·심사",
        links: [
          { href: "/faq/personal-rehabilitation-documents-faq", label: "개인회생 신청서류 확인" },
          { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 자격 요건 안내" },
          { href: "/faq/bankruptcy-discharge-faq", label: "면책·면책불허가 사유 FAQ" },
          { href: "/faq/who-can-file-bankruptcy-faq", label: "파산 신청 자격 확인" },
          { href: "/blog/personal-rehabilitation-before-application", label: "회생 신청 전 준비 칼럼" },
        ],
        intro: "채권자목록·재산목록·수입지출목록을 정확히 작성하는 것이 핵심입니다.",
      },
      {
        title: "지역·채무 상담",
        links: [
          { href: "/북구개인회생", label: "북구 개인회생 상담 안내" },
          { href: "/사상구개인회생", label: "사상구 개인회생 상담" },
          { href: "/수영구개인회생", label: "수영구 개인회생 상담" },
          { href: "/contact", label: "채무조정·신용회복 상담 문의" },
        ],
        intro: "부산 전역 거주 의뢰인의 회생·파산 사건을 상담합니다.",
      },
    ],
  },
  {
    slug: "민사소송",
    title: "부산 민사·소송서류 종합 안내",
    h1: "부산 지급명령·소장·가압류·가처분 상담",
    description:
      "부산 지급명령·대여금·물품대금·손해배상·가압류·가처분·민사집행. 부산지방법원 관할 안내. 다옴법무사사무소.",
    primaryServiceSlug: "inheritance-registration",
    intro:
      "채권 회수·분쟁 대응에서 지급명령·본안 소송·가압류·가처분 중 어떤 절차가 적합한지는 채권 종류·증거·상대방 주소에 따라 달라집니다. 부산지방법원·동부지원 관할은 사건 소재지와 당사자 주소를 기준으로 정해지며, 소장·답변서·준비서면 작성과 증거 정리가 결과에 큰 영향을 줍니다. 다옴법무사사무소는 소송 전략과 서류 작성·접수 절차를 실무 관점에서 안내합니다. 법원과 공식 제휴 관계가 아닌 민사 서류·절차 상담입니다.",
    ctaDescription:
      "지급명령은 채권의 종류와 상대방 주소, 증거자료에 따라 진행 방식이 달라질 수 있습니다. 다옴법무사사무소 안윤정 법무사가 현재 상황을 확인해드리겠습니다.",
    jurisdictionHref: "/부산지방법원법무사",
    costHref: "/부산법무사비용",
    documentsHref: "/contact",
    faqServiceSlugs: ["inheritance-registration"],
    relatedHubSlugs: ["공탁채권회수", "임대차전세"],
    sections: [
      {
        title: "채권 회수·지급명령",
        intro: "금전 채권은 지급명령으로 빠르게 진행할 수 있는 경우가 많습니다.",
        links: [
          { href: "/부산지방법원법무사", label: "부산지방법원 지급명령 절차 안내" },
          { href: "/부산지방법원동부지원법무사", label: "부산지방법원 동부지원 민사 접수 안내" },
          { href: "/contact", label: "대여금·물품대금 청구 상담" },
          { href: "/contact", label: "손해배상·공사대금 청구 상담" },
          { href: "/contact", label: "소장·답변서·준비서면 작성 상담" },
        ],
      },
      {
        title: "보전처분·집행",
        intro: "가압류·가처분은 본안 전 재산·현상 보전을 위한 절차입니다.",
        links: [
          { href: "/contact", label: "가압류·가처분 신청 절차 상담" },
          { href: "/contact", label: "점유이전금지가처분 안내" },
          { href: "/contact", label: "민사집행·강제집행 절차 상담" },
          { href: "/공탁채권회수", label: "채권압류·추심명령 안내" },
        ],
      },
      {
        title: "임대차·부동산 분쟁",
        links: [
          { href: "/임대차전세", label: "임대차보증금반환·명도 상담" },
          { href: "/contact", label: "토지인도·건물명도 청구 상담" },
          { href: "/contact", label: "내용증명 발송·이의신청 안내" },
        ],
        intro: "임대차·부동산 관련 분쟁은 관련 허브와 함께 검토하세요.",
      },
    ],
  },
  {
    slug: "임대차전세",
    title: "부산 임대차·전세보증금 종합 안내",
    h1: "부산 전세보증금반환·임차권등기명령 상담",
    description:
      "부산 전세보증금반환·임차권등기명령·전세권설정·전세사기예방. 해운대·수영·북구 임대차 분쟁. 다옴법무사사무소.",
    primaryServiceSlug: "real-estate-registration",
    intro:
      "전세 보증금 반환이 지연되거나 임대인과 연락이 두절되면 임차권등기명령·보증금반환청구·내용증명 등 순서를 빠르게 정리해야 합니다. 이사 시점·전입신고·확정일자·대항력·우선변제권 여부에 따라 준비서류가 달라지고, 상가와 주택은 임대차보호법 적용도 다릅니다. 다옴법무사사무소는 부산광역시 자립지원전담기관 전세사기 예방 특강 경험을 바탕으로 계약서·등기부를 함께 확인합니다.",
    ctaDescription:
      "임차권등기명령은 이사 시점, 보증금 반환 여부, 전입신고 상태에 따라 준비서류가 달라질 수 있습니다. 계약서와 등기부등본을 함께 확인하는 것이 좋습니다.",
    jurisdictionHref: "/부산지방법원동부지원법무사",
    costHref: "/부산법무사비용",
    documentsHref: "/faq/jeonse-registration-faq",
    faqServiceSlugs: ["real-estate-registration"],
    relatedHubSlugs: ["부동산등기", "민사소송"],
    sections: [
      {
        title: "전세보증금·임차권",
        intro: "보증금 반환이 어려울 때 임차권등기명령으로 우선변제권을 확보하는 경우가 많습니다.",
        links: [
          { href: "/faq/jeonse-registration-faq", label: "임차권등기명령 필요서류 확인" },
          { href: "/faq/real-estate-divorce-registration", label: "전세권설정·말소등기 안내" },
          { href: "/blog/jeonse-right-vs-lease-registration-order", label: "전세권과 임차권등기명령 비교" },
          { href: "/contact", label: "부산 전세보증금 반환 상담" },
          { href: "/contact", label: "해운대 전세권설정 상담 안내" },
          { href: "/contact", label: "임대차계약 해지·내용증명 상담" },
        ],
      },
      {
        title: "전세사기 예방",
        links: [
          { href: "/contact", label: "전세사기 예방·계약 검토 상담" },
          { href: "/about", label: "전세사기 예방 특강 경력 확인" },
          { href: "/faq/jeonse-registration-faq", label: "확정일자·대항력 확인 안내" },
        ],
        intro: "계약 전 등기부·건축물대장·임대인 권리 관계를 확인하는 것이 중요합니다.",
      },
      {
        title: "관련 등기·소송",
        links: [
          { href: "/부동산등기", label: "부동산등기 종합 허브 보기" },
          { href: "/민사소송", label: "보증금반환 소송·지급명령 안내" },
          { href: "/수영구부동산등기", label: "수영구·광안 임대차 관련 등기" },
        ],
        intro: "등기와 소송 절차를 함께 검토할 수 있습니다.",
      },
    ],
  },
  {
    slug: "공탁채권회수",
    title: "부산 공탁·채권회수 종합 안내",
    h1: "부산 변제공탁·채권압류·추심명령 상담",
    description:
      "부산 변제공탁·집행공탁·채권압류·추심명령·미수금회수. 부산지방법원 공탁·민사집행 안내. 다옴법무사사무소.",
    primaryServiceSlug: "inheritance-registration",
    intro:
      "채무 변제 공탁·집행 공탁·해방 공탁은 채권·채무 관계와 소송 진행 상황에 따라 서류와 순서가 달라집니다. 미수금·대여금·공사대금 회수는 지급명령·본안 소송·가압류·추심명령·강제집행까지 단계별 전략이 필요합니다. 부산지방법원 공탁 사무와 민사집행 절차는 관할과 신청서 양식을 사전에 확인하는 것이 좋습니다. 다옴법무사사무소는 채권 회수 경로를 정리해 드립니다.",
    ctaDescription:
      "공탁·채권회수는 채권 성격과 상대방 재산 상황에 따라 절차가 달라집니다. 관련 서류를 확인해드리겠습니다.",
    jurisdictionHref: "/부산지방법원법무사",
    costHref: "/부산법무사비용",
    faqServiceSlugs: ["inheritance-registration"],
    relatedHubSlugs: ["민사소송", "개인회생파산"],
    sections: [
      {
        title: "공탁 절차",
        intro: "변제공탁·집행공탁·해방공탁은 사건별 양식과 제출 부수가 다릅니다.",
        links: [
          { href: "/contact", label: "부산 변제공탁·공탁서 작성 상담" },
          { href: "/contact", label: "공탁금 출급·회수 절차 안내" },
          { href: "/부산지방법원법무사", label: "부산지방법원 공탁 접수 안내" },
        ],
      },
      {
        title: "채권 회수·집행",
        links: [
          { href: "/민사소송", label: "지급명령·소장 작성 상담 허브" },
          { href: "/contact", label: "채권압류·추심명령 신청 상담" },
          { href: "/contact", label: "미수금·대여금 회수 상담" },
          { href: "/contact", label: "공사대금·물품대금 회수 상담" },
        ],
        intro: "가압류 후 추심명령·전부명령으로 회수하는 경우가 많습니다.",
      },
    ],
  },
  {
    slug: "가족후견",
    title: "부산 가족·후견·가사비송 종합 안내",
    h1: "부산 성년후견·가사비송·상속특별대리인 상담",
    description:
      "부산 성년후견·한정후견·임의후견·가사비송·상속특별대리인. 부산가정법원 관할 안내. 다옴법무사사무소.",
    primaryServiceSlug: "inheritance-renunciation",
    intro:
      "성년후견·한정후견·임의후견은 가정법원 가사 사건으로, 신청 사유와 감정·조사 절차에 따라 소요 기간이 달라집니다. 상속이 진행 중인데 상속인이 행방불명이거나 미성년자인 경우 상속특별대리인·미성년자특별대리인 선임이 필요할 수 있습니다. 가족관계등록 정정·개명·실종선고 등도 가사비송 절차입니다. 다옴법무사사무소는 부산가정법원 관할과 준비서류를 안내합니다.",
    ctaDescription:
      "후견·가사 사건은 가족 관계와 피성년·피후견인 상황에 따라 신청 요건이 달라집니다. 상담 시 기본 사실관계를 확인해드리겠습니다.",
    jurisdictionHref: "/부산가정법원상속",
    documentsHref: "/contact",
    faqServiceSlugs: ["inheritance-renunciation", "qualified-acceptance"],
    relatedHubSlugs: ["상속"],
    sections: [
      {
        title: "후견·특별대리인",
        intro: "후견 개시는 가정법원 심판으로, 신청서와 증거 준비가 중요합니다.",
        links: [
          { href: "/contact", label: "성년후견 신청서류 확인 상담" },
          { href: "/contact", label: "한정후견·임의후견 절차 안내" },
          { href: "/contact", label: "상속특별대리인·미성년자특별대리인 선임 상담" },
          { href: "/부산가정법원상속", label: "부산가정법원 가사 사건 안내" },
        ],
      },
      {
        title: "상속·가족관계",
        links: [
          { href: "/상속", label: "상속등기·포기·한정승인 허브 보기" },
          { href: "/services/inheritance-renunciation", label: "상속포기 가정법원 신고 안내" },
          { href: "/faq/inheritance-renunciation-family-effect", label: "상속포기 가족 효과 FAQ" },
          { href: "/contact", label: "가족관계등록 정정·개명 신청 상담" },
        ],
        intro: "상속과 후견 절차가 겹치는 경우 순서를 함께 검토합니다.",
      },
    ],
  },
  {
    slug: "특수등기",
    title: "부산 특수등기·기타등기 종합 안내",
    h1: "부산 선박·비영리법인·종중·외국인 부동산등기 상담",
    description:
      "부산 선박등기·비영리법인·종중·교회·외국인 부동산등기·재외국민 상속. 다옴법무사사무소.",
    primaryServiceSlug: "corporate-registration",
    intro:
      "선박·자동차 근저당·공장재단·비영리법인·종중·교회 등기는 일반 부동산·주식회사 등기와 요건과 서류가 다릅니다. 외국인·재외국민 상속등기는 번역·공증·인증 절차가 추가될 수 있습니다. 부산항·산업단지·비영리 단체 사무에서 특수등기 문의가 이어지며, 관할 등기소와 사전 협의가 필요한 경우도 있습니다. 다옴법무사사무소는 사건 유형별 체크리스트를 안내합니다.",
    ctaDescription:
      "특수등기는 대상 재산·법인 종류에 따라 절차가 크게 달라집니다. 보유 서류를 확인한 뒤 관할과 순서를 안내해드리겠습니다.",
    jurisdictionHref: "/부산지방법원등기국",
    costHref: "/부산법무사비용",
    faqServiceSlugs: ["corporate-registration"],
    relatedHubSlugs: ["법인등기", "부동산등기"],
    sections: [
      {
        title: "법인·단체 등기",
        intro: "비영리·사단·재단·협동조합·학교법인은 정관과 설립 목적 검토가 핵심입니다.",
        links: [
          { href: "/contact", label: "부산 비영리법인·사단법인 등기 상담" },
          { href: "/contact", label: "협동조합·사회적협동조합 설립등기 안내" },
          { href: "/contact", label: "종중·교회·사찰 등기 상담" },
          { href: "/명례산업단지법인등기", label: "공장·산업단지 법인등기 안내" },
        ],
      },
      {
        title: "선박·동산·외국인",
        links: [
          { href: "/contact", label: "부산 선박등기 상담 안내" },
          { href: "/contact", label: "자동차 근저당·공장재단 등기 상담" },
          { href: "/contact", label: "외국인·재외국민 상속등기 안내" },
          { href: "/contact", label: "영문서류·번역공증 연계 상담" },
        ],
        intro: "국제 요소가 있는 사건은 인증·번역 일정을 미리 잡는 것이 좋습니다.",
      },
    ],
  },
  {
    slug: "창업법무",
    title: "부산 창업·소상공인 법무 종합 안내",
    h1: "부산 스타트업·소상공인·법인설립 법무 상담",
    description:
      "부산 창업법무·스타트업·소상공인·법인설립·정관·임원변경·폐업청산. 센텀·명지·에코델타 창업 등기. 다옴법무사사무소.",
    primaryServiceSlug: "company-establishment",
    intro:
      "창업 초기에는 법인 설립·정관 설계·사업자등록·본점 소재지 등기를 한 번에 정리하는 것이 이후 변경 비용을 줄입니다. 센텀·문현·명지국제신도시·에코델타시티·명례산업단지 등에서는 스타트업·소상공인·제조업 법인 설립과 투자 라운드 후 임원변경 수요가 큽니다. 폐업·해산·청산 시에도 등기와 세무·채무 정리 순서가 중요합니다. 다옴법무사사무소는 창업부터 폐업까지 법무사 업무를 연결해 안내합니다.",
    ctaDescription:
      "창업 법무는 업종·출자 구조·임원 구성에 따라 설계가 달라집니다. 사업 계획과 함께 상담해주시면 순서를 정리해드리겠습니다.",
    jurisdictionHref: "/센텀법인설립등기",
    costHref: "/법인설립등기비용",
    documentsHref: "/faq/company-establishment-documents-faq",
    faqServiceSlugs: ["company-establishment", "director-change", "corporate-registration"],
    relatedHubSlugs: ["법인등기", "공탁채권회수"],
    sections: [
      {
        title: "창업·설립",
        intro: "1인·2인 창업, 스타트업, 소상공인 법인화까지 정관·자본금 설계를 함께 검토합니다.",
        links: [
          { href: "/services/company-establishment", label: "센텀 법인설립등기 상담 안내" },
          { href: "/센텀법인설립등기", label: "센텀 스타트업 설립등기 안내" },
          { href: "/faq/company-establishment-documents-faq", label: "창업 법인설립 필요서류 확인" },
          { href: "/blog/company-establishment-registration-checklist", label: "법인설립 등기 체크리스트" },
          { href: "/contact", label: "부산 스타트업·소상공인 법무 상담" },
        ],
      },
      {
        title: "운영·변경·폐업",
        links: [
          { href: "/services/director-change", label: "임원변경·대표이사 교체 등기" },
          { href: "/services/corporate-registration", label: "본점이전·지점설치 등기 안내" },
          { href: "/contact", label: "폐업·해산·청산 절차 상담" },
          { href: "/contact", label: "기업 채권회수·미수금 상담" },
        ],
        intro: "투자·지분 변동 시 정관·주주총회 의사록을 함께 점검하세요.",
      },
      {
        title: "산업단지·신도시",
        links: [
          { href: "/명지국제신도시법인등기", label: "명지국제신도시 법인등기 안내" },
          { href: "/에코델타시티법인등기", label: "에코델타시티 법인등기 안내" },
          { href: "/명례산업단지법인등기", label: "명례산업단지 법인등기 안내" },
          { href: "/문현금융단지법인등기", label: "문현금융단지 법인등기 안내" },
        ],
        intro: "입주 단지별 본점 소재지·관할 등기소를 확인합니다.",
      },
    ],
  },
];

export function getTopicHubConfig(slug: string) {
  const key = normalizeRouteSlug(slug);
  return topicHubConfigs.find((c) => normalizeRouteSlug(c.slug) === key);
}

export function getAllTopicHubSlugs(): string[] {
  return topicHubConfigs.map((c) => c.slug);
}
