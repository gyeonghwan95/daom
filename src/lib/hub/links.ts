import type { PageRelatedLink } from "@/lib/pageData/types";
import { CORE_HUBS, getCoreHubBySlug } from "./registry";
import { isCoreHubSlug, resolveParentHubSlug } from "./resolve";
import type { HubLinkInput } from "./types";

export type CapLinksOptions = {
  min?: number;
  max?: number;
};

export function capHubLinks(
  links: PageRelatedLink[],
  options: CapLinksOptions = {},
): PageRelatedLink[] {
  const min = options.min ?? 8;
  const max = options.max ?? 28;
  const seenHref = new Set<string>();
  const seenLabel = new Set<string>();
  const result: PageRelatedLink[] = [];

  for (const link of links) {
    if (link.href.startsWith("tel:")) continue;
    const hrefKey = link.href.split("#")[0]!;
    if (seenHref.has(hrefKey) || seenLabel.has(link.label)) continue;
    seenHref.add(hrefKey);
    seenLabel.add(link.label);
    result.push(link);
    if (result.length >= max) break;
  }

  const fillers: PageRelatedLink[] = [
    { href: "/부산법무사", label: "부산 법무사 종합 안내" },
    { href: "/services", label: "부산 법무사 업무안내" },
    { href: "/faq", label: "부산 법무사 FAQ" },
    { href: "/contact", label: "부산 법무사 상담 문의" },
    { href: "/location", label: "센텀 법무사 오시는 길" },
    { href: "/blog", label: "블로그 안내" },
    { href: "/부산상속등기", label: "부산 상속등기 안내" },
    { href: "/부산법인등기", label: "부산 법인등기 안내" },
    { href: "/부산개인회생", label: "부산 개인회생 상담" },
    { href: "/부산법무사비용", label: "부산 법무사 비용 안내" },
  ];

  for (const filler of fillers) {
    if (result.length >= min) break;
    const hrefKey = filler.href.split("#")[0]!;
    if (seenHref.has(hrefKey) || seenLabel.has(filler.label)) continue;
    seenHref.add(hrefKey);
    seenLabel.add(filler.label);
    result.push(filler);
  }

  return result;
}

export function getHubNavigationLinks(input: HubLinkInput): PageRelatedLink[] {
  const parentSlug = resolveParentHubSlug(input);
  const parentHub = getCoreHubBySlug(parentSlug);
  const isHub = isCoreHubSlug(input.slug);

  if (isHub && parentHub) {
    return capHubLinks(
      parentHub.spokes.filter((spoke) => spoke.href !== input.path),
      { min: 20, max: 28 },
    );
  }

  const links: PageRelatedLink[] = [];

  if (parentHub && parentHub.slug !== input.slug) {
    links.push({
      href: `/${parentHub.slug}`,
      label: `${parentHub.title} 허브로 돌아가기`,
    });
    links.push(
      ...parentHub.spokes
        .filter((spoke) => spoke.href !== input.path && spoke.href !== `/${input.slug}`)
        .slice(0, 12),
    );
  }

  const siblingHubs = CORE_HUBS.filter((h) => h.slug !== parentSlug && h.slug !== input.slug)
    .slice(0, 3)
    .map((h) => ({
      href: `/${h.slug}`,
      label: `${h.title} 안내`,
    }));

  links.push(...siblingHubs);

  return capHubLinks(links, { min: 8, max: 16 });
}

export function getCoreHubSpokes(slug: string): PageRelatedLink[] {
  const hub = getCoreHubBySlug(slug);
  if (!hub) return [];
  return hub.spokes.map((s) => ({ href: s.href, label: s.label }));
}
