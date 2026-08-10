import type { SearchGuideEntry, SearchIntentCategory } from "./types";
import { searchIntentSeeds } from "./seeds";

const CATEGORY_LABELS: Record<SearchIntentCategory, string> = {
  recommend: "추천·선택 키워드",
  expertise: "등기·상속 실무 키워드",
  keyword: "실제 검색 키워드",
  rehab: "개인회생·파산",
  concern: "고객 고민 키워드",
  public: "공공기관 키워드",
  builder: "건축주·보존등기",
  mistakes: "실수 모음",
  checklist: "체크리스트",
  "cost-why": "비용이 달라지는 이유",
};

/** Existing URLs strengthened via hub — never create duplicates */
const EXISTING_GUIDE_ENTRIES: SearchGuideEntry[] = [
  { label: "부산 법무사 추천", href: "/부산법무사추천", category: "recommend", existing: true },
  { label: "부산 등기 법무사 추천", href: "/부산등기법무사추천", category: "recommend", existing: true },
  { label: "부산 법무사 상담", href: "/부산법무사상담", category: "recommend", existing: true },
  { label: "부산 법무사무소", href: "/부산법무사무소", category: "recommend", existing: true },
  { label: "부산 법무사 서류 준비", href: "/부산법무사서류준비", category: "checklist", existing: true },
  { label: "부산 법무사 방문상담", href: "/부산법무사방문상담", category: "recommend", existing: true },
  { label: "부산 법무사 비대면상담", href: "/부산법무사비대면상담", category: "recommend", existing: true },
  { label: "부산 법무사 비용", href: "/부산법무사비용", category: "recommend", existing: true },
  { label: "부산 법무사 후기", href: "/부산법무사후기", category: "recommend", existing: true },
  { label: "부산 법무사 비교", href: "/부산법무사비교", category: "recommend", existing: true },
  { label: "부산 상속등기 실무 안내", href: "/부산상속등기전문", category: "expertise", existing: true },
  { label: "부산 부동산등기 실무 안내", href: "/부산부동산등기전문", category: "expertise", existing: true },
  { label: "부산 법인등기 실무 안내", href: "/부산법인등기전문", category: "expertise", existing: true },
  { label: "부산 등기 실무 안내", href: "/부산등기전문법무사", category: "expertise", existing: true },
  { label: "부산 상속 업무 깊이 안내", href: "/부산상속전문법무사", category: "expertise", existing: true },
  { label: "부산 법인 업무 깊이 안내", href: "/부산법인전문법무사", category: "expertise" },
  { label: "부산 개인회생 업무 안내", href: "/부산개인회생전문법무사", category: "expertise" },
  { label: "부산 매매등기 업무 안내", href: "/부산매매등기전문법무사", category: "expertise" },
  { label: "부산 한정승인 업무 안내", href: "/부산한정승인전문법무사", category: "expertise" },
  { label: "부산 회생 업무 안내", href: "/부산회생전문법무사", category: "expertise" },
  { label: "부산 파산 업무 안내", href: "/부산파산전문법무사", category: "expertise" },
  { label: "부산 상속포기 업무 안내", href: "/부산상속포기전문법무사", category: "expertise" },
  { label: "부산 증여등기전문 법무사", href: "/부산증여등기전문법무사", category: "expertise" },
  { label: "부산 법인설립전문 법무사", href: "/부산법인설립전문법무사", category: "expertise" },
  { label: "부산 부동산전문 법무사", href: "/부산부동산전문법무사", category: "expertise" },
  { label: "상속등기 비용", href: "/상속등기비용", category: "keyword", existing: true },
  { label: "법인등기 비용", href: "/법인등기비용", category: "keyword", existing: true },
  { label: "개인회생 비용", href: "/개인회생비용", category: "keyword", existing: true },
  { label: "개인파산 비용", href: "/개인파산비용", category: "keyword", existing: true },
  { label: "부산 개인회생", href: "/부산개인회생", category: "rehab", existing: true },
  { label: "부산 개인파산", href: "/부산개인파산", category: "rehab", existing: true },
  { label: "부산 파산", href: "/부산파산", category: "rehab", existing: true },
  { label: "개인회생 준비서류", href: "/개인회생준비서류", category: "concern", existing: true },
  { label: "개인파산 준비서류", href: "/개인파산준비서류", category: "concern", existing: true },
  { label: "상속등기 준비서류", href: "/상속등기준비서류", category: "concern", existing: true },
  { label: "법인등기 준비서류", href: "/법인등기준비서류", category: "concern", existing: true },
  { label: "공공기관 등기업무", href: "/공공기관등기업무", category: "public", existing: true },
  { label: "부산 신축건물 보존등기", href: "/부산신축건물보존등기", category: "builder", existing: true },
];

export function getSearchGuideCategoryLabel(
  category: SearchIntentCategory,
): string {
  return CATEGORY_LABELS[category];
}

export function getAllSearchGuideEntries(): SearchGuideEntry[] {
  const news: SearchGuideEntry[] = searchIntentSeeds.map((seed) => ({
    label: seed.label,
    href: `/${seed.slug}`,
    category: seed.category,
    existing: false,
  }));
  return [...EXISTING_GUIDE_ENTRIES, ...news];
}

export function getSearchGuideEntriesByCategory(): {
  category: SearchIntentCategory;
  label: string;
  entries: SearchGuideEntry[];
}[] {
  const all = getAllSearchGuideEntries();
  const order = Object.keys(CATEGORY_LABELS) as SearchIntentCategory[];
  return order.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    entries: all.filter((e) => e.category === category),
  }));
}
