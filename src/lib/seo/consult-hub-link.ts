import { LEGAL_CONSULTATION_CHAMPION } from "@/data/seo/page-relations";

type HubLink = { href: string; label: string };

/** 지역·역세권 페이지 → 부산 전체 상담 허브. exact-match 앵커는 쓰지 않는다. */
const CONSULT_HUB_ANCHORS: Record<string, string> = {
  부산역법무사: "부산 전역 상담 안내",
  초량동법무사: "법무사 상담 방법",
  동구법무사: "업무별 상담 안내",
};

export function consultHubLinkForLocalPage(slug: string): HubLink {
  return {
    href: LEGAL_CONSULTATION_CHAMPION,
    label: CONSULT_HUB_ANCHORS[slug] ?? "다옴법무사사무소 상담 안내",
  };
}

export function withConsultHubLink<T extends HubLink>(slug: string, links: T[]): T[] {
  if (links.some((link) => link.href.split("?")[0] === LEGAL_CONSULTATION_CHAMPION)) {
    return links;
  }
  return [...links, consultHubLinkForLocalPage(slug) as T];
}
