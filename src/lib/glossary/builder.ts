import { buildMetaDescription } from "@/lib/pageData/seo";
import { buildSeoTitle } from "@/lib/seo/metadata";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import { glossaryHub } from "./config";
import { getGlossaryGuide } from "./guides";
import { josa } from "./josa";
import {
  GLOSSARY_POLICY,
  getGlossaryPolicy,
  isGlossaryDiscoverable,
} from "./policy";
import { getAllGlossaryTerms, getGlossaryTermBySlug } from "./terms";

function uniqueLinks(
  links: { href: string; label: string }[],
): { href: string; label: string }[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (!link?.href) return false;
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function ownerLink(slug: string): { href: string; label: string } | null {
  const policy = getGlossaryPolicy(slug);
  if (!policy) return null;
  return { href: policy.serviceOwner, label: policy.serviceOwnerLabel };
}

export function buildGlossaryHubPageData(): PageData {
  const discoverable = getAllGlossaryTerms().filter((t) => isGlossaryDiscoverable(t.slug));

  return createPageData({
    slug: glossaryHub.slug,
    path: glossaryHub.path,
    category: "glossary",
    title: "등기·신청 용어",
    metaTitle: buildSeoTitle("등기·신청에서 자주 확인하는 용어"),
    metaDescription: buildMetaDescription(glossaryHub.metaDescriptionBase),
    h1: glossaryHub.h1,
    intro: glossaryHub.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "용어 안내" },
    ],
    introParagraphs: [glossaryHub.intro],
    faqs: glossaryHub.faqs,
    consultationExample: {
      title: "용어보다 지금 할 일이 먼저라면",
      body: "상황별 안내나 해당 업무 페이지에서 기한·서류를 확인하는 편이 맞습니다. 용어가 헷갈릴 때만 이 목록을 쓰시면 됩니다.",
    },
    internalLinks: uniqueLinks([
      { href: "/situations", label: "상황별 법률문제" },
      { href: "/자가진단", label: "자가진단" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/부산임원변경등기", label: "부산 임원변경등기" },
      { href: "/contact", label: "상담 문의" },
    ]),
    sections: [
      {
        title: "용어로 찾아보기",
        body: "아래 용어는 뜻을 짧게 구분하는 보조 문서입니다. 신청·등기의 대표 안내는 각 업무 페이지입니다.",
        links: discoverable.map((t) => ({ href: t.path, label: t.term })),
      },
    ],
    primaryKeywords: ["등기 용어", "신청 용어"],
    includeFaqSchema: true,
    ctaTitle: "필요한 업무 안내로 이동합니다",
    ctaText:
      "용어 확인 후 신청·등기가 필요하면 해당 업무 페이지 또는 상담으로 이어갑니다.",
  });
}

export function buildGlossaryTermPageData(slug: string): PageData | null {
  const t = getGlossaryTermBySlug(slug);
  const guide = getGlossaryGuide(slug);
  const policy = getGlossaryPolicy(slug);
  if (!t || !guide || !policy) return null;

  const owner = ownerLink(slug);

  return createPageData({
    slug: t.slug,
    path: t.path,
    category: "glossary",
    title: t.term,
    metaTitle: buildSeoTitle(`${t.term} 용어 확인`),
    metaDescription: buildMetaDescription(
      `${josa(t.term, "은/는")} ${t.oneLineDefinition.replace(/\.$/, "")}. 신청·등기 절차의 대표 안내는 ${policy.serviceOwnerLabel}에서 확인합니다.`,
    ),
    h1: t.term,
    intro: t.oneLineDefinition,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "용어 안내", href: "/glossary" },
      { label: t.term },
    ],
    introParagraphs: [t.oneLineDefinition, guide.answerLead],
    procedures: [
      `${t.term}의 신청 순서는 ${policy.serviceOwnerLabel}에서 확인합니다.`,
    ],
    documents: [
      `${t.term}의 준비서류는 ${policy.serviceOwnerLabel}에서 확인합니다.`,
    ],
    consultationPoints: guide.stuckPoints.slice(0, 3),
    faqs: [
      {
        question: `${josa(t.term, "은/는")} 무슨 뜻인가요?`,
        answer: t.oneLineDefinition,
      },
      {
        question: `${josa(t.term, "을/를")} 신청·등기할 때는 어디를 보나요?`,
        answer: `대표 안내는 ${policy.serviceOwnerLabel}(${policy.serviceOwner})입니다. 이 페이지는 용어를 구분하는 보조 문서입니다.`,
      },
      {
        question: `${josa(t.term, "은/는")} 검색 대표 페이지인가요?`,
        answer: `아닙니다. 의뢰·절차 검색의 대표 URL은 ${policy.serviceOwner}입니다.`,
      },
    ],
    consultationExample: {
      title: `${t.term} 다음 단계`,
      body: `기한·서류·비용은 ${policy.serviceOwnerLabel}에서 확인합니다.`,
    },
    internalLinks: uniqueLinks([
      ...(owner ? [owner] : []),
      ...t.diagnosisLinks.slice(0, 2),
      { href: "/glossary", label: "용어 목록" },
      { href: "/situations", label: "상황별 안내" },
    ]),
    sections: [
      {
        title: `${t.term}에서 자주 헷갈리는 점`,
        body: `${t.term}의 신청·등기 절차 전체는 ${policy.serviceOwnerLabel}이 기준입니다.`,
        items: guide.stuckPoints.slice(0, 3),
      },
      {
        title: `${t.term}에서 법무사가 맡는 범위`,
        body: [guide.scrivenerScope, guide.outOfScope].filter(Boolean).join(" "),
      },
      {
        title: `${t.term} 대표 업무 안내`,
        body: `${t.term}의 신청·등기·기한·서류는 이 용어 페이지가 아니라 ${policy.serviceOwner}가 대표입니다.`,
        links: uniqueLinks([...(owner ? [owner] : []), ...t.diagnosisLinks.slice(0, 1)]),
      },
    ],
    primaryKeywords: [t.term],
    includeFaqSchema: false,
    ctaTitle: `${policy.serviceOwnerLabel}에서 절차를 확인합니다`,
    ctaText: `${josa(t.term, "을/를")} 신청·등기해야 하면 대표 안내 페이지로 이동합니다.`,
  });
}

export function buildAllGlossaryTermPageData(): PageData[] {
  return getAllGlossaryTerms()
    .map((term) => buildGlossaryTermPageData(term.slug))
    .filter((p): p is PageData => p !== null);
}

export function resolveGlossaryHubPageData(): PageData {
  return buildGlossaryHubPageData();
}

export function resolveGlossaryTermPageData(slug: string): PageData | undefined {
  return buildGlossaryTermPageData(slug) ?? undefined;
}

export function assertGlossaryPolicyComplete(): void {
  for (const term of getAllGlossaryTerms()) {
    if (!GLOSSARY_POLICY[term.slug]) {
      throw new Error(`Missing glossary policy: ${term.slug}`);
    }
    if (!getGlossaryGuide(term.slug)) {
      throw new Error(`Missing glossary guide: ${term.slug}`);
    }
  }
}
