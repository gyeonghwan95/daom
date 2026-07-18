import type { CaseRegionEntry } from "./types";

/** 법원·등기소 인근 지역 키워드 */
export function buildCourtEntries(): CaseRegionEntry[] {
  const items: Array<{
    name: string;
    slug: string;
    parent: string;
    context: string;
    indexable?: boolean;
    canonicalSlug?: string;
  }> = [
    {
      name: "부산지방법원",
      slug: "부산지방법원법무사",
      parent: "yeonje",
      context:
        "거제동 부산지방법원 인근에서 민사·등기·소송 일정과 맞춘 법무사 업무 문의가 많은 권역입니다.",
    },
    {
      name: "부산고등법원",
      slug: "부산고등법원법무사",
      parent: "yeonje",
      context:
        "고등법원 인근에서 항소·소송 일정과 연결된 서류·등기 상담이 이어지는 구간입니다.",
      indexable: false,
      canonicalSlug: "부산지방법원법무사",
    },
    {
      name: "부산가정법원",
      slug: "부산가정법원법무사",
      parent: "yeonje",
      context:
        "가정법원 사건의 상속·가족관계 서류와 맞물린 등기·상담 일정을 정리하는 문의가 있습니다.",
    },
    {
      name: "부산회생법원",
      slug: "부산회생법원법무사",
      parent: "yeonje",
      context:
        "회생·파산 절차와 병행되는 서류·재산 목록·등기 관련 상담이 이어지는 권역입니다.",
    },
    {
      name: "부산지방법원등기국",
      slug: "부산지방법원등기국법무사",
      parent: "yeonje",
      context:
        "등기국 접수·보정 일정과 맞춘 부동산·법인등기 실무 문의가 많은 거점입니다.",
    },
    {
      name: "거제동법원",
      slug: "부산거제동법원법무사",
      parent: "yeonje",
      context:
        "거제동 법원 생활권에서 소송·등기 일정을 함께 맞추는 상담이 있습니다.",
      indexable: false,
      canonicalSlug: "부산지방법원법무사",
    },
    {
      name: "부산동부지원",
      slug: "부산동부지원법무사",
      parent: "haeundae",
      context:
        "해운대 동부지원 인근에서 동부산 생활권 사건의 소송·등기 일정 상담이 이어집니다.",
    },
    {
      name: "해운대동부지원",
      slug: "부산해운대동부지원법무사",
      parent: "haeundae",
      context:
        "동부지원 관할 사건의 서류·등기 일정을 맞추는 문의가 있는 권역입니다.",
      indexable: false,
      canonicalSlug: "부산동부지원법무사",
    },
    {
      name: "부산서부지원",
      slug: "부산서부지원법무사",
      parent: "gangseo",
      context:
        "강서 서부지원 인근에서 서부산 권역 사건의 소송·등기 상담이 있습니다.",
    },
    {
      name: "강서서부지원",
      slug: "부산강서서부지원법무사",
      parent: "gangseo",
      context:
        "서부지원 관할과 맞닿은 서부산 생활권의 법무사 업무 문의가 이어집니다.",
      indexable: false,
      canonicalSlug: "부산서부지원법무사",
    },
    {
      name: "부산서부지원등기과",
      slug: "부산서부지원등기과법무사",
      parent: "gangseo",
      context:
        "서부지원 등기과 접수·보정과 맞춘 부동산·법인등기 실무 상담이 있습니다.",
      indexable: false,
      canonicalSlug: "부산서부지원법무사",
    },
    {
      name: "부산등기국",
      slug: "부산등기국법무사",
      parent: "yeonje",
      context:
        "등기 접수·보정·완료 확인 일정을 맞추는 실무 문의가 많은 거점입니다.",
      indexable: false,
      canonicalSlug: "부산지방법원등기국법무사",
    },
  ];

  return items.map((item) => ({
    slug: item.slug,
    name: item.name,
    displayName: item.name.startsWith("부산") ? item.name : `부산 ${item.name}`,
    kind: "court" as const,
    parentDistrictKey: item.parent,
    traits: ["court" as const, "registry" as const],
    keywords: [item.name, `${item.name} 법무사`, "부산 법원 법무사"],
    context: item.context,
    indexable: item.indexable ?? true,
    canonicalSlug: item.canonicalSlug,
  }));
}
