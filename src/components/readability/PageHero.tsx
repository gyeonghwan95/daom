import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import { HeroContactButtons } from "@/components/cta/HeroContactButtons";
import { CostInquiryNote } from "@/components/cta/CostInquiryNote";
import { HeroTrustLine } from "@/components/readability/HeroTrustLine";
import { ConsultEmpathyLead } from "@/components/consultation/ConsultEmpathyLead";
import { NaverBlogMorePostsButton } from "@/components/cta/NaverBlogMorePostsButton";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { NationwideRegionChip } from "@/components/nationwide/NationwideRegionChip";
import { ProseParagraphs } from "./ProseParagraphs";
import { encodePublicSrc } from "@/lib/encode-public-src";
import type { SiteImageAsset } from "@/lib/site-images";
import { ServiceAnswerCard } from "@/components/seo/ServiceAnswerCard";
import { OfficeProfileCard } from "@/components/seo/OfficeProfileCard";

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
  /** 단일 상담 CTA일 때 '안윤정 법무사는 누구일까?' 버튼 표시 */
  showAboutLawyerCta?: boolean;
  /** '안윤정 법무사는 누구일까?' 오른쪽에 네이버 블로그 더보기 버튼 */
  showNaverBlogCta?: boolean;
  /** H1 위 좌측 — 전국 업무 가능 chip */
  showNationwideChip?: boolean;
  /** 상담 신청 CTA 옆 네이버 예약 (기본: 상담/문의 경로일 때) */
  showNaverReservation?: boolean;
  sideImage?: SiteImageAsset;
  /** 페이지 경로 — 업무 페이지면 H1 바로 아래 "핵심 답변"을 붙인다(데이터 없으면 표시 없음) */
  path?: string;
  children?: ReactNode;
};

function isConsultCtaHref(href: string): boolean {
  return (
    href.startsWith("/contact") ||
    href.includes("inquiry") ||
    href === "/상담" ||
    href.startsWith("/상담?")
  );
}

export function PageHero({
  h1,
  intro,
  introParagraphs = [],
  eyebrow,
  ctaHref = "/contact/inquiry",
  ctaLabel = consultationInquiryCopy.ctaShort,
  secondaryCta,
  showDiagnosisCta = true,
  showAboutLawyerCta = true,
  showNaverBlogCta = false,
  showNationwideChip = false,
  showNaverReservation,
  sideImage,
  path,
  children,
}: PageHeroProps) {
  const descriptions =
    introParagraphs.length > 0 ? introParagraphs : intro ? [intro] : [];

  const textBlock = (
    <>
      {showNationwideChip ? (
        <div className="readability-hero__chip-row">
          <NationwideRegionChip />
        </div>
      ) : null}
      {eyebrow ? <p className="readability-hero__eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title">{h1}</h1>
      {/* 검색 AI가 H1 다음 문장을 답으로 읽으므로 결론·한눈 표를 신뢰 배지보다 먼저 둔다(2026-11-19) */}
      <ServiceAnswerCard path={path} />
      <HeroTrustLine />
      <ConsultEmpathyLead />
      {descriptions.length > 0 ? (
        <div className="mt-4 md:mt-5">
          <ProseParagraphs paragraphs={descriptions.slice(0, 2)} />
        </div>
      ) : null}
      {/* 업체 추천형 검색 페이지에만: 도입 문단 뒤에 사무소 사실 묶음(OfficeProfileCard) */}
      <OfficeProfileCard path={path} />
      {children}
    </>
  );

  const aboutCta =
    showAboutLawyerCta && !secondaryCta && !showDiagnosisCta
      ? { href: "/about", label: "안윤정 법무사는 누구일까?" }
      : null;

  const resolvedSecondary = secondaryCta ?? aboutCta;
  const naverOn =
    showNaverReservation !== false &&
    Boolean(ctaLabel) &&
    isConsultCtaHref(ctaHref);
  const secondaryBtnClass = showNaverBlogCta
    ? "btn-secondary inline-flex min-h-12 items-center justify-center gap-1.5 px-4 sm:px-5"
    : "btn-secondary inline-flex min-h-12 items-center justify-center px-6";

  // 상담형 CTA(문의·상담 경로)는 글자 링크형 안내(HeroContactButtons): PC 상담 연결 + 공통 안내 2개
  const consultHero = Boolean(ctaLabel) && isConsultCtaHref(ctaHref);
  const consultCtaBlock = consultHero ? (
    <HeroContactButtons
      className="mt-5 md:mt-6"
      placement="page_hero"
      showReservation={naverOn}
      inquiryFallbackHref={ctaHref}
    />
  ) : null;

  // 상담형이 아닌 히어로도 서두 비용 문의 안내는 같은 위치(설명 바로 뒤)에 둔다 — 상담형은 HeroContactButtons 안에 있다.
  const costIntro = consultHero ? null : <CostInquiryNote variant="intro" className="mt-5 md:mt-6" />;

  const ctaBlock = consultCtaBlock ?? (ctaLabel ? (
    <div className="mt-5 flex flex-col gap-3 md:mt-6">
      <InquiryNaverCtaPair
        placement="page_hero"
        layout="row"
        size="md"
        showNaver={naverOn}
        inquiry={
          isConsultCtaHref(ctaHref) ? (
            <InquiryStartButton
              source="landing"
              fallbackHref={ctaHref}
              className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
            >
              {ctaLabel}
            </InquiryStartButton>
          ) : (
            // 상담 경로가 아닌 이동 링크(예: 용어 페이지의 '취득세 안내 보기')는 보조 버튼으로 —
            // 바로 위 상담 카드(CostInquiryNote)의 '간편 문의'가 주 버튼이라, 남색 버튼이 둘이면 무엇을 눌러야 할지 흐려진다(2026-11-15).
            <Link
              href={ctaHref}
              className="btn-secondary group inline-flex min-h-12 items-center justify-center gap-1.5 px-6"
            >
              {ctaLabel}
              <span
                className="text-navy/45 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          )
        }
      />
      {resolvedSecondary || showDiagnosisCta || showNaverBlogCta ? (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {resolvedSecondary ? (
            <Link href={resolvedSecondary.href} className={secondaryBtnClass}>
              {resolvedSecondary.label}
            </Link>
          ) : showDiagnosisCta ? (
            <Link href="/자가진단" className={secondaryBtnClass}>
              자가진단 보기
            </Link>
          ) : null}
          {showNaverBlogCta ? (
            <NaverBlogMorePostsButton className={secondaryBtnClass} />
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null);

  if (!sideImage) {
    return (
      <header className="readability-hero">
        {textBlock}
        {costIntro}
        {ctaBlock}
      </header>
    );
  }

  return (
    <header className="readability-hero">
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,12.5rem)] lg:items-start lg:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
        <div className="min-w-0">
          {textBlock}
          {costIntro}
          {ctaBlock}
        </div>
        {/* 본문 높이에 맞춰 늘이면 세로로 길쭉하게 잘리므로 비율을 고정한다 */}
        <div className="mx-auto w-full max-w-[15rem] lg:mx-0 lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-beige-dark bg-beige/40 shadow-sm lg:aspect-[4/5]">
            <Image
              src={encodePublicSrc(sideImage.src)}
              alt={sideImage.alt}
              fill
              priority
              quality={72}
              className="object-cover object-[center_18%]"
              sizes="(max-width: 1024px) 15rem, 14rem"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
