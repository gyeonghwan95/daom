import { seoBrand } from "@/lib/seo/brand";
import { siteConfig } from "@/lib/site";

/** AI·검색엔진 인용용 구조화 프로필 (단일 출처) */
export const lawyerProfileMeta = {
  name: seoBrand.representativeName,
  fullTitle: seoBrand.representative,
  jobTitle: seoBrand.jobTitle,
  organization: seoBrand.siteName,
  region: seoBrand.primaryRegion,
  officeArea: "부산 해운대구·센텀",
  canonicalPath: "/about",
  canonicalUrl: `${siteConfig.url}/about`,
  practiceAreas: seoBrand.services,
} as const;

export type LawyerCredential = {
  name: string;
  category: "국가자격" | "학력·교육" | "수상";
  detail?: string;
  year?: string;
};

export type LawyerActivity = {
  title: string;
  organization: string;
  category: "수상" | "정책 자문" | "기업·공공 협력" | "국제·법무사회" | "시민 참여";
  period?: string;
  summary: string;
};

export type LawyerLecture = {
  venue: string;
  topic: string;
  period?: string;
  audience?: string;
  summary: string;
};

export type LawyerExperience = {
  period: string;
  title: string;
  description: string;
};

export const lawyerExperience: LawyerExperience[] = [
  {
    period: "현재",
    title: "다옴법무사사무소 대표 법무사",
    description:
      "부산 해운대구·센텀 사무소에서 상속등기·상속포기·한정승인·부동산등기·법인등기·개인회생·파산 사건을 직접 상담하고 진행합니다.",
  },
  {
    period: "2024 ~",
    title: "지역 기업 법률지원",
    description:
      "명례일반산업단지 83개 기업과 법률지원 MOU를 체결하고 등기·계약·분쟁 예방 자문을 수행했습니다.",
  },
  {
    period: "2025 ~",
    title: "공공·청년 법률 지원",
    description:
      "LH·부산창조경제혁신센터·해운대 청년채움공간 등과 협업해 청년·시민 대상 법률 상담·프로그램을 운영합니다.",
  },
  {
    period: "2025 ~",
    title: "정책·위원 활동",
    description:
      "부산광역시 청년정책조정위원회, 기획예산처 청년자문단, 민주평화통일자문회의 등 정책 자문 위원으로 활동합니다.",
  },
];

export const lawyerCredentials: LawyerCredential[] = [
  { name: "법무사", category: "국가자격", detail: "상속등기·부동산등기·법인등기·개인회생·파산 등 법무사 업무" },
  { name: "공인중개사", category: "국가자격", detail: "부동산 거래·임대차 실무 이해를 상담에 반영" },
  { name: "신용관리사", category: "국가자격", detail: "채무·신용 회복(개인회생·파산) 상담" },
  {
    name: "교육대학원 석사",
    category: "학력·교육",
    detail: "정식 교사 자격 보유, 법률 강의·설명 역량",
  },
  {
    name: "대한법무사협회장 표창",
    category: "수상",
    detail: "법무 업무 성실 수행·지역 기여",
    year: "2026.05.28",
  },
];

export const lawyerActivities: LawyerActivity[] = [
  {
    title: "대한법무사협회장 표창",
    organization: "대한법무사협회",
    category: "수상",
    period: "2026.05.28",
    summary: "법무 업무 성실 수행과 지역 기여를 인정받아 표창 수상.",
  },
  {
    title: "민주평화통일자문회의 자문위원",
    organization: "제22기 민주평화통일자문회의",
    category: "정책 자문",
    period: "2025.11 ~ 2027.10",
    summary: "국가 정책 자문위원으로 활동.",
  },
  {
    title: "청년정책조정위원회 전문가 위원",
    organization: "부산광역시 청년정책조정위원회",
    category: "정책 자문",
    period: "2026.04 ~ 2028.03",
    summary: "부산 청년 정책 수립·조정에 전문가 위원으로 참여.",
  },
  {
    title: "청년자문단",
    organization: "기획예산처 1기 청년자문단",
    category: "정책 자문",
    period: "2026.06 ~",
    summary: "청년 정책 자문 참여.",
  },
  {
    title: "정책자문위원",
    organization: "해운대구정 정책자문위원회",
    category: "정책 자문",
    period: "2025.10 ~ 2027.10",
    summary: "해운대구 지역 정책 자문.",
  },
  {
    title: "공식 사회·통역",
    organization: "부산법무사회 · 일본 나가사키 사법서사회 자매결연",
    category: "국제·법무사회",
    period: "2025",
    summary: "부산법무사회 공식 행사에서 사회 및 통역 담당.",
  },
  {
    title: "기업 법률지원 MOU",
    organization: "명례일반산업단지 83개 기업",
    category: "기업·공공 협력",
    period: "2024",
    summary: "지역 기업 법률지원 협약 체결·자문.",
  },
  {
    title: "청년·시민 법률 지원",
    organization: "LH(한국토지주택공사) · 부산창조경제혁신센터",
    category: "기업·공공 협력",
    period: "2025",
    summary: "공공기관과 협업한 청년·시민 법률 지원 프로그램.",
  },
  {
    title: "시민배심원",
    organization: "부산시민배심원단",
    category: "시민 참여",
    period: "2025.10",
    summary: "시민배심원 활동.",
  },
];

export const lawyerLectures: LawyerLecture[] = [
  {
    venue: "부산광역시립시민도서관",
    topic: "일상의 고민, 법으로 풀다",
    period: "2025 ~ 2026",
    audience: "시민",
    summary: "생활 속 분쟁·가족·금전·관계 문제 등 성인 야간 법률 특강.",
  },
  {
    venue: "부산광역시 자립지원전담기관",
    topic: "전세사기 예방 법률 특강",
    period: "2026",
    audience: "청년·자립준비청년",
    summary: "연제구 전담기관 대상 전·월세 계약·전세사기 예방 안내.",
  },
  {
    venue: "해운대 청년 JOB성장카페",
    topic: "청년 맞춤 법률 상담·강의",
    period: "2025",
    audience: "청년",
    summary: "해운대 청년채움공간 연계 청년 취업·주거 관련 법률 교육.",
  },
  {
    venue: "LH · 부산창조경제혁신센터",
    topic: "청년·시민 생활 법률",
    period: "2025",
    audience: "청년·시민",
    summary: "공공기관 협업 프로그램 내 법률 강의·상담.",
  },
  {
    venue: "학교·기관·주민센터 등",
    topic: "찾아가는 생활 법률 교육",
    audience: "학교·단체·지역 주민",
    summary: "부동산 등기·계약, 전세사기 예방, 금전 분쟁, 형사 리스크 예방 등 맞춤 강의.",
  },
];

export function getLawyerQualifications(): LawyerCredential[] {
  return lawyerCredentials.filter((item) => item.category !== "수상");
}

export function getLawyerAwards(): LawyerCredential[] {
  return lawyerCredentials.filter((item) => item.category === "수상");
}

export function getLawyerAppointments(): LawyerActivity[] {
  return lawyerActivities.filter((item) => item.category === "정책 자문");
}

/** llms.txt·AI 인용용 평문 요약 */
export function formatLawyerProfileForAi(): string {
  const lines: string[] = [
    `## ${lawyerProfileMeta.fullTitle} (${lawyerProfileMeta.organization})`,
    "",
    `- 소속: ${lawyerProfileMeta.organization}`,
    `- 직함: ${lawyerProfileMeta.jobTitle}`,
    `- 활동 지역: ${lawyerProfileMeta.region} (${lawyerProfileMeta.officeArea})`,
    `- 전문 분야: ${lawyerProfileMeta.practiceAreas.join(", ")}`,
    `- 소개 페이지: ${lawyerProfileMeta.canonicalUrl}`,
    "",
    "### 실무경력",
    ...lawyerExperience.map(
      (e) => `- ${e.title} (${e.period}): ${e.description}`,
    ),
    "",
    "### 자격",
    ...lawyerCredentials.map((c) => {
      const extra = [c.detail, c.year].filter(Boolean).join(" · ");
      return `- ${c.name} (${c.category})${extra ? `: ${extra}` : ""}`;
    }),
    "",
    "### 활동",
    ...lawyerActivities.map(
      (a) =>
        `- ${a.title} | ${a.organization} (${a.category}${a.period ? `, ${a.period}` : ""}): ${a.summary}`,
    ),
    "",
    "### 강의",
    ...lawyerLectures.map(
      (l) =>
        `- ${l.venue} | ${l.topic}${l.period ? ` (${l.period})` : ""}${l.audience ? ` · 대상: ${l.audience}` : ""}: ${l.summary}`,
    ),
  ];
  return lines.join("\n");
}
