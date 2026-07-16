import type { PageCategory } from "@/lib/pageData/types";
import type { SearchCategoryFilter, SearchContentType } from "./types";

export const SEARCH_CATEGORY_LABELS: Record<SearchContentType, string> = {
  menu: "메뉴",
  service: "업무",
  region: "지역",
  situation: "상황별",
  diagnosis: "자가진단",
  faq: "FAQ",
  case: "사례",
  cost: "비용·서류",
  document: "준비서류",
  glossary: "용어사전",
  tool: "계산기",
  lecture: "강의·특강",
  lectureHistory: "강의 이력",
  agency: "공공·기업",
  special: "특수업무",
  core: "안내",
  blog: "블로그",
  other: "기타",
};

export const SEARCH_FILTER_LABELS: Record<SearchCategoryFilter, string> = {
  all: "전체",
  service: "업무",
  region: "지역",
  diagnosis: "자가진단",
  faq: "FAQ",
  case: "사례",
  cost: "비용·서류",
  lecture: "강의·특강",
  tool: "계산기",
  glossary: "용어사전",
  other: "기타",
};

const DOCUMENT_HINT =
  /준비서류|필요서류|구비서류|제출서류|서류안내/;
const COST_HINT = /비용|수임료|수수료|보수|견적/;
const AGENCY_HINT = /공공기관|공기업|지자체|관공서/;
const SPECIAL_HINT = /복대리|집단등기|집단 등기/;
const LECTURE_HINT =
  /법률강의|법률강사|특강|강의문의|강사소개|법률교육|예방교육|강의이력|도서관법률|기관법률|법무사강의/;

export function resolveSearchContentType(input: {
  path: string;
  slug: string;
  category: PageCategory;
  title: string;
  lectureSlugs: Set<string>;
}): SearchContentType {
  const { path, slug, category, title, lectureSlugs } = input;
  const haystack = `${path} ${slug} ${title}`;

  if (path === "/강의이력" || path.startsWith("/강의이력/")) {
    return "lectureHistory";
  }
  if (lectureSlugs.has(slug) || LECTURE_HINT.test(haystack)) {
    return "lecture";
  }
  if (SPECIAL_HINT.test(haystack)) return "special";
  if (AGENCY_HINT.test(haystack)) return "agency";
  if (DOCUMENT_HINT.test(haystack)) return "document";
  if (category === "cost" || COST_HINT.test(haystack)) return "cost";

  switch (category) {
    case "service":
      return "service";
    case "local":
    case "court":
    case "businessDistrict":
    case "realEstate":
      return "region";
    case "situation":
      return "situation";
    case "diagnosis":
      return "diagnosis";
    case "faq":
      return "faq";
    case "case":
      return "case";
    case "glossary":
      return "glossary";
    case "tool":
      return "tool";
    case "blog":
      return "blog";
    case "core":
    case "pillar":
    case "media":
      return "core";
    default:
      return "other";
  }
}

export function matchesSearchFilter(
  contentType: SearchContentType,
  filter: SearchCategoryFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "cost") {
    return contentType === "cost" || contentType === "document";
  }
  if (filter === "service") {
    return (
      contentType === "service" ||
      contentType === "special" ||
      contentType === "agency" ||
      contentType === "situation"
    );
  }
  if (filter === "other") {
    return (
      contentType === "core" ||
      contentType === "menu" ||
      contentType === "blog" ||
      contentType === "other"
    );
  }
  if (filter === "lecture") {
    return contentType === "lecture" || contentType === "lectureHistory";
  }
  return contentType === filter;
}
