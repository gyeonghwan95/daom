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
};

export const lectureNavGroups: NavGroup[] = [
  {
    title: "강의 안내",
    links: [
      { href: "/법률강의", label: "전체 강의 안내" },
      { href: "/부산법률강사", label: "법률 강사 섭외" },
      { href: "/부산법무사강의", label: "부산 법무사 강의" },
      { href: "/강사소개", label: "강사 소개" },
      { href: "/강의이력", label: "강의 이력" },
      { href: "/강의문의", label: "강의 문의" },
    ],
  },
  {
    title: "주제·기관별",
    links: [
      { href: "/전세사기예방교육", label: "전세사기 예방" },
      { href: "/청년생활법률특강", label: "청년 생활법률" },
      { href: "/부산도서관법률특강", label: "도서관 법률특강" },
      { href: "/부산기관법률특강", label: "기관·단체 특강" },
      { href: "/디지털법률교육", label: "디지털 법률" },
      { href: "/창업법률교육", label: "창업 법률" },
      { href: "/기업법률교육", label: "기업 법률" },
      { href: "/공공기관법률교육", label: "공공기관 법률" },
      { href: "/학교법률교육", label: "학교·진로" },
      { href: "/법무사진로특강", label: "법무사 진로특강" },
    ],
  },
];

export const mainNavigation: NavItem[] = [
  { href: "/about", label: "소개" },
  { href: "/office", label: "사무소" },
  { href: "/services", label: "업무안내" },
  {
    href: "/법률강의",
    label: "강의·특강",
    groups: lectureNavGroups,
  },
  { href: "/situations", label: "상황별 법률문제" },
  { href: "/tools", label: "법률 계산기" },
  { href: "/busan-legal-map", label: "부산 법률지도" },
  { href: "/glossary", label: "법률 용어사전" },
  { href: "/자가진단", label: "자가진단" },
  { href: "/blog", label: "블로그" },
  { href: "/media", label: "언론·활동" },
  { href: "/reviews", label: "고객후기" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "상담" },
  { href: "/location", label: "오시는 길" },
];

/** 현재 경로가 메뉴 항목과 일치하는지 (하위 페이지 포함) */
export function isNavItemActive(pathname: string, href: string): boolean {
  const normalized = pathname.split("?")[0].split("#")[0];
  if (href === "/") return normalized === "/";
  if (href === "/법률강의") {
    return (
      normalized === href ||
      normalized.startsWith("/강의이력") ||
      normalized === "/강사소개" ||
      normalized === "/강의문의" ||
      normalized === "/부산법률강사" ||
      normalized === "/부산법무사강의" ||
      normalized === "/부산도서관법률특강" ||
      normalized === "/부산기관법률특강" ||
      normalized === "/전세사기예방교육" ||
      normalized === "/청년생활법률특강" ||
      normalized === "/디지털법률교육" ||
      normalized === "/창업법률교육" ||
      normalized === "/기업법률교육" ||
      normalized === "/학교법률교육" ||
      normalized === "/공공기관법률교육" ||
      normalized === "/법무사진로특강"
    );
  }
  return normalized === href || normalized.startsWith(`${href}/`);
}
