import { imagePaths, siteImages, type SiteImageAsset } from "@/lib/site-images";

export type ActivityHighlight = {
  title: string;
  body: string;
};

export type ActivityRole = {
  title: string;
  period: string;
  subtitle?: string;
  image?: SiteImageAsset;
};

export type ExternalActivityItem = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  period: string;
  image: SiteImageAsset;
};

export type LawyerActivitySection = {
  id: "community" | "external" | "education";
  title: string;
  subtitle: string;
  homeSummary: string;
  image: SiteImageAsset;
  highlights?: ActivityHighlight[];
  roles?: ActivityRole[];
};

export const lawyerExternalActivitiesIntro = {
  title: "대외활동",
  subtitle:
    "기업·공공기관과의 협력, 정책 자문, 지역사회 법률 지원 등 법률 전문가로서 지역과 함께하고 있습니다.",
} as const;

function activityImage(
  src: string,
  alt: string,
  width = 800,
  height = 600,
): SiteImageAsset {
  return { src, alt, width, height };
}

/** period 문자열에서 정렬용 시작일(YYYY-MM-DD) 추출 */
export function parseActivitySortKey(period: string): string {
  const head = period.replace(/\s*~\s*.*$/, "").trim();
  const dotted = head.match(/^(\d{4})\.(\d{1,2})(?:\.(\d{1,2}))?/);
  if (dotted) {
    const year = dotted[1];
    const month = dotted[2].padStart(2, "0");
    const day = (dotted[3] ?? "1").padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const yearOnly = head.match(/^(\d{4})$/);
  if (yearOnly) {
    return `${yearOnly[1]}-01-01`;
  }
  return "1970-01-01";
}

function sortExternalActivitiesByNewest(
  items: ExternalActivityItem[],
): ExternalActivityItem[] {
  return [...items].sort((a, b) => {
    const byDate = parseActivitySortKey(b.period).localeCompare(
      parseActivitySortKey(a.period),
    );
    if (byDate !== 0) return byDate;
    return a.title.localeCompare(b.title, "ko");
  });
}

const externalActivityEntries: ExternalActivityItem[] = [
  {
    id: "mou",
    category: "기업 협력",
    title: "명례일반산업단지 MOU",
    subtitle: "83개 기업 법률지원 협약 체결·자문",
    period: "2024",
    image: activityImage(
      imagePaths.activityMou,
      "명례일반산업단지 MOU 법률지원 협약",
    ),
  },
  {
    id: "lh",
    category: "공공기관",
    title: "LH · 부산창경 협업",
    subtitle: "청년·시민 법률 지원 프로그램",
    period: "2025",
    image: activityImage(
      imagePaths.activityLhCollab,
      "LH 부산창조경제혁신센터 협업",
    ),
  },
  {
    id: "youth-space",
    category: "청년 지원",
    title: "해운대 청년채움공간",
    subtitle: "청년 JOB성장카페 법률 상담·강의",
    period: "2025",
    image: activityImage(
      imagePaths.activityYouthSpace,
      "해운대 청년채움공간 법률 강의",
    ),
  },
  {
    id: "intl",
    category: "국제 교류",
    title: "나가사키 사법서사회",
    subtitle: "부산법무사회 자매결연 행사 사회·통역",
    period: "2025",
    image: activityImage(
      imagePaths.activityNagasaki,
      "나가사키 사법서사회 국제 교류",
    ),
  },
  {
    id: "award",
    category: "수상",
    title: "대한법무사협회장 표창",
    subtitle: "법무 업무 성실 수행·지역 기여",
    period: "2026.05.28",
    image: siteImages.about.policy.barAssociationAward,
  },
  {
    id: "budget-youth",
    category: "정책 자문",
    title: "기획예산처 1기 청년자문단",
    subtitle: "청년 정책 자문 참여",
    period: "2026.06 ~",
    image: siteImages.about.policy.youthBudgetAdvisory,
  },
  {
    id: "busan-youth",
    category: "정책 자문",
    title: "부산광역시 청년정책조정위원회",
    subtitle: "전문가 위원 활동",
    period: "2026.04 ~ 2028.03",
    image: siteImages.about.policy.busanYouthPolicy,
  },
  {
    id: "haewoondae-policy",
    category: "정책 자문",
    title: "해운대구정책자문위원회",
    subtitle: "자문위원 활동",
    period: "2025.10 ~ 2027.10",
    image: siteImages.about.policy.haewoondaePolicy,
  },
  {
    id: "peace-unification",
    category: "정책 자문",
    title: "제22기 민주평화통일자문회의",
    subtitle: "자문위원 활동",
    period: "2025.11 ~ 2027.10",
    image: siteImages.about.policy.peaceUnification,
  },
  {
    id: "citizen-jury",
    category: "시민 참여",
    title: "부산시민배심원단",
    subtitle: "시민배심원 활동",
    period: "2025.10",
    image: siteImages.about.policy.citizenJury,
  },
];

export const lawyerExternalActivities =
  sortExternalActivitiesByNewest(externalActivityEntries);

function externalActivitiesToRoles(): ActivityRole[] {
  return lawyerExternalActivities.map((item) => ({
    title: item.title,
    period: item.period,
    subtitle: item.subtitle,
    image: item.image,
  }));
}

export const lawyerQualifications = [
  "법무사",
  "공인중개사",
  "신용관리사",
  "교육대학원 석사 (정식 교사 자격)",
  "대한법무사협회장 표창 (2026.05.28)",
] as const;

export type LawyerQualificationCategory = "license" | "education" | "award";

export type LawyerQualificationItem = {
  title: string;
  detail?: string;
  category: LawyerQualificationCategory;
};

export const lawyerQualificationItems: LawyerQualificationItem[] = [
  { title: "법무사", category: "license" },
  { title: "공인중개사", category: "license" },
  { title: "신용관리사", category: "license" },
  {
    title: "교육대학원 석사",
    detail: "정식 교사 자격",
    category: "education",
  },
  {
    title: "대한법무사협회장 표창",
    detail: "2026.05.28",
    category: "award",
  },
];

export const lawyerActivitySections: LawyerActivitySection[] = [
  {
    id: "community",
    title: "기업과 지역사회의 든든한 조력자",
    subtitle:
      "개인 법무를 넘어 지역 산업의 안정적인 성장을 위해 발로 뛰고 있습니다.",
    homeSummary:
      "기업 MOU·공공기관 협업·국제 법무 교류로 지역과 함께합니다.",
    image: siteImages.media.community,
    highlights: [
      {
        title: "기업 법무 특화",
        body: "기장 명례일반산업단지 내 83개 기업과 법률지원 협약(MOU)을 체결한 경험이 있으며, 여러 법률 자문을 진행하고 있습니다.",
      },
      {
        title: "공공기관 협업",
        body: "LH(한국토지주택공사), 부산창조경제혁신센터, 해운대 청년채움공간, 부산 청년JOB성장카페 등 주요 기관과 협업하며 청년 및 지역 시민을 위한 법률 지원 체계를 구축하고 있습니다.",
      },
      {
        title: "국제 교류 가교",
        body: "부산법무사회와 자매결연을 맺은 일본 나가사키 사법서사회의 공식 행사에서 사회 및 통역을 맡아 국제적 법무 교류의 핵심 역할을 수행합니다.",
      },
    ],
  },
  {
    id: "external",
    title: lawyerExternalActivitiesIntro.title,
    subtitle: lawyerExternalActivitiesIntro.subtitle,
    homeSummary:
      "기업 MOU·공공기관 협업부터 정책 자문·수상까지, 지역과 함께하는 활동입니다.",
    image: siteImages.media.policy,
    roles: externalActivitiesToRoles(),
  },
  {
    id: "education",
    title: "생활 속 법률, 쉽게 풀어드립니다",
    subtitle:
      "법무사·공인중개사·신용관리사 자격을 모두 보유한 베테랑이자, 교육대학원 석사(정식 교사 자격 보유) 출신의 법률 에듀케이터입니다.",
    homeSummary:
      "박문각 유튜브 인터뷰부터 찾아가는 법률 교육까지, 일상의 법을 쉽게 전합니다.",
    image: siteImages.media.education,
    highlights: [
      {
        title: "실무 경험과 상담",
        body: "박문각 유튜브 합격 인터뷰(1·2편)를 통해 현실적인 수험법과 만점 공부법을 공유한 바 있습니다.",
      },
      {
        title: "맞춤형 강의",
        body: "부동산 등기·계약, 전세사기 예방, 금전 관계 분쟁, 형사 리스크 예방 등 일상의 법적 상황을 사례 중심으로 재밌게 풀어냅니다.",
      },
      {
        title: "찾아가는 법률 교육",
        body: "학교, 기관, 청년단체, 주민센터 등 생활 법률이 필요한 곳이라면 부산 어디든 달려가 소통하고 있습니다.",
      },
    ],
  },
];

export const homeActivitiesIntro = {
  title: "개인 법무를 넘어, 지역과 함께",
  description:
    "의뢰인 한 분 한 분의 사건을 돌보는 것과 함께, 기업·공공기관·지역사회를 위한 법률 지원과 교육에도 힘쓰고 있습니다.",
} as const;
