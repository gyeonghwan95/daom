import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";
import type { ServiceFaq } from "@/types/service";

export type ConsultLandingContent = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  paragraphs: string[];
  bullets: string[];
  prepItems: string[];
  faqs: ServiceFaq[];
  relatedLinks: { href: string; label: string }[];
  presetSituationIds: ConsultSituationId[];
  serviceSlug: string;
};

export const CONSULT_LANDINGS: ConsultLandingContent[] = [
  {
    slug: "상담",
    title: "법무사 상담 안내",
    metaTitle: "법무사 상담｜상황만 선택하는 약 1분 간편 상담",
    metaDescription:
      "업무명을 몰라도 괜찮습니다. 준비 서류가 없어도 현재 상황만 선택해 법무사 상담을 남길 수 있습니다. 해운대·센텀 다옴법무사사무소.",
    h1: "법무사 상담, 상황만 선택해도 시작할 수 있습니다",
    eyebrow: "약 1분 간편 상담",
    paragraphs: [
      "긴 문의 글을 쓰지 않아도 됩니다. 해당하는 상황을 고르고, 준비된 자료가 있으면 표시한 뒤, 연락처만 남겨 주시면 됩니다.",
      "필요한 절차와 준비자료를 확인한 뒤 남겨주신 방법으로 안내드립니다. 전화가 어려운 경우 문자·이메일로 남겨 주세요.",
    ],
    bullets: [
      "업무명을 정확히 몰라도 괜찮습니다",
      "준비된 서류가 없어도 상담할 수 있습니다",
      "약 1분이면 문의를 남길 수 있습니다",
    ],
    prepItems: [
      "상담하고 싶은 상황(상속·등기·법인·회생 등)",
      "연락받을 전화 또는 이메일",
      "있으면 등기부·계약서 사진(없어도 가능)",
    ],
    faqs: [
      {
        question: "업무 이름을 모르면 어떻게 하나요?",
        answer:
          "‘등기·법률 문제가 있는데 업무명을 모르겠어요’를 선택하거나, 현재 상황을 여러 개 골라 주시면 됩니다.",
      },
      {
        question: "서류가 없어도 되나요?",
        answer:
          "네. ‘아직 준비된 자료가 없어도 상담할 수 있어요’를 선택하시면 됩니다.",
      },
      {
        question: "바로 전화로 상담할 수도 있나요?",
        answer:
          "가능합니다. 플로팅·하단 메뉴의 전화·카카오톡·네이버 톡톡으로도 연락하실 수 있습니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산법무사", label: "부산 법무사 종합 안내" },
      { href: "/부산법무사상담", label: "상담 준비 안내" },
      { href: "/contact", label: "연락처·오시는 길" },
    ],
    presetSituationIds: ["unknown-work"],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "1분간편상담",
    title: "1분 간편 상담",
    metaTitle: "1분 간편 상담｜법무사 상황 선택형 문의",
    metaDescription:
      "약 1분 만에 상황·연락처만 남겨 법무사에게 문의합니다. 서류·업무명을 몰라도 됩니다.",
    h1: "약 1분 간편 상담으로 문의를 남겨 보세요",
    eyebrow: "짧은 선택형 문의",
    paragraphs: [
      "선택 카드로 상황을 고르고 연락처만 남기면 됩니다. 자세히 정리하지 않으셔도 확인에 도움이 됩니다.",
    ],
    bullets: [
      "한 화면에 한 질문",
      "서류 없어도 진행 가능",
      "전화·문자·이메일 중 편한 연락 방법 선택",
    ],
    prepItems: ["연락처", "대략적인 상황"],
    faqs: [
      {
        question: "정말 1분 걸리나요?",
        answer:
          "상황 선택과 연락처 입력이 중심이라 대부분 짧게 끝납니다. 메모는 선택 사항입니다.",
      },
    ],
    relatedLinks: [
      { href: "/상담", label: "상담 안내" },
      { href: "/부산법무사", label: "부산 법무사" },
    ],
    presetSituationIds: ["unknown-work"],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "법무사상담",
    title: "법무사 상담이란",
    metaTitle: "법무사 상담｜등기·상속·법인·회생 문의 안내",
    metaDescription:
      "법무사 상담에서 다루는 업무와 준비 방법. 상황 선택형 간편 상담으로 문의를 남길 수 있습니다.",
    h1: "법무사 상담에서 확인할 수 있는 것",
    eyebrow: "등기·비송·회생 실무 상담",
    paragraphs: [
      "법무사 상담은 상속·부동산·법인 등기와 개인회생·파산 서류 등 실무 절차를 정리하는 데 초점을 둡니다.",
      "소송 대리 등은 범위가 다를 수 있어, 남겨주신 상황을 보고 가능한 안내를 드립니다.",
    ],
    bullets: [
      "관할·서류·기한 안내",
      "수임료와 공과금 구분 설명",
      "방문·비대면 가능 여부 안내",
    ],
    prepItems: ["상담 목적", "관련 서류(있으면)", "연락처"],
    faqs: [
      {
        question: "변호사 상담과 다른가요?",
        answer:
          "법무사는 등기·서류·비송 실무를 중심으로 안내합니다. 소송이 필요한 경우 별도 안내할 수 있습니다.",
      },
    ],
    relatedLinks: [
      { href: "/services", label: "업무 안내" },
      { href: "/상담", label: "간편 상담 시작" },
    ],
    presetSituationIds: ["unknown-work"],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "상속등기상담",
    title: "상속등기 상담",
    metaTitle: "상속등기 상담｜서류·절차·기한 문의",
    metaDescription:
      "상속등기 상담. 서류가 없어도 상황만 선택해 문의할 수 있습니다. 부산·해운대 다옴법무사사무소.",
    h1: "상속등기, 지금 상담이 필요한지 확인해 보세요",
    eyebrow: "상속등기 간편 상담",
    paragraphs: [
      "상속등기는 부동산 소재지·상속인 수·협의 여부에 따라 서류가 달라집니다. 상황을 선택해 주시면 필요한 순서를 안내합니다.",
    ],
    bullets: ["가족관계·등기부 확인", "협의분할·단독상속 구분", "세금·말소 동반 여부"],
    prepItems: ["가족관계증명서(있으면)", "등기부(있으면)", "사망일"],
    faqs: [
      {
        question: "상속포기와 함께 봐야 하나요?",
        answer:
          "채무가 의심되면 등기보다 포기·한정승인을 먼저 상담하는 것이 안전합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
    ],
    presetSituationIds: ["inheritance-registration", "family-passed"],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "상속포기상담",
    title: "상속포기 상담",
    metaTitle: "상속포기 상담｜3개월 기한·서류 문의",
    metaDescription:
      "상속포기 상담. 3개월 기한과 필요 서류를 상황 선택으로 문의할 수 있습니다.",
    h1: "상속포기, 기한 안에 상담이 필요할 수 있습니다",
    eyebrow: "상속포기 간편 상담",
    paragraphs: [
      "상속 개시를 안 날부터 3개월 안에 신고해야 합니다. 서류가 없어도 기한·관할부터 확인해 드립니다.",
    ],
    bullets: ["3개월 기한 확인", "상속인별 신고", "한정승인과의 차이"],
    prepItems: ["사망일", "상속인 범위", "채무 의심 여부"],
    faqs: [
      {
        question: "일부만 포기할 수 있나요?",
        answer:
          "원칙과 예외가 있어 사건별로 안내합니다. 상황을 남겨 주시면 방향을 정리합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산상속포기", label: "부산 상속포기" },
      { href: "/services/inheritance-renunciation", label: "상속포기 업무안내" },
    ],
    presetSituationIds: ["inheritance-renunciation"],
    serviceSlug: "inheritance-renunciation",
  },
  {
    slug: "한정승인상담",
    title: "한정승인 상담",
    metaTitle: "한정승인 상담｜채무 불확실 시 상속 문의",
    metaDescription:
      "한정승인 상담. 채무가 불확실할 때 상황만 선택해 문의할 수 있습니다.",
    h1: "한정승인, 채무를 모를 때 상담해 보세요",
    eyebrow: "한정승인 간편 상담",
    paragraphs: [
      "재산은 받되 채무는 상속 재산 범위로 제한하는 절차입니다. 조회·기한·서류를 상황에 맞춰 안내합니다.",
    ],
    bullets: ["재산·채무 조회", "3개월 기한", "상속등기와의 순서"],
    prepItems: ["사망일", "재산·채무 개요"],
    faqs: [
      {
        question: "단순승인과 어떻게 다른가요?",
        answer:
          "단순승인은 채무까지 전부 승계될 수 있습니다. 채무가 불확실하면 한정·포기를 먼저 검토합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산한정승인", label: "부산 한정승인" },
      { href: "/services/qualified-acceptance", label: "한정승인 업무안내" },
    ],
    presetSituationIds: ["inheritance-renunciation"],
    serviceSlug: "qualified-acceptance",
  },
  {
    slug: "부동산등기상담",
    title: "부동산등기 상담",
    metaTitle: "부동산등기 상담｜매매·증여·이전 문의",
    metaDescription:
      "부동산등기 상담. 잔금일·서류가 불확실해도 상황 선택으로 문의할 수 있습니다.",
    h1: "부동산등기, 잔금·서류가 막힐 때 상담하세요",
    eyebrow: "부동산등기 간편 상담",
    paragraphs: [
      "매매·증여·말소·이전 등 원인에 따라 서류와 일정이 달라집니다. 현재 상황만 선택해 주세요.",
    ],
    bullets: ["잔금일 일정", "근저당 말소", "취득세·등기 순서"],
    prepItems: ["계약서(있으면)", "등기부(있으면)", "잔금일"],
    faqs: [
      {
        question: "잔금 전에 상담해도 되나요?",
        answer: "네. 일정을 미리 잡으면 당일 혼란을 줄일 수 있습니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
    ],
    presetSituationIds: ["real-estate-trade"],
    serviceSlug: "real-estate-registration",
  },
  {
    slug: "법인등기상담",
    title: "법인등기 상담",
    metaTitle: "법인등기 상담｜설립·임원변경·본점이전",
    metaDescription:
      "법인등기 상담. 임원변경 기한·설립 서류가 없어도 상황만 선택해 문의할 수 있습니다.",
    h1: "법인등기, 기한이 걱정될 때 상담하세요",
    eyebrow: "법인등기 간편 상담",
    paragraphs: [
      "설립·임원변경·본점이전은 결의일과 기한이 중요합니다. 서류가 없어도 날짜부터 확인해 드립니다.",
    ],
    bullets: ["임원변경 기한", "정관·의사록", "관할 등기소"],
    prepItems: ["등기사항전부증명서(있으면)", "변경 내용", "취임일"],
    faqs: [
      {
        question: "기한이 지났어도 상담되나요?",
        answer: "네. 현황을 알려 주시면 가능한 조치를 안내합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/services/corporate-registration", label: "법인등기 안내" },
    ],
    presetSituationIds: ["corporate"],
    serviceSlug: "corporate-registration",
  },
  {
    slug: "전세보증금상담",
    title: "전세보증금 상담",
    metaTitle: "전세보증금 상담｜반환·임차권등기 문의",
    metaDescription:
      "전세보증금 반환·임차권등기 상담. 서류가 없어도 상황만 선택해 문의할 수 있습니다.",
    h1: "전세보증금을 받지 못할 때 상담해 보세요",
    eyebrow: "전세·임차 간편 상담",
    paragraphs: [
      "반환 지연·연락 두절·경매 등 상황에 따라 임차권등기명령·내용증명 등이 달라집니다.",
    ],
    bullets: ["계약·확정일자", "임차권등기", "내용증명·독촉"],
    prepItems: ["임대차계약서(있으면)", "입금 증빙(있으면)"],
    faqs: [
      {
        question: "임차권등기명령이 뭔가요?",
        answer:
          "대항력·우선변제권을 유지하기 위한 절차입니다. 상황에 맞는지 상담으로 확인하세요.",
      },
    ],
    relatedLinks: [
      { href: "/부산임차권등기명령", label: "임차권등기명령 안내" },
      { href: "/부산전세보증금반환법무사", label: "전세보증금 반환" },
    ],
    presetSituationIds: ["jeonse-deposit"],
    serviceSlug: "real-estate-registration",
  },
  {
    slug: "개인회생상담",
    title: "개인회생 상담",
    metaTitle: "개인회생 상담｜자격·서류·파산과의 차이",
    metaDescription:
      "개인회생·파산 상담. 채무·소득 개요만으로도 상황 선택형 문의가 가능합니다.",
    h1: "개인회생이 맞는지 상황부터 상담해 보세요",
    eyebrow: "회생·파산 간편 상담",
    paragraphs: [
      "소득·재산·채무 구조에 따라 회생과 파산이 달라집니다. 정확한 금액이 없어도 개요만으로 1차 안내가 가능합니다.",
    ],
    bullets: ["소득·생계비", "채무 목록", "압류·독촉 여부"],
    prepItems: ["채무 대략액", "소득 유무", "연락처"],
    faqs: [
      {
        question: "파산과 함께 상담되나요?",
        answer: "네. 상황에 맞는 방향을 비교해 안내합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
    ],
    presetSituationIds: ["rehab-bankruptcy"],
    serviceSlug: "personal-rehabilitation",
  },
  {
    slug: "등기서류상담",
    title: "등기 서류 상담",
    metaTitle: "등기 서류 상담｜무엇을 준비할지 모를 때",
    metaDescription:
      "등기 서류가 무엇인지 모를 때. 상황만 선택하면 필요 서류 방향을 안내받을 수 있습니다.",
    h1: "등기 서류, 무엇을 준비해야 할지 모를 때",
    eyebrow: "서류 준비 간편 상담",
    paragraphs: [
      "업무마다 서류가 다릅니다. 상황을 고르시면 체크리스트 방향으로 안내드립니다. 없어도 상담할 수 있습니다.",
    ],
    bullets: ["업무별 서류 차이", "원본·사본", "없어도 1차 안내 가능"],
    prepItems: ["상담 목적", "있으면 관련 서류"],
    faqs: [
      {
        question: "서류 사진만 보내도 되나요?",
        answer: "초기 안내는 사진·PDF로도 가능한 경우가 많습니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산법무사서류준비", label: "서류 준비 안내" },
      { href: "/상담", label: "간편 상담" },
    ],
    presetSituationIds: ["unknown-work"],
    serviceSlug: "real-estate-registration",
  },
  {
    slug: "무슨법률업무인지모를때",
    title: "무슨 법률 업무인지 모를 때",
    metaTitle: "어떤 법무사 업무인지 모르겠다면｜상황부터 설명해도 괜찮습니다",
    metaDescription:
      "업무명을 몰라도 가족 사망, 부동산 이전, 법인 변경, 개인회생, 지급명령, 보증금 미반환 등 상황만 설명해 법무사 업무 가능 여부와 준비서류를 확인할 수 있습니다.",
    h1: "어떤 법무사 업무인지 모르겠다면, 상황부터 설명해도 괜찮습니다",
    eyebrow: "업무명을 몰라도 시작하는 상담",
    paragraphs: [
      "검색어와 실제 필요한 절차가 다를 수 있습니다. ‘상속등기’ ‘증여등기’처럼 정확한 이름을 몰라도, 지금 겪고 있는 일만 설명해 주시면 관련 업무와 준비서류를 연결해 드립니다.",
      "가족이 사망한 뒤 부동산과 빚을 정리해야 하는 경우, 매매·증여·상속으로 부동산을 이전해야 하는 경우, 법인 임원·주소·목적이 바뀐 경우, 채무가 늘어 개인회생을 검토하는 경우, 돈을 받지 못해 지급명령이 필요한 경우, 임대차보증금을 돌려받지 못한 경우처럼 상황 단위로 나누어 보시면 찾기 쉽습니다.",
      "초기 문의에서는 접수 가능 여부·일반 준비서류·비용 구성을 안내할 수 있습니다. 개별 법률 판단·상세 분석·서류 작성·신청대리는 별도 검토 단계입니다.",
    ],
    bullets: [
      "업무명을 몰라도 상황만으로 1차 안내 가능",
      "여러 상황을 복수 선택해도 됩니다",
      "관련 업무 페이지로 내부 연결",
      "전화·카카오톡·간편 상담 모두 이용 가능",
    ],
    prepItems: [
      "현재 상황 한 줄 요약",
      "기한(사망일·잔금일·취임일 등)",
      "보유 서류(없어도 가능)",
      "연락처",
    ],
    faqs: [
      {
        question: "여러 개를 골라도 되나요?",
        answer: "네. 해당하는 상황을 모두 선택해 주세요.",
      },
      {
        question: "업무명을 모르면 상담이 어렵나요?",
        answer:
          "아닙니다. 상황·기한·보유 서류만 알려 주셔도 관련 업무와 준비서류를 연결해 드립니다.",
      },
      {
        question: "바로 의뢰하지 않아도 되나요?",
        answer:
          "네. 접수 가능 여부와 서류·비용 구성을 확인한 뒤 진행 여부를 결정하셔도 됩니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산법무사상담", label: "상담 전 비용·준비서류 안내" },
      { href: "/부산법률상담", label: "공공 상담과 법무사 업무 차이" },
      { href: "/부산상속등기", label: "가족 사망 후 상속등기" },
      { href: "/부산증여등기", label: "부동산 증여등기" },
      { href: "/부산부동산등기", label: "부동산등기" },
      { href: "/부산법인등기", label: "법인등기" },
      { href: "/부산개인회생", label: "개인회생" },
      { href: "/민사소송", label: "지급명령·내용증명" },
      { href: "/부산임차권등기명령", label: "임차권등기명령" },
      { href: "/상담", label: "간편 상담 시작" },
      { href: "/situations", label: "상황별 안내" },
    ],
    presetSituationIds: ["unknown-work"],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "서류가없어도상담가능",
    title: "서류가 없어도 상담 가능",
    metaTitle: "서류가 없어도 상담 가능｜법무사 간편 문의",
    metaDescription:
      "서류가 준비되지 않아도 법무사 상담 문의를 남길 수 있습니다. 상황만 선택하세요.",
    h1: "서류가 없어도 상담 문의를 남길 수 있습니다",
    eyebrow: "서류 없이 시작",
    paragraphs: [
      "상담 단계에서 필요한 목록을 알려 드립니다. 지금은 상황과 연락처만 있어도 됩니다.",
    ],
    bullets: ["서류 없이 시작", "이후 목록 안내", "급하면 전화·카카오도 가능"],
    prepItems: ["상황 선택", "연락처"],
    faqs: [
      {
        question: "나중에 서류를 보내면 되나요?",
        answer: "네. 상담 후 안내드린 목록대로 준비하시면 됩니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산법무사서류준비", label: "서류 준비" },
      { href: "/1분간편상담", label: "1분 간편 상담" },
    ],
    presetSituationIds: ["unknown-work"],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "전화가어려울때법률상담",
    title: "전화가 어려울 때 법률 상담",
    metaTitle: "전화가 어려울 때 법률 상담｜문자·이메일 문의",
    metaDescription:
      "전화가 어려울 때 문자·이메일로 연락받을 방법을 남겨 법무사 상담을 신청하세요.",
    h1: "전화가 어려울 때도 상담을 남길 수 있습니다",
    eyebrow: "비대면·문자·이메일",
    paragraphs: [
      "선호 연락 방법을 문자·이메일로 두시면 됩니다. 상황 선택형 문의로 부담을 줄였습니다.",
    ],
    bullets: ["문자·이메일 선호 가능", "카카오·톡톡도 유지", "방문은 예약 후"],
    prepItems: ["이메일 또는 휴대폰", "상황 선택"],
    faqs: [
      {
        question: "카카오톡으로만 연락하고 싶어요",
        answer:
          "하단·플로팅의 카카오톡으로도 가능하고, 간편 상담에서 선호 연락을 남겨도 됩니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산법무사비대면상담", label: "비대면상담 안내" },
      { href: "/상담", label: "간편 상담" },
    ],
    presetSituationIds: ["unknown-work"],
    serviceSlug: "inheritance-registration",
  },
];

export function getConsultLanding(slug: string): ConsultLandingContent | undefined {
  return CONSULT_LANDINGS.find((p) => p.slug === slug);
}

export function getAllConsultLandingSlugs(): string[] {
  return CONSULT_LANDINGS.map((p) => p.slug);
}
