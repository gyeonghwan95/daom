import type { LecturePageContent } from "@/lib/lectures/types";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { institutionExpansionPages } from "@/lib/lectures/content-institution-expansion";
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
  metaTitle: "부산 법률 강의·특강｜기관·도서관·학교·기업 맞춤 법률교육",
  metaDescription:
    "부산 법률 강의·생활법률 특강. 도서관·기관·단체·학교·기업 맞춤 교육. 전세사기 예방, 청년·창업·디지털·진로 특강. 안윤정 법무사 출강.",
  h1: "부산 법률 강의·특강｜기관·도서관·학교·기업 맞춤 생활법률 교육",
  eyebrow: "기관·단체·학교·기업 교육담당자용",
  heroIntro:
    "도서관·청년기관·학교·공공·기업·협회 교육에 맞춘 생활법률·예방 특강입니다. 부산에서 법률 강의·특강을 기획할 때 주제와 이력을 한곳에서 확인하세요.",
  heroParagraphs: [
    "안윤정 법무사가 사례와 체크리스트 중심으로 설명합니다. 부산 중심, 인근·온라인은 협의합니다.",
    "법정 지정교육(청렴·성희롱예방·산업안전 등)은 안내 범위에 포함하지 않습니다.",
  ],
  summaryItems: [
    { label: "주요 주제", value: "전세사기 예방 · 청년 생활법률 · 디지털 · 창업·기업 · 진로" },
    { label: "형식", value: "특강 · 연속과정 · 워크숍 · 온라인(협의)" },
    { label: "지역", value: "부산 중심, 인근·온라인 협의" },
    { label: "문의 시", value: "주제 · 대상 · 인원 · 일정" },
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
      title: "도서관·평생학습관",
      topics: ["시민 생활법률", "연속과정", "야간·주말 특강"],
    },
    {
      title: "공공·복지·청년기관",
      topics: ["전세사기 예방", "청년 생활법률", "디지털"],
    },
    {
      title: "학교·대학",
      topics: ["생활법률", "법무사 진로특강"],
    },
    {
      title: "기업·협회·업체",
      topics: ["임직원 실무", "계약·채권", "창업"],
    },
  ],
  formats: [],
  durationOptions: [],
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
      question: "도서관·기관·업체 특강도 같은 페이지에서 보나요?",
      answer:
        "네. 이 허브에서 주제를 고르고, 도서관·기관·법무사 강의·기업·학교 등 세부 안내로 이동할 수 있습니다.",
    },
    {
      question: "온라인 강의도 가능한가요?",
      answer:
        "기관 화상 환경과 참여 방식에 따라 협의합니다.",
    },
  ],
  relatedLectureLinks: relatedAll.filter((l) => l.href !== "/법률강의"),
  relatedServiceLinks: [
    { href: "/about", label: "안윤정 법무사 소개" },
    { href: "/media", label: "언론·활동" },
    { href: "/임대차전세", label: "전세·임대차 안내" },
    { href: "/부산법인설립등기", label: "법인설립등기" },
  ],
  historyIds: [
    "citizen-library-life-law",
    "self-support-jeonse-prevention",
    "haeundae-youth-job-growth-cafe",
    "lh-busan-changjo-collab",
    "yangsan-high-school-career-talk",
  ],
  ctaTitle: "강의 가능 일정·맞춤 제안을 문의하세요",
  ctaText:
    "주제·대상·희망 일정만 남겨 주시면 가능 여부와 구성안을 안내드립니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showRecommendTool: true,
  primaryKeywords: [
    "부산 법률 강의",
    "부산 법률 특강",
    "부산법률강의",
    "법률 강사 섭외",
    "생활법률 특강",
    "기관 법률교육",
    "부산 법무사 강의",
  ],
};

const hiring: LecturePageContent = {
  slug: "부산법률강사",
  kind: "hiring",
  title: "부산 법률 강사 섭외",
  metaTitle: "부산 법률 강사 섭외｜기관·도서관·학교·기업 생활법률 특강",
  metaDescription:
    "부산 법률 강사 섭외·법무사 출강. 도서관·기관·학교·기업 생활법률 특강. 전세사기 예방·청년·창업 교육을 기관 목적에 맞춰 기획합니다.",
  h1: "부산 법률 강사 섭외｜대상과 목적에 맞춘 생활법률 특강",
  eyebrow: "기관 담당자 강사 검토",
  heroIntro:
    "교육 목적에 맞는지 바로 검토할 수 있도록, 확인된 이력·주제·프로필만 짧게 모았습니다. 부산에서 법률 강사·법무사 강의를 찾는 담당자용입니다.",
  heroParagraphs: [
    "공공·학교·청년기관·기업 교육담당자용입니다. 확인된 강의 이력만 제시합니다.",
  ],
  summaryItems: [
    { label: "적합 목표", value: "예방교육 · 실무 기초 · 진로 특강" },
    { label: "비대상", value: "법정 지정교육(청렴·성희롱예방 등)" },
    { label: "형식", value: "특강 · 워크숍 · 온라인 협의" },
    { label: "지역", value: "부산 · 인근(협의)" },
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
      question: "어떤 기관에서 많이 문의하나요?",
      answer:
        "청년·자립지원·도서관·학교·공공 협업 프로그램·창업·기업 교육 담당자의 문의가 이어집니다. 특정 기관 배정은 없습니다.",
    },
    {
      question: "생활법률 강사와 사건 수임 법무사의 차이는?",
      answer:
        "본 페이지는 교육·특강 기획용입니다. 개별 사건 대리는 별도 상담·수임 절차입니다.",
    },
    {
      question: "강사 프로필만 먼저 받을 수 있나요?",
      answer:
        "가능합니다. 강사 소개 페이지의 인쇄용 요약을 활용하거나, 강의 문의로 요청해 주세요.",
    },
    {
      question: "여러 주제를 하루 일정에 묶을 수 있나요?",
      answer: "시간·난이도에 맞게 모듈을 재조합할 수 있습니다. 사전 협의가 필요합니다.",
    },
    {
      question: "소규모 워크숍만 가능한가요?",
      answer: "소수 인원 상담형·토론형도 협의 가능합니다.",
    },
    {
      question: "강의 가능 일정은 언제 알 수 있나요?",
      answer: "희망일을 알려주시면 가능 여부를 회신합니다. 성사를 보장하지는 않습니다.",
    },
    {
      question: "실제 강의 사진은 어디서 보나요?",
      answer:
        "언론·활동의 강의 사진 모음과 이 페이지의 이력 카드에서 확인할 수 있습니다.",
    },
    {
      question: "부산 강사 섭외만 가능한가요?",
      answer: "부산 중심이며 인근·온라인은 협의합니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/법률강의", label: "법률 강의 허브" },
    { href: "/부산법무사강의", label: "부산 법무사 강의" },
    { href: "/강사소개", label: "강사 소개" },
    { href: "/강의문의", label: "강의 문의" },
    { href: "/전세사기예방교육", label: "전세사기 예방교육" },
    { href: "/부산기관법률특강", label: "기관 법률특강" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "법무사 소개" },
    { href: "/media#lectures", label: "강의 사진" },
  ],
  historyIds: hub.historyIds,
  ctaTitle: "강사 검토 후 맞춤 제안을 요청하세요",
  ctaText: "기관 유형·대상·목표만 남겨 주시면 구성안을 안내합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showPrintProfile: true,
  primaryKeywords: [
    "부산 법률 강사",
    "법률 강사 섭외",
    "생활법률 강사",
    "법무사 강사",
    "부산 법무사 강사",
    "법무사 강사 섭외",
    "기관 출강",
  ],
};

const jeonse: LecturePageContent = {
  slug: "전세사기예방교육",
  kind: "topic",
  title: "부산 전세사기 예방교육",
  metaTitle: "부산 전세사기 예방교육｜청년·신혼부부·기관 맞춤형 법률특강",
  metaDescription:
    "부산 전세사기 예방교육. 계약 전 확인, 등기부등본, 확정일자, 보증보험 등을 사례 중심으로 안내합니다. 청년·신혼·기관 맞춤 특강.",
  h1: "부산 전세사기 예방교육｜계약 전 확인부터 보증금 보호까지",
  eyebrow: "주거·임대차 예방교육",
  heroIntro:
    "계약 전에 무엇을 확인해야 하는지를 체크리스트와 사례로 정리하는 특강입니다.",
  heroParagraphs: [
    "부산광역시 자립지원전담기관 전세사기 예방 특강 등 실제 강의 이력을 바탕으로 구성을 안내합니다.",
    "공식 예방교육을 대체한다고 보지 마시고, 생활법률·실무 예방 관점의 교육으로 이해해 주세요.",
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
      question: "관련 법무사 업무도 같이 안내하나요?",
      answer:
        "교육과 사건 수임은 분리합니다. 필요 시 임대차·등기 안내 페이지를 링크로 안내합니다.",
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
    { href: "/부산법률강사", label: "강사 섭외" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
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
  title: "부산 청년 생활법률 특강",
  metaTitle: "부산 청년 생활법률 특강｜계약·금전·주거·온라인 분쟁 예방교육",
  metaDescription:
    "부산 청년 생활법률 특강. 주거·근로·금전·온라인 분쟁 예방을 사례로 안내합니다. 청년센터·학교·기관 맞춤.",
  h1: "부산 청년 생활법률 특강｜사회생활 전 꼭 알아야 할 법률상식",
  eyebrow: "청년·사회초년생",
  heroIntro:
    "검색만으로 헷갈리기 쉬운 생활법률을, 청년 눈높이의 사례와 체크리스트로 정리합니다.",
  heroParagraphs: [
    "해운대 청년 JOB성장카페·청년채움공간 연계 교육과 청년 대상 오프라인 특강 이력을 바탕으로 구성합니다.",
    "공포를 조장하지 않고, 지금 확인할 행동 중심으로 설명합니다.",
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
    "부산 청년 법률특강",
    "청년 생활법률 교육",
    "청년센터 법률 강사",
  ],
};

const startup: LecturePageContent = {
  slug: "창업법률교육",
  kind: "topic",
  title: "부산 창업 법률교육",
  metaTitle: "부산 창업 법률교육｜법인설립·계약·지분·상표·분쟁 예방특강",
  metaDescription:
    "부산 창업 법률교육. 법인설립·공동창업·계약·등기기한 등 예비창업자·초기기업 실무특강.",
  h1: "부산 창업 법률교육｜예비창업자와 초기기업을 위한 실무특강",
  eyebrow: "창업지원·초기기업",
  heroIntro:
    "창업 초기에 놓치기 쉬운 법인·계약·기한 리스크를 실무 언어로 정리합니다.",
  heroParagraphs: [
    "법무사 법인등기 실무와 공공·창업 협업 경험을 바탕으로, 예방교육 범위에서 안내합니다.",
    "투자 유치 전문 법률자문이나 결과 보장으로 오인되지 않도록 기초·체크리스트 중심으로 구성합니다.",
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
  primaryKeywords: ["부산 창업 법률교육", "창업 법률특강", "법인설립 특강"],
};

const enterprise: LecturePageContent = {
  slug: "기업법률교육",
  kind: "topic",
  title: "부산 기업 법률교육",
  metaTitle: "부산 기업 법률교육｜임직원 계약·채권·개인정보·법률 리스크 특강",
  metaDescription:
    "부산 기업 법률교육. 임직원 계약·채권·개인정보·SNS 리스크 등 실무 예방특강. 법정의무교육 대체 아님.",
  h1: "부산 기업 법률교육｜임직원이 알아야 할 실무 법률 리스크",
  eyebrow: "기업·산업단지·중소기업",
  heroIntro:
    "공인 준법교육이 아니라, 임직원이 일하다 마주치는 계약·채권·정보·표시 리스크를 예방하는 실무특강입니다.",
  heroParagraphs: [
    "명례일반산업단지 기업 법률지원 MOU 등 지역 기업 협업 경험을 바탕으로 눈높이를 맞춥니다.",
    "컴플라이언스 인증·법정의무교육으로 오인되지 않도록 범위를 명확히 합니다.",
  ],
  summaryItems: [
    { label: "대상", value: "신입·관리자·영업·총무" },
    { label: "제외", value: "청렴·성희롱예방 등 법정 지정교육" },
  ],
  topicCards: [
    { title: "계약 체크리스트", description: "체결 전 확인" },
    { title: "미수금·채권", description: "내용증명·지급명령 기초" },
    { title: "등기기한", description: "임원·본점 변경" },
  ],
  audienceCards: [
    { title: "중소·소상공", description: "실무 기초" },
    { title: "산업단지·협회", description: "단체 특강" },
  ],
  institutionCards: [
    {
      title: "기업·협회",
      topics: ["계약", "채권", "개인정보", "SNS"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "계약 체결 전 체크리스트",
    "계약해제·해지 기초",
    "미수금 관리",
    "내용증명과 지급명령",
    "임원변경·본점이전 등기기한",
    "회사 인감과 권한",
    "개인정보 처리 기초",
    "SNS·메신저 사용",
    "영업비밀·자료반출 주의",
    "퇴직자 자료관리",
    "거래처 분쟁 초기대응",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["임직원 체크리스트", "기한 안내 요약"],
  faqs: [
    {
      question: "준법지원인·법정교육으로 인정되나요?",
      answer: "아니요. 일반 실무 예방교육입니다.",
    },
    {
      question: "산업단지 단체 교육이 가능한가요?",
      answer: "일정·인원에 따라 협의 가능합니다.",
    },
    {
      question: "신입사원 온보딩용 짧은 모듈이 있나요?",
      answer: "60분 생활·계약 기초 모듈로 줄일 수 있습니다.",
    },
    {
      question: "개인정보보호 법정교육을 대체하나요?",
      answer: "대체하지 않습니다. 실무 주의점 안내입니다.",
    },
    {
      question: "변호사가 아닌 법무사 강의의 범위는?",
      answer:
        "등기·계약·채권 서류·예방 체크리스트 등 법무사 실무와 연결된 범위를 중심으로 합니다.",
    },
    {
      question: "사내 자료로 남겨도 되나요?",
      answer: "제공 범위는 사전 협의하며, 무단 재배포는 제한할 수 있습니다.",
    },
    {
      question: "온라인 가능?",
      answer: "협의 가능합니다.",
    },
    {
      question: "문의 방법",
      answer: "강의 문의 페이지에서 기업명·인원·희망 주제를 남겨 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/창업법률교육", label: "창업 법률교육" },
    { href: "/공공기관법률교육", label: "공공기관 법률교육" },
    { href: "/부산기관법률특강", label: "기관 법률특강" },
    { href: "/강의문의", label: "문의" },
  ],
  relatedServiceLinks: [
    { href: "/부산기업법률자문", label: "개별 기업 등기·서류 업무 문의" },
    { href: "/부산법인등기", label: "법인등기" },
    { href: "/부산임원변경등기", label: "임원변경등기" },
  ],
  historyIds: [],
  ctaTitle: "기업 법률특강을 문의하세요",
  ctaText: "인원·직급·희망 주제만 알려주시면 됩니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: [
    "부산 기업 법률교육",
    "임직원 법률교육",
    "사내 특강 강사",
    "부산 업체 법률교육",
    "부산 사내특강",
  ],
};

const speaker: LecturePageContent = {
  slug: "강사소개",
  kind: "speaker",
  title: "안윤정 법무사 강사 소개",
  metaTitle: "안윤정 법무사 강사 소개｜부산 법률특강·전세사기·창업 강의",
  metaDescription:
    "안윤정 법무사 강사 소개. 부산 법률 강의·특강 출강. 법무사·공인중개사·신용관리사, 교육대학원 석사. 생활법률·전세사기 예방·청년·진로 특강.",
  h1: "법률을 실제 생활의 언어로 설명하는 안윤정 법무사",
  eyebrow: "기관용 강사 프로필",
  heroIntro:
    "법무사 실무와 교육 현장 경험으로, 기관·대상에 맞춘 생활법률 특강을 진행합니다. 부산에서 법무사 강의·강사 프로필을 검토할 때 참고하세요.",
  heroParagraphs: [
    "상속·부동산·법인·회생 사건을 다루며, 도서관·청년기관·학교 등에서 출강해 왔습니다.",
    "용어 나열이 아니라, 현장에서 바로 확인할 포인트와 예방 행동을 중심으로 설명합니다.",
  ],
  summaryItems: [
    { label: "자격", value: "법무사 · 공인중개사 · 신용관리사" },
    { label: "교육", value: "교육대학원 석사 · 교사 자격" },
    { label: "수상", value: "대한법무사협회장 표창 (2026.05.28)" },
    { label: "출강", value: "도서관 · 청년기관 · 학교 · 공공 · 기업" },
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
    { href: "/법률강의", label: "법률 강의 안내" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/강의문의", label: "강의 문의" },
    { href: "/부산법률강사", label: "강사 섭외" },
    { href: "/부산법무사강의", label: "부산 법무사 강의" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "법무사 소개" },
    { href: "/media", label: "언론·활동" },
  ],
  historyIds: hub.historyIds,
  ctaTitle: "강의 일정을 남겨 주세요",
  ctaText: "기관명·대상·주제·희망일만 있어도 가능 여부를 회신합니다.",
  disclaimer: commonDisclaimer,
  showPrintProfile: true,
  showInquiryForm: true,
  primaryKeywords: [
    "법률 강사 프로필",
    "안윤정 법무사",
    "법무사 강사",
    "부산 법률 강사",
    "부산 법무사 강의",
  ],
};

const inquiry: LecturePageContent = {
  slug: "강의문의",
  kind: "inquiry",
  title: "법률 강의 문의",
  metaTitle: "부산 법률 강의 문의｜기관·단체 특강·강사 섭외 일정 협의",
  metaDescription:
    "부산 법률 강의·특강 문의. 도서관·기관·학교·기업·협회 담당자용. 주제·대상·일정만 남겨 주세요. 민감정보는 받지 않습니다.",
  h1: "기관·단체 담당자를 위한 부산 법률 강의 문의",
  eyebrow: "맞춤 제안 요청",
  heroIntro:
    "부산에서 법률 강의·특강을 기획 중이라면 기관·대상·주제·일정만 남겨 주세요. 민감정보(주민등록번호·사건 상세 등)는 받지 않습니다.",
  heroParagraphs: [],
  summaryItems: [
    { label: "준비하면 좋은 정보", value: "주제 · 대상 · 인원 · 날짜 · 온/오프라인" },
    { label: "다음 단계", value: "가능 여부 · 개요 회신" },
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
      question: "얼마나 빨리 답을 받나요?",
      answer: "연락 가능 시간에 순차 회신하며, 특정 기한을 보장하지는 않습니다.",
    },
    {
      question: "예산도 적어야 하나요?",
      answer: "선택 사항입니다. 없어도 주제·시간 기준으로 먼저 안내할 수 있습니다.",
    },
    {
      question: "개인 사건 상담인가요?",
      answer:
        "이 폼은 강의·출강 문의용입니다. 사건 상담은 상담 신청 페이지를 이용해 주세요.",
    },
    {
      question: "제안서만 먼저 받을 수 있나요?",
      answer: "가능 여부 확인 후 개요·프로필을 드릴 수 있습니다.",
    },
    {
      question: "필수 항목은?",
      answer: "기관명, 연락처, 희망 주제, 교육 대상입니다.",
    },
    {
      question: "개인정보 동의는?",
      answer: "문의 처리 목적 범위에서만 사용하며, 동의 후 제출해 주세요.",
    },
    {
      question: "여러 날짜 후보를 넣어도 되나요?",
      answer: "기타 요청사항에 후보 일자를 적어 주시면 됩니다.",
    },
    {
      question: "카카오·전화로도 가능한가요?",
      answer: "가능합니다. 하단 연락 채널을 이용하셔도 됩니다.",
    },
  ],
  relatedLectureLinks: relatedAll.filter((l) => l.href !== "/강의문의"),
  relatedServiceLinks: [{ href: "/contact", label: "일반 상담" }],
  historyIds: [],
  ctaTitle: "아래 양식으로 강의 문의를 남겨 주세요",
  ctaText: "빠르게 검토하실 수 있도록 핵심 항목만 구성했습니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showRecommendTool: false,
  primaryKeywords: [
    "법률 강의 문의",
    "출강 문의",
    "강의 제안서",
    "부산 법률특강 문의",
    "기관 강의 섭외 문의",
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
    { href: "/강의문의", label: "문의" },
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
  summaryItems: [
    { label: "모듈", value: "생활법률 · 온라인 · 주거(대학) · 진로" },
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
    { href: "/디지털법률교육", label: "디지털" },
    { href: "/강의문의", label: "문의" },
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
  title: "공공기관 법률교육",
  metaTitle: "부산 공공기관 법률교육｜공기업·지자체 임직원 맞춤형 특강",
  metaDescription:
    "공공기관·공기업 임직원 맞춤 생활·실무 법률교육. 청렴 등 법정교육은 포함하지 않습니다.",
  h1: "부산 공공기관·공기업 임직원을 위한 맞춤형 법률교육",
  eyebrow: "공공·공기업·출자출연·지자체",
  heroIntro:
    "계약·채권·개인정보·생활·디지털 등 실무 예방교육입니다. 청렴·이해충돌·청탁금지 등 별도 지정교육은 다루지 않습니다. 부산 지자체·공기업 교육담당자용 안내입니다.",
  heroParagraphs: [
    "LH·부산창조경제혁신센터 협업 프로그램 경험을 참고하되, 법정의무교육으로 표시하지 않습니다.",
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
  ],
  relatedLectureLinks: [
    { href: "/기업법률교육", label: "기업 법률교육" },
    { href: "/부산기관법률특강", label: "기관 법률특강" },
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
    "부산 공공기관 법률교육",
    "공기업 법률교육",
    "지자체 법률특강",
    "부산 지자체 법률교육",
    "공단 법률특강",
  ],
};

const career: LecturePageContent = {
  slug: "법무사진로특강",
  kind: "topic",
  title: "법무사 진로특강",
  metaTitle: "법무사 진로특강｜법무사의 업무와 법률전문직 진로 이야기",
  metaDescription:
    "법무사 진로특강. 업무·시험·커리어를 학교·청년 눈높이로 전달. 양산제일고 특강 이력.",
  h1: "법무사 진로특강｜일·자격·현장에서 보는 법률전문직",
  eyebrow: "진로·직업 특강",
  heroIntro:
    "법무사 시험 합격 경험과 실무·강의 경험을 바탕으로, 직업의 일과 준비 과정을 이야기합니다.",
  heroParagraphs: [
    "양산제일고등학교 진로특강 이력이 있습니다. 합격 신화·성공 보장을 말하지 않고, 현실적인 일과 준비를 설명합니다.",
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
    { href: "/강사소개", label: "강사 소개" },
    { href: "/강의문의", label: "문의" },
  ],
  relatedServiceLinks: [{ href: "/about", label: "법무사 소개" }],
  historyIds: ["yangsan-high-school-career-talk"],
  ctaTitle: "진로특강 일정을 문의하세요",
  ctaText: "학교명·학년·시간만 남겨 주세요.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: ["법무사 진로특강", "법조인 진로강의", "진로교육 강사 법무사"],
};

export const lecturePages: LecturePageContent[] = [
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
