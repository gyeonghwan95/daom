export const mainNavigation = [
  { href: "/about", label: "소개" },
  { href: "/office", label: "사무소" },
  { href: "/services", label: "업무안내" },
  { href: "/자가진단", label: "자가진단" },
  { href: "/blog", label: "포스팅" },
  { href: "/media", label: "언론·활동" },
  { href: "/reviews", label: "고객후기" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "상담" },
  { href: "/location", label: "오시는 길" },
] as const;

export type NavItem = (typeof mainNavigation)[number];

/** 현재 경로가 메뉴 항목과 일치하는지 (하위 페이지 포함) */
export function isNavItemActive(pathname: string, href: string): boolean {
  const normalized = pathname.split("?")[0].split("#")[0];
  if (href === "/") return normalized === "/";
  return normalized === href || normalized.startsWith(`${href}/`);
}
