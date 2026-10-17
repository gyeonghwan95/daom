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
import { CostInquiryNote } from "@/components/cta/CostInquiryNote";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
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

      <section
        id="process"
        className="about-process section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        aria-labelledby="process-heading"
      >
        <p className="about-kicker">진행 순서</p>
        <h2 id="process-heading" className="section-heading">
          맡기시면 이렇게 이어집니다
        </h2>
        <ol className="about-process__grid mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {appeal.process.map((item) => (
            <li key={item.step} className="about-process__item">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="approach"
        className="about-approach section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        aria-labelledby="approach-heading"
      >
        <p className="about-kicker">맡기는 이유</p>
        <h2 id="approach-heading" className="section-heading">
          사건을 다루는 방식
        </h2>
        <p className="body-text mt-3 max-w-3xl">
          숫자로 순위를 말하지 않습니다. 상담에서 바로 확인할 수 있는 진행 방식과, 이미
          공개한 자격·위촉·강의 기록으로 판단해 주시면 됩니다.
        </p>
        <ul className="about-approach__grid mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {appeal.approach.map((item) => (
            <li key={item.title} className="about-approach__item">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="practice"
        className="about-practice section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        aria-labelledby="practice-heading"
      >
        <p className="about-kicker">주요 업무</p>
        <h2 id="practice-heading" className="section-heading">
          지금 맡길 수 있는 일
        </h2>
        <p className="body-text mt-3 max-w-3xl">
          상속·부동산·법인등기와 개인회생·파산을 중심으로 받습니다. 각 업무 안내에서 절차와
          준비 서류를 이어서 확인하실 수 있습니다.
        </p>
        <ul className="about-practice__grid mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {appeal.practice.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="about-practice__item">
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

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

      <div
        id="consultation"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <CTASection description="안윤정 법무사에게 직접 상담을 요청하세요. 사건 내용을 듣고 진행 가능 여부와 예상 절차를 안내해 드립니다." />
      </div>

      <RelatedLinks title="관련 안내" links={RELATED_LINKS} />
    </article>
  );
}
