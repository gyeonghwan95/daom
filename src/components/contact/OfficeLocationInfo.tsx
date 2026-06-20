import Link from "next/link";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
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

type OfficeLocationInfoProps = {
  showQuickContact?: boolean;
  showVisitNotice?: boolean;
};

export function OfficeLocationInfo({
  showQuickContact = true,
  showVisitNotice = true,
}: OfficeLocationInfoProps) {
  const { phone } = getContactInfo();
  const channels = getDirectConsultationChannels();

  return (
    <div className="space-y-6">
      {showVisitNotice && <VisitNoticeBanner />}

      <section className="card-surface bg-beige p-6 md:p-8">
        <h2 className="section-heading">사무소 위치</h2>
        <dl className="mt-4 space-y-4 text-base text-navy/80">
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
