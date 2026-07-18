import type { CaseRegionEntry, DistrictKey } from "./types";

type IndustrialSeed = {
  name: string;
  slug: string;
  parent: DistrictKey;
  context: string;
  indexable?: boolean;
  canonicalSlug?: string;
};

const industrialSeeds: IndustrialSeed[] = [
  { name: "센텀2지구", slug: "부산센텀2지구법무사", parent: "haeundae", context: "센텀2지구 도시첨단산업단지 인근 기업·부동산등기 상담이 이어지는 업무권역입니다." },
  { name: "센텀2지구도시첨단산업단지", slug: "부산센텀2지구도시첨단산업단지법무사", parent: "haeundae", context: "첨단산업단지 입주 기업의 법인·공장·사무실 등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산센텀2지구법무사" },
  { name: "회동석대산업단지", slug: "부산회동석대산업단지법무사", parent: "haeundae", context: "회동·석대 산업단지 사업장의 부동산·법인등기 상담이 있습니다." },
  { name: "회동석대도시첨단산업단지", slug: "부산회동석대도시첨단산업단지법무사", parent: "haeundae", context: "도시첨단산업단지 입주와 맞물린 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산회동석대산업단지법무사" },
  { name: "부산진해경제자유구역", slug: "부산진해경제자유구역법무사", parent: "gangseo", context: "경제자유구역 입주 기업의 법인·부동산등기 일정을 맞추는 상담이 있습니다." },
  { name: "미음산업단지", slug: "부산미음산업단지법무사", parent: "gangseo", context: "미음산단 공장·창고 등기 문의가 있는 산업 권역입니다." },
  { name: "화전산업단지", slug: "부산화전산업단지법무사", parent: "gangseo", context: "화전산단 사업장 등기·법인 변경 상담이 이어집니다." },
  { name: "생곡산업단지", slug: "부산생곡산업단지법무사", parent: "gangseo", context: "생곡산단 입주 기업의 부동산·법인등기 문의가 있습니다." },
  { name: "지사과학산업단지", slug: "부산지사과학산업단지법무사", parent: "gangseo", context: "지사 과학·글로벌 산업단지 기업의 등기 상담이 있는 권역입니다." },
  { name: "지사글로벌산업단지", slug: "부산지사글로벌산업단지법무사", parent: "gangseo", context: "글로벌산단 입주와 맞물린 법인·공장등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산지사과학산업단지법무사" },
  { name: "서부산복합산업단지", slug: "부산서부산복합산업단지법무사", parent: "gangseo", context: "서부산 복합산단 사업장 등기 일정을 맞추는 상담이 있습니다." },
  { name: "강서해성산업단지", slug: "부산강서해성산업단지법무사", parent: "gangseo", context: "강서 해성산단 인근 공장·법인등기 문의가 이어집니다." },
  { name: "명동산업단지", slug: "부산명동산업단지법무사", parent: "gangseo", context: "명동산단 사업장 부동산등기 상담이 있습니다." },
  { name: "명서산업단지", slug: "부산명서산업단지법무사", parent: "gangseo", context: "명서산단 입주 기업의 등기·법인 변경 문의가 있습니다." },
  { name: "신평장림산업단지", slug: "부산신평장림산업단지법무사", parent: "saha", context: "신평·장림 산업벨트 공장·창고 등기 문의가 많은 권역입니다." },
  { name: "서부산스마트밸리", slug: "부산서부산스마트밸리법무사", parent: "gangseo", context: "스마트밸리 입주 기업의 법인·부동산등기 상담이 이어집니다." },
  { name: "산양산업단지", slug: "부산산양산업단지법무사", parent: "gangseo", context: "산양산단 사업장 등기 문의가 있는 산업 구간입니다." },
  { name: "사상산업단지", slug: "부산사상산업단지법무사", parent: "sasang", context: "사상 산업·재생 권역의 공장·법인등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산사상공업지역법무사" },
  { name: "사상재생사업지구", slug: "부산사상재생사업지구법무사", parent: "sasang", context: "재생사업과 맞물린 부동산·사업장 권리 상담이 있습니다." },
  { name: "모라도시첨단산업단지", slug: "부산모라도시첨단산업단지법무사", parent: "sasang", context: "모라 첨단산단 입주 기업의 등기 문의가 이어집니다." },
  { name: "금곡도시첨단산업단지", slug: "부산금곡도시첨단산업단지법무사", parent: "buk", context: "금곡 첨단산단 기업의 법인·부동산등기 상담이 있습니다." },
  { name: "정관농공단지", slug: "부산정관농공단지법무사", parent: "gijang", context: "정관 농공단지 사업장 등기 문의가 있는 구간입니다.", indexable: false, canonicalSlug: "부산정관산업단지법무사" },
  { name: "반룡산업단지", slug: "부산반룡산업단지법무사", parent: "gijang", context: "반룡산단 입주 기업의 공장·법인등기 상담이 있습니다." },
  { name: "에코장안산업단지", slug: "부산에코장안산업단지법무사", parent: "gijang", context: "에코장안산단 사업장 등기 일정을 맞추는 상담이 이어집니다." },
  { name: "동남권방사선의과학산업단지", slug: "부산동남권방사선의과학산업단지법무사", parent: "gijang", context: "방사선의과학산단 입주 기관·기업의 법인·부동산등기 문의가 있습니다." },
];

export function buildIndustrialEntries(): CaseRegionEntry[] {
  return industrialSeeds.map((seed) => ({
    slug: seed.slug,
    name: seed.name,
    displayName: `부산 ${seed.name}`,
    kind: "industrial" as const,
    parentDistrictKey: seed.parent,
    traits: ["industrial" as const],
    keywords: [seed.name, `부산 ${seed.name}`, `${seed.name} 법무사`],
    context: seed.context,
    indexable: seed.indexable ?? true,
    canonicalSlug: seed.canonicalSlug,
  }));
}
