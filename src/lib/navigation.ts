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
  { href: "/glossary", label: "등기 용어 안내" },
  { href: "/blog", label: "블로그" },
  { href: "/media", label: "언론·활동" },
  { href: "/reviews", label: "고객후기" },
  { href: "/faq", label: "FAQ" },
  { href: "/공지사항", label: "공지사항" },
  { href: "/contact", label: "상담 문의" },
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
      normalized === "/부산법률전문가" ||
      normalized === "/부산법률강사" ||
      normalized === "/부산법무사강의" ||
      normalized === "/부산도서관법률특강" ||
      normalized === "/부산기관법률특강" ||
      normalized === "/부산사회복지기관강사" ||
      normalized === "/부산강사섭외비용" ||
      normalized === "/부산강사섭외체크리스트" ||
      normalized === "/기관특강주제추천" ||
      normalized === "/강의시간별구성" ||
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
