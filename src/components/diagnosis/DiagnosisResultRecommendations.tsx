import Link from "next/link";
import type { DiagnosisRecommendationGroups } from "@/lib/diagnosis/result-recommendations";

type DiagnosisResultRecommendationsProps = {
  groups: DiagnosisRecommendationGroups;
};

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-navy">{title}</h4>
      <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="interactive-surface card-surface flex min-h-11 items-center px-4 py-3 text-sm font-medium text-navy hover:bg-beige/40"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiagnosisResultRecommendations({
  groups,
}: DiagnosisResultRecommendationsProps) {
  const sections = [
    { title: "관련 자가진단", links: groups.diagnosis ?? [] },
    { title: "관련 사례", links: groups.cases },
    { title: "관련 FAQ", links: groups.faqs },
    { title: "관련 법률용어", links: groups.glossary ?? [] },
    { title: "관련 서비스", links: groups.services },
    { title: "관련 블로그", links: groups.blogs },
    { title: "관련 상황별 안내", links: groups.situations ?? [] },
    { title: "관련 법률 계산기", links: groups.tools ?? [] },
  ];

  const hasAny = sections.some((section) => section.links.length > 0);
  if (!hasAny) return null;

  return (
    <section
      className="diagnosis-result__recommendations rounded-2xl border border-beige-dark bg-beige/20 p-5 sm:p-6"
      aria-labelledby="diagnosis-recommendations-heading"
    >
      <h3
        id="diagnosis-recommendations-heading"
        className="text-base font-semibold text-navy sm:text-lg"
      >
        함께 보면 좋은 글
      </h3>
      <p className="mt-2 text-sm text-navy/65">
        절차·비용·서류를 더 자세히 확인할 수 있는 안내입니다.
      </p>

      <div className="mt-5 space-y-5">
        {sections.map((section) => (
          <LinkGroup
            key={section.title}
            title={section.title}
            links={section.links}
          />
        ))}
      </div>
    </section>
  );
}
