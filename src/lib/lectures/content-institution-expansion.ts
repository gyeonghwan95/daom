import type { LecturePageContent } from "@/lib/lectures/types";
import {
  commonDisclaimer,
  durationOptionsDefault,
  lectureFormatsDefault,
  preparationDefault,
  processStepsDefault,
} from "@/lib/lectures/shared";

/**
 * 부산 기관·도서관·법무사 강의 검색의도 확장 페이지.
 * 기존 slug는 변경하지 않고 신규 URL만 추가합니다.
 */
export const libraryLecture: LecturePageContent = {
  slug: "부산도서관법률특강",
  kind: "topic",
  title: "부산 도서관 법률특강",
  metaTitle: "부산 도서관 법률특강｜시민·평생학습 생활법률 강의",
  metaDescription:
    "부산 도서관·평생학습관 대상 생활법률 특강. 부산광역시립시민도서관 연속 강의 이력을 바탕으로 시민 눈높이 사례 중심 교육을 기획합니다.",
  h1: "부산 도서관 법률특강｜시민이 바로 쓰는 생활법률 강의",
  eyebrow: "도서관·평생학습·시민교육",
  heroIntro:
    "도서관·평생학습관·문화센터에서 시민 대상으로 진행하는 생활법률·예방 특강입니다. 용어 나열이 아니라, 일상에서 바로 확인할 포인트를 중심으로 구성합니다.",
  heroParagraphs: [
    "부산광역시립시민도서관에서 진행한 생활법률 연속 특강 이력을 바탕으로, 회차·주제·난이도를 기관 일정에 맞춰 조정합니다.",
    "부산 해운대·센텀을 거점으로 부산 전역 도서관·학습관 출강을 우선하며, 인근·온라인은 협의합니다.",
  ],
  summaryItems: [
    { label: "적합 기관", value: "시립·구립 도서관 · 평생학습관 · 문화센터" },
    { label: "형식", value: "1회 특강 · 2~4주 연속과정" },
    { label: "주제 예", value: "계약 · 주거 · 상속 기초 · 생활분쟁 · 디지털" },
    { label: "지역", value: "부산 중심, 인근·온라인 협의" },
  ],
  topicCards: [
    {
      title: "생활법률 입문",
      description: "계약·금전·주거 기초",
      href: "/청년생활법률특강",
    },
    {
      title: "전세사기 예방",
      description: "등기부·확정일자 체크",
      href: "/전세사기예방교육",
    },
    {
      title: "디지털 생활법률",
      description: "개인정보·온라인 분쟁",
      href: "/디지털법률교육",
    },
  ],
  audienceCards: [
    { title: "일반 시민", description: "일상 계약·분쟁 예방" },
    { title: "중장년·시니어", description: "상속·계약 기초" },
    { title: "청년·사회초년생", description: "주거·근로·금전" },
  ],
  institutionCards: [
    {
      title: "도서관·평생학습",
      topics: ["생활법률", "주거", "상속 기초", "디지털"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "생활 속 계약, 왜 문제가 되나",
    "주거·전월세에서 자주 놓치는 확인",
    "금전거래·보증·차용 주의점",
    "상속·가족 재산 기초(개요)",
    "온라인·개인정보 생활 예방",
    "질의응답·체크리스트",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["회차별 개요", "시민용 체크리스트"],
  faqs: [
    {
      question: "도서관 야간·주말 특강도 가능한가요?",
      answer: "기관 일정에 맞춰 협의합니다. 연속 과정과 1회 특강 모두 가능합니다.",
    },
    {
      question: "시민도서관 강의 이력이 있나요?",
      answer:
        "네. 부산광역시립시민도서관 생활법률 연속 특강 등 확인된 이력이 있습니다. 강의 이력 페이지에서 확인할 수 있습니다.",
    },
    {
      question: "평생학습관·문화센터도 같은 구성인가요?",
      answer: "대상·시간에 맞게 목차와 사례를 조정합니다. 기본 골격은 생활법률 예방교육입니다.",
    },
    {
      question: "법정의무교육으로 인정되나요?",
      answer: "아니요. 시민 대상 생활·예방 특강이며 법정 지정교육으로 안내하지 않습니다.",
    },
    {
      question: "강의료는 어떻게 정해지나요?",
      answer: "시간·회차·자료 범위와 기관 기준을 함께 보고 협의합니다.",
    },
    {
      question: "부산 외 도서관도 가능한가요?",
      answer: "부산 중심이며 인근·온라인은 일정에 따라 협의합니다.",
    },
    {
      question: "제안서·강사 프로필이 필요한가요?",
      answer: "요청하시면 확인된 내용으로 제공합니다. 강사 소개 페이지도 참고해 주세요.",
    },
    {
      question: "문의는 어디에 남기면 되나요?",
      answer: "강의 문의 페이지에 기관명·대상·희망 일정만 남겨 주시면 됩니다.",
    },
  ],
  relatedLectureLinks: [
    { href: "/법률강의", label: "법률 강의 허브" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/부산기관법률특강", label: "기관 법률특강" },
    { href: "/강사소개", label: "강사 소개" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "안윤정 법무사 소개" },
    { href: "/media#lectures", label: "강의 사진" },
  ],
  historyIds: ["citizen-library-life-law", "youth-law-essential-lecture"],
  ctaTitle: "도서관·평생학습 특강을 문의하세요",
  ctaText: "기관명·예상 인원·희망 회차(1회/연속)만 남겨 주시면 가능 여부를 회신합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  primaryKeywords: [
    "부산 도서관 법률특강",
    "평생학습관 법률강의",
    "시민 생활법률 특강",
    "부산 도서관 특강 강사",
    "부산 생활법률 강의",
  ],
};

export const lawyerLecture: LecturePageContent = {
  slug: "부산법무사강의",
  kind: "topic",
  title: "부산 법무사 강의",
  metaTitle: "부산 법무사 강의｜실무 기반 법률특강·기관 출강",
  metaDescription:
    "부산 법무사 강의·특강 안내. 안윤정 법무사가 등기·계약·생활법률 실무 경험을 바탕으로 기관·학교·기업·도서관 출강 교육을 진행합니다.",
  h1: "부산 법무사 강의｜실무로 설명하는 법률특강·기관 출강",
  eyebrow: "법무사 실무 기반 교육",
  heroIntro:
    "일반 교양 강연이 아니라, 법무사 사무소에서 실제로 다루는 계약·등기·서류·예방 포인트를 눈높이에 맞게 풀어내는 강의입니다.",
  heroParagraphs: [
    "부산 해운대·센텀 다옴법무사사무소 안윤정 법무사가 직접 출강합니다. 도서관·청년기관·학교·공공·기업 교육 이력을 확인할 수 있습니다.",
    "강사 섭외·프로필 검토는 부산 법률 강사 섭외·강사 소개 페이지와 함께 보시면 됩니다.",
  ],
  summaryItems: [
    { label: "강사", value: "안윤정 법무사 (실무·출강)" },
    { label: "핵심", value: "사례 · 체크리스트 · 질의응답" },
    { label: "가능 주제", value: "전세 · 청년 · 창업·기업 · 디지털 · 진로" },
    { label: "지역", value: "부산 중심 · 인근·온라인 협의" },
  ],
  topicCards: [
    {
      title: "강사 섭외 안내",
      description: "기관용 검토 포인트",
      href: "/부산법률강사",
    },
    {
      title: "강사 프로필",
      description: "자격·경력·출강",
      href: "/강사소개",
    },
    {
      title: "전세사기 예방",
      description: "실무 체크리스트",
      href: "/전세사기예방교육",
    },
  ],
  audienceCards: [
    { title: "기관 교육담당", description: "강사·주제 검토" },
    { title: "학교·대학", description: "생활법률·진로" },
    { title: "기업·협회", description: "임직원 실무 예방" },
  ],
  institutionCards: [
    {
      title: "법무사 강의가 맞는 경우",
      topics: ["등기·계약 예방", "서류 확인", "생활법률", "진로"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "법무사 실무와 연결되는 주제 선정",
    "대상 눈높이에 맞춘 사례 가공",
    "체크리스트·질의응답 설계",
    "기관 일정에 맞춘 60~120분·연속과정",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["강의 개요", "강사 프로필 요약"],
  faqs: [
    {
      question: "변호사 강의와 무엇이 다른가요?",
      answer:
        "소송 대리 중심이 아니라, 등기·계약·서류·생활 예방처럼 법무사 실무와 맞닿은 범위를 중심으로 설명합니다.",
    },
    {
      question: "부산 법무사 특강만 의뢰할 수 있나요?",
      answer: "네. 주제·대상만 알려주시면 맞춤 구성으로 협의합니다.",
    },
    {
      question: "강사 프로필과 이력은 어디서 보나요?",
      answer: "강사 소개·강의 이력·언론·활동 페이지에서 확인된 내용만 제시합니다.",
    },
    {
      question: "사건 상담도 강의 중에 해주나요?",
      answer:
        "개별 사건 상담·수임은 별도 절차입니다. 강의는 일반화된 예방·실무 안내입니다.",
    },
    {
      question: "법정의무교육을 대체하나요?",
      answer: "대체하지 않습니다. 청렴·성희롱예방 등 지정교육은 범위에 넣지 않습니다.",
    },
    {
      question: "출강 지역은?",
      answer: "부산 중심이며 인근·온라인은 협의합니다.",
    },
    {
      question: "강의료는?",
      answer: "시간·형식·이동·자료 범위와 기관 기준으로 협의합니다.",
    },
    {
      question: "문의 방법",
      answer: "강의 문의 페이지에 기관·대상·주제를 남겨 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/부산법률강사", label: "부산 법률 강사 섭외" },
    { href: "/강사소개", label: "강사 소개" },
    { href: "/법률강의", label: "법률 강의 허브" },
    { href: "/강의이력", label: "강의 이력" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "법무사 소개" },
    { href: "/media#lectures", label: "강의 사진" },
  ],
  historyIds: [
    "citizen-library-life-law",
    "self-support-jeonse-prevention",
    "yangsan-high-school-career-talk",
    "haeundae-youth-job-growth-cafe",
  ],
  ctaTitle: "부산 법무사 강의를 문의하세요",
  ctaText: "기관 유형·교육 대상·희망 주제만 남겨 주시면 가능 여부와 구성을 안내합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showPrintProfile: true,
  primaryKeywords: [
    "부산 법무사 강의",
    "부산 법무사 특강",
    "법무사 법률강의",
    "부산 법무사 출강",
    "법무사 기관 강의",
  ],
};

export const institutionLecture: LecturePageContent = {
  slug: "부산기관법률특강",
  kind: "topic",
  title: "부산 기관 법률특강",
  metaTitle: "부산 기관 법률특강｜단체·협회·업체·복지기관 맞춤 교육",
  metaDescription:
    "부산 기관·단체·협회·업체·복지기관 맞춤 법률특강. 대상과 목적에 맞춰 생활법률·전세·청년·창업·기업 예방교육을 기획합니다.",
  h1: "부산 기관 법률특강｜단체·협회·업체에 맞춘 생활법률 교육",
  eyebrow: "기관·단체·협회·복지·업체",
  heroIntro:
    "교육담당자가 가장 먼저 확인하는 것—대상·목적·시간—에 맞춰 주제를 재조합합니다. 공공·민간·비영리 모두 협의 가능합니다.",
  heroParagraphs: [
    "도서관·청년기관·학교·자립지원·창업지원·기업·협회처럼 성격이 다른 기관에도, 같은 ‘생활·예방’ 골격으로 난이도만 조정합니다.",
    "법정의무·지정 자격교육(청렴·성희롱예방 등)은 포함하지 않습니다. 실무 예방·생활법률 특강 범위로 안내합니다.",
  ],
  summaryItems: [
    { label: "문의 기관 예", value: "공공 · 복지 · 청년 · 협회 · 업체 · 도서관" },
    { label: "맞춤 기준", value: "대상 · 목적 · 인원 · 시간" },
    { label: "형식", value: "특강 · 워크숍 · 연속과정 · 온라인(협의)" },
    { label: "다음 단계", value: "가능 여부 · 개요 회신" },
  ],
  topicCards: [
    {
      title: "도서관·평생학습",
      description: "시민 생활법률",
      href: "/부산도서관법률특강",
    },
    {
      title: "공공기관 임직원",
      description: "실무 예방교육",
      href: "/공공기관법률교육",
    },
    {
      title: "기업·협회",
      description: "임직원 법률 리스크",
      href: "/기업법률교육",
    },
    {
      title: "청년·복지기관",
      description: "생활·주거 예방",
      href: "/청년생활법률특강",
    },
  ],
  audienceCards: [
    { title: "기관 이용자·시민", description: "생활법률" },
    { title: "임직원·실무자", description: "계약·채권·정보" },
    { title: "청년·학생", description: "주거·진로·디지털" },
  ],
  institutionCards: [
    {
      title: "공공·복지·청년",
      topics: ["생활법률", "전세사기", "디지털"],
    },
    {
      title: "협회·단체·업체",
      topics: ["계약", "채권", "개인정보", "창업"],
    },
  ],
  formats: lectureFormatsDefault,
  durationOptions: durationOptionsDefault,
  modules: [
    "기관 목적에 맞춘 주제 선정",
    "대상별 사례·난이도 조정",
    "체크리스트·질의응답",
    "필요 시 제안서·프로필 제공",
  ],
  processSteps: processStepsDefault,
  preparationChecklist: preparationDefault,
  materialExamples: ["기관용 개요서", "대상별 모듈 선택표"],
  faqs: [
    {
      question: "어떤 기관에서 의뢰할 수 있나요?",
      answer:
        "도서관·학교·청년·복지·공공·협회·업체·창업지원 등 교육 프로그램이 있는 기관이면 협의 가능합니다.",
    },
    {
      question: "업체·협회 단체 특강과 사내교육의 차이는?",
      answer:
        "구성은 비슷하고, 참석자(회원·임직원)와 목적에 따라 사례를 바꿉니다. 기업 전용 안내는 기업 법률교육 페이지를 참고하세요.",
    },
    {
      question: "여러 주제를 하루 일정에 묶을 수 있나요?",
      answer: "시간·난이도에 맞게 모듈을 재조합할 수 있습니다.",
    },
    {
      question: "법정교육으로 인정되나요?",
      answer: "아니요. 생활·실무 예방특강입니다.",
    },
    {
      question: "부산 외 기관도 가능한가요?",
      answer: "부산 중심이며 인근·온라인은 협의합니다.",
    },
    {
      question: "강사 검토 자료는?",
      answer: "강사 소개·강의 이력·부산 법률 강사 섭외 페이지를 함께 보시면 됩니다.",
    },
    {
      question: "비용은?",
      answer: "시간·형식·이동·자료 범위와 기관 기준으로 협의합니다.",
    },
    {
      question: "문의는?",
      answer: "강의 문의에 기관명·대상·주제·희망일을 남겨 주세요.",
    },
  ],
  relatedLectureLinks: [
    { href: "/법률강의", label: "법률 강의 허브" },
    { href: "/부산도서관법률특강", label: "도서관 법률특강" },
    { href: "/부산법무사강의", label: "부산 법무사 강의" },
    { href: "/부산법률강사", label: "강사 섭외" },
    { href: "/강의문의", label: "강의 문의" },
  ],
  relatedServiceLinks: [
    { href: "/about", label: "법무사 소개" },
    { href: "/media#lectures", label: "강의 사진" },
  ],
  historyIds: [
    "citizen-library-life-law",
    "self-support-jeonse-prevention",
    "lh-busan-changjo-collab",
    "haeundae-youth-job-growth-cafe",
  ],
  ctaTitle: "기관·단체 맞춤 특강을 문의하세요",
  ctaText: "기관 유형·교육 대상·목적만 남겨 주시면 맞는 주제 구성을 제안합니다.",
  disclaimer: commonDisclaimer,
  showInquiryForm: true,
  showRecommendTool: true,
  primaryKeywords: [
    "부산 기관 법률특강",
    "부산 단체 법률교육",
    "부산 협회 법률특강",
    "기관 생활법률 특강",
    "부산 업체 법률특강",
  ],
};

export const institutionExpansionPages: LecturePageContent[] = [
  libraryLecture,
  lawyerLecture,
  institutionLecture,
];
