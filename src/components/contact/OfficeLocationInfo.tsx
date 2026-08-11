import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { encodePublicSrc } from "@/lib/encode-public-src";
import {
  getMailtoHref,
  getNapInfo,
} from "@/lib/business-info";
import { getDirectConsultationChannels, getPhoneHref } from "@/lib/contact";
import { officeHours, officeLocation } from "@/lib/office-location";
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
  const channels = getDirectConsultationChannels();
  const nap = getNapInfo();

  return (
    <div className="space-y-6">
      {showVisitNotice ? <VisitNoticeBanner /> : null}

      <section
        id="office-location"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface overflow-hidden bg-beige p-5 sm:p-6 md:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="section-heading">사무소 위치</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">
              {officeLocation.areaLabel} · {officeLocation.shortAddress}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyAddressButton />
            <NaverSmartPlaceCta
              variant="map"
              placement="location_page"
              tone="soft"
              size="sm"
              label="네이버 지도"
            />
          </div>
        </div>

        {sideImage ? (
          <figure className="mx-auto mt-6 w-full max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-beige-dark bg-white shadow-[0_1px_0_rgba(30,58,95,0.04)]">
              <Image
                src={encodePublicSrc(sideImage.src)}
                alt={sideImage.alt}
                width={sideImage.width}
                height={sideImage.height}
                priority
                quality={85}
                sizes="(max-width: 672px) 100vw, 672px"
                className="h-auto w-full"
              />
            </div>
          </figure>
        ) : null}

        {/* 약도 아래 전폭 정보 */}
        <div className="mt-6 w-full space-y-4">
          <div className="rounded-2xl border border-beige-dark bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.12em] text-navy/45 uppercase">
              사무소 정보
            </p>
            <dl className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="상호명" value={nap.tradeName} />
              <InfoItem label="대표자" value={nap.representative} />
              <InfoItem
                label="주소"
                value={nap.address}
                className="sm:col-span-2 lg:col-span-1"
              />
              <InfoItem
                label="전화번호"
                value={
                  nap.phone ? (
                    <a
                      href={getPhoneHref(nap.phone)}
                      className="font-medium text-navy-light underline-offset-2 hover:text-navy hover:underline"
                    >
                      {nap.phone}
                    </a>
                  ) : (
                    "문의 시 안내"
                  )
                }
              />
              <InfoItem
                label="이메일"
                value={
                  <a
                    href={getMailtoHref(nap.email)}
                    className="font-medium text-navy-light underline-offset-2 hover:text-navy hover:underline"
                  >
                    {nap.email}
                  </a>
                }
              />
              <InfoItem
                label="홈페이지"
                value={
                  <a
                    href={nap.websiteUrl}
                    className="break-all font-medium text-navy-light underline-offset-2 hover:text-navy hover:underline"
                  >
                    {nap.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                }
              />
            </dl>
          </div>

          <div className="grid w-full gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-beige-dark bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold tracking-[0.12em] text-navy/45 uppercase">
                운영시간
              </p>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <InfoItem label="평일" value={officeHours.weekday} />
                <InfoItem label="점심시간" value={officeHours.lunch} />
                <InfoItem label="휴무일" value={officeHours.closed} />
              </dl>
              <p className="mt-4 rounded-lg bg-beige/60 px-3 py-2.5 text-sm leading-relaxed text-navy/70">
                {officeHours.note}
              </p>
              {!showQuickContact ? (
                <div className="mt-4">
                  <NaverSmartPlaceCta
                    variant="reservation"
                    placement="location_page"
                    tone="brand"
                    fullWidth
                    size="md"
                    label="네이버 예약"
                    showHint
                  />
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-beige-dark bg-white p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-[0.12em] text-navy/45 uppercase">
                  교통
                </p>
                <p className="mt-3 text-sm leading-relaxed text-navy/85 sm:text-[0.95rem]">
                  {officeLocation.subway}
                </p>
              </div>
              <div className="rounded-2xl border border-beige-dark bg-white p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-[0.12em] text-navy/45 uppercase">
                  주차
                </p>
                <p className="mt-3 text-sm leading-relaxed text-navy/85 sm:text-[0.95rem]">
                  {officeLocation.parking}
                </p>
                <p className="mt-1.5 text-sm text-navy/55">{officeLocation.room}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showQuickContact ? (
        <section className="card-surface p-5 sm:p-6 md:p-8">
          <h2 className="section-heading">예약·상담 바로가기</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/70 sm:text-base">
            전화는 바로 연결되고, 카카오톡·네이버 톡톡은 채팅으로 편하게 문의하실 수
            있습니다. 방문이 필요하면 네이버에서 일정을 확인해 주세요.
          </p>
          <div className="mt-5">
            <ConsultationButtons channels={channels} theme="light" layout="grid" />
          </div>
          <div className="mt-4">
            <NaverSmartPlaceCta
              variant="reservation"
              placement="location_page"
              tone="brand"
              fullWidth
              size="md"
              label="네이버 예약"
              showHint
            />
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
      ) : null}
    </div>
  );
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold tracking-wide text-navy/50">{label}</dt>
      <dd className="mt-1.5 text-sm font-medium leading-relaxed text-navy/90 sm:text-[0.95rem]">
        {value}
      </dd>
    </div>
  );
}
