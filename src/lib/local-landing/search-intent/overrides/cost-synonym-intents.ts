import { buildSearchIntentContent } from "../factory";
import { searchIntentSeeds } from "../seeds";
import type { SearchIntentContent, SearchIntentSeed } from "../types";

function seedBySlug(slug: string): SearchIntentSeed {
  const seed = searchIntentSeeds.find((row) => row.slug === slug);
  if (!seed) {
    throw new Error(`Missing search-intent seed: ${slug}`);
  }
  return seed;
}

const hub = { href: "/부산법무사비용", label: "부산 법무사 비용 구성" } as const;
const table = { href: "/부산법무사보수표", label: "협회 보수 기준 참고" } as const;

function supportCostPage(
  slug: string,
  patch: Pick<
    SearchIntentContent,
    "metaTitle" | "metaDescription" | "h1" | "heroParagraphs"
  >,
): SearchIntentContent {
  const base = buildSearchIntentContent(seedBySlug(slug));
  return {
    ...base,
    ...patch,
    breadcrumbParent: { href: "/부산법무사비용", label: "부산 법무사 비용" },
    relatedServiceLinks: [
      hub,
      table,
      { href: "/상속등기비용", label: "상속등기 비용 구조" },
      { href: "/contact/inquiry", label: "비용 구성 문의" },
    ],
    relatedGuideLinks: [
      { href: "/부산법무사상담", label: "상담 준비" },
      { href: "/부산법무사비교", label: "비교할 때 볼 기준" },
    ],
  };
}

/** Synonym URLs kept. PRIMARY for the family is /부산법무사비용. */
export const costSynonymOverrides: Record<string, SearchIntentContent> = {
  부산법무사수임료: supportCostPage("부산법무사수임료", {
    metaTitle: "법무사 수임료와 공과금은 어떻게 다른가요｜다옴법무사사무소",
    metaDescription:
      "법무사 수임료(보수)와 세금·공과금은 성격이 다릅니다. 부산 법무사 비용 대표 안내에서 항목별 구성을 이어서 확인하세요.",
    h1: "법무사 수임료, 세금·공과금과 어떻게 다를까요?",
    heroParagraphs: [
      "부산 법무사 수임료를 검색하셔도, 알고 싶은 내용은 대개 실제 부담 총액과 포함 범위입니다. 수임료는 위임 업무의 보수이고, 취득세·등록면허세·송달료 등은 다른 항목일 수 있습니다.",
      "같은 검색의도의 대표 안내는 부산 법무사 비용 페이지입니다. 이 주소는 용어를 정확히 나누기 위한 보조 안내입니다.",
      "다옴법무사사무소(해운대·센텀)는 항목을 구분해 설명하며, 근거 없는 고정 단가는 표시하지 않습니다.",
    ],
  }),
  부산법무사보수: supportCostPage("부산법무사보수", {
    metaTitle: "법무사 보수는 비용 전부인가요｜다옴법무사사무소",
    metaDescription:
      "법무사 보수는 위임 업무 보수입니다. 세금·공과금·실비와 구분해 보세요. 대표 안내는 부산 법무사 비용 페이지입니다.",
    h1: "법무사 보수와 전체 비용은 어떻게 다를까요?",
    heroParagraphs: [
      "법무사 보수는 협회 기준상 기본보수·가산보수·기타 보수·실비로 나뉠 수 있습니다. 검색에서 말하는 ‘비용’에는 세금이 섞여 있는 경우가 많습니다.",
      "협회 보수표 숫자는 상한 산정 참고이며 확정 견적이 아닙니다. 구성 전체는 부산 법무사 비용 안내를 보세요.",
    ],
  }),
  법무사수임료: supportCostPage("법무사수임료", {
    metaTitle: "법무사 수임료 구성 안내｜다옴법무사사무소",
    metaDescription:
      "법무사 수임료와 공과금을 구분해 안내합니다. 대표 페이지는 부산 법무사 비용입니다.",
    h1: "법무사 수임료, 어떤 항목과 나눠 볼까요?",
    heroParagraphs: [
      "법무사 수임료만 비교하면 세금·수수료가 빠진 금액을 총액으로 오해하기 쉽습니다. 지역 대표 안내는 부산 법무사 비용 페이지입니다.",
    ],
  }),
  법무사비용: supportCostPage("법무사비용", {
    metaTitle: "법무사 비용 항목 안내｜다옴법무사사무소",
    metaDescription:
      "법무사 비용은 보수만 뜻하지 않을 수 있습니다. 부산 지역 대표 안내는 부산 법무사 비용 페이지입니다.",
    h1: "법무사 비용, 보수와 실비를 나눠 보기",
    heroParagraphs: [
      "전국형 검색어 ‘법무사 비용’도 실제로는 업무별 공과금 구조가 핵심입니다. 부산 사건은 부산 법무사 비용 안내에서 업무별로 이어갑니다.",
    ],
  }),
  법무사보수: supportCostPage("법무사보수", {
    metaTitle: "법무사 보수와 실비 구분｜다옴법무사사무소",
    metaDescription:
      "법무사 보수는 위임 보수입니다. 세금·공과금과 구분해 확인하세요.",
    h1: "법무사 보수, 실비와 어떻게 다를까요?",
    heroParagraphs: [
      "보수와 실비를 한 단어로 섞어 검색하는 경우가 많습니다. 대표 구성 안내는 부산 법무사 비용 페이지입니다.",
    ],
  }),
  등기비용: {
    ...supportCostPage("등기비용", {
      metaTitle: "등기 비용, 원인마다 구조가 다릅니다｜다옴법무사사무소",
      metaDescription:
        "매매·상속·말소는 세금 구조가 다릅니다. 부동산등기 비용·소유권이전 비용 안내와 함께 보세요.",
      h1: "등기 비용은 등기 원인부터 나눠 볼까요?",
      heroParagraphs: [
        "등기비용은 매매 취득세 구조와 말소·표시변경이 같지 않습니다. 원인별 안내는 부동산등기 비용·소유권이전 비용 페이지로 이어갑니다.",
      ],
    }),
    relatedServiceLinks: [
      { href: "/부동산등기비용", label: "부동산등기 비용 항목" },
      { href: "/소유권이전등기비용", label: "소유권이전 비용" },
      { href: "/상속등기비용", label: "상속등기 비용" },
      hub,
    ],
  },
};
