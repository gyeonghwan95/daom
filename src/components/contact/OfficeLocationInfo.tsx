import Link from "next/link";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { SiteImage } from "@/components/media/SiteImage";
import {
  getDirectConsultationChannels,
  getPhoneHref,
  getContactInfo,
} from "@/lib/contact";
import {
  getNaverMapSearchUrl,
  officeLocation,
} from "@/lib/office-location";
import { siteConfig } from "@/lib/site";
import type { SiteImageAsset } from "@/lib/site-images";

type OfficeLocationInfoProps = {
  showQuickContact?: boolean;
  showVisitNotice?: boolean;
  sideImage?: SiteImageAsset;
};

export function OfficeLocationInfo({
  showQuickContact = true,
  showVisitNotice = true,
  sideImage,
}: OfficeLocationInfoProps) {
  const { phone } = getContactInfo();
  const channels = getDirectConsultationChannels();

  const infoBlock = (
    <dl className="space-y-4 text-base text-navy/80">
      <div>
        <dt className="font-semibold text-navy">사무소명</dt>
        <dd className="mt-1">{siteConfig.name}</dd>
      </div>
      <div>
        <dt className="font-semibold text-navy">대표</dt>
        <dd className="mt-1">{siteConfig.representative}</dd>
      </div>
      <div>
        <dt className="font-semibold text-navy">주소</dt>
        <dd className="mt-1 leading-relaxed">{officeLocation.fullAddress}</dd>
        <dd className="mt-3 flex flex-wrap gap-2">
          <CopyAddressButton />
          <a
            href={getNaverMapSearchUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-beige/40"
          >
            네이버 지도 열기
          </a>
        </dd>
      </div>
      <div>
        <dt className="font-semibold text-navy">교통·주차</dt>
        <dd className="mt-1 leading-relaxed">
          {officeLocation.parking}
          <br />
          {officeLocation.subway}
        </dd>
      </div>
      {phone && (
        <div>
          <dt className="font-semibold text-navy">전화 상담</dt>
          <dd className="mt-1">
            <a
              href={getPhoneHref(phone)}
              className="inline-flex min-h-12 items-center font-medium text-navy-light underline-offset-2 hover:underline"
            >
              {phone}
            </a>
          </dd>
        </div>
      )}
    </dl>
  );

  return (
    <div className="space-y-6">
      {showVisitNotice && <VisitNoticeBanner />}

      <section
        id="office-location"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface overflow-hidden bg-beige p-6 md:p-8"
      >
        <h2 className="section-heading">사무소 위치</h2>
        {sideImage ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
            <div className="min-w-0">{infoBlock}</div>
            <div className="relative min-h-[14rem] w-full overflow-hidden rounded-xl border border-beige-dark bg-white lg:min-h-0">
              <SiteImage
                {...sideImage}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="h-full w-full"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">{infoBlock}</div>
        )}
      </section>

      {showQuickContact && (
        <section className="card-surface p-6 md:p-8">
          <h2 className="section-heading">예약·상담 바로가기</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
            전화는 바로 연결되고, 카카오톡·네이버 톡톡은 채팅으로 편하게 문의하실 수
            있습니다.
          </p>
          <div className="mt-5">
            <ConsultationButtons channels={channels} theme="light" layout="grid" />
          </div>
          <p className="mt-4 text-sm text-navy/60">
            <Link
              href="/contact"
              className="font-medium text-navy-light underline-offset-2 hover:underline"
            >
              상담 문의 페이지
            </Link>
            에서도 같은 방법으로 연락하실 수 있습니다.
          </p>
        </section>
      )}
    </div>
  );
}
