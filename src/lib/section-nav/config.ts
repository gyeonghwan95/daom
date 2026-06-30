import type { SectionNavItem } from "@/lib/section-nav/types";

export const PAGE_END_SECTIONS: SectionNavItem[] = [
  { id: "consultation", label: "상담 문의" },
  { id: "related", label: "관련 안내" },
];

export const sectionNavByPath: Record<string, SectionNavItem[]> = {
  "/about": [
    { id: "qualifications", label: "주요 경력 및 자격" },
    { id: "community", label: "기업·지역사회" },
    { id: "external", label: "대외활동" },
    { id: "education", label: "생활 속 법률" },
    ...PAGE_END_SECTIONS,
  ],
  "/office": [
    { id: "office-gallery", label: "사무소 사진" },
    { id: "office-video", label: "사무소 영상" },
    { id: "office-map", label: "위치 한눈에 보기" },
    ...PAGE_END_SECTIONS,
  ],
  "/services": [
    { id: "services-list", label: "주요 업무 분야" },
    { id: "cases", label: "업무 사례" },
    ...PAGE_END_SECTIONS,
  ],
  "/contact": [
    { id: "consultation-methods", label: "상담 방법" },
    { id: "contact-form", label: "온라인 문의" },
    { id: "related", label: "관련 안내" },
  ],
  "/location": [
    { id: "office-location", label: "사무소 위치" },
    { id: "location-map", label: "위치 지도" },
    { id: "directions", label: "찾아오시는 길" },
    { id: "parking", label: "주차 안내" },
    ...PAGE_END_SECTIONS,
  ],
  "/media": [
    { id: "media-video", label: "영상" },
    { id: "community", label: "기업·지역사회" },
    { id: "external", label: "대외활동" },
    { id: "lectures", label: "강의·강연" },
    { id: "press", label: "언론보도" },
    ...PAGE_END_SECTIONS,
  ],
  "/blog": [
    { id: "naver-blog", label: "네이버 블로그 안내" },
    { id: "site-columns", label: "사이트 칼럼" },
    ...PAGE_END_SECTIONS,
  ],
  "/reviews": [
    { id: "reviews", label: "방문자 리뷰" },
    ...PAGE_END_SECTIONS,
  ],
  "/faq": [
    { id: "faq-list", label: "질문 목록" },
    ...PAGE_END_SECTIONS,
  ],
};

export const serviceDetailSections: SectionNavItem[] = [
  { id: "when-needed", label: "필요한 경우" },
  { id: "procedures", label: "절차" },
  { id: "documents", label: "준비 서류" },
  { id: "common-issues", label: "자주 발생하는 문제" },
  { id: "our-approach", label: "진행 방식" },
  { id: "service-faq", label: "자주 묻는 질문" },
  { id: "related-case", label: "관련 사례" },
  ...PAGE_END_SECTIONS,
];

export const EXCLUDED_SECTION_NAV_PREFIXES = [
  "/",
  "/admin",
  "/cases",
  "/press",
] as const;
