import { buildMetaDescription } from "@/lib/pageData/seo";
import { buildSeoTitle } from "@/lib/seo/metadata";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import { glossaryHub } from "./config";
import { getAllGlossaryTerms, getGlossaryTermBySlug } from "./terms";
import type { GlossaryTerm } from "./types";

function buildGlossaryTermMetaTitle(term: string): string {
  return buildSeoTitle(`${term} 뜻과 절차｜부산 법무사가 쉽게 설명`);
}

function buildGlossaryTermMetaDescription(t: GlossaryTerm): string {
  const base = `${t.term}은(는) ${t.oneLineDefinition.replace(/\.$/, "")}입니다. 언제 문제가 되는지, 준비서류와 확인사항을 정리했습니다.`;
  return buildMetaDescription(base);
}

function buildRelatedTermLinks(current: GlossaryTerm): { href: string; label: string }[] {
  const sameCategory = getAllGlossaryTerms()
    .filter((t) => t.category === current.category && t.slug !== current.slug)
    .slice(0, 4)
    .map((t) => ({ href: t.path, label: t.term }));

  const crossLinks = getAllGlossaryTerms()
    .filter((t) => t.category !== current.category && t.slug !== current.slug)
    .slice(0, 2)
    .map((t) => ({ href: t.path, label: t.term }));

  return [...sameCategory, ...crossLinks];
}

export function buildGlossaryHubPageData(): PageData {
  const terms = getAllGlossaryTerms();
  const termLinks = terms.map((t) => ({ href: t.path, label: t.term }));

  return createPageData({
    slug: glossaryHub.slug,
    path: glossaryHub.path,
    category: "glossary",
    title: "법률 용어사전",
    metaTitle: buildSeoTitle("법률 용어사전 — 상속·등기·민사 용어 쉽게"),
    metaDescription: buildMetaDescription(glossaryHub.metaDescriptionBase),
    h1: glossaryHub.h1,
    intro: glossaryHub.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "법률 용어사전" },
    ],
    introParagraphs: [glossaryHub.intro],
    faqs: glossaryHub.faqs,
    consultationExample: {
      title: "용어는 알겠는데 내 사건은?",
      body: "용어 이해 후에도 서류·기한·관할은 사건마다 다릅니다. 관련 자가진단을 먼저 보시거나, 해운대·센텀 사무소로 상황을 알려주시면 다음 단계를 함께 정리해 드립니다.",
    },
    internalLinks: [
      { href: "/situations", label: "상황별 법률문제" },
      { href: "/tools", label: "법률 계산기" },
      { href: "/cases", label: "사례 탐색기" },
      { href: "/busan-legal-map", label: "부산 법률지도" },
      { href: "/contact", label: "상담 문의" },
      ...termLinks.slice(0, 6),
    ],
    sections: [
      {
        title: "용어 목록",
        body: "아래 카드에서 용어를 선택하면 정의·설명·준비서류·관련 페이지로 이동할 수 있습니다.",
        links: termLinks,
      },
    ],
    primaryKeywords: [
      "법률 용어사전",
      "상속등기 뜻",
      "한정승인 뜻",
      "소유권이전등기",
      "개인회생 뜻",
      "부산 법무사",
    ],
    includeFaqSchema: true,
    ctaTitle: "용어 설명만으로 부족하다면",
    ctaText:
      "기한·서류·비용은 사실관계마다 달라집니다. 전화·카카오톡·방문(예약)으로 편하게 문의해 주세요.",
  });
}

export function buildGlossaryTermPageData(slug: string): PageData | null {
  const t = getGlossaryTermBySlug(slug);
  if (!t) return null;

  const relatedTerms = buildRelatedTermLinks(t);

  return createPageData({
    slug: t.slug,
    path: t.path,
    category: "glossary",
    title: t.term,
    metaTitle: buildGlossaryTermMetaTitle(t.term),
    metaDescription: buildGlossaryTermMetaDescription(t),
    h1: `${t.term} 뜻과 절차`,
    intro: t.oneLineDefinition,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "법률 용어사전", href: "/glossary" },
      { label: t.term },
    ],
    introParagraphs: [t.plainExplanation],
    documents: t.checks,
    consultationPoints: t.whenItMatters,
    faqs: [
      {
        question: `${t.term}은 언제 필요한가요?`,
        answer: t.whenItMatters.join(" "),
      },
      {
        question: `${t.term} 전에 무엇을 확인해야 하나요?`,
        answer: t.checks.join(" "),
      },
    ],
    consultationExample: {
      title: `${t.term} 관련 상담`,
      body: `${t.term}이 본인 사건과 맞는지, 다음에 무엇을 준비해야 하는지 사실관계를 알려주시면 부산 해운대구·센텀 사무소에서 안내해 드립니다.`,
    },
    internalLinks: [
      ...t.serviceLinks,
      ...t.diagnosisLinks,
      ...t.faqLinks,
      ...t.caseLinks,
      ...relatedTerms,
      { href: "/glossary", label: "법률 용어사전" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: "한 줄 정의",
        body: t.oneLineDefinition,
      },
      {
        title: "쉽게 풀어쓴 설명",
        body: t.plainExplanation,
      },
      {
        title: "언제 문제가 되는지",
        body: "아래 상황에서 특히 주의가 필요합니다.",
        items: t.whenItMatters,
      },
      {
        title: "준비서류 또는 확인사항",
        body: "절차 전에 아래 항목을 먼저 확인해 보세요.",
        items: t.checks,
      },
      {
        title: "관련 자가진단",
        body: "질문에 답하며 위험도와 다음 절차를 점검할 수 있습니다.",
        links: t.diagnosisLinks,
      },
      {
        title: "관련 서비스",
        body: "절차·서류·비용을 항목별로 정리한 업무 안내입니다.",
        links: t.serviceLinks,
      },
      {
        title: "관련 FAQ",
        body: "자주 묻는 질문과 답변입니다.",
        links: t.faqLinks,
      },
      {
        title: "관련 사례",
        body: "유사 상황의 상담·진행 사례를 참고할 수 있습니다.",
        links: t.caseLinks,
      },
      {
        title: "관련 용어",
        body: "함께 보면 이해가 쉬운 용어입니다.",
        links: relatedTerms,
      },
    ],
    primaryKeywords: [t.term, `${t.term} 뜻`, `${t.term} 절차`, "부산 법무사"],
    includeFaqSchema: true,
    ctaTitle: `${t.term} — 다음 단계가 필요하신가요?`,
    ctaText:
      "용어 이해 후에도 기한·관할·서류는 사건마다 다릅니다. 관련 자가진단을 확인하시거나 상담을 예약해 주세요.",
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
