import type { PageRelatedLink } from "@/lib/pageData/types";

export type DiagnosisHubCategory = {
  id: string;
  title: string;
  description: string;
  diagnosisSlugs: string[];
  topicHubHref?: string;
};

export const DIAGNOSIS_HUB_CATEGORIES: DiagnosisHubCategory[] = [
  {
    id: "inheritance",
    title: "상속",
    description: "상속등기·상속포기·한정승인",
    diagnosisSlugs: ["상속등기자가진단", "상속포기자가진단", "한정승인자가진단"],
    topicHubHref: "/상속",
  },
  {
    id: "corporate",
    title: "법인등기",
    description: "법인변경·임원변경·법인설립",
    diagnosisSlugs: ["법인등기자가진단", "임원변경등기자가진단", "법인설립자가진단"],
    topicHubHref: "/법인등기",
  },
  {
    id: "real-estate",
    title: "부동산등기",
    description: "매매·증여·상속 원인 등기",
    diagnosisSlugs: ["부동산등기자가진단", "소유권이전등기자가진단"],
    topicHubHref: "/부동산등기",
  },
  {
    id: "rehab",
    title: "개인회생·파산",
    description: "채무조정·면책 절차",
    diagnosisSlugs: ["개인회생자가진단", "개인파산자가진단"],
    topicHubHref: "/개인회생파산",
  },
  {
    id: "jeonse",
    title: "임대차·전세보증금",
    description: "보증금 반환·임차권등기명령",
    diagnosisSlugs: ["전세보증금자가진단", "임차권등기명령자가진단"],
    topicHubHref: "/임대차전세",
  },
  {
    id: "civil",
    title: "민사·채권회수",
    description: "지급명령·내용증명·공탁",
    diagnosisSlugs: ["지급명령자가진단", "내용증명자가진단", "공탁자가진단"],
    topicHubHref: "/민사소송",
  },
  {
    id: "family",
    title: "가족·후견",
    description: "성년후견·특별대리인",
    diagnosisSlugs: ["성년후견자가진단", "특별대리인자가진단"],
    topicHubHref: "/가족후견",
  },
  {
    id: "special",
    title: "특수등기",
    description: "선박·비영리·외국인 등",
    diagnosisSlugs: ["선박등기자가진단"],
    topicHubHref: "/특수등기",
  },
];

export const POPULAR_DIAGNOSIS_SLUGS = [
  "상속포기자가진단",
  "상속등기자가진단",
  "임원변경등기자가진단",
  "개인회생자가진단",
  "전세보증금자가진단",
] as const;

/** 토픽 허브 slug → 관련 자가진단 링크 */
export const TOPIC_HUB_DIAGNOSIS_LINKS: Record<string, PageRelatedLink[]> = {
  상속: [
    { href: "/상속등기자가진단", label: "상속등기 자가진단" },
    { href: "/상속포기자가진단", label: "상속포기 자가진단" },
    { href: "/한정승인자가진단", label: "한정승인 자가진단" },
  ],
  법인등기: [
    { href: "/법인등기자가진단", label: "법인등기 자가진단" },
    { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
  ],
  부동산등기: [
    { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
    { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
  ],
  개인회생파산: [
    { href: "/개인회생자가진단", label: "개인회생 자가진단" },
    { href: "/개인파산자가진단", label: "개인파산 자가진단" },
  ],
};

export const DIAGNOSIS_HUB_INTRO =
  "상속, 법인등기, 부동산등기, 개인회생, 전세보증금 등 현재 상황을 간단히 점검할 수 있습니다. 아래에서 해당 업무를 고른 뒤 질문에 답하면 절차·서류·비용·기한 방향을 안내받을 수 있습니다.";

export function getTopicHubDiagnosisLinks(hubSlug: string): PageRelatedLink[] {
  return TOPIC_HUB_DIAGNOSIS_LINKS[hubSlug] ?? [];
}
