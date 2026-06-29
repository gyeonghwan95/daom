"use client";

import Link from "next/link";
import {
  FormIcon,
  KakaoIcon,
  LocationIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import {
  getContactInfo,
  getNaverReservationUrl,
  getPhoneHref,
} from "@/lib/contact";
import { trackCTA } from "@/lib/analytics/track-cta";

type ConversionActionButtonsProps = {
  documentsHref?: string;
  diagnosisHref?: string;
  theme?: "light" | "dark";
  pageSlug?: string;
  className?: string;
};

const primaryBase =
  "interactive-surface inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold sm:min-h-12 sm:px-4";

const secondaryBase =
  "interactive-surface inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold sm:min-h-12 sm:px-4";

function primaryClass(theme: "light" | "dark", kind: "phone" | "kakao" | "naver") {
  if (kind === "kakao") {
    return `${primaryBase} bg-[#FEE500] text-[#191919] hover:brightness-95`;
  }
  if (kind === "naver") {
    return `${primaryBase} bg-[#03C75A] text-white hover:opacity-90`;
  }
  if (theme === "dark") {
    return `${primaryBase} bg-white text-navy hover:bg-beige`;
  }
  return `${primaryBase} bg-navy text-white hover:bg-navy-dark`;
}

function secondaryClass(theme: "light" | "dark") {
  if (theme === "dark") {
    return `${secondaryBase} border-white/30 bg-white/5 text-white hover:bg-white/10`;
  }
  return `${secondaryBase} border-beige-muted bg-white text-navy hover:border-navy-light hover:bg-beige/50`;
}

export function ConversionActionButtons({
  documentsHref = "#documents",
  diagnosisHref = "/자가진단",
  theme = "light",
  pageSlug,
  className = "",
}: ConversionActionButtonsProps) {
  const { phone, kakao, naverTalk } = getContactInfo();
  const reservation = getNaverReservationUrl();
  const slug = pageSlug ?? "conversion-cta";

  const visitHref = reservation || "/location";
  const visitExternal = Boolean(reservation);

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {phone ? (
          <a
            href={getPhoneHref(phone)}
            data-cta="phone"
            onClick={() => trackCTA("phone", slug)}
            className={primaryClass(theme, "phone")}
          >
            <PhoneIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">전화 상담</span>
          </a>
        ) : null}

        {kakao ? (
          <a
            href={kakao}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="kakao"
            onClick={() => trackCTA("kakao", slug)}
            className={primaryClass(theme, "kakao")}
          >
            <KakaoIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">카카오톡 상담</span>
          </a>
        ) : null}

        {naverTalk ? (
          <a
            href={naverTalk}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="naver-talk"
            onClick={() => trackCTA("naver-talk", slug)}
            className={`${primaryClass(theme, "naver")} col-span-2 sm:col-span-1`}
          >
            <NaverIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">네이버 톡톡</span>
          </a>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
        {visitExternal ? (
          <a
            href={visitHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="location"
            onClick={() => trackCTA("location", slug)}
            className={secondaryClass(theme)}
          >
            <LocationIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">방문 상담 안내</span>
          </a>
        ) : (
          <Link
            href="/location"
            data-cta="location"
            onClick={() => trackCTA("location", slug)}
            className={secondaryClass(theme)}
          >
            <LocationIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">방문 상담 안내</span>
          </Link>
        )}

        <a href={documentsHref} className={secondaryClass(theme)}>
          <FormIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">준비서류 먼저 확인</span>
        </a>

        <Link href={diagnosisHref} className={secondaryClass(theme)}>
          <span className="truncate">자가진단 먼저 해보기</span>
        </Link>
      </div>
    </div>
  );
}
