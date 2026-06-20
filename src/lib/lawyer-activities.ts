import { siteImages, type SiteImageAsset } from "@/lib/site-images";

export type ActivityHighlight = {
  title: string;
  body: string;
};

export type ActivityRole = {
  title: string;
  period: string;
};

export type LawyerActivitySection = {
  id: "community" | "policy" | "education";
  title: string;
  subtitle: string;
  homeSummary: string;
  image: SiteImageAsset;
  highlights?: ActivityHighlight[];
  roles?: ActivityRole[];
};

export const lawyerQualifications = [
  "법무사",
  "공인중개사",
  "신용관리사",
  "교육대학원 석사 (정식 교사 자격)",
  "대한법무사협회장 표창 (2026.05.28)",
] as const;

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
    id: "policy",
    title: "정책으로 기여하는 법률 전문가",
    subtitle:
      "법률 실무를 넘어 부산, 대한민국의 발전을 위한 정책 자문 활동에도 적극 참여하고 있습니다.",
    homeSummary:
      "협회 표창과 각종 정책자문위원 활동으로 지역과 국가에 기여합니다.",
    image: siteImages.media.policy,
    roles: [
      { title: "대한법무사협회 표창", period: "2026.05.28" },
      { title: "기획예산처 1기 청년자문단", period: "2026.06 ~" },
      {
        title: "부산광역시 청년정책조정위원회 전문가 위원",
        period: "2026.04.01 ~ 2028.03.31",
      },
      {
        title: "해운대구정 정책자문위원회 자문위원",
        period: "2025.10.31 ~ 2027.10.30",
      },
      {
        title: "제22기 민주평화통일자문회의 자문위원",
        period: "2025.11.01 ~ 2027.10.31",
      },
      { title: "부산시민배심원단", period: "2025.10" },
    ],
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
        title: "검증된 전문가",
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
