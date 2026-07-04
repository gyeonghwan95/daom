import Link from "next/link";
import { OfficeHoursDetail } from "@/components/contact/OfficeHoursDetail";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { OfficeMap } from "@/components/map/OfficeMap";
import { Reveal } from "@/components/motion/Reveal";
import { getNapInfo } from "@/lib/business-info";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { officeLocation } from "@/lib/office-location";

const consultationOptions = [
  {
    title: "전화 상담",
    description: "바로 연결됩니다. 간단한 문의나 예약 요청에 편리합니다.",
    action: "phone" as const,
  },
  {
    title: "카카오톡 상담",
    description: "채팅으로 사건 내용과 서류를 편하게 보내실 수 있습니다.",
    action: "kakao" as const,
  },
  {
    title: "방문 상담",
    description: `${officeLocation.visitNotice} 사전 예약 후 방문해 주세요.`,
    action: "visit" as const,
  },
];

export function HomePlaceGuide() {
  const nap = getNapInfo();
  const { phone, kakao } = getContactInfo();

  const quickChannels = [
    {
      id: "phone" as const,
      label: "전화걸기",
      shortLabel: "전화 상담",
      href: phone ? getPhoneHref(phone) : "/contact",
      external: false,
      configured: Boolean(phone),
    },
    {
      id: "kakao" as const,
      label: "카카오톡",
      shortLabel: "카카오톡",
      href: kakao || "/contact",
      external: Boolean(kakao),
      configured: Boolean(kakao),
    },
  ];

  return (
    <section className="home-place-guide w-full border-t border-beige-dark bg-cream/30 py-14 md:py-20">
      <Container className="max-w-4xl">
        <Reveal>
          <p className="home-section-label text-navy-light">Visit & Contact</p>
          <h2 className="mt-2 text-2xl font-bold text-navy md:text-3xl">
            오시는 길 · 상담 · 운영시간
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/70 md:text-base">
            네이버 플레이스와 동일한 주소·연락처·운영시간을 안내합니다.
          </p>
        </Reveal>

        <div className="mt-10 space-y-10">
          <section
            id="home-directions"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
            aria-labelledby="home-directions-heading"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 id="home-directions-heading" className="section-heading">
                오시는 길
              </h3>
              <HomeSectionActionLink href="/location" label="상세 안내" variant="button" />
            </div>

            <div className="mt-4">
              <OfficeMap />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-navy">주소</dt>
                <dd className="mt-1 leading-relaxed text-navy/80">{nap.address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">대중교통</dt>
                <dd className="mt-1 leading-relaxed text-navy/80">
                  {officeLocation.subway}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold text-navy">주차 안내</dt>
                <dd className="mt-1 leading-relaxed text-navy/80">
                  {officeLocation.parking}. 건물 내 주차 위치는{" "}
                  <Link href="/location#parking" className="font-medium text-navy-light hover:underline">
                    오시는 길 페이지
                  </Link>
                  에서 확인하실 수 있습니다.
                </dd>
              </div>
            </dl>
          </section>

          <section
            id="home-consultation"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
            aria-labelledby="home-consultation-heading"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 id="home-consultation-heading" className="section-heading">
                상담 안내
              </h3>
              <HomeSectionActionLink href="/contact" label="상담 문의" variant="button" />
            </div>

            <ul className="mt-6 space-y-4">
              {consultationOptions.map((option) => (
                <li
                  key={option.title}
                  className="rounded-xl border border-beige-dark bg-white px-4 py-4 md:px-5"
                >
                  <h4 className="font-semibold text-navy">{option.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-navy/75 md:text-base">
                    {option.description}
                  </p>
                  {option.action === "phone" && phone ? (
                    <a
                      href={getPhoneHref(phone)}
                      className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-navy-light hover:underline"
                    >
                      {phone} 전화하기
                    </a>
                  ) : null}
                  {option.action === "kakao" && kakao ? (
                    <a
                      href={kakao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-navy-light hover:underline"
                    >
                      카카오톡 채널 열기
                    </a>
                  ) : null}
                  {option.action === "visit" ? (
                    <Link
                      href="/contact"
                      className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-navy-light hover:underline"
                    >
                      방문 예약 문의
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <ConsultationButtons channels={quickChannels} theme="light" layout="grid" />
            </div>
          </section>

          <section
            id="home-hours"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
            aria-labelledby="home-hours-heading"
          >
            <h3 id="home-hours-heading" className="section-heading">
              운영시간
            </h3>
            <div className="mt-4">
              <OfficeHoursDetail />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy/65">
              {nap.openingHoursNote} 이메일 문의:{" "}
              <a
                href={`mailto:${nap.email}`}
                className="font-medium text-navy-light hover:underline"
              >
                {nap.email}
              </a>
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
