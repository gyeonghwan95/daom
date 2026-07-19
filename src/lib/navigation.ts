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
  {
    href: "/services",
    label: "업무안내",
    groups: [
      {
        title: "주요 업무",
        links: [
          { href: "/services", label: "업무안내 전체" },
          { href: "/부산부동산등기", label: "부동산등기" },
          { href: "/부산법인등기", label: "법인등기" },
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
  },
  {
    href: "/partners",
    label: "협업문의",
    megaMenu: true,
    groups: buildCollaborationNavGroups(),
  },
  {
    href: "/업무사례",
    label: "업무 사례",
    groups: [
      {
        title: "사례 안내",
        links: [
          { href: "/cases", label: "전체 업무 사례" },
          { href: "/업무사례/지역별", label: "부산 지역 업무사례" },
          { href: "/업무사례/업무별", label: "업무별 업무 사례" },
          { href: "/업무사례/경남법무사업무", label: "경남 지역 업무사례" },
          { href: "/업무사례/울산법무사업무", label: "울산 지역 업무사례" },
          { href: "/업무사례/대구법무사업무", label: "대구 지역 업무사례" },
          { href: "/업무사례/경북법무사업무", label: "경북 지역 업무사례" },
        ],
      },
      {
        title: "전국 업무사례",
        links: [
          { href: "/업무사례/전국업무사례", label: "전국 업무사례" },
          { href: "/업무사례/전국상속등기법무사", label: "전국 상속등기" },
          { href: "/업무사례/지역별상속등기법무사", label: "지역별 상속등기" },
          { href: "/업무사례/전국법인본점이전등기", label: "전국 법인 본점이전" },
          { href: "/업무사례/전국비대면법무사", label: "전국 비대면 업무" },
        ],
      },
    ],
  },
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
  if (href === "/partners") {
    return isCollaborationPath(normalized);
  }
  if (href === "/업무사례") {
    return (
      normalized === "/업무사례" ||
      normalized.startsWith("/업무사례/") ||
      normalized === "/cases" ||
      normalized.startsWith("/cases/") ||
      normalized.startsWith("/services/cases/")
    );
  }
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
  if (href === "/services") {
    return (
      normalized === href ||
      normalized.startsWith("/services/") ||
      normalized === "/전국업무" ||
      normalized.startsWith("/전국") ||
      normalized === "/여러지역상속부동산등기"
    );
  }
  return normalized === href || normalized.startsWith(`${href}/`);
}
