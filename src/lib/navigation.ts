import { buildCollaborationNavGroups } from "@/lib/b2b/collaboration-registry";
import { isCollaborationPath } from "@/lib/b2b/collaboration-registry";

export type NavLink = {
  href: string;
  label: string;
};

export type NavGroup = {
  title: string;
  links: NavLink[];
};

export type NavItem = {
  href: string;
  label: string;
  /** 하위 메뉴(있을 때만 드롭다운/아코디언) */
  groups?: NavGroup[];
  /** 협업문의 메가메뉴(5열+CTA) */
  megaMenu?: boolean;
};

export const lectureNavGroups: NavGroup[] = [
  {
    title: "강의·특강",
    links: [
      { href: "/법률강의", label: "강의·특강 안내" },
      { href: "/강의이력", label: "강의 이력" },
      { href: "/강사소개", label: "강사 소개" },
      { href: "/강의문의", label: "강의 문의" },
    ],
  },
  {
    title: "주제 안내",
    links: [
      { href: "/전세사기예방교육", label: "전세사기 예방교육" },
      { href: "/청년생활법률특강", label: "청년 법률교육" },
      { href: "/창업법률교육", label: "창업 법률교육" },
      { href: "/기업법률교육", label: "기업 법률교육" },
      { href: "/법무사진로특강", label: "법무사 진로특강" },
    ],
  },
];

/**
 * JSON-LD SiteNavigationElement 전용. 화면 메뉴와 분리한다.
 * 짧은 일반명사(소개·상담)와 타지역(울산) 앵커는 넣지 않는다.
 */
export const siteSitelinkItems = [
  { href: "/about", label: "법무사 소개" },
  { href: "/services", label: "업무안내" },
  { href: "/contact", label: "상담 문의" },
  { href: "/location", label: "오시는 길" },
  { href: "/업무사례", label: "업무 사례" },
  { href: "/reviews", label: "고객후기" },
] as const;

const servicesNavItem: NavItem = {
  href: "/services",
  label: "업무안내",
  groups: [
    {
      title: "주요 업무",
      links: [
        { href: "/services", label: "업무안내 전체" },
        { href: "/부산법무사", label: "부산 업무 안내" },
        { href: "/부산등기법무사", label: "등기업무" },
        { href: "/부산부동산등기", label: "부동산등기" },
        { href: "/부산건물등기", label: "건물·건축물등기" },
        { href: "/부산법인등기", label: "법인등기" },
        { href: "/법인변경등기", label: "법인 변경등기" },
        { href: "/부산상속등기", label: "상속등기" },
        { href: "/부산개인회생", label: "개인회생" },
      ],
    },
    {
      title: "전국 의뢰 업무",
      links: [
        { href: "/전국업무", label: "전국 업무 안내" },
        { href: "/전국상속등기", label: "전국 상속등기" },
        { href: "/전국유증등기", label: "전국 유증등기" },
        { href: "/여러지역상속부동산등기", label: "여러 지역 상속부동산" },
        { href: "/전국법인본점이전등기", label: "전국 법인 본점이전" },
        { href: "/전국공동담보등기", label: "전국 공동담보등기" },
      ],
    },
  ],
};

const casesNavItem: NavItem = {
  href: "/업무사례",
  label: "업무 사례",
  groups: [
    {
      title: "부산 업무사례",
      links: [
        { href: "/업무사례", label: "전체 업무 사례" },
        { href: "/업무사례/지역별", label: "부산 지역 업무사례" },
        { href: "/업무사례/업무별", label: "업무별 업무 사례" },
      ],
    },
    {
      title: "전국 업무사례",
      links: [
        { href: "/업무사례/전국업무사례", label: "전국 업무사례" },
        { href: "/업무사례/전국상속등기법무사", label: "전국 상속등기" },
        { href: "/업무사례/지역별상속등기법무사", label: "지역별 상속등기" },
        { href: "/업무사례/경남법무사업무", label: "경남 업무사례" },
        { href: "/업무사례/울산법무사업무", label: "울산 업무사례" },
        { href: "/업무사례/대구법무사업무", label: "대구 업무사례" },
        { href: "/업무사례/경북법무사업무", label: "경북 업무사례" },
        { href: "/업무사례/전국법인본점이전등기", label: "전국 법인 본점이전" },
        { href: "/업무사례/전국비대면법무사", label: "전국 비대면 업무" },
      ],
    },
  ],
};

/**
 * 헤더·모바일 공통 주 메뉴.
 * 기존에 연결돼 있던 페이지는 모두 최상단에 둔다.
 */
export const mainNavigation: NavItem[] = [
  { href: "/about", label: "법무사 소개" },
  { href: "/office", label: "사무소" },
  servicesNavItem,
  {
    href: "/partners",
    label: "협업문의",
    megaMenu: true,
    groups: buildCollaborationNavGroups(),
  },
  casesNavItem,
  {
    href: "/법률강의",
    label: "강의·특강",
    groups: lectureNavGroups,
  },
  { href: "/자가진단", label: "자가진단" },
  { href: "/situations", label: "상황별 안내" },
  { href: "/tools", label: "법률 계산기" },
  { href: "/busan-legal-map", label: "부산 법률지도" },
  { href: "/glossary", label: "업무 용어" },
  { href: "/blog", label: "블로그" },
  { href: "/media", label: "언론·활동" },
  { href: "/reviews", label: "고객후기" },
  { href: "/faq", label: "FAQ" },
  { href: "/공지사항", label: "공지사항" },
  { href: "/contact", label: "상담 문의" },
  { href: "/location", label: "오시는 길" },
];

/** 퍼센트 인코딩·NFC·트레일링 슬래시를 맞춰 메뉴 경로를 비교한다. */
export function normalizeNavPath(pathname: string): string {
  const trimmed = pathname.split("?")[0].split("#")[0].trim() || "/";
  let decoded = trimmed;
  try {
    if (/%[0-9A-Fa-f]{2}/.test(trimmed)) {
      decoded = decodeURIComponent(trimmed);
    }
  } catch {
    decoded = trimmed;
  }
  const nfc = decoded.normalize("NFC");
  if (nfc.length > 1 && nfc.endsWith("/")) return nfc.slice(0, -1);
  return nfc || "/";
}

function hrefMatchScore(pathname: string, href: string): number {
  const path = normalizeNavPath(pathname);
  const target = normalizeNavPath(href);
  if (target === "/") return path === "/" ? 1 : -1;
  if (path === target) return target.length + 100;
  if (path.startsWith(`${target}/`)) return target.length;
  return -1;
}

const LECTURE_EXTRA_HREFS = [
  "/강의이력",
  "/강사소개",
  "/강의문의",
  "/부산법률전문가",
  "/부산법률강사",
  "/부산법무사강의",
  "/부산도서관법률특강",
  "/부산기관법률특강",
  "/부산사회복지기관강사",
  "/부산강사섭외비용",
  "/부산강사섭외체크리스트",
  "/기관특강주제추천",
  "/강의시간별구성",
  "/전세사기예방교육",
  "/청년생활법률특강",
  "/디지털법률교육",
  "/창업법률교육",
  "/기업법률교육",
  "/학교법률교육",
  "/공공기관법률교육",
  "/법무사진로특강",
] as const;

function extraMatchScore(pathname: string, item: NavItem): number {
  const path = normalizeNavPath(pathname);
  let best = -1;
  const consider = (href: string) => {
    const score = hrefMatchScore(path, href);
    if (score > best) best = score;
  };

  if (item.href === "/partners" && isCollaborationPath(path)) {
    consider(path);
  }
  if (item.href === "/업무사례") {
    consider("/cases");
    consider("/services/cases");
  }
  if (item.href === "/법률강의") {
    for (const href of LECTURE_EXTRA_HREFS) consider(href);
  }
  if (item.href === "/services" && path.startsWith("/전국")) {
    consider(path);
  }
  if (item.href === "/자가진단" && /(^|\/)[^/]*자가진단$/.test(path)) {
    consider(path);
  }
  if (item.href === "/media") {
    consider("/press");
  }
  if (item.href === "/공지사항") {
    consider("/notices");
  }
  return best;
}

function navItemMatchScore(pathname: string, item: NavItem): number {
  let best = hrefMatchScore(pathname, item.href);
  for (const group of item.groups ?? []) {
    for (const link of group.links) {
      const score = hrefMatchScore(pathname, link.href);
      if (score > best) best = score;
    }
  }
  const extra = extraMatchScore(pathname, item);
  if (extra > best) best = extra;
  return best;
}

function winningNavHref(pathname: string): string | null {
  let winner: { href: string; score: number } | null = null;
  for (const item of mainNavigation) {
    const score = navItemMatchScore(pathname, item);
    if (score < 0) continue;
    if (!winner || score > winner.score) {
      winner = { href: item.href, score };
    }
  }
  return winner?.href ?? null;
}

/** 현재 경로가 해당 GNB 항목(또는 하위 연결 URL)에 해당하는지 */
export function isNavItemActive(pathname: string, href: string): boolean {
  return winningNavHref(pathname) === href;
}

export function isExactNavHref(pathname: string, href: string): boolean {
  return hrefMatchScore(pathname, href) >= 100;
}

/** 드롭다운·모바일 하위 링크. 허브 URL은 정확히 맞을 때만 현재 페이지로 본다. */
export function isNavLinkActive(
  pathname: string,
  href: string,
  hubHref?: string,
): boolean {
  const target = normalizeNavPath(href);
  if (hubHref && target === normalizeNavPath(hubHref)) {
    return isExactNavHref(pathname, href);
  }
  return hrefMatchScore(pathname, href) >= 0;
}
