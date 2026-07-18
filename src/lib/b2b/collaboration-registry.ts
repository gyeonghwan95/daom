/**
 * 협업문의 메뉴·허브·디렉터리 중앙 데이터.
 * 상위 GNB 라벨은 항상 "협업문의"이며, 복대리 등은 하위·상세에서만 사용한다.
 */

export type CollaborationCategory =
  | "guide"
  | "delegation"
  | "real-estate"
  | "construction"
  | "corporate-public"
  | "special-project";

export type CollaborationLink = {
  href: string;
  label: string;
  description?: string;
  category: CollaborationCategory;
  /** 메뉴에 노출 (상세 URL 전부 노출 금지) */
  inMegaMenu?: boolean;
  inMobileMenu?: boolean;
  inFooter?: boolean;
  /** partners#all-services 디렉터리에 표시 */
  inDirectory?: boolean;
  phase?: 1 | 2;
  status?: "live" | "backlog";
};

/** 메가메뉴·모바일·디렉터리에 쓰는 대표 링크 (live만) */
export const collaborationLinks: CollaborationLink[] = [
  // 안내
  {
    href: "/partners",
    label: "협업문의 종합안내",
    description: "전문직·기업·기관 협업 분야를 한곳에서 확인합니다.",
    category: "guide",
    inMegaMenu: true,
    inMobileMenu: true,
    inFooter: true,
    inDirectory: false,
    status: "live",
  },
  {
    href: "/partners#principles",
    label: "협업 진행방식",
    description: "역할 분담·일정·자료 전달의 기본 원칙을 안내합니다.",
    category: "guide",
    inMegaMenu: true,
    inMobileMenu: true,
    status: "live",
  },
  {
    href: "/partners#all-services",
    label: "협업 가능 업무",
    description: "복대리·부동산·건축·기업·특수등기 분야를 모았습니다.",
    category: "guide",
    inMegaMenu: true,
    status: "live",
  },
  {
    href: "/partners#prep",
    label: "협업 전 준비사항",
    description: "문의 전에 알려주시면 좋은 기본 정보를 정리합니다.",
    category: "guide",
    inMegaMenu: true,
    status: "live",
  },
  {
    href: "/협업문의",
    label: "협업 문의서 작성",
    description: "업무 종류와 일정을 알려주시면 가능 범위부터 확인합니다.",
    category: "guide",
    inMegaMenu: true,
    inMobileMenu: true,
    inFooter: true,
    status: "live",
  },

  // 복대리·현지업무
  {
    href: "/부산법무사복대리",
    label: "부산 법무사 복대리",
    description: "타지역 법무사·법무법인의 부산 현지 등기 협업을 안내합니다.",
    category: "delegation",
    inMegaMenu: true,
    inMobileMenu: true,
    inFooter: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산등기복대리",
    label: "부산 등기 복대리(접수·관할)",
    description: "관할 등기소·접수·보정 체크포인트를 확인합니다.",
    category: "delegation",
    inMegaMenu: true,
    inDirectory: true,
    status: "live",
  },
  {
    href: "/부산부동산등기복대리",
    label: "부산 부동산등기 복대리",
    description: "부산 소재 부동산등기의 현지 접수·진행 확인이 필요할 때.",
    category: "delegation",
    inMegaMenu: true,
    inMobileMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산법인등기복대리",
    label: "부산 법인등기 복대리",
    description: "임원변경·본점이전 등 법인등기의 부산 관할 협업.",
    category: "delegation",
    inMegaMenu: true,
    inMobileMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산등기접수협업",
    label: "부산 등기 접수 협업",
    description: "신청서 준비 상태와 접수·접수증 공유 범위를 확인합니다.",
    category: "delegation",
    inMegaMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산등기보정업무",
    label: "부산 등기 보정 업무",
    description: "보정 안내·기한·보완 서류와 수행 가능 범위를 검토합니다.",
    category: "delegation",
    inMegaMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산등기소현지업무",
    label: "부산 등기소 현지업무",
    description: "현지 방문·서류 제출·진행 확인이 필요한 경우를 안내합니다.",
    category: "delegation",
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산원거리등기협업",
    label: "부산 원거리 등기 협업",
    description: "원본 이동·일정·연락 창구를 맞춰 부산 현지업무를 조율합니다.",
    category: "delegation",
    inDirectory: true,
    status: "live",
    phase: 1,
  },

  // 부동산·중개
  {
    href: "/부산부동산협력법무사",
    label: "부산 부동산 협력 법무사",
    description: "잔금일·서류·담보 연동 등 거래 이후 등기 절차를 연결합니다.",
    category: "real-estate",
    inMegaMenu: true,
    inMobileMenu: true,
    inFooter: true,
    inDirectory: true,
    status: "live",
  },
  {
    href: "/부산잔금등기협업",
    label: "부산 잔금일 등기 협업",
    description: "잔금일과 매도·매수 서류, 근저당 동시 진행을 조율합니다.",
    category: "real-estate",
    inMegaMenu: true,
    inMobileMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산잔금일법무사",
    label: "잔금일 법무사 안내",
    description: "잔금일 기준 등기 준비 체크포인트를 확인합니다.",
    category: "real-estate",
    inDirectory: true,
    status: "live",
  },
  {
    href: "/부산신축건물보존등기",
    label: "신축건물 보존등기",
    description: "사용승인 이후 보존등기 절차와 건축·시행 협업을 안내합니다.",
    category: "real-estate",
    inMegaMenu: true,
    inMobileMenu: true,
    inDirectory: true,
    status: "live",
  },
  {
    href: "/부산신축건물보존등기#architect-collab",
    label: "건축사 등기 협업",
    description: "대장·사용승인 이후 보존등기로 이어지는 역할을 확인합니다.",
    category: "real-estate",
    inMegaMenu: true,
    status: "live",
  },
  {
    href: "/부산신축건물보존등기#building-checkpoints",
    label: "오피스텔·빌라·상가 보존등기",
    description: "건물 유형별 체크포인트를 보존등기 안내에서 확인합니다.",
    category: "real-estate",
    inMegaMenu: true,
    status: "live",
  },

  // 건축·시행·집단
  {
    href: "/부산시행사등기",
    label: "시행사 등기업무",
    description: "보존·분양·담보가 연결되는 프로젝트 범위와 일정을 검토합니다.",
    category: "construction",
    inMegaMenu: true,
    inMobileMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산건설사등기",
    label: "건설사 등기업무",
    description: "건축주·도급 구조에 따른 보존·법인·부동산등기를 확인합니다.",
    category: "construction",
    inMegaMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산집단등기",
    label: "집단등기·대량등기",
    description: "여러 동·호실의 목록·일정·후속 등기 연결을 검토합니다.",
    category: "construction",
    inMegaMenu: true,
    inMobileMenu: true,
    inFooter: true,
    inDirectory: true,
    status: "live",
  },
  {
    href: "/부산분양등기",
    label: "분양등기",
    description: "보존 이후 수분양자 이전·잔금·담보 일정을 정리합니다.",
    category: "construction",
    inMegaMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산건축사등기협업",
    label: "건축사 등기 협업(상세)",
    description: "사용승인·대장·표시 확인과 법무사 역할 구분을 안내합니다.",
    category: "construction",
    inDirectory: true,
    status: "live",
    phase: 1,
  },

  // 기업·기관
  {
    href: "/부산법인등기아웃소싱",
    label: "법인등기 아웃소싱",
    description: "반복 임원·본점·목적 변경등기의 일정 관리를 상담합니다.",
    category: "corporate-public",
    inMegaMenu: true,
    inMobileMenu: true,
    inDirectory: true,
    status: "live",
    phase: 1,
  },
  {
    href: "/부산기업법률자문",
    label: "기업 등기업무",
    description: "법인·기업 부동산등기 등 기업 담당자용 실무를 안내합니다.",
    category: "corporate-public",
    inMegaMenu: true,
    inDirectory: true,
    status: "live",
  },
  {
    href: "/명례산업단지법인등기",
    label: "산업단지 등기업무",
    description: "산업단지 입주기업의 법인·부동산등기 관련 안내입니다.",
    category: "corporate-public",
    inMegaMenu: true,
    inDirectory: true,
    status: "live",
  },
  {
    href: "/공공기관등기업무",
    label: "공공기관 등기업무",
    description: "공문·의결·촉탁 여부를 확인하는 기관 담당자용 안내입니다.",
    category: "corporate-public",
    inMegaMenu: true,
    inMobileMenu: true,
    inFooter: true,
    inDirectory: true,
    status: "live",
  },

  // 특수
  {
    href: "/부산신탁등기",
    label: "신탁등기",
    description: "신탁 설정·변경·말소와 관련 자료를 먼저 확인합니다.",
    category: "special-project",
    inDirectory: true,
    status: "live",
  },
  {
    href: "/특수등기의뢰",
    label: "특수 등기 의뢰",
    description: "정형화하기 어려운 특수 등기는 개요를 먼저 검토합니다.",
    category: "special-project",
    inDirectory: true,
    inMobileMenu: true,
    status: "live",
  },
  {
    href: "/부산재개발등기",
    label: "재개발 등기",
    description: "정비사업·재개발 관련 등기 안내입니다.",
    category: "special-project",
    inDirectory: true,
    status: "live",
  },
  {
    href: "/부산재건축등기",
    label: "재건축 등기",
    description: "재건축 관련 등기 절차 안내입니다.",
    category: "special-project",
    inDirectory: true,
    status: "live",
  },
];

export const collaborationCategoryLabels: Record<
  CollaborationCategory,
  string
> = {
  guide: "협업 안내",
  delegation: "복대리·현지업무",
  "real-estate": "부동산·중개 협업",
  construction: "건축·시행·집단등기",
  "corporate-public": "기업·기관 협업",
  "special-project": "특수·프로젝트 등기",
};

/** 데스크톱 메가메뉴·모바일 하위용 NavGroup 형태 */
export function buildCollaborationNavGroups(): {
  title: string;
  links: { href: string; label: string }[];
}[] {
  const areas: {
    title: string;
    categories: CollaborationCategory[];
  }[] = [
    { title: "협업 안내", categories: ["guide"] },
    { title: "복대리·현지업무", categories: ["delegation"] },
    { title: "부동산·중개 협업", categories: ["real-estate"] },
    {
      title: "건축·시행·집단등기",
      categories: ["construction"],
    },
    {
      title: "기업·기관 협업",
      categories: ["corporate-public"],
    },
    {
      title: "특수·프로젝트 등기",
      categories: ["special-project"],
    },
  ];

  return areas.map((area) => ({
    title: area.title,
    links: collaborationLinks
      .filter(
        (link) =>
          link.status === "live" &&
          (link.inMegaMenu || link.inMobileMenu) &&
          area.categories.includes(link.category),
      )
      .slice(0, 7)
      .map((link) => ({ href: link.href, label: link.label })),
  }));
}

export function footerCollaborationLinks(): CollaborationLink[] {
  return collaborationLinks.filter(
    (link) => link.status === "live" && link.inFooter,
  );
}

/** 메가메뉴 5영역 (construction 영역에 시행·집단 포함) */
export const megaMenuAreas: {
  id: string;
  title: string;
  categories: CollaborationCategory[];
}[] = [
  { id: "guide", title: "협업 안내", categories: ["guide"] },
  {
    id: "delegation",
    title: "복대리·현지업무",
    categories: ["delegation"],
  },
  {
    id: "real-estate",
    title: "부동산·건축 협업",
    categories: ["real-estate"],
  },
  {
    id: "projects",
    title: "시행·기업·기관",
    categories: ["construction", "corporate-public"],
  },
];

export function linksForMegaArea(areaId: string): CollaborationLink[] {
  const area = megaMenuAreas.find((a) => a.id === areaId);
  if (!area) return [];
  return collaborationLinks.filter(
    (link) =>
      link.status === "live" &&
      link.inMegaMenu &&
      area.categories.includes(link.category),
  );
}

export function directorySections(): {
  id: CollaborationCategory;
  title: string;
  links: CollaborationLink[];
}[] {
  const order: CollaborationCategory[] = [
    "delegation",
    "real-estate",
    "construction",
    "corporate-public",
    "special-project",
  ];
  return order.map((id) => ({
    id,
    title: collaborationCategoryLabels[id],
    links: collaborationLinks.filter(
      (l) => l.status === "live" && l.inDirectory && l.category === id,
    ),
  }));
}

export const COLLABORATION_ACTIVE_PREFIXES = [
  "/partners",
  "/협업문의",
  "/부산법무사복대리",
  "/부산부동산협력법무사",
  "/부산등기복대리",
  "/부산부동산등기복대리",
  "/부산법인등기복대리",
  "/부산등기접수협업",
  "/부산등기보정업무",
  "/부산등기소현지업무",
  "/부산원거리등기협업",
  "/부산잔금등기협업",
  "/부산시행사등기",
  "/부산건설사등기",
  "/부산분양등기",
  "/부산건축사등기협업",
  "/부산법인등기아웃소싱",
  "/부산집단등기",
  "/법무사협업",
  "/특수등기의뢰",
  "/공공기관등기업무",
  "/부산신축건물보존등기",
] as const;

export function isCollaborationPath(pathname: string): boolean {
  const path = pathname.split("?")[0].split("#")[0];
  return COLLABORATION_ACTIVE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
