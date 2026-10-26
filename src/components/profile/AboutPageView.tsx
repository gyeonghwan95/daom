import Link from "next/link";
import { AboutExternalActivitiesMarquee } from "@/components/profile/AboutExternalActivitiesMarquee";
import { AboutHeroActions } from "@/components/profile/AboutHeroActions";
import { ActivitySectionBlock } from "@/components/profile/ActivitySectionBlock";
import { LawyerAtAGlance } from "@/components/profile/LawyerAtAGlance";
import { LawyerEeatProfile } from "@/components/profile/LawyerEeatProfile";
import { LawyerProfileNav } from "@/components/profile/LawyerProfileNav";
import { LawyerQualificationsSection } from "@/components/profile/LawyerQualificationsSection";
import { LawyerTrackRecordTables } from "@/components/profile/LawyerTrackRecordTables";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import { AboutHeroGallery } from "@/components/profile/AboutHeroGallery";
import { AboutReviewVoices } from "@/components/profile/AboutReviewVoices";
import { CostInquiryNote } from "@/components/cta/CostInquiryNote";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageSerpCarousel } from "@/components/carousel/PageSerpCarousel";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAboutAppeal, getAboutHeroSlides } from "@/lib/about-appeal";
import { lawyerActivitySections } from "@/lib/lawyer-activities";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

const RELATED_LINKS = [
  { href: "/office", label: "사무소 소개" },
  { href: "/services", label: "업무안내" },
  { href: "/법률강의", label: "법률 강의·특강" },
  { href: "/강의이력", label: "강의 이력" },
  { href: "/강사소개", label: "강사 소개" },
  { href: "/media", label: "언론·활동" },
  { href: "/contact", label: "상담 신청" },
];

const BREADCRUMBS = [{ label: "홈", href: "/" }, { label: "법무사 소개" }];

export function AboutPageView() {
  const appeal = getAboutAppeal();
  const heroSlides = getAboutHeroSlides();

  return (
    <article className="content-stack about-page">
      <Breadcrumb items={BREADCRUMBS} />
      <BreadcrumbJsonLd items={BREADCRUMBS} currentPath="/about" />

      <header className="about-hero">
        <div className="about-hero__copy">
          <p className="about-kicker">{appeal.officeName} 대표</p>
          <h1 className="about-hero__title">안윤정 법무사 소개</h1>
          <p className="about-hero__lead">내 일을 맡길 법무사, 안윤정입니다.</p>
          <p className="about-hero__intro">
            상담부터 등기·신청까지 대표가 직접 진행합니다. {appeal.locationShort}에서
            상속·부동산·법인등기와 개인회생·파산을 맡고, 기한과 비용을 먼저 나눠 설명합니다.
          </p>
          <ul className="about-hero__tags">
            <li>{appeal.locationShort}</li>
            <li>방문 예약제</li>
            {appeal.awardLine ? <li>협회장 표창</li> : null}
          </ul>
          {appeal.pressQuote ? (
            <blockquote className="about-hero__quote">
              <p>“{appeal.pressQuote.quote}”</p>
              <cite>
                <Link href={appeal.pressQuote.href}>{appeal.pressQuote.source}</Link>
              </cite>
            </blockquote>
          ) : null}
          <div className="about-hero__actions">
            <AboutHeroActions />
            <p className="about-hero__hint">{consultationInquiryCopy.oneMinuteShort}</p>
          </div>
          <nav className="about-hero__jumps" aria-label="소개 페이지 바로가기">
            {appeal.jumps.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <AboutHeroGallery
          representative={heroSlides.representative}
          appeal={heroSlides.appeal}
        />
        <ul className="about-proof" aria-label="검증된 이력 요약">
          {appeal.proof.map((item) => (
            <li key={item.label} className="about-proof__item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </li>
          ))}
        </ul>
      </header>

      <CostInquiryNote variant="intro" />

      <LawyerProfileNav />

      {/* 실제 고객의 말 → 한눈에 보는 근거 순서로 먼저 보여 주고, 진행 방식은 상담 직전에 둔다 */}
      <AboutReviewVoices />

      <LawyerAtAGlance />
      <LawyerEeatProfile />
      <LawyerTrackRecordTables />
      <LawyerQualificationsSection showPortrait={false} />

      <BusinessCredentialSlot path="/about" slug="about" />

      {lawyerActivitySections.map((section, index) =>
        section.id === "external" ? (
          <AboutExternalActivitiesMarquee key={section.id} />
        ) : (
          <ActivitySectionBlock
            key={section.id}
            section={section}
            imagePosition={index % 2 === 0 ? "left" : "right"}
          />
        ),
      )}

      <section
        id="process"
        className="about-how section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        aria-labelledby="process-heading"
      >
        <p className="about-kicker">맡기실 때</p>
        <h2 id="process-heading" className="section-heading">
          맡기시면 이렇게 진행합니다
        </h2>
        <ol className="about-how__steps">
          {appeal.process.map((item) => (
            <li key={item.step} className="about-how__step">
              <span className="about-how__num" aria-hidden>
                {item.step}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>

        <div
          id="approach"
          className="about-how__promise section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h3 className="about-how__subhead">상담에서 바로 확인하실 수 있는 약속</h3>
          <ul className="about-how__checks">
            {appeal.approach.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="practice"
          className="about-how__practice section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h3 className="about-how__subhead">지금 맡길 수 있는 일</h3>
          <ul className="about-how__chips">
            {appeal.practice.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="about-how__chip">
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div
        id="consultation"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <CTASection description="안윤정 법무사에게 직접 상담을 요청하세요. 사건 내용을 듣고 진행 가능 여부와 예상 절차를 안내해 드립니다." />
      </div>

      <PageSerpCarousel path="/about" />

      <RelatedLinks title="관련 안내" links={RELATED_LINKS} />
    </article>
  );
}
