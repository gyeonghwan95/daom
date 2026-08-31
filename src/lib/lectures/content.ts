import { expertHubPage } from "@/lib/lectures/content-expert-hub";
import type { LecturePageContent } from "@/lib/lectures/types";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { institutionExpansionPages } from "@/lib/lectures/content-institution-expansion";
import {
  getHiringHubBodySections,
  hiringHubEnrichment,
  speakerExpansionPages,
} from "@/lib/lectures/content-speaker-expansion";
import {
  commonDisclaimer,
  durationOptionsDefault,
  lectureFormatsDefault,
  preparationDefault,
  processStepsDefault,
  relatedAll,
} from "@/lib/lectures/shared";

const hub: LecturePageContent = {
  slug: "법률강의",
  kind: "hub",
  title: "부산 법률 강의·특강",
  metaTitle: "부산 법률 강의·특강 | 안윤정 법무사",
  metaDescription:
    "안윤정 법무사의 부산 법률 강의·특강. 생활법률·전세사기·청년·창업 교육. 공공기관·도서관·기업·학교 출강. 확인된 이력과 문의 안내.",
  h1: "부산 법률 강의·특강 | 안윤정 법무사 출강 안내",
  eyebrow: "강의·특강 안내",
  heroIntro:
    "안윤정 법무사가 생활법률·전세사기·창업·청년 법률교육을 부산 중심으로 출강합니다. 공공기관·도서관·기업·학교·청년·복지기관 담당자가 주제와 이력을 고른 뒤 문의하시면 됩니다.",
  heroParagraphs: [
    "법정 지정교육(청렴·성희롱예방·산업안전 등)은 안내 범위에 넣지 않습니다. 마케팅·리더십·AI처럼 법무사 업무와 무관한 강의도 다루지 않습니다.",
  ],
  bodySections: [
    {
      title: "담당자가 5초 안에 고르는 방법",
      paragraphs: [
        "주제가 정해졌으면 아래 교육 카드에서, 장소·기관 유형이 먼저면 진행 장소 카드에서 고르시면 됩니다. 전세사기·청년·창업·기업·학교 진로는 각각 다른 커리큘럼과 확인된 이력을 가집니다.",
        "강사를 검토 중이면 섭외 기준 페이지, 출강 사실을 확인하려면 강의 이력, 일정·제안은 강의 문의로 이어집니다. 사건 상담 페이지와 경로를 섞지 않습니다.",
      ],
    },
  ],
  summaryItems: [
    { label: "강사", value: "안윤정 법무사 · 다옴법무사사무소" },
    { label: "주제", value: "생활법률 · 전세사기 · 청년 · 창업 · 기업 · 진로" },
    { label: "출강", value: "부산 중심 · 인근·온라인 협의" },
    { label: "대상 기관", value: "공공 · 도서관 · 기업 · 학교 · 청년 · 복지" },
  ],
  topicCards: [
    {
      title: "전세사기 예방교육",
      description: "계약 전 확인부터 보증금 보호까지",
      href: "/전세사기예방교육",
    },
    {
      title: "청년 생활법률 특강",
      description: "주거·계약·금전·온라인 분쟁 예방",
      href: "/청년생활법률특강",
    },
    {
      title: "도서관 법률특강",
      description: "시민·평생학습 생활법률",
      href: "/부산도서관법률특강",
    },
    {
      title: "기관·단체 법률특강",
      description: "협회·복지·업체 맞춤",
      href: "/부산기관법률특강",
    },
    {
      title: "부산 법무사 강의",
      description: "실무 기반 출강 교육",
      href: "/부산법무사강의",
    },
    {
      title: "창업 법률교육",
      description: "법인설립·계약·지분·기한 리스크",
      href: "/창업법률교육",
    },
    {
      title: "기업 법률교육",
      description: "임직원 계약·채권·개인정보 기초",
      href: "/기업법률교육",
    },
    {
      title: "학교·진로 특강",
      description: "생활법률·법무사 진로 이야기",
      href: "/학교법률교육",
    },
  ],
  audienceCards: [
    { title: "청년·대학생", description: "주거·계약·온라인·금전거래 기초" },
    { title: "신혼·사회초년생", description: "전월세·근로·생활분쟁 예방" },
    { title: "예비창업자", description: "법인·계약·동업 리스크" },
    { title: "임직원", description: "계약·채권·SNS·개인정보 기초" },
    { title: "학생·학부모", description: "연령에 맞춘 사례·진로 특강" },
    { title: "시민·평생학습", description: "상속·계약·생활법률" },
  ],
  institutionCards: [
    {
      title: "공공기관",
      topics: ["직원·이용자 생활법률", "법정 지정교육 제외"],
      href: "/공공기관법률교육",
    },
    {
      title: "기업",
      topics: ["임직원 계약·채권", "사내 특강"],
      href: "/기업법률교육",
    },
    {
      title: "도서관·평생학습",
      topics: ["시민 생활법률", "연속과정"],
      href: "/부산도서관법률특강",
    },
    {
      title: "청년기관",
      topics: ["주거·계약·금전", "자립 프로그램"],
      href: "/청년생활법률특강",
    },
    {
      title: "사회복지기관",
      topics: ["종사자·이용자 예방", "초기 안내"],
      href: "/부산사회복지기관강사",
    },
    {
      title: "학교·대학",
      topics: ["생활법률", "법무사 진로특강"],
      href: "/학교법률교육",
    },
    {
      title: "협회·단체",
      topics: ["회원·종사자 맞춤", "1회 특강"],
      href: "/부산기관법률특강",
    },
  ],
  formats: [
    {
      title: "특강",
      description: "60~120분 한 회차. 핵심 주제와 질의응답.",
    },
    {
      title: "워크숍 · 워크샵",
      description: "사례 질문·체크리스트·상황판단. 철자만 다른 같은 형식입니다.",
    },
    {
      title: "세미나 · 초청강연",
      description: "정보전달 비중을 높인 특강. 별도 세미나 전용 페이지는 두지 않습니다.",
    },
    {
      title: "직원교육",
      description: "사내·기관 정기/수시 교육. 법정 지정교육을 대체하지 않습니다.",
    },
  ],
  durationOptions: durationOptionsDefault,
  modules: [
    "대상·목적에 맞춘 사례 중심 구성",
    "체크리스트·질의응답 포함",
    "확인된 출강 이력 기반 안내",
  ],
  processSteps: processStepsDefault.slice(0, 4),
  preparationChecklist: [],
  materialExamples: [],
  faqs: [
    {
      question: "부산 외 지역도 출강이 가능한가요?",
      answer:
        "부산 중심이며 인근 지역은 일정·주제에 따라 협의합니다. 먼 거리는 온라인 대안도 검토합니다.",
    },
    {
      question: "강의 시간은 어떻게 구성하나요?",
      answer:
        "60·90·120분과 반일 과정을 기준으로 기관 일정에 맞춰 조정합니다.",
    },
    {
      question: "기관 성격에 맞춰 내용을 바꿀 수 있나요?",
      answer:
        "대상·목적·시간에 맞게 목차와 사례를 조정합니다. 사전 협의가 필요합니다.",
    },
    {
      question: "법정의무교육으로 인정되나요?",
      answer:
        "아니요. 본 안내는 생활·실무 예방교육이며 법정의무교육·공인강사 지정 교육으로 안내하지 않습니다.",
    },
    {
      question: "강의료는 어떻게 정해지나요?",
      answer:
        "시간·형식·이동·자료 준비 범위에 따라 기관 기준과 협의합니다. 고정 단가를 단정하지 않습니다.",
    },
    {
      question: "제안서와 강사 프로필을 받을 수 있나요?",
      answer:
        "가능합니다. 강의문의에서 요청해 주시거나 강사소개 페이지를 참고해 주세요.",
    },
    {
      question: "실제 사례를 강의에 사용하나요?",
      answer:
        "개인정보가 드러나지 않도록 가공·일반화한 예방 사례 중심으로 설명합니다.",
    },
    {
      question: "온라인 강의도 가능한가요?",
      answer:
        "기관 화상 환경과 참여 방식에 따라 협의합니다. 오프라인 출강을 기본으로 합니다.",
    },
    {
      question: "1시간 특강과 여러 회차 과정도 가능한가요?",
      answer:
        "60분 특강부터 2~4시간 교육, 주차별 연속과정까지 기관 일정에 맞춰 협의합니다. 시간별 구성 안내를 함께 보시면 됩니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/전세사기예방교육", label: "전세사기 예방교육" },
    { href: "/청년생활법률특강", label: "청년 법률교육" },
    { href: "/창업법률교육", label: "창업 법률교육" },
    { href: "/기업법률교육", label: "기업 법률교육" },
    { href: "/법무사진로특강", label: "법무사 진로특강" },
    { href: "/부산법률강사", label: "강사 섭외·초빙" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/강사소개", label: "강사 소개" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "안윤정 법무사 소개" },
    { href: "/media#lectures", label: "강의 사진·활동" },
  ],
  historyIds: [
    "citizen-library-life-law",
    "self-support-jeonse-prevention",
    "haeundae-youth-job-growth-cafe",
    "lh-busan-changjo-collab",
    "yangsan-high-school-career-talk",
  ],
  ctaTitle: "강의 가능 일정을 문의하세요",
  ctaText:
    "교육 대상과 희망 주제만 남겨 주셔도 가능 여부와 구성안을 안내합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showRecommendTool: false,
  primaryKeywords: ["부산 법률 강의", "부산 법률 특강"],
  secondaryKeywords: [
    "부산 생활법률 강의",
    "부산 생활법률 특강",
    "부산 법률교육 강사",
  ],
};

const hiring: LecturePageContent = {
  slug: "부산법률강사",
  kind: "hiring",
  title: "부산 강사 섭외·초빙",
  metaTitle: "부산 강사 섭외·초빙 | 법률 특강 강사 선택 기준",
  metaDescription:
    "부산에서 법률 특강 강사를 섭외할 때 확인할 기준. 출강 이력·전문 분야·강의계획서·맞춤 구성. 안윤정 법무사 검증 이력을 함께 안내합니다.",
  h1: "부산에서 법률 특강 강사를 섭외할 때 확인할 것",
  eyebrow: "강사 섭외 · 초빙",
  heroIntro:
    "외부강사·특강 강사를 고를 때는 광고 문구보다 강의 대상 경험, 확인된 출강 이력, 전문 분야, 강의계획서 제공 여부를 먼저 봅니다. 이 페이지는 그 기준과 안윤정 법무사의 검증 가능한 이력을 맞춰 보여 줍니다.",
  heroParagraphs: [
    "리더십·마케팅·CS·AI처럼 법무사 업무 밖의 주제는 다루지 않습니다. 법정 지정교육도 범위에 넣지 않습니다. 확인되지 않은 출강 횟수나 만족도는 적지 않습니다.",
  ],
  bodySections: getHiringHubBodySections(),
  summaryItems: [
    { label: "출강지역", value: "부산 중심 · 인근·온라인 협의" },
    { label: "주요 대상", value: "공공 · 기업 · 청년 · 시민 · 종사자" },
    { label: "기본 시간", value: "60분 · 90~120분 · 3~4시간" },
    { label: "자료", value: "프로필·강의계획서 요청 가능" },
  ],
  topicCards: hub.topicCards,
  audienceCards: [
    { title: "공공기관", description: "직원·상담·시민 대상 실무교육" },
    { title: "기업·협회", description: "계약·미수금·법인 실무" },
    { title: "청년기관", description: "주거·계약·금전관리" },
    { title: "도서관·시민", description: "생활법률·연속강좌" },
    { title: "복지·자립지원", description: "종사자·이용자 현장교육" },
    { title: "학교·진로", description: "생활법률·진로 특강(제안)" },
  ],
  institutionCards: [
    {
      title: "공공기관",
      topics: ["직원·이용자 생활법률", "법정 지정교육 제외"],
      href: "/공공기관법률교육",
    },
    {
      title: "기업",
      topics: ["임직원 계약·채권", "사내 특강"],
      href: "/기업법률교육",
    },
    {
      title: "도서관·평생학습",
      topics: ["시민 생활법률", "연속과정"],
      href: "/부산도서관법률특강",
    },
    {
      title: "청년기관",
      topics: ["주거·계약·금전", "자립 프로그램"],
      href: "/청년생활법률특강",
    },
    {
      title: "사회복지기관",
      topics: ["종사자·이용자 예방", "초기 안내"],
      href: "/부산사회복지기관강사",
    },
    {
      title: "학교·대학",
      topics: ["생활법률", "법무사 진로특강"],
      href: "/학교법률교육",
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "생활분쟁·계약·증거관리",
    "전세·주거 안전과 등기부 확인",
    "창업·법인·미수금 기초",
    "상속·가족재산 개요(대상에 맞게)",
    "종사자용 초기 안내와 전문기관 구분",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["강사 프로필", "강의 개요·계획서", "체크리스트"],
  faqs: [
    {
      question: "강사 프로필과 강의계획서를 먼저 받을 수 있나요?",
      answer:
        "가능합니다. 강사 소개 페이지의 인쇄용 요약과 함께, 문의 시 기관 양식에 맞춘 개요를 요청해 주세요.",
    },
    {
      question: "어떤 기관에서 출강한 이력이 있나요?",
      answer:
        "부산광역시립시민도서관, 부산광역시 자립지원전담기관, 해운대청년채움공간, 창원청년비전센터, 양산제일고 등 확인된 이력은 강의 이력 페이지에서 볼 수 있습니다.",
    },
    {
      question: "출강료는 얼마인가요?",
      answer:
        "시간·대상·인원·장소·자료 범위에 따라 달라 금액을 미리 단정하지 않습니다. 기관 내부 강사료 기준이 있으면 함께 보내 주시면 맞춰 검토합니다.",
    },
    {
      question: "실제 전문가가 직접 강의하나요?",
      answer:
        "안윤정 법무사가 직접 출강합니다. 대리 강사 알선은 하지 않습니다.",
    },
    {
      question: "온라인 강의도 가능한가요?",
      answer: "기관 환경에 맞춰 협의합니다. 오프라인 출강을 기본으로 합니다.",
    },
    {
      question: "법정 지정교육도 하나요?",
      answer:
        "청렴·성희롱예방 등 별도 자격·지정요건이 있는 법정의무교육은 범위에 포함하지 않습니다.",
    },
    {
      question: "담당자와 사전 조율은 어떻게 하나요?",
      answer:
        "교육 대상·시간·장소에 맞춰 목차와 사례를 조정합니다. 희망일과 대상을 알려주시면 가능 여부를 회신합니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/부산법률전문가", label: "법률 실무·공공활동 소개" },
    { href: "/법률강의", label: "법률 강의 허브" },
    { href: "/강사소개", label: "강사 소개" },
    { href: "/강의이력", label: "확인된 출강 이력" },
    { href: "/공공기관법률교육", label: "공공기관 강사·교육" },
    { href: "/기업법률교육", label: "기업·직원교육 강사" },
    { href: "/청년생활법률특강", label: "청년 특강 강사" },
    { href: "/창업법률교육", label: "창업교육 강사" },
    { href: "/부산사회복지기관강사", label: "사회복지기관 강사" },
    { href: "/부산도서관법률특강", label: "도서관·시민강좌 강사" },
    ...hiringHubEnrichment.relatedGuideLinks,
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "법무사 소개" },
    { href: "/media#lectures", label: "강의 사진" },
  ],
  historyIds: hub.historyIds,
  ctaTitle: "특강 구성을 문의하세요",
  ctaText:
    "교육 대상과 희망 주제만 남겨 주시면 가능 여부와 구성안을 안내합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showPrintProfile: true,
  showFormatGuide: true,
  showTopicFinder: false,
  primaryKeywords: ["부산 강사 섭외", "부산 강사 초빙"],
  secondaryKeywords: [
    "부산 외부강사",
    "부산 특강 강사",
    "부산 강연 강사",
    "부산 법률 강사",
  ],
};

const jeonse: LecturePageContent = {
  slug: "전세사기예방교육",
  kind: "topic",
  title: "부산 전세사기 예방교육",
  metaTitle: "부산 전세사기 예방교육 | 청년·기관 법률특강",
  metaDescription:
    "부산 전세사기 예방교육. 계약 전 확인, 등기부, 확정일자, 보증·특약을 사례로 안내합니다. 청년·기관 특강. 안윤정 법무사.",
  h1: "부산 전세사기 예방교육, 계약 전에 확인할 것",
  eyebrow: "주거·임대차 예방교육",
  heroIntro:
    "계약 전에 무엇을 확인해야 하는지를 체크리스트와 사례로 정리하는 특강입니다.",
  heroParagraphs: [
    "부산광역시 자립지원전담기관 전세사기 예방 특강 등 실제 강의 이력을 바탕으로 구성을 안내합니다.",
    "공식 예방교육을 대체한다고 보지 마시고, 생활법률·실무 예방 관점의 교육으로 이해해 주세요.",
  ],
  bodySections: [
    {
      title: "이 교육에서 실제로 확인하는 순서",
      paragraphs: [
        "매물과 임대인을 누구로 볼지, 등기부에서 선순위·근저당을 어떻게 읽는지, 전입신고·확정일자·보증·특약·잔금일 확인을 계약 전 순서로 붙입니다. 용어 암기가 아니라 현장에서 빠지기 쉬운 확인을 사례로 풉니다.",
        "부산광역시 자립지원전담기관 전세사기 예방 특강처럼, 자립준비청년·청년기관 이용자에게 맞춘 이력이 있습니다. 기관이 모은 청중의 계약 경험(첫 전세, 고시원, 기숙사 이후 원룸)에 따라 사례를 바꿉니다.",
      ],
    },
    {
      title: "가능한 시간과 진행 방식",
      paragraphs: [
        "60분은 핵심 체크리스트와 질의응답, 90~120분은 등기부 읽기·특약 문장 연습까지 넣을 수 있습니다. 게임형 퍼실리테이션은 하지 않습니다.",
        "공식 전세사기 예방교육 지정 과정을 대체한다고 안내하지 않습니다. 생활·실무 예방 특강 범위에서 협의합니다.",
      ],
    },
  ],
  summaryItems: [
    { label: "추천 대상", value: "청년·대학생·신혼·자립준비청년·기관 이용자·신입사원" },
    { label: "핵심", value: "매물·임대인 확인, 등기부, 확정일자, 보증, 특약" },
    { label: "형식", value: "60~120분 특강·워크숍" },
  ],
  topicCards: [
    { title: "청년 전세사기 예방", description: "첫 계약 전 체크리스트" },
    { title: "대학생 주거법률", description: "고시원·원룸·기숙사 외 계약" },
    { title: "신혼·사회초년생", description: "보증금 보호 포인트" },
    { title: "자립준비청년", description: "기관 연계 예방교육" },
  ],
  audienceCards: [
    { title: "청년기관·복지기관", description: "이용자·자립준비청년 대상" },
    { title: "대학·학교", description: "졸업·취업 전 주거교육" },
    { title: "기업 신입", description: "사내 복리·온보딩 연계" },
  ],
  institutionCards: [
    {
      title: "자립·청년·복지",
      topics: ["전세사기 예방", "전월세 계약"],
    },
  ],
  formats: lectureFormatsDefault.filter((f) =>
    ["특강", "사례 중심 워크숍", "소규모 상담형 교육"].includes(f.title),
  ),
  durationOptions: durationOptionsDefault,
  modules: [
    "계약 전 매물·임대인 확인",
    "등기부등본 기본 구조",
    "선순위 권리와 근저당",
    "전입신고·확정일자",
    "보증보험 확인",
    "계약서 특약",
    "잔금일 확인",
    "계약 후 권리 보호",
    "보증금 반환 지연 시 기초 대응",
    "사례 토론",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: [
    "전세계약 체크리스트",
    "등기부 보는 포인트 요약",
    "특약 예시(일반화)",
  ],
  faqs: [
    {
      question: "전세사기 예방교육 강사를 찾고 있습니다. 가능한가요?",
      answer:
        "청년·기관 대상 전세사기 예방 특강 이력이 있으며, 일정·인원에 따라 협의합니다.",
    },
    {
      question: "등기부등본 읽는 법만 짧게 가능한가요?",
      answer: "시간 모듈을 줄여 핵심만 구성하는 것도 가능합니다.",
    },
    {
      question: "보증금 반환을 보장하나요?",
      answer:
        "교육은 예방·확인 방법 안내에 그칩니다. 개별 사건 결과나 반환을 보장하지 않습니다.",
    },
    {
      question: "찾아가는 교육이 가능한가요?",
      answer: "기관 장소 출강은 일정에 따라 협의합니다.",
    },
    {
      question: "신혼부부만 따로 구성을 바꿀 수 있나요?",
      answer: "대상별 사례와 강조점을 조정할 수 있습니다.",
    },
    {
      question: "이미 보증금을 못 받고 있다면 이 교육 페이지가 맞나요?",
      answer:
        "아닙니다. 이 페이지는 계약 전 예방교육·특강 안내입니다. 이미 보증금 미반환·연락두절·경매가 시작된 경우에는 전세보증금 피해 대응 안내를 보세요.",
    },
    {
      question: "사진·자료를 홍보에 써도 되나요?",
      answer:
        "개인정보·초상권이 있는 사진은 기관 내부용이라도 별도 협의가 필요합니다.",
    },
    {
      question: "교육 후 개인 상담이 가능한가요?",
      answer:
        "강의 중에는 일반론으로 답하고, 개별 사안은 별도 상담 절차로 안내합니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/법률강의", label: "법률 강의 허브" },
    { href: "/청년생활법률특강", label: "청년 생활법률" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/부산법률강사", label: "강사 섭외" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
    {
      href: "/전세사기피해대응절차",
      label: "이미 보증금 반환 문제가 발생한 경우",
    },
    { href: "/임대차전세", label: "전세·임대차 안내" },
    { href: "/about", label: "전세사기 예방 특강 경력" },
  ],
  historyIds: ["self-support-jeonse-prevention", "youth-jeonse-prevention-series"],
  ctaTitle: "전세사기 예방교육 일정을 문의하세요",
  ctaText: "대상·인원·희망일만 남겨 주시면 구성안을 안내합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: [
    "부산 전세사기 예방교육",
    "전세사기 예방교육 강사",
    "청년 전세사기 교육",
    "등기부등본 강의",
    "전세사기 예방교육 부산",
    "부산 전세사기 특강",
  ],
};

const youth: LecturePageContent = {
  slug: "청년생활법률특강",
  kind: "topic",
  title: "부산 청년 법률교육",
  metaTitle: "부산 청년 법률교육 | 주거·계약 특강",
  metaDescription:
    "부산 청년·사회초년생 법률교육. 주거·전세·금전거래·계약을 사례로 안내합니다. 청년센터·자립 프로그램 출강.",
  h1: "부산 청년 법률교육, 주거와 계약에서 확인할 것",
  eyebrow: "청년센터 · 자립 · 사회초년생",
  heroIntro:
    "청년이 실제로 겪는 주거·금전·계약 상황에서 질문을 모아, 어렵지 않은 설명으로 확인 순서를 남기는 특강입니다. 청년센터·자립지원·대학 프로그램에 맞춰 시간을 조정합니다.",
  heroParagraphs: [
    "처음 독립할 때 확인할 임대차계약, 전세사기와 등기부등본, 가족·친구 사이 돈거래, 취업·창업 과정의 계약, 카카오톡과 통화녹음처럼 현장에서 질문이 많은 주제를 우선합니다.",
    "해운대 청년 JOB성장카페·청년채움공간·자립지원전담기관 등 확인된 출강 이력을 바탕으로 구성합니다. 공포를 조장하지 않고, 지금 확인할 행동 중심으로 설명합니다.",
  ],
  summaryItems: [
    { label: "대상", value: "청년센터·대학·취업준비·사회초년생" },
    { label: "범위", value: "주거·계약·금전·온라인·기초 노동·창업 입문" },
  ],
  topicCards: [
    { title: "전월세·주거", description: "계약 전 확인", href: "/전세사기예방교육" },
    { title: "디지털·온라인", description: "명예훼손·사기 예방", href: "/디지털법률교육" },
    { title: "창업 입문", description: "사업자·계약 기초", href: "/창업법률교육" },
  ],
  audienceCards: [
    { title: "청년센터·공간", description: "프로그램 연계 특강" },
    { title: "대학·취업준비", description: "졸업 전 생활법률" },
    { title: "자립준비청년", description: "주거·계약 중심" },
  ],
  institutionCards: [
    {
      title: "청년·자립기관",
      topics: ["생활법률", "전세사기", "온라인 예방"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "전월세 계약",
    "근로계약 기초",
    "금전거래와 차용증",
    "중고거래·온라인 사기",
    "개인정보보호 기초",
    "명예훼손·모욕 기초",
    "디지털 범죄 예방 기초",
    "계약서 확인 포인트",
    "보증·연대보증 주의",
    "내용증명·지급명령 기초",
    "신용·채무관리 기초",
    "창업 전 법률 체크",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["청년 생활법률 체크리스트", "상황별 질문 리스트"],
  faqs: [
    {
      question: "청년센터 프로그램에 맞춰 길이를 조절할 수 있나요?",
      answer: "60~120분 등 프로그램 슬롯에 맞게 조정합니다.",
    },
    {
      question: "전세사기만 따로 가능한가요?",
      answer: "전세사기 예방교육 페이지 구성을 단독으로 진행할 수 있습니다.",
    },
    {
      question: "노동법 전문 교육인가요?",
      answer:
        "근로계약 기초·주의점 수준의 생활법률 안내이며, 노무사 전문교육을 대체하지 않습니다.",
    },
    {
      question: "온라인 범죄 전문기관 교육을 대체하나요?",
      answer: "아니요. 생활법률 예방 관점의 기초 안내입니다.",
    },
    {
      question: "참여형으로 구성할 수 있나요?",
      answer: "체크리스트·사례 토론 비중을 높일 수 있습니다.",
    },
    {
      question: "민감 개인 상담은 어떻게 하나요?",
      answer: "공개 강의에서는 일반론으로 안내하고, 개별 사안은 별도 상담을 안내합니다.",
    },
    {
      question: "부산 청년만 대상인가요?",
      answer: "부산·인근 기관 프로그램을 우선하며, 대상 조건은 기관과 맞춥니다.",
    },
    {
      question: "강의 문의는 어디로?",
      answer: "강의 문의 페이지에서 기관·대상·주제를 남겨 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/전세사기예방교육", label: "전세사기 예방교육" },
    { href: "/디지털법률교육", label: "디지털 법률교육" },
    { href: "/법률강의", label: "강의 허브" },
    { href: "/부산법률강사", label: "부산 강사 초빙" },
    { href: "/강의문의", label: "문의" },
  ],
  relatedServiceLinks: [{ href: "/media#lectures", label: "강의 사진" }],
  historyIds: [
    "haeundae-youth-job-growth-cafe",
    "youth-mistake-crime-lecture",
    "youth-jeonse-prevention-series",
  ],
  ctaTitle: "청년 생활법률 특강을 문의하세요",
  ctaText: "프로그램 일정과 대상만 알려주시면 구성안을 안내합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: [
    "부산 청년 특강 강사",
    "부산 청년교육 강사",
    "부산 청년센터 강사",
    "부산 자립청년 교육",
    "부산 사회초년생 교육",
  ],
  secondaryKeywords: [
    "부산 청년 생활법률 특강",
    "청년 생활법률 교육",
    "청년센터 법률 강사",
  ],
};

const startup: LecturePageContent = {
  slug: "창업법률교육",
  kind: "topic",
  title: "부산 창업 법률교육",
  metaTitle: "부산 창업 법률교육 | 예비창업자·기관 특강",
  metaDescription:
    "부산 예비창업자·초기기업 법률교육. 개인·법인, 동업 합의, 거래계약·미수금 기초. 세무·노무·투자유치는 다루지 않습니다.",
  h1: "부산 창업 법률교육, 예비창업자가 놓치기 쉬운 실무",
  eyebrow: "창업지원 · 예비창업 · 초기기업",
  heroIntro:
    "사업 시작 단계에서 대표자가 결정해야 할 상호·목적·자본·임원, 계약과 미수금, 법인설립 이후 변경등기처럼 놓치기 쉬운 실무를 사례로 정리합니다.",
  heroParagraphs: [
    "법무사 법인등기 실무와 해운대청년채움공간 창업법률 특강 등 확인된 이력을 바탕으로, 예방교육 범위에서 안내합니다.",
    "세무·회계·노무·투자유치 전략은 법무사 업무 범위를 벗어나므로 다루지 않습니다. 투자 유치 전문 법률자문이나 결과 보장으로 오인되지 않도록 기초·체크리스트 중심으로 구성합니다.",
  ],
  summaryItems: [
    { label: "대상", value: "예비창업·초기기업·로컬·소상공인 프로그램" },
    { label: "범위", value: "사업자/법인, 동업·지분, 계약, 등기기한, 채권 기초" },
  ],
  topicCards: [
    { title: "법인설립 기초", description: "개인 vs 법인" },
    { title: "동업·지분", description: "역할과 문서" },
    { title: "계약·미수금", description: "조항·내용증명 기초" },
  ],
  audienceCards: [
    { title: "창업지원기관", description: "패키지·보육 프로그램" },
    { title: "청년창업", description: "입문 특강" },
  ],
  institutionCards: [
    {
      title: "창업보육·창경·센터",
      topics: ["법인설립", "계약", "등기기한"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "개인사업자와 법인 선택",
    "법인설립의 기본구조",
    "공동창업자 역할과 지분",
    "상호·목적·본점·임원",
    "계약서에서 확인할 조항",
    "외주·용역계약",
    "미수금과 채권관리 기초",
    "개인정보 처리 기초",
    "온라인 홍보·표시 주의",
    "법인등기 기한과 과태료",
    "투자 전 기본 문서 개념",
    "폐업·해산 시 주의점",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["창업 전 체크리스트", "등기기한 안내 요약"],
  faqs: [
    {
      question: "창업보육센터 특강으로 가능한가요?",
      answer: "프로그램 시간과 난이도에 맞춰 구성 협의가 가능합니다.",
    },
    {
      question: "상표 등록을 대신해 주나요?",
      answer:
        "교육에서는 주의점만 안내합니다. 출원 대행은 별도 전문 영역·상담입니다.",
    },
    {
      question: "등기 과태료까지 다루나요?",
      answer: "임원변경·본점이전 등 기한과 과태료 개념을 포함해 설명할 수 있습니다.",
    },
    {
      question: "투자계약 심화 강의인가요?",
      answer: "기초 개념·체크포인트 수준이며, 딜 자문을 대체하지 않습니다.",
    },
    {
      question: "1인 창업만 대상인가요?",
      answer: "1인·공동창업 모두 모듈을 조정할 수 있습니다.",
    },
    {
      question: "관련 등기 서비스 안내도 하나요?",
      answer: "교육과 분리해, 필요 시 법인설립·법인등기 안내 페이지를 연결합니다.",
    },
    {
      question: "온라인으로도 가능한가요?",
      answer: "기관 환경에 따라 협의합니다.",
    },
    {
      question: "강의료는?",
      answer: "시간·형식에 따라 협의하며 단가를 단정하지 않습니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/기업법률교육", label: "기업 법률교육" },
    { href: "/법률강의", label: "강의 허브" },
    { href: "/부산법률강사", label: "부산 강사 초빙" },
    { href: "/강의문의", label: "문의" },
  ],
  relatedServiceLinks: [
    { href: "/부산기업법률자문", label: "기업 법률실무 지원" },
    { href: "/부산법인설립등기", label: "법인설립등기" },
    { href: "/부산임원변경등기", label: "임원변경등기" },
  ],
  historyIds: ["lh-busan-changjo-collab"],
  ctaTitle: "창업 법률특강을 문의하세요",
  ctaText: "프로그램명·대상·시간만 남겨 주세요.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: [
    "부산 창업교육 강사",
    "부산 예비창업자 강사",
    "부산 창업 특강",
    "부산 스타트업 강사",
  ],
  secondaryKeywords: ["부산 창업 법률교육", "법인설립 특강", "청년창업 교육"],
};

const enterprise: LecturePageContent = {
  slug: "기업법률교육",
  kind: "topic",
  title: "부산 기업 특강",
  metaTitle: "부산 기업 특강 | 계약·채권·법인 실무 법률교육 - 안윤정 법무사",
  metaDescription:
    "부산 기업 법률특강. 계약 체결 전 확인, 미수금·증거관리, 법인등기 기한을 임직원 사례 중심으로 구성합니다. 리더십·마케팅 강의가 아니며 법정 지정교육은 포함하지 않습니다.",
  h1: "부산 기업 법률특강, 임직원이 놓치기 쉬운 실무부터",
  eyebrow: "부산 기업 특강 · 계약·채권·법인 실무",
  heroIntro:
    "계약·미수금·증거관리·법인 실무를 임직원이 실제 업무에서 놓치기 쉬운 사례 중심으로 정리합니다. 안윤정 법무사가 법무사 실무와 확인된 기업·창업 협업을 바탕으로 구성합니다.",
  heroParagraphs: [
    "기업 담당자가 찾는 것은 슬로건이 아니라, 직원이 계약서에 서명하기 전·미수금이 생겼을 때·등기 기한을 놓쳤을 때 무엇을 확인하면 되는가입니다.",
    "명례일반산업단지 기업 법률지원 MOU 등 확인된 협업을 참고하되, 기업교육 1위나 법정의무교육을 대체한다고 안내하지 않습니다.",
  ],
  bodySections: [
    {
      title: "계약서를 체결하기 전에 직원이 무엇을 확인해야 하나요?",
      paragraphs: [
        "상대방 표시, 대금·납기, 해제·해지, 도장·서명 권한이 맞는지부터 봅니다. 강의에서는 체크리스트로 나눠, 영업·총무가 각각 어디를 보면 되는지 설명합니다.",
      ],
    },
    {
      title: "거래처 미수금이 발생했을 때 어떤 자료부터 남겨야 하나요?",
      paragraphs: [
        "계약서·세금계산서·납품·입금 내역과 카카오톡·이메일처럼 주고받은 기록을 시간 순으로 모으는 것이 출발점입니다. 내용증명·지급명령은 사실관계에 따라 달라지므로 강의에서는 절차 개요와 준비 자료만 안내합니다.",
      ],
    },
    {
      title: "카카오톡·이메일·녹취는 어떻게 업무 증거가 되나요?",
      paragraphs: [
        "대화가 남아 있어도 당사자·일시·원본 보존이 흐리면 나중에 쓰기 어렵습니다. 업무 메신저를 개인 휴대폰에만 두지 않는 습관, 요약 메일로 남기는 습관을 사례로 설명합니다.",
      ],
    },
    {
      title: "대표·임원·총무 담당자가 법인등기 기한을 놓치면 어떻게 되나요?",
      paragraphs: [
        "임원 변경·본점 이전 등기는 결의 후 기한이 있습니다. 과태료 가능성을 과장하지 않고, 어떤 일정을 달력에 올려야 하는지만 실무 순서로 안내합니다.",
      ],
    },
    {
      title: "신규 직원에게 회사 생활에서 필요한 기본 법률지식을 교육하고 싶습니다",
      paragraphs: [
        "계약 서명, SNS·개인정보, 거래처 자료 반출처럼 입사 초기에 실수가 나기 쉬운 지점을 60분 모듈로 줄일 수 있습니다. 법정 개인정보 교육을 대체하지는 않습니다.",
      ],
    },
    {
      title: "창업자가 계약과 법인 운영에서 자주 놓치는 부분은 무엇인가요?",
      paragraphs: [
        "동업 조건, 법인 인감 관리, 임원 임기처럼 설립 직후 빈번한 공백을 다룹니다. 예비창업 중심이면 창업 법률교육 안내를 함께 보시면 됩니다.",
      ],
    },
  ],
  summaryItems: [
    { label: "대상", value: "대표 · 임원 · 총무 · 영업 · 신입" },
    { label: "형식", value: "60·90·120분 특강 · 워크숍(협의)" },
    { label: "자격", value: "법무사 국가자격 · 확인된 기업 협업" },
    { label: "제외", value: "청렴·성희롱예방 등 법정 지정교육" },
  ],
  topicCards: [
    { title: "계약 체크리스트", description: "체결 전 확인" },
    { title: "미수금·채권", description: "자료 정리·내용증명 기초" },
    { title: "증거관리", description: "메일·메신저·녹취" },
    { title: "법인등기 기한", description: "임원·본점 변경" },
    { title: "신입 모듈", description: "60분 생활·계약 기초" },
    { title: "창업팀", description: "설립 이후 계약·등기", href: "/창업법률교육" },
  ],
  audienceCards: [
    { title: "대표·임원", description: "계약 · 법인 · 채권" },
    { title: "총무·경영지원", description: "등기 기한 · 문서 · 권한" },
    { title: "영업팀", description: "계약 · 미수금 · 증거" },
    { title: "신입직원", description: "계약 · SNS · 개인정보 · 생활법률" },
    { title: "예비창업자", description: "법인 · 동업 · 계약" },
    { title: "산업단지·협회", description: "단체 특강 협의" },
  ],
  institutionCards: [
    {
      title: "기업·협회",
      topics: ["계약", "채권", "법인 실무", "신입 온보딩"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: [
    {
      label: "60분 — 기업에서 꼭 알아야 할 계약·증거관리",
      outline: ["도입", "계약 체크 포인트", "업무 증거 남기는 법", "질의응답"],
    },
    {
      label: "90분 — 계약부터 미수금까지",
      outline: [
        "계약 체결 전 확인",
        "미수금 발생 시 자료",
        "내용증명 개요",
        "질의응답",
      ],
    },
    {
      label: "120분 — 임직원 계약·채권·법인 실무",
      outline: [
        "계약·증거",
        "미수금 대응 순서",
        "임원·본점 등기 기한",
        "직급별 질의응답",
      ],
    },
    {
      label: "창업팀 — 설립 이후 대표가 확인할 것",
      outline: ["법인 운영 기초", "계약·인감", "등기 기한", "채권 관리 입문"],
    },
  ],
  modules: [
    "계약 체결 전 체크리스트",
    "미수금 발생 시 남길 자료",
    "카카오톡·이메일 증거 관리",
    "내용증명과 지급명령 개요",
    "임원변경·본점이전 등기 기한",
    "회사 인감과 권한",
    "신입 직원 생활법률 기초",
    "거래처 분쟁 초기 대응",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["임직원 체크리스트", "기한 안내 요약"],
  faqs: [
    {
      question: "기업 특강은 몇 분이 적당한가요?",
      answer:
        "핵심만이면 60분, 미수금까지 보면 90분, 법인 기한까지 넣으면 120분을 많이 요청합니다. 인원·직급이 섞이면 시간을 늘리기보다 공통 안내와 질답으로 나눕니다.",
    },
    {
      question: "직원 직급에 따라 내용을 바꿀 수 있나요?",
      answer:
        "가능합니다. 신입은 계약·생활 기초, 영업은 미수금·증거, 총무·대표는 등기 기한 비중을 높입니다.",
    },
    {
      question: "계약·채권·법인 주제를 함께 구성할 수 있나요?",
      answer:
        "120분 구성에서 모듈을 나눠 담을 수 있습니다. 한 시간에 모든 주제를 깊게 다루지는 않습니다.",
    },
    {
      question: "법정의무교육인가요?",
      answer:
        "아닙니다. 청렴·성희롱예방·개인정보 법정교육을 대체하지 않는 실무 예방 특강입니다.",
    },
    {
      question: "온라인 교육도 가능한가요?",
      answer: "기관 화상 환경에 따라 협의합니다.",
    },
    {
      question: "강의료는 얼마인가요?",
      answer:
        "시간·인원·이동·자료 범위에 따라 기관 기준과 협의합니다. 고정 단가를 단정하지 않습니다.",
    },
    {
      question: "변호사가 아닌 법무사 강의의 범위는?",
      answer:
        "등기·계약 서류·채권 회수 준비 자료 등 법무사 실무와 연결된 예방 교육을 중심으로 합니다. 소송 대리는 하지 않습니다.",
    },
    {
      question: "산업단지 단체 교육이 가능한가요?",
      answer: "일정·인원에 따라 협의 가능합니다. 확인된 협력 사례는 명례일반산업단지 법률지원 MOU가 있습니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/부산법률전문가", label: "안윤정 법무사 활동 한눈에 보기" },
    { href: "/창업법률교육", label: "창업 법률교육" },
    { href: "/공공기관법률교육", label: "공공기관 법률교육" },
    { href: "/부산기관법률특강", label: "기관 법률특강" },
    { href: "/부산법률강사", label: "부산 강사 초빙" },
    { href: "/강사소개", label: "강사 프로필" },
    { href: "/강의문의", label: "기업 특강 문의" },
  ],
  relatedServiceLinks: [
    { href: "/부산기업법률자문", label: "개별 기업 등기·서류 업무 문의" },
    { href: "/부산법인등기", label: "법인등기" },
    { href: "/부산임원변경등기", label: "임원변경등기" },
  ],
  historyIds: ["lh-busan-changjo-collab"],
  ctaTitle: "기업 특강을 문의하세요",
  ctaText: "기업명·교육 대상·희망 주제와 일정만 알려주시면 됩니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: [
    "부산 기업 특강",
    "부산 기업 법률특강",
    "부산 기업교육 강사",
  ],
  secondaryKeywords: [
    "부산 직원교육",
    "부산 사내특강",
    "부산 임직원 법률교육",
  ],
};


const speaker: LecturePageContent = {
  slug: "강사소개",
  kind: "speaker",
  title: "안윤정 법무사 강사 소개",
  metaTitle: "안윤정 법무사 강사 소개 | 법률특강 프로필",
  metaDescription:
    "안윤정 법무사 강사 소개. 현직 법무사 실무, 확인된 기관 출강, 대상별 커리큘럼 구성. 생활법률·전세사기·청년·창업 교육.",
  h1: "안윤정 법무사 강사 소개",
  eyebrow: "확인된 출강 · 기관용 강사 프로필",
  heroIntro:
    "현직 법무사로서 법률 실무와 교육 경험을 바탕으로, 공공기관·도서관·청년기관·학교 대상 생활법률 특강을 구성합니다. 확인된 출강 이력만 공개합니다.",
  heroParagraphs: [
    "강의와 직접 연결되는 강점은 현직 법무사 실무, 교육·강의 경험, 실제 기관 출강, 공공활동, 대상별 커리큘럼 구성입니다. 사건 상담용 경력 전체를 나열하지 않습니다.",
    "시민도서관 생활법률 연속 특강, 자립지원전담기관 전세사기 예방, 청년기관 주거·창업 교육, 고등학교 진로특강처럼 기관명과 주제가 확인된 이력만 안내합니다.",
  ],
  summaryItems: [
    { label: "자격", value: "법무사 · 공인중개사 · 신용관리사 · 직업상담사" },
    { label: "교육", value: "교육대학원 석사 · 교사 자격 · 행정대학원 재학" },
    { label: "수상", value: "대한법무사협회장 표창 (2026.05)" },
    { label: "출강", value: "도서관 · 청년 · 학교 · 공공 · 기업 · 무료상담" },
  ],
  topicCards: hub.topicCards,
  audienceCards: [],
  institutionCards: [],
  formats: [],
  durationOptions: [],
  modules: [],
  processSteps: [],
  preparationChecklist: [],
  materialExamples: [],
  faqs: [
    {
      question: "법무사 소개 페이지와 무엇이 다른가요?",
      answer:
        "법무사 소개는 사무소·사건 상담용이고, 이 페이지는 기관이 출강 강사를 검토하기 위한 안내입니다.",
    },
    {
      question: "프로필을 인쇄할 수 있나요?",
      answer: "아래 자격·경력 영역의 인쇄하기를 사용하시면 됩니다.",
    },
    {
      question: "강의 가능 주제는?",
      answer: "전세사기 예방, 청년 생활법률, 디지털 기초, 창업·기업 실무, 진로 등입니다.",
    },
    {
      question: "출강 지역은?",
      answer: "부산 중심이며, 인근·온라인은 협의합니다.",
    },
    {
      question: "사건 상담도 여기로 하나요?",
      answer:
        "강의는 이 페이지·강의 문의로, 사건 상담은 상담 신청 페이지를 이용해 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/부산법률전문가", label: "자격·강의·공공활동 전체 보기" },
    { href: "/부산법률강사", label: "부산 강사 초빙" },
    { href: "/법률강의", label: "법률 강의 허브" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "법무사 소개" },
    { href: "/media", label: "언론·활동" },
  ],
  historyIds: hub.historyIds,
  ctaTitle: "강의 가능 일정을 문의하세요",
  ctaText:
    "연락처·교육 대상·희망 주제만 남겨 주시면 가능 여부와 구성안을 안내합니다.",
  disclaimer: commonDisclaimer,
  showPrintProfile: true,
  showInquiryForm: true,
  primaryKeywords: ["법률 강사 프로필", "안윤정 법무사 강사"],
  secondaryKeywords: ["부산 강사 프로필", "부산 강사 소개서"],
};

const inquiry: LecturePageContent = {
  slug: "강의문의",
  kind: "inquiry",
  title: "부산 강의 문의",
  metaTitle: "부산 강의 문의 | 특강·출강 안내",
  metaDescription:
    "부산 강의·특강·출강 문의. 공공기관·기업·도서관·청년기관·학교 담당자용. 생활법률·전세사기·창업 특강을 대상과 시간에 맞춰 구성합니다.",
  h1: "부산 강의·특강 문의",
  eyebrow: "출강·특강 문의",
  heroIntro:
    "공공기관·기업·도서관·청년기관·학교에서 생활법률·전세사기·창업법률 특강이 필요할 때, 안윤정 법무사가 대상과 시간에 맞춰 구성합니다.",
  heroParagraphs: [],
  summaryItems: [
    { label: "필수", value: "연락처 · 교육 대상 · 희망 주제" },
    { label: "선택", value: "기관명 · 일정 · 인원 · 강의계획서 요청" },
    { label: "다음 단계", value: "메일 확인 후 가능 여부 회신" },
  ],
  topicCards: hub.topicCards,
  audienceCards: [],
  institutionCards: [],
  formats: [],
  durationOptions: [],
  modules: [],
  processSteps: [],
  preparationChecklist: preparationDefault.slice(0, 5),
  materialExamples: [],
  faqs: [
    {
      question: "어떤 주제가 가능한가요?",
      answer:
        "생활법률, 전세사기 예방, 청년 주거·계약, 창업·기업 실무 기초, 디지털 생활법률, 법무사 진로특강입니다. 마케팅·리더십·AI·법정 지정교육은 다루지 않습니다.",
    },
    {
      question: "어떤 대상에게 강의하나요?",
      answer:
        "시민, 청년, 학생, 임직원, 기관 종사자, 예비창업자처럼 기관이 모은 청중을 기준으로 사례와 시간을 맞춥니다.",
    },
    {
      question: "부산 어디까지 출강하나요?",
      answer:
        "부산 전역 출강을 우선합니다. 창원·양산 등 인근은 확인된 이력이 있는 범위에서 협의하고, 먼 거리는 온라인을 검토합니다.",
    },
    {
      question: "1시간 특강도 가능한가요?",
      answer: "60분 핵심형으로 구성할 수 있습니다. 핵심 주제 하나와 질의응답 위주입니다.",
    },
    {
      question: "2~4시간 교육도 가능한가요?",
      answer:
        "가능합니다. 사례·체크리스트 비중을 늘린 참여형으로 맞출 수 있습니다. 게임형 퍼실리테이션은 제공하지 않습니다.",
    },
    {
      question: "여러 회차 과정도 가능한가요?",
      answer:
        "시민도서관처럼 주차별 연속 과정 이력이 있습니다. 회차·주제는 기관 일정에 맞춰 협의합니다.",
    },
    {
      question: "강의계획서와 강사 프로필을 받을 수 있나요?",
      answer:
        "가능합니다. 문의에 요청해 주시면 개요와 프로필을 드립니다. 기관 양식 작성도 협의합니다.",
    },
    {
      question: "강의료는 어떻게 결정하나요?",
      answer:
        "강의시간, 교육대상, 인원, 지역, 준비 범위, 회차에 따라 달라집니다. 고정 단가를 만들지 않으며, 기관 내부 강사료 기준이 있으면 맞춰 검토합니다.",
    },
    {
      question: "필요한 장비는 무엇인가요?",
      answer:
        "통상 빔프로젝터·스크린·마이크면 충분합니다. 기관 장비 환경에 맞춰 자료 형식(PPT 등)을 협의합니다.",
    },
    {
      question: "온라인 강의와 사진 촬영은 가능한가요?",
      answer:
        "온라인은 기관 화상 환경에 따라 협의합니다. 현장 사진은 기관 규정과 참석자 동의를 전제로 하며, 초상권이 걸린 자료는 공개하지 않습니다.",
    },
    {
      question: "세금계산서나 기관 행정 서류는요?",
      answer:
        "사업자 기준 세금계산서 등 행정 서류는 기관 요청에 맞춰 안내합니다. 구체적인 서식은 문의 시 확인합니다.",
    },
    {
      question: "이 폼은 사건 상담인가요?",
      answer:
        "강의·출강 문의용입니다. 개인 사건 상담은 상담 신청 페이지를 이용해 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/법률강의", label: "강의·특강 안내" },
    { href: "/부산법률강사", label: "강사 섭외 기준" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/강사소개", label: "강사 소개" },
    { href: "/전세사기예방교육", label: "전세사기 예방교육" },
  ],
  relatedServiceLinks: [{ href: "/contact", label: "사건 상담(별도)" }],
  historyIds: hub.historyIds,
  ctaTitle: "강의 가능 일정을 남겨 주세요",
  ctaText:
    "연락처·교육 대상·희망 주제만 필수입니다. 민감정보(주민등록번호·사건 상세)는 적지 마세요.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showRecommendTool: false,
  primaryKeywords: ["부산 강의 문의"],
  secondaryKeywords: [
    "부산 특강 문의",
    "부산 강연 문의",
    "부산 출강 문의",
    "강의 제안 문의",
  ],
};

const digital: LecturePageContent = {
  slug: "디지털법률교육",
  kind: "topic",
  title: "부산 디지털 법률교육",
  metaTitle: "부산 디지털 법률교육｜개인정보·명예훼손·온라인 범죄 예방특강",
  metaDescription:
    "부산 디지털 법률교육. SNS·개인정보·온라인 사기 예방을 생활법률 관점으로 안내합니다. 공식 예방교육 대체 아님.",
  h1: "부산 디지털 법률교육｜온라인 활동에서 꼭 알아야 할 법률 기준",
  eyebrow: "디지털·온라인 예방",
  heroIntro:
    "게시글·채팅·거래·AI 사용에서 생길 수 있는 법적 리스크를 예방 관점으로 안내합니다.",
  heroParagraphs: [
    "청년 대상 ‘온라인 세상에서 살아남기’ 특강 등 관련 이력의 연장선에서 구성합니다.",
    "디지털 성범죄 전문자격 교육이나 수사기관 공식 교육을 대체하지 않습니다. 기준은 시점에 따라 달라질 수 있습니다.",
  ],
  bodySections: [
    {
      title: "온라인에서 바로 쓰는 예방 포인트",
      paragraphs: [
        "게시글·댓글·단톡에서 명예훼손·모욕이 문제 되는 상황, 개인정보를 함부로 넘기는 경우, 중고거래·피싱형 사기의 흔한 패턴을 생활 사례로 설명합니다. 증거로 남을 수 있는 캡처·대화 기록의 의미만 기초로 안내합니다.",
        "청년 대상 ‘온라인 세상에서 살아남기’ 특강 이력이 있습니다. 학교·기업 임직원 SNS 수칙 교육 요청이 오면 대상 연령과 플랫폼(커뮤니티, 메신저, 숏폼)에 맞춰 사례를 바꿉니다.",
      ],
    },
    {
      title: "이 강의가 아닌 것",
      paragraphs: [
        "디지털 성범죄 전문 자격과정, 수사기관 공식 예방교육, 플랫폼 운영 정책 컨설팅은 범위에 넣지 않습니다. 법률 기준은 시점과 사안에 따라 달라질 수 있어, 개별 사건은 별도 상담을 안내합니다.",
      ],
    },
  ],
  summaryItems: [
    { label: "범위", value: "명예훼손·모욕, 개인정보, 사기, 증거보존 기초" },
    { label: "제외", value: "전문 수사·법정 지정교육 대체" },
  ],
  topicCards: [
    { title: "SNS·게시글", description: "표현과 책임" },
    { title: "개인정보", description: "수집·공유 주의" },
    { title: "온라인 사기", description: "중고·피싱 예방" },
  ],
  audienceCards: [
    { title: "청년·학생", description: "디지털 시민 기초" },
    { title: "직장인·교직원", description: "SNS·메신저" },
  ],
  institutionCards: [
    { title: "학교·기업·청년", topics: ["온라인 예방", "개인정보"] },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "온라인 글과 법적 책임",
    "명예훼손·모욕 기본구조",
    "개인정보 수집·공유 주의",
    "단체채팅방·캡처 공유",
    "중고거래·계정거래 사기",
    "피싱·스미싱·메신저 사칭",
    "불법촬영물·유포물 대응 기초",
    "생성형 AI와 개인정보",
    "AI 이미지·글과 저작권 기초",
    "피해 시 증거 보존",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["온라인 행동 체크리스트"],
  faqs: [
    {
      question: "경찰·공공 공식 예방교육을 대체하나요?",
      answer: "아니요. 생활법률 예방 안내입니다.",
    },
    {
      question: "딥페이크·AI까지 다루나요?",
      answer: "기초 주의점 수준으로 다룰 수 있으며, 기술·법령 변화는 시점 기준으로 설명합니다.",
    },
    {
      question: "청소년용으로 톤을 조절하나요?",
      answer: "연령에 맞게 사례와 표현을 조정합니다.",
    },
    {
      question: "개인정보 법정교육을 대체하나요?",
      answer: "대체하지 않습니다.",
    },
    {
      question: "관련 이력은?",
      answer: "청년 디지털 법률 가이드 특강 기록(사진 아카이브)이 있습니다.",
    },
    {
      question: "질의응답에 개별 사건 상담이 들어가나요?",
      answer: "일반론으로 답하고 개별 사안은 별도 상담을 안내합니다.",
    },
    {
      question: "자료 업데이트는?",
      answer: "사전 협의 시점에 맞춰 사례·포인트를 조정합니다.",
    },
    {
      question: "문의?",
      answer: "강의 문의 페이지를 이용해 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/청년생활법률특강", label: "청년 생활법률" },
    { href: "/학교법률교육", label: "학교 법률교육" },
    { href: "/법률강의", label: "강의·특강 안내" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/부산법률강사", label: "강사 섭외 기준" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [],
  historyIds: ["youth-digital-law-guide"],
  ctaTitle: "디지털 법률교육을 문의하세요",
  ctaText: "대상 연령과 강조 주제만 알려주시면 됩니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: ["부산 디지털 법률교육", "개인정보보호 특강", "사이버 명예훼손 교육"],
};

const school: LecturePageContent = {
  slug: "학교법률교육",
  kind: "topic",
  title: "부산 학교·대학 법률교육",
  metaTitle: "부산 학교·대학 법률교육｜청소년·대학생 생활법률 특강",
  metaDescription:
    "부산 학교·대학 법률교육. 학생 눈높이 생활법률·진로특강. 양산제일고 진로특강 등 이력 기반.",
  h1: "부산 학교·대학 법률교육｜학생 눈높이에 맞춘 사례 중심 특강",
  eyebrow: "초·중·고·대학·학부모·교직원",
  heroIntro: "연령에 맞는 사례로 생활법률과 진로 이야기를 전달합니다.",
  heroParagraphs: [
    "양산제일고 법무사 진로특강 등 학교 출강 이력이 있으며, 부산·인근 학교 일정은 협의합니다.",
  ],
  bodySections: [
    {
      title: "학교에서 생활법률 특강을 넣는 이유",
      paragraphs: [
        "학생은 계약·온라인 게시·금전 거래를 처음 만나는 시점에 있습니다. 이 특강은 분쟁을 키우기 전에 확인할 순서를 학년 눈높이로 설명합니다. 학교폭력 전문상담이나 수사 절차를 대체하지 않습니다.",
        "확인된 학교 출강은 양산제일고등학교 법무사 진로특강입니다. 부산 학교 일정은 학년·시수·장소(강당·교실)에 맞춰 협의합니다. 확인되지 않은 학교명을 나열하지 않습니다.",
      ],
    },
    {
      title: "학년·시간에 따라 달라지는 구성",
      paragraphs: [
        "중·고는 온라인 게시, 돈 빌리기, 진로 이야기의 비중을 높입니다. 대학·학부모 대상이면 주거 계약·보증금·아르바이트 계약처럼 바로 쓰는 확인을 넣습니다.",
        "법무사 진로만 필요한 시간은 진로특강 구성으로 단독 진행할 수 있습니다. 생활법률과 진로를 한 시간에 섞을지는 담당자와 사전 조율합니다.",
      ],
    },
  ],
  summaryItems: [
    { label: "모듈", value: "생활법률 · 온라인 · 주거(대학) · 진로" },
    { label: "확인된 이력", value: "양산제일고 법무사 진로특강" },
    { label: "시간", value: "50분 수업시수 · 60~90분 특강" },
  ],
  topicCards: [
    { title: "법무사 진로특강", description: "직업·시험·일", href: "/법무사진로특강" },
    { title: "디지털 예방", description: "사이버폭력 기초", href: "/디지털법률교육" },
  ],
  audienceCards: [
    { title: "중·고등학생", description: "기초·진로" },
    { title: "대학생", description: "계약·주거" },
    { title: "학부모·교직원", description: "생활법률 기초" },
  ],
  institutionCards: [
    { title: "초중고·대학", topics: ["생활법률", "진로", "온라인"] },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "생활 속 법률 기초",
    "온라인·학교폭력 예방 기초",
    "계약·금전(고·대학)",
    "주거·전세(대학)",
    "법무사·법률전문직 진로",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["연령대별 사례 목록"],
  faqs: [
    {
      question: "진로특강만 가능한가요?",
      answer: "법무사 진로특강 구성으로 단독 진행할 수 있습니다.",
    },
    {
      question: "초등도 가능한가요?",
      answer: "연령 적합 사례로 조정 가능 여부를 사전 협의합니다.",
    },
    {
      question: "학교폭력 전문상담을 대체하나요?",
      answer: "아니요. 예방·기초 안내 수준입니다.",
    },
    {
      question: "학부모 대상도?",
      answer: "가능하며 주제를 맞춥니다.",
    },
    {
      question: "부산 외 학교도?",
      answer: "양산 등 인근은 일정 협의, 원거리는 온라인을 검토합니다.",
    },
    {
      question: "교양특강 형식은?",
      answer: "대학 교양·특강 슬롯에 맞춰 시간을 조정합니다.",
    },
    {
      question: "자료 배포는?",
      answer: "학교 정책에 맞게 협의합니다.",
    },
    {
      question: "문의",
      answer: "강의 문의 페이지를 이용해 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/법무사진로특강", label: "진로특강" },
    { href: "/디지털법률교육", label: "디지털 법률교육" },
    { href: "/법률강의", label: "강의·특강 안내" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/부산법률강사", label: "강사 섭외 기준" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [{ href: "/about", label: "강사(법무사) 소개" }],
  historyIds: ["yangsan-high-school-career-talk"],
  ctaTitle: "학교·대학 특강을 문의하세요",
  ctaText: "학년·인원·희망 주제만 남겨 주세요.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: ["부산 학교 법률교육", "청소년 법률교육", "대학생 법률교육"],
};

const publicEdu: LecturePageContent = {
  slug: "공공기관법률교육",
  kind: "topic",
  title: "부산 공공기관 강사",
  metaTitle: "부산 공공기관 강사｜직원·상담사·시민 대상 사례 중심 실무교육",
  metaDescription:
    "부산 공공기관·공기업·지자체 외부강사 안내. 직원교육과 시민교육을 구분해 생활분쟁·계약·증거·상속 초기 안내를 사례 중심으로 구성합니다. 법정 지정교육은 포함하지 않습니다.",
  h1: "부산 공공기관 강사｜직원·상담사·시민을 위한 실무교육",
  eyebrow: "공공기관 · 기관교육 · 외부강사",
  heroIntro:
    "공공기관 담당자가 외부강사를 찾을 때 먼저 확인하는 것은 직원교육인지 시민교육인지, 그리고 법정 지정교육과 겹치지 않는지입니다. 본 안내는 생활·실무 예방교육 범위로, 청렴·이해충돌·청탁금지 등 별도 지정교육은 다루지 않습니다.",
  heroParagraphs: [
    "직원교육에서는 계약·채권·개인정보·생활분쟁처럼 업무와 연결되는 기초를, 시민·이용자 대상 프로그램에서는 주거·금전·가족재산처럼 바로 적용할 수 있는 확인 순서를 중심으로 구성합니다. 상담·지원 업무 종사자에게는 법률판단을 대신하지 않으면서 초기 안내와 전문기관을 구분하는 기준을 함께 정리합니다.",
    "LH·부산창조경제혁신센터 협업 프로그램 등 확인된 공공 협업 경험을 참고하되, 법정의무교육으로 표시하지 않습니다. 대상·시간에 따라 난이도를 조정하며, 프로필·강의계획서·견적에 필요한 정보는 문의 시 요청해 주세요.",
  ],
  summaryItems: [
    { label: "가능", value: "생활법률·계약·채권·디지털·전세사기(직원)" },
    { label: "불가 안내", value: "청렴·성희롱예방 등 자격 지정교육" },
  ],
  topicCards: [
    { title: "생활법률", description: "직원 대상" },
    { title: "계약·채권", description: "실무 기초" },
    { title: "디지털", description: "온라인 예방", href: "/디지털법률교육" },
  ],
  audienceCards: [
    { title: "신규 직원", description: "온보딩" },
    { title: "실무 담당", description: "계약·정보" },
  ],
  institutionCards: [
    {
      title: "공사·공단·지자체",
      topics: ["생활법률", "계약", "디지털"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "공공 실무와 연결되는 생활법률",
    "계약·채권 기초",
    "개인정보·온라인",
    "직원 대상 전세사기 예방(선택)",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["기관용 개요서"],
  faqs: [
    {
      question: "청렴교육 강사인가요?",
      answer: "아니요. 해당 법정·지정교육은 제공 범위에 넣지 않습니다.",
    },
    {
      question: "외부강사 섭외 절차에 필요한 서류는?",
      answer: "프로필·개요를 요청하시면 확인된 내용으로 제공합니다.",
    },
    {
      question: "공기업만 가능한가요?",
      answer: "지자체·출자출연·공사·공단 등 협의 가능합니다.",
    },
    {
      question: "등기업무 교육과 겹치나요?",
      answer:
        "공공 등기 실무는 /공공기관등기업무 안내와 별개이며, 본 페이지는 임직원 교육입니다.",
    },
    {
      question: "효과 보장?",
      answer: "보장하지 않습니다.",
    },
    {
      question: "온라인?",
      answer: "협의 가능합니다.",
    },
    {
      question: "부산만?",
      answer: "부산 중심, 인근·온라인 협의.",
    },
    {
      question: "문의",
      answer: "강의 문의 페이지를 이용해 주세요.",
    },
    {
      question: "공무원·직원 생활법률 교육도 가능한가요?",
      answer:
        "직원·공무원 대상 생활법률·계약·채권 기초 특강은 협의할 수 있습니다. 청렴·이해충돌·성희롱예방 등 법정·지정교육은 제공하지 않습니다.",
    },
    {
      question: "몇 시간 구성이 가능한가요?",
      answer:
        "1~2시간 특강부터 반나절 구성까지 대상·주제에 맞춰 조정합니다. 인원·온라인 여부·제외할 법정교육만 알려 주시면 개요를 안내합니다.",
    },
    {
      question: "전세사기 예방교육은 직원 대상인가요?",
      answer:
        "공공기관 직원 대상 전세사기 예방 모듈을 선택할 수 있습니다. 시민·청년 대상은 전세사기 예방교육·청년 생활법률 특강 페이지에서 별도로 안내합니다.",
    },
    {
      question: "공공기관 워크숍·세미나에도 출강하나요?",
      answer:
        "직원교육·특강·워크숍(워크샵)·세미나 모두 같은 출강 문의로 협의합니다. 청렴 등 지정교육은 포함하지 않습니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/기업법률교육", label: "기업 법률교육" },
    { href: "/부산기관법률특강", label: "기관 법률특강" },
    { href: "/부산법률강사", label: "부산 강사 초빙" },
    { href: "/강의문의", label: "문의" },
  ],
  relatedServiceLinks: [
    { href: "/공공기관등기업무", label: "공공기관 등기업무" },
  ],
  historyIds: ["lh-busan-changjo-collab"],
  ctaTitle: "공공기관 교육 문의를 남겨 주세요",
  ctaText: "기관명·대상·제외할 법정교육 여부만 명확히 적어 주세요.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: [
    "부산 공공기관 강사",
    "부산 공공기관 특강",
    "부산 기관교육 강사",
    "부산 공공기관 직원교육",
  ],
  secondaryKeywords: [
    "부산 공공기관 법률교육",
    "공기업 법률교육",
    "지자체 법률특강",
  ],
};

const career: LecturePageContent = {
  slug: "법무사진로특강",
  kind: "topic",
  title: "법무사 진로특강",
  metaTitle: "부산 법무사 진로특강 | 학교·직업 특강",
  metaDescription:
    "법무사 진로특강. 업무·시험·현장을 학교·청년 눈높이로 전달합니다. 양산제일고 특강 이력이 있습니다.",
  h1: "법무사 진로특강, 일과 자격을 현장에서 이야기할 때",
  eyebrow: "진로·직업 특강",
  heroIntro:
    "법무사 시험 합격 경험과 실무·강의 경험을 바탕으로, 직업의 일과 준비 과정을 이야기합니다.",
  heroParagraphs: [
    "양산제일고등학교 진로특강 이력이 있습니다. 합격 신화·성공 보장을 말하지 않고, 현실적인 일과 준비를 설명합니다.",
  ],
  bodySections: [
    {
      title: "법무사 진로특강에서 실제로 다루는 것",
      paragraphs: [
        "법무사가 하루 일과에서 다루는 등기·서류·상담이 무엇인지를 학생 언어로 풀어 줍니다. 시험 과목 나열보다, 현장에서 어떤 질문을 받는지, 변호사·세무사와 일이 어떻게 다른지를 구분합니다.",
        "양산제일고에서 진행한 진로특강을 기준으로, 50분 수업시수와 60~90분 특강 슬롯에 맞춰 일과 소개·자격 이야기·질의응답 비중을 조절합니다. 합격을 보장하거나 학원 홍보로 쓰지 않습니다.",
      ],
    },
    {
      title: "생활법률 특강과 나누는 기준",
      paragraphs: [
        "진로만 필요하면 이 페이지 구성으로 단독 진행합니다. 계약·주거·온라인을 함께 다루려면 학교 법률교육 페이지의 생활법률 모듈과 시간을 나눕니다.",
        "교사가 미리 받고 싶은 소개 자료는 강사 소개 인쇄용 요약과 강의 이력의 해당 출강 기록을 함께 보시면 됩니다.",
      ],
    },
  ],
  summaryItems: [
    { label: "자격 기반", value: "법무사·공인중개사·신용관리사·교육 경력" },
  ],
  topicCards: [
    { title: "법무사 하는 일", description: "등기·서류·상담" },
    { title: "시험·준비", description: "경험 이야기" },
    { title: "관련 자격", description: "중개·신용관리" },
  ],
  audienceCards: [
    { title: "고등학생", description: "진로" },
    { title: "대학생", description: "커리어" },
  ],
  institutionCards: [
    { title: "학교·진로교육", topics: ["법무사 진로", "법률전문직"] },
  ],
  formats: lectureFormatsDefault.filter((f) => f.title === "특강"),
  durationOptions: durationOptionsDefault.slice(0, 3),
  modules: [
    "법무사가 하는 일",
    "등기·서류 업무의 예",
    "시험·준비 경험",
    "관련 자격과 시너지",
    "질의응답",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["진로 한 장 요약"],
  faqs: [
    {
      question: "합격 노하우만 강의하나요?",
      answer: "일과 현장 중심으로 이야기하며, 합격을 보장하지 않습니다.",
    },
    {
      question: "중·고등 모두 가능한가요?",
      answer: "학년 눈높이에 맞게 조절합니다.",
    },
    {
      question: "생활법률과 합반 가능한가요?",
      answer: "시간 배분에 따라 모듈을 결합할 수 있습니다.",
    },
    {
      question: "양산·부산 외 지역은?",
      answer: "일정 협의, 원거리는 온라인 검토.",
    },
    {
      question: "강사 소개 자료는?",
      answer: "강사 소개 페이지를 활용해 주세요.",
    },
    {
      question: "이벤트성 특강 의뢰도?",
      answer: "교육 목적과 시간이 맞으면 협의합니다.",
    },
    {
      question: "비용은?",
      answer: "협의합니다.",
    },
    {
      question: "문의",
      answer: "강의 문의 페이지를 이용해 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/학교법률교육", label: "학교 법률교육" },
    { href: "/법률강의", label: "강의·특강 안내" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/강사소개", label: "강사 소개" },
    { href: "/부산법률강사", label: "강사 섭외 기준" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [{ href: "/about", label: "법무사 소개" }],
  historyIds: ["yangsan-high-school-career-talk"],
  ctaTitle: "진로특강 일정을 문의하세요",
  ctaText: "학교명·학년·시간만 남겨 주세요.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: ["부산 법무사 진로특강"],
  secondaryKeywords: ["법무사 직업 특강", "법무사 진로 강사"],
};

export const lecturePages: LecturePageContent[] = [
  expertHubPage,
  hub,
  hiring,
  jeonse,
  youth,
  startup,
  enterprise,
  speaker,
  inquiry,
  digital,
  school,
  publicEdu,
  career,
  ...institutionExpansionPages,
  ...speakerExpansionPages,
];


const bySlug = new Map(
  lecturePages.map((page) => [page.slug, page] as const),
);

export function getLectureContent(
  slug: string,
): LecturePageContent | undefined {
  return bySlug.get(normalizeRouteSlug(slug));
}

export function getAllLectureSlugs(): string[] {
  return lecturePages.map((page) => page.slug);
}
