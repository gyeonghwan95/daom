import { expertHubPage } from "@/lib/lectures/content-expert-hub";
import type { LecturePageContent } from "@/lib/lectures/types";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { institutionExpansionPages } from "@/lib/lectures/content-institution-expansion";
import { speakerExpansionPages } from "@/lib/lectures/content-speaker-expansion";
import {
  lectureTargetContents,
  newLectureTargetContents,
} from "@/lib/lectures/target-specs";
import {
  commonDisclaimer,
  durationOptionsDefault,
  lectureFormatsDefault,
  preparationDefault,
  processStepsDefault,
} from "@/lib/lectures/shared";

/** /강의문의가 참조하는 허브 주제 카드 — target 페이지 개편과 분리해 고정 */
const baseTopicCards: LecturePageContent["topicCards"] = [
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
];

const baseHistoryIds: string[] = [
  "citizen-library-life-law",
  "self-support-jeonse-prevention",
  "haeundae-youth-job-growth-cafe",
  "lh-busan-changjo-collab",
  "yangsan-high-school-career-talk",
];

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
  topicCards: baseTopicCards,
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
  historyIds: baseHistoryIds,
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

export const lecturePages: LecturePageContent[] = [
  expertHubPage,
  lectureTargetContents.법률강의,
  lectureTargetContents.부산법률강사,
  lectureTargetContents.전세사기예방교육,
  youth,
  startup,
  lectureTargetContents.기업법률교육,
  lectureTargetContents.강사소개,
  inquiry,
  digital,
  lectureTargetContents.학교법률교육,
  publicEdu,
  lectureTargetContents.법무사진로특강,
  ...institutionExpansionPages,
  ...speakerExpansionPages,
  ...newLectureTargetContents,
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
