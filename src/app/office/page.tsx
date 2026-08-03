import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteImage } from "@/components/media/SiteImage";
import { YoutubeVideoSection } from "@/components/media/YoutubeVideoSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import { ContentSection } from "@/components/readability";
import { createPageMetadata } from "@/lib/metadata";
import { siteImages } from "@/lib/site-images";
import { getYoutubeVideoById } from "@/lib/youtube-videos";
import { getOfficeLocationWithAccess, officeLocation } from "@/lib/office-location";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.office);

export default function OfficePage() {
  const { gallery, map } = siteImages.office;
  const officeVideo = getYoutubeVideoById("office-intro");
  const aboutThumb = siteImages.home.trust;

  return (
    <PageContainer>
      <PageContentSection
        h1="다옴법무사사무소"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "사무소" },
        ]}
        currentPath="/office"
        intro={`다옴법무사사무소는 ${getOfficeLocationWithAccess()}에 있습니다. 해운대·센텀 일대를 중심으로 등기·상속·회생 업무를 수행합니다. 안윤정 법무사가 사무소에서 직접 의뢰인을 맞이하고 사건을 진행하여, 중간 과정마다 진행 상황을 공유해 드립니다. ${officeLocation.visitNotice}`}
        relatedLinks={[
          { href: "/location", label: "오시는 길" },
          { href: "/services", label: "업무안내" },
          { href: "/contact", label: "상담 신청" },
        ]}
        consultationDescription="사무소 방문은 예약 후 이용해 주세요. 전화·카카오톡·네이버 톡톡으로 예약·상담 모두 가능합니다."
        afterIntro={
          <ContentSection
            id="about-recommend"
            title="안윤정 법무사는 어떤사람일까?"
          >
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
                    <span className="text-base font-semibold md:text-lg">
                      법무사 소개
                    </span>
                  </span>
                  <span className="readability-link-card__arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            </ul>
          </ContentSection>
        }
      >
        <div className="space-y-10">
          <BusinessCredentialSlot
            fixed={{ variant: "inline", copyGroup: "general" }}
          />

          <section
            id="office-gallery"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {gallery.map((image) => (
                <SiteImage
                  key={image.src + image.alt}
                  {...image}
                  className="w-full overflow-hidden rounded-xl border border-beige-dark"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          </section>

          {officeVideo && (
            <section
              id="office-video"
              className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
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
              사무소 위치와 주차 안내는 아래 이미지에서 확인하실 수 있습니다.
            </p>
            <div className="mt-4 flex justify-center">
              <SiteImage
                {...map}
                className="w-full max-w-md overflow-hidden rounded-xl border border-beige-dark sm:max-w-lg md:max-w-xl"
              />
            </div>
            <Link
              href="/location"
              className="mt-4 inline-flex min-h-12 items-center text-sm font-semibold text-navy-light hover:underline"
            >
              지도·찾아오시는 길·주차 안내 자세히 보기 →
            </Link>
          </section>
        </div>
      </PageContentSection>
    </PageContainer>
  );
}
