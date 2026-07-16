import type {
  LectureDurationOption,
  LectureFormatOption,
  LecturePageContent,
} from "@/lib/lectures/types";

export const lectureFormatsDefault: LectureFormatOption[] = [
  {
    title: "특강",
    description: "60~120분 집중 강의와 질의응답으로 구성합니다.",
  },
  {
    title: "정규·연속 과정",
    description: "주차별 주제(예: 4주)로 깊이 있게 진행할 수 있습니다.",
  },
  {
    title: "사례 중심 워크숍",
    description: "체크리스트·조별 토론으로 예방 행동을 연습합니다.",
  },
  {
    title: "소규모 상담형 교육",
    description: "소수 인원으로 질문 비중을 높인 맞춤 세션입니다.",
  },
  {
    title: "온라인 강의",
    description: "화상·사전 녹화 방식은 기관 환경에 맞춰 협의합니다.",
  },
];

export const durationOptionsDefault: LectureDurationOption[] = [
  {
    label: "60분",
    outline: ["도입·목표", "핵심 개념", "사례 1~2", "체크포인트", "질의응답"],
  },
  {
    label: "90분",
    outline: [
      "도입",
      "핵심 이론",
      "실무 사례",
      "체크리스트 실습",
      "질의응답",
    ],
  },
  {
    label: "120분",
    outline: [
      "도입",
      "이론",
      "사례 토론",
      "조별 활동",
      "정리·질답",
    ],
  },
  {
    label: "3~4시간",
    outline: [
      "모듈별 이론",
      "심화 사례",
      "실습·워크시트",
      "종합 질의응답",
    ],
  },
];

export const processStepsDefault = [
  "교육 목적·대상·희망 일정을 남겨 주시면 가능 여부를 확인합니다.",
  "기관과 주제·시간·형식을 사전 협의합니다.",
  "필요 시 강의 개요·강사 프로필을 제공합니다.",
  "당일 특강·워크숍을 진행하고 질의응답을 포함합니다.",
  "요청 시 교육자료·체크리스트 제공 범위를 협의합니다.",
];

export const preparationDefault = [
  "희망 주제와 교육 목적",
  "교육 대상(연령·인원·기관 유형)",
  "희망 날짜·시간·장소(또는 온라인)",
  "기존에 진행한 유사 교육 유무",
  "제안서·프로필 필요 여부",
];

export const commonDisclaimer =
  "강의 성사·수강 만족·교육 효과를 보장하지 않습니다. 청렴·성희롱예방·산업안전 등 별도 자격·지정요건이 필요한 법정의무교육은 본 안내 범위에 포함하지 않습니다. 법령·제도는 시점·사안에 따라 달라질 수 있습니다.";

export const relatedAll: LecturePageContent["relatedLectureLinks"] = [
  { href: "/법률강의", label: "법률 강의 허브" },
  { href: "/강의이력", label: "강의 이력" },
  { href: "/부산법률강사", label: "부산 법률 강사 섭외" },
  { href: "/부산법무사강의", label: "부산 법무사 강의" },
  { href: "/부산기관법률특강", label: "기관 법률특강" },
  { href: "/부산도서관법률특강", label: "도서관 법률특강" },
  { href: "/강사소개", label: "강사 소개" },
  { href: "/강의문의", label: "강의 문의" },
  { href: "/media#lectures", label: "강의 사진·활동" },
];

/** 링크 경로를 사용자용 문구로 표시할 때 사용 (본문에 경로 문자열을 쓰지 않음) */
export const lecturePageLabels: Record<string, string> = {
  "/법률강의": "법률 강의 허브",
  "/강의이력": "강의 이력",
  "/부산법률강사": "부산 법률 강사 섭외",
  "/강사소개": "강사 소개",
  "/강의문의": "강의 문의",
  "/전세사기예방교육": "전세사기 예방교육",
  "/청년생활법률특강": "청년 생활법률 특강",
  "/창업법률교육": "창업 법률교육",
  "/기업법률교육": "기업 법률교육",
  "/디지털법률교육": "디지털 법률교육",
  "/학교법률교육": "학교 법률교육",
  "/법무사진로특강": "법무사 진로특강",
  "/공공기관법률교육": "공공기관 법률교육",
  "/부산도서관법률특강": "도서관 법률특강",
  "/부산법무사강의": "부산 법무사 강의",
  "/부산기관법률특강": "기관 법률특강",
  "/media#lectures": "강의 사진·활동",
  "/about": "법무사 소개",
};

export function getLecturePageLabel(href: string): string {
  return lecturePageLabels[href] ?? href.replace(/^\//, "");
}
