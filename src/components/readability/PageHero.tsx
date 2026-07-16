import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { KeywordBadges } from "./KeywordBadges";
import { ProseParagraphs } from "./ProseParagraphs";
import type { SiteImageAsset } from "@/lib/site-images";

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
  /** 히어로 우측(데스크톱) 대표 이미지 */
  sideImage?: SiteImageAsset;
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
  sideImage,
  children,
}: PageHeroProps) {
  const descriptions =
    introParagraphs.length > 0
      ? introParagraphs
      : intro
        ? [intro]
        : [];

  const textBlock = (
    <>
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
    </>
  );

  const ctaBlock =
    ctaLabel ? (
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
    ) : null;

  if (!sideImage) {
    return (
      <header className="readability-hero">
        {textBlock}
        {ctaBlock}
      </header>
    );
  }

  return (
    <header className="readability-hero">
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,12.5rem)] lg:items-stretch lg:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
        <div className="min-w-0">
          {textBlock}
          {ctaBlock}
        </div>
        <div className="mx-auto w-full max-w-[14rem] sm:max-w-[15rem] lg:relative lg:mx-0 lg:h-full lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-[4/3] max-h-52 w-full overflow-hidden rounded-2xl border border-beige-dark bg-beige/40 shadow-sm sm:max-h-56 lg:absolute lg:inset-0 lg:aspect-auto lg:max-h-none">
            <Image
              src={sideImage.src}
              alt={sideImage.alt}
              fill
              priority
              className="object-cover object-[center_18%]"
              sizes="(max-width: 1024px) 15rem, 14rem"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
