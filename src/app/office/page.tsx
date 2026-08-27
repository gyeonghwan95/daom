import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteImage } from "@/components/media/SiteImage";
import { YoutubeVideoSection } from "@/components/media/YoutubeVideoSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import { OfficeLocationInfo } from "@/components/contact/OfficeLocationInfo";
import { ContentSection } from "@/components/readability";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { siteImages, type SiteImageAsset } from "@/lib/site-images";
import { getYoutubeVideoById } from "@/lib/youtube-videos";
import { getDirectConsultationChannels } from "@/lib/contact";
import {
  buildFaqPageSchema,
  buildLocalBusinessSchema,
} from "@/lib/seo/json-ld";
import { staticPageSeo } from "@/lib/seo/page-seo";
import {
  officeFaqs,
  officePageMeta,
  officePrepareItems,
  officeProseSections,
  officeServiceLinks,
} from "@/lib/office/office-page-content";

export const metadata: Metadata = createPageMetadata(staticPageSeo.office);

/** 사진 그리드용 — 비율을 섹션 단위로만 통일 */
function FigureWithCaption({
  image,
  caption,
  className = "",
  aspectClass = "aspect-[4/3]",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  image: SiteImageAsset;
  caption?: string;
  className?: string;
  aspectClass?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className={className}>
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-beige-dark bg-beige/20 shadow-sm ${aspectClass}`}
      >
        <SiteImage
          {...image}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs leading-relaxed text-navy/55 sm:text-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default function OfficePage() {
  const {
    gallery,
    map,
    exterior: lawyerPortrait,
    parking,
    direction01,
    nameplate,
  } = siteImages.office;
  const officeVideo = getYoutubeVideoById("office-intro");
  const aboutThumb = siteImages.home.trust;
  const channels = getDirectConsultationChannels();
  const consult = siteImages.contact;
  const [nameBadge, wallPlaque, buildingExterior, certificates] = gallery;

  return (
    <PageContainer>
      <JsonLd
        data={[
          buildLocalBusinessSchema(),
          buildFaqPageSchema(officeFaqs),
        ]}
      />
      <PageContentSection
        h1={officePageMeta.h1}
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "사무소" },
        ]}
        currentPath="/office"
        intro={officePageMeta.intro}
        relatedLinks={[
          { href: "/location", label: "오시는 길" },
          { href: "/등기관할과사무소위치", label: "등기 관할과 사무소 위치" },
          { href: "/about", label: "법무사 소개" },
          { href: "/services", label: "업무안내" },
          { href: "/부산법무사방문상담", label: "방문상담 안내" },
          { href: "/부산법무사비대면상담", label: "비대면상담 안내" },
          { href: "/contact", label: "상담 신청" },
        ]}
        consultationDescription="방문은 예약 후 이용해 주세요. 전화·카카오톡·네이버 톡톡으로 상황 확인과 예약을 모두 요청하실 수 있습니다."
        afterIntro={
          <div className="space-y-8 md:space-y-10">
            <div id="about-recommend">
              <ul className="readability-link-list">
                <li>
                  <Link href="/about" className="readability-link-card group">
                    <span className="flex min-w-0 flex-1 items-center gap-3.5 md:gap-4">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-beige-dark bg-beige/40 shadow-sm ring-2 ring-white md:h-14 md:w-14">
                        <Image
                          src={aboutThumb.src}
                          alt={aboutThumb.alt}
                          fill
                          className="object-cover object-[center_18%] transition-transform duration-300 group-hover:scale-105"
                          sizes="56px"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base font-semibold md:text-lg">
                          안윤정 법무사 소개
                        </span>
                        <span className="mt-0.5 block text-sm text-navy/60">
                          자격·이력·강의·공공 협업을 한곳에서 확인
                        </span>
                      </span>
                    </span>
                    <span className="readability-link-card__arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <section
              id="office-gallery"
              className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
            >
              <h2 className="section-heading">사무소 공간</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/65">
                해운대 청년채움공간 내 사무소 위치와 상담 환경을 먼저 살펴보세요.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                {buildingExterior ? (
                  <FigureWithCaption
                    image={buildingExterior}
                    caption="해운대 청년채움공간 · 사무소가 있는 건물"
                    priority
                    sizes="(max-width: 768px) 50vw, 420px"
                  />
                ) : null}
                {certificates ? (
                  <FigureWithCaption
                    image={certificates}
                    caption="자격·수료증"
                    sizes="(max-width: 768px) 50vw, 420px"
                  />
                ) : null}
                {nameBadge ? (
                  <FigureWithCaption
                    image={nameBadge}
                    caption="안윤정 법무사 명패"
                    sizes="(max-width: 768px) 50vw, 420px"
                  />
                ) : null}
                {wallPlaque ? (
                  <FigureWithCaption
                    image={wallPlaque}
                    caption="다옴법무사사무소 현판"
                    sizes="(max-width: 768px) 50vw, 420px"
                  />
                ) : null}
              </div>
            </section>
          </div>
        }
      >
        <div className="space-y-10 md:space-y-12">
          <BusinessCredentialSlot
            fixed={{ variant: "inline", copyGroup: "general" }}
          />

          <ContentSection
            id={officeProseSections[0]!.id}
            title={officeProseSections[0]!.title}
          >
            <div className="readability-prose">
              {officeProseSections[0]!.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <FigureWithCaption
                image={lawyerPortrait}
                caption="안윤정 법무사"
                sizes="(max-width: 768px) 50vw, 420px"
              />
              <FigureWithCaption
                image={nameplate}
                caption="다옴법무사사무소 현판"
                sizes="(max-width: 768px) 50vw, 420px"
              />
            </div>
          </ContentSection>

          <ContentSection
            id={officeProseSections[1]!.id}
            title={officeProseSections[1]!.title}
          >
            <div className="readability-prose">
              {officeProseSections[1]!.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <FigureWithCaption
                image={consult.phoneConsult}
                caption="전화 상담"
                aspectClass="aspect-[2/1]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <FigureWithCaption
                image={consult.inPersonConsult}
                caption="대면 상담"
                aspectClass="aspect-[2/1]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <FigureWithCaption
                image={consult.onSiteConsult}
                caption="출장 상담"
                aspectClass="aspect-[2/1]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          </ContentSection>

          <section
            id="office-contact-now"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] rounded-2xl border border-beige-dark bg-beige/50 p-5 sm:p-6 md:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,18rem)] lg:items-center lg:gap-8">
              <div>
                <h2 className="section-heading">지금 연락·예약하기</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/75 sm:text-base">
                  업무명을 정확히 모르셔도 됩니다. 현재 상황과 준비된 자료만 남겨
                  주시면 필요한 절차와 방문 여부를 먼저 안내합니다.
                </p>
                <div className="mt-5">
                  <ConsultationButtons
                    channels={channels}
                    theme="light"
                    layout="grid"
                    pageSlug="office"
                  />
                </div>
                <p className="mt-4 text-sm text-navy/60">
                  <InquiryStartButton
                    source="cta"
                    className="inline bg-transparent p-0 font-medium text-navy-light underline-offset-2 hover:underline"
                  >
                    1분만에 문의하기
                  </InquiryStartButton>
                  로도 같은 내용을 전달할 수 있습니다.
                </p>
              </div>
              <FigureWithCaption
                image={consult.top}
                caption="상담 중인 안윤정 법무사"
                className="mx-auto w-full max-w-sm lg:max-w-none"
                sizes="(max-width: 1024px) 80vw, 18rem"
              />
            </div>
          </section>

          <ContentSection
            id={officeProseSections[2]!.id}
            title={officeProseSections[2]!.title}
          >
            <div className="readability-prose">
              {officeProseSections[2]!.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-navy/85 sm:text-[0.95rem]">
              {officePrepareItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 border-b border-beige-dark/80 py-2 last:border-0"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy/40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          <OfficeLocationInfo showQuickContact={false} showVisitNotice />

          <ContentSection
            id={officeProseSections[3]!.id}
            title={officeProseSections[3]!.title}
          >
            <div className="readability-prose">
              {officeProseSections[3]!.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <FigureWithCaption
                image={direction01}
                caption="센텀동로 200 · D동 창조관 LAB9호 (옆문)"
                aspectClass="aspect-[3/2]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <FigureWithCaption
                image={parking}
                caption="청년채움공간 주차장 입구"
                aspectClass="aspect-[3/2]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </ContentSection>

          <ContentSection
            id={officeProseSections[4]!.id}
            title={officeProseSections[4]!.title}
          >
            <div className="readability-prose">
              {officeProseSections[4]!.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="office-services" title="이 사무소에서 이어가는 업무">
            <p className="body-text max-w-3xl text-[0.9375rem] leading-relaxed text-navy/80">
              사무소 상담 이후에는 업무별 안내 페이지에서 서류·기한·다음 단계를 이어서
              확인하실 수 있습니다.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {officeServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex h-full flex-col rounded-xl border border-beige-dark bg-white px-4 py-3.5 transition-colors hover:border-navy/25 hover:bg-beige/40"
                  >
                    <span className="font-semibold text-navy">{link.label}</span>
                    <span className="mt-1 text-sm text-navy/60">{link.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </ContentSection>

          {officeVideo && (
            <section
              id="office-video"
              className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] rounded-2xl border border-beige-dark bg-white p-5 md:p-8"
            >
              <h2 className="section-heading">사무소 영상 안내</h2>
              <p className="mt-2 text-sm text-navy/65">
                방문 전 사무소 분위기와 상담 환경을 영상으로 확인해 보세요.
              </p>
              <div className="mt-6">
                <YoutubeVideoSection
                  videos={[officeVideo]}
                  variant="light"
                  featuredId="office-intro"
                />
              </div>
            </section>
          )}

          <section
            id="office-map"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
          >
            <h2 className="section-heading">위치 한눈에 보기</h2>
            <p className="mt-2 text-sm text-navy/65">
              약도 이미지입니다. 상세 지도·주차·동선은 오시는 길에서 이어서 확인하세요.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-beige-dark sm:max-w-lg">
                <SiteImage {...map} fill className="object-contain bg-white" sizes="512px" />
              </div>
            </div>
            <Link
              href="/location"
              className="mt-4 inline-flex min-h-12 items-center text-sm font-semibold text-navy-light hover:underline"
            >
              지도·찾아오시는 길·주차 안내 자세히 보기 →
            </Link>
          </section>

          <ContentSection id="office-faq" title="자주 묻는 질문">
            <dl className="space-y-5">
              {officeFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-beige-dark pb-5 last:border-0 last:pb-0"
                >
                  <dt className="font-semibold text-navy">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-navy/80 sm:text-[0.95rem]">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </ContentSection>

          <section
            id="office-bottom-cta"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] rounded-2xl border border-navy/10 bg-navy px-5 py-8 text-white sm:px-8"
          >
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              방문 전에 상황만 알려주셔도 됩니다
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              해운대·센텀 사무소로 오시기 전에 전화·카카오톡·네이버 톡톡으로 현재 상황과
              준비된 자료를 확인해 보세요. 필요한 절차, 추가 서류, 방문 필요 여부부터
              정리해 드립니다.
            </p>
            <div className="mt-6">
              <ConsultationButtons
                channels={channels}
                theme="dark"
                layout="grid"
                pageSlug="office-bottom"
              />
            </div>
          </section>
        </div>
      </PageContentSection>
    </PageContainer>
  );
}
