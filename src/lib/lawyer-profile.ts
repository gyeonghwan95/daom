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
  category: "수상" | "정책 자문" | "기업·공공 협력" | "국제·법무사회" | "시민 참여" | "언론";
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
    period: "2025.06 ~ 현재",
    title: "다옴법무사사무소 대표 법무사",
    description:
      "부산 해운대구·센텀 사무소에서 상속등기·상속포기·한정승인·부동산등기·법인등기·개인회생·파산·민사집행 사건을 직접 상담하고 진행합니다. 기업·공공·시민 대상 법률 강연도 병행합니다.",
  },
  {
    period: "2025.06 ~",
    title: "지역 기업 법률지원",
    description:
      "명례일반산업단지와 법률지원 MOU를 체결하고 등기·계약·분쟁 예방 자문을 수행합니다.",
  },
  {
    period: "2025 ~",
    title: "공공·청년 법률 지원",
    description:
      "LH·부산창조경제혁신센터·해운대청년채움공간·부산청년 JOB카페 등과 협업해 청년·시민 대상 법률 상담·특강을 운영합니다. 부산지방법원 동부지원 무료법률상담(부산지방법무사협회)에도 참여합니다.",
  },
  {
    period: "2025 ~",
    title: "정책·위원 활동",
    description:
      "기획예산처 청년자문단, 부산광역시 청년정책조정위원회, 해운대구구정 정책자문위원회, 민주평화통일자문회의 자문위원으로 활동합니다.",
  },
  {
    period: "2020.03 ~ 2021.02",
    title: "부산교육대학교 소프트웨어교육사업단 연구원",
    description:
      "기획처 소프트웨어교육사업단에서 SW·AI 교육 프로그램 개발·운영과 사업 기획·행정 업무를 담당했습니다.",
  },
  {
    period: "2017.08 ~ 2019.02",
    title: "동서대학교 교수학습개발센터 연구원",
    description:
      "교무처 교수학습개발센터에서 학습 프로그램 개발·운영과 연구·행정 업무를 수행했습니다.",
  },
];

export const lawyerCredentials: LawyerCredential[] = [
  {
    name: "법무사",
    category: "국가자격",
    detail: "법원행정처 · 상속등기·부동산등기·법인등기·개인회생·파산 등",
    year: "2025.02.05",
  },
  {
    name: "공인중개사",
    category: "국가자격",
    detail: "한국산업인력공단 · 부동산 거래·임대차 실무",
    year: "2021.12.13",
  },
  {
    name: "신용관리사",
    category: "국가자격",
    detail: "한국금융연수원 · 채무·신용 회복(개인회생·파산) 상담",
    year: "2024.09.19",
  },
  {
    name: "직업상담사 2급",
    category: "국가자격",
    detail: "한국산업인력공단 · 진로·취업 상담 역량",
    year: "2019.08.16",
  },
  {
    name: "중등학교정교사 2급",
    category: "학력·교육",
    detail: "교육부 · 법률 강의·교육 설계에 활용",
    year: "2016.02.01",
  },
  {
    name: "부산대학교 행정대학원 석사 과정",
    category: "학력·교육",
    detail: "행정학과 재학 · 공공·정책 이해 강화",
    year: "2026.03 ~",
  },
  {
    name: "신라대학교 교육대학원 석사",
    category: "학력·교육",
    detail: "교육학과 졸업 · 정식 교사 자격·법률 에듀케이터",
    year: "2016.08",
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
    title: "기획예산처 1기 청년자문단 자문위원",
    organization: "기획예산처",
    category: "정책 자문",
    period: "2026.06 ~ 2027.06",
    summary: "장관 임명 청년자문단으로 청년 정책 자문에 참여합니다.",
  },
  {
    title: "부산광역시 청년정책조정위원회 전문가 자문위원",
    organization: "부산광역시 청년정책조정위원회",
    category: "정책 자문",
    period: "2026.04 ~ 2028.04",
    summary: "부산 청년 정책 수립·조정에 전문가 자문위원으로 참여합니다.",
  },
  {
    title: "해운대구구정 정책자문위원회 자문위원",
    organization: "해운대구구정 정책자문위원회",
    category: "정책 자문",
    period: "2025.10 ~ 2027.10",
    summary: "해운대구 지역 정책 자문에 참여합니다.",
  },
  {
    title: "민주평화통일자문회의 자문위원",
    organization: "민주평화통일자문회의",
    category: "정책 자문",
    period: "2025.11 ~ 2027.11",
    summary: "국가 정책 자문위원으로 활동합니다.",
  },
  {
    title: "부산지방법원 동부지원 무료법률상담",
    organization: "부산지방법무사협회",
    category: "시민 참여",
    period: "2025.08 ~",
    summary: "동부지원 무료법률상담에 참여해 시민 법률 접근성을 높입니다.",
  },
  {
    title: "부산 MBC NEWS 전문가 출연",
    organization: "부산 MBC NEWS",
    category: "언론",
    period: "2026.06.24",
    summary: "고유가 피해지원금 제도 관련 전문가 촬영에 참여했습니다.",
  },
  {
    title: "공식 사회·통역",
    organization: "부산지방법무사회 · 일본 나가사키 사법서사회 자매결연",
    category: "국제·법무사회",
    period: "2025.07.02",
    summary: "협약 행사에서 대표 일본어 통역 및 사회를 담당했습니다.",
  },
  {
    title: "기업 법률지원 MOU",
    organization: "명례일반산업단지",
    category: "기업·공공 협력",
    period: "2025.06.26",
    summary: "산업단지 법률지원 협약 체결·자문.",
  },
  {
    title: "청년·시민 법률 지원",
    organization: "LH · 부산창조경제혁신센터",
    category: "기업·공공 협력",
    period: "2025.07 ~ 09",
    summary: "공공기관과 협업한 청년·시민 법률 지원·자문 프로그램.",
  },
  {
    title: "민사소송·민사집행학술회",
    organization: "제30기 법무사 동기회",
    category: "국제·법무사회",
    period: "2025.05.16 ~",
    summary: "동기회 산하 민사소송 및 민사집행학술회 소속 활동.",
  },
  {
    title: "시민배심원",
    organization: "부산시민배심원단",
    category: "시민 참여",
    period: "2025.10",
    summary: "부산시민배심원단 활동.",
  },
];

/** /about EEAT 강의 카드 — 기관·주제 요약 (상세 일자는 실적 표·강의이력) */
export const lawyerLectures: LawyerLecture[] = [
  {
    venue: "부산광역시립시민도서관",
    topic: "전·월세·생활분쟁·디지털·형사 예방 특강",
    period: "2026.05 ~ 06",
    audience: "시민",
    summary:
      "전·월세계약, 생활 속 분쟁, 명예훼손·모욕·개인정보 보호 등 성인 야간 생활법률 특강.",
  },
  {
    venue: "부산광역시 자립지원전담기관",
    topic: "전세사기 예방·일상분쟁 생존법",
    period: "2026.05 ~ 07",
    audience: "청년·자립준비청년",
    summary: "전·월세 계약 점검과 일상분쟁 대응을 사례 중심으로 안내.",
  },
  {
    venue: "해운대청년채움공간",
    topic: "주거·디지털·창업·생활법률 특강",
    period: "2025 ~ 2026",
    audience: "청년",
    summary: "주거계약, 디지털 법률, 창업법률, 형사 리스크 예방 등 청년 맞춤 특강.",
  },
  {
    venue: "부산청년 JOB카페",
    topic: "전세사기 예방·일상분쟁 생존법",
    period: "2025.08 ~ 2026.01",
    audience: "청년",
    summary: "전세사기 예방접종·일상분쟁 생존법 등 연속 오프라인 특강.",
  },
  {
    venue: "창원청년비전센터",
    topic: "청년이 꼭 알아야 할 생활법률",
    period: "2026.07.02",
    audience: "청년",
    summary: "창원 지역 청년 대상 생활법률·예방 교육.",
  },
  {
    venue: "양산제일고등학교",
    topic: "전문가 진로 특강",
    period: "2026.05.21",
    audience: "고등학생",
    summary: "법무사 직업·진로와 생활 속 법률 기초 안내.",
  },
  {
    venue: "LH · 부산창조경제혁신센터",
    topic: "청년·시민 생활 법률 자문·강의",
    period: "2025",
    audience: "청년·시민",
    summary: "공공기관 협업 프로그램 내 법률 강의·상담.",
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
