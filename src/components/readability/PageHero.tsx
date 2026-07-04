import Link from "next/link";
import type { ReactNode } from "react";
import { KeywordBadges } from "./KeywordBadges";
import { ProseParagraphs } from "./ProseParagraphs";

type PageHeroProps = {
  h1: string;
  intro?: string;
  introParagraphs?: string[];
  keywords?: string[];
  eyebrow?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCta?: { href: string; label: string };
  showDiagnosisCta?: boolean;
  children?: ReactNode;
};

export function PageHero({
  h1,
  intro,
  introParagraphs = [],
  keywords = [],
  eyebrow,
  ctaHref = "/contact",
  ctaLabel = "상담 문의하기",
  secondaryCta,
  showDiagnosisCta = true,
  children,
}: PageHeroProps) {
  const descriptions =
    introParagraphs.length > 0
      ? introParagraphs
      : intro
        ? [intro]
        : [];

  return (
    <header className="readability-hero">
      {eyebrow ? (
        <p className="readability-hero__eyebrow">{eyebrow}</p>
      ) : null}
      <h1 className="page-title">{h1}</h1>
      {descriptions.length > 0 ? (
        <div className="mt-4 md:mt-5">
          <ProseParagraphs paragraphs={descriptions.slice(0, 2)} />
        </div>
      ) : null}
      {keywords.length > 0 ? (
        <div className="mt-4 md:mt-5">
          <KeywordBadges keywords={keywords} />
        </div>
      ) : null}
      {children}
      {ctaLabel ? (
        <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
          <Link
            href={ctaHref}
            className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
          >
            {ctaLabel}
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="btn-secondary inline-flex min-h-12 items-center justify-center px-6"
            >
              {secondaryCta.label}
            </Link>
          ) : showDiagnosisCta ? (
            <Link
              href="/자가진단"
              className="btn-secondary inline-flex min-h-12 items-center justify-center px-6"
            >
              자가진단 보기
            </Link>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
