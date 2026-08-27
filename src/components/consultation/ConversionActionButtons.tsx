"use client";

import Link from "next/link";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import {
  FormIcon,
  KakaoIcon,
  LocationIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import { useOrderedConsultationChannels } from "@/hooks/useOrderedConsultationChannels";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { trackCTA } from "@/lib/analytics/track-cta";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";

type ConversionActionButtonsProps = {
  documentsHref?: string;
  diagnosisHref?: string;
  theme?: "light" | "dark";
  pageSlug?: string;
  className?: string;
  inquiryNote?: string;
  presetSituationIds?: ConsultSituationId[];
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
  inquiryNote,
  presetSituationIds,
}: ConversionActionButtonsProps) {
  const { phone, kakao, naverTalk } = getContactInfo();
  const slug = pageSlug ?? "conversion-cta";
  const channelItems = useOrderedConsultationChannels(
    [
      phone
        ? { id: "phone" as const, href: getPhoneHref(phone), label: "전화 상담" }
        : null,
      kakao
        ? {
            id: "kakao" as const,
            href: kakao,
            label: "카카오톡 상담",
            external: true,
          }
        : null,
      naverTalk
        ? {
            id: "naver" as const,
            href: naverTalk,
            label: "네이버 톡톡",
            external: true,
          }
        : null,
    ].filter((item): item is NonNullable<typeof item> => Boolean(item)),
  );

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      <InquiryNaverCtaPair
        placement="conversion_actions"
        layout="row"
        size="md"
        inquiry={
          <InquiryStartButton
            source="cta"
            note={inquiryNote}
            presetSituationIds={presetSituationIds}
            pageSlug={slug}
            className={
              theme === "dark"
                ? `${primaryBase} w-full bg-white text-navy hover:bg-beige`
                : `${primaryBase} w-full bg-navy text-white hover:bg-navy-dark`
            }
          >
            <FormIcon className="h-5 w-5 shrink-0" />
            <span>{consultationInquiryCopy.ctaPrimary}</span>
          </InquiryStartButton>
        }
      />
      <p
        className={
          theme === "dark"
            ? "text-center text-xs text-white/75"
            : "text-center text-xs text-navy/60"
        }
      >
        {consultationInquiryCopy.oneMinuteShort}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {channelItems.map((channel) => {
          const kind = channel.id;
          const className =
            kind === "naver"
              ? `${primaryClass(theme, kind)} col-span-2 sm:col-span-1`
              : primaryClass(theme, kind);
          const icon =
            kind === "phone" ? (
              <PhoneIcon className="h-5 w-5 shrink-0" />
            ) : kind === "kakao" ? (
              <KakaoIcon className="h-5 w-5 shrink-0" />
            ) : (
              <NaverIcon className="h-5 w-5 shrink-0" />
            );
          const ctaKind =
            kind === "phone"
              ? "phone"
              : kind === "kakao"
                ? "kakao"
                : "naver-talk";

          return (
            <a
              key={channel.id}
              href={channel.href}
              target={"external" in channel && channel.external ? "_blank" : undefined}
              rel={
                "external" in channel && channel.external
                  ? "noopener noreferrer"
                  : undefined
              }
              data-cta={ctaKind}
              onClick={() => trackCTA(ctaKind, slug, channel.href)}
              className={className}
            >
              {icon}
              <span className="truncate">{channel.label}</span>
            </a>
          );
        })}
      </div>

      <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
        <Link
          href="/location"
          data-cta="location"
          onClick={() => trackCTA("location", slug, "/location")}
          className={secondaryClass(theme)}
        >
          <LocationIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">방문 상담 안내</span>
        </Link>

        <a
          href={documentsHref}
          className={secondaryClass(theme)}
          onClick={() => trackCTA("documents", slug, documentsHref)}
        >
          <FormIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">준비서류 먼저 확인</span>
        </a>

        <Link
          href={diagnosisHref}
          className={secondaryClass(theme)}
          onClick={() => trackCTA("diagnosis", slug, diagnosisHref)}
        >
          <FormIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">자가진단 보기</span>
        </Link>
      </div>
    </div>
  );
}
