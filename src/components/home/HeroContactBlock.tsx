"use client";

import Link from "next/link";
import {
  FormIcon,
  KakaoIcon,
  LocationIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { getPhoneHref, type ConsultationChannel } from "@/lib/contact";
import { isNaverSmartPlaceConfigured } from "@/lib/naver-smartplace/cta";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { openFloatingConsult } from "@/lib/floating-consult";

type HeroContactBlockProps = {
  phone: string;
  channels: ConsultationChannel[];
  tone?: "light" | "on-dark";
};

const CHIP_ICON_CLASS = "h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem]";

const channelMeta: Record<
  "phone" | "kakao" | "naver",
  { label: string }
> = {
  phone: { label: "전화걸기" },
  kakao: { label: "카카오톡" },
  naver: { label: "네이버 톡톡" },
};

const HERO_INQUIRY_CHIP_LABEL = consultationInquiryCopy.ctaShort;

function ChannelIcon({ id }: { id: "phone" | "kakao" | "naver" }) {
  const className = CHIP_ICON_CLASS;

  switch (id) {
    case "phone":
      return <PhoneIcon className={className} />;
    case "kakao":
      return <KakaoIcon className={className} />;
    case "naver":
      return <NaverIcon className={className} />;
  }
}

export function HeroContactBlock({
  phone,
  channels,
  tone = "light",
}: HeroContactBlockProps) {
  const directChannels = channels.filter((c) =>
    ["phone", "kakao", "naver"].includes(c.id),
  );

  return (
    <div className="hero-contact">
      <div className="hero-contact__row" role="list">
        {directChannels.map((channel) => {
          const id = channel.id as "phone" | "kakao" | "naver";
          const meta = channelMeta[id];
          const href =
            id === "phone" && phone ? getPhoneHref(phone) : channel.href;
          const className = `hero-contact__chip hero-contact__chip--${id}`;
          const ariaLabel = meta.label;

          const content = (
            <>
              <ChannelIcon id={id} />
              <span className="hero-contact__chip-label">{meta.label}</span>
            </>
          );

          if (channel.external) {
            return (
              <a
                key={channel.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                role="listitem"
                aria-label={ariaLabel}
                title={ariaLabel}
              >
                {content}
              </a>
            );
          }

          return (
            <a
              key={channel.id}
              href={href}
              className={className}
              role="listitem"
              aria-label={ariaLabel}
              title={ariaLabel}
            >
              {content}
            </a>
          );
        })}
      </div>

      <div className="hero-contact__footer">
        <div className="hero-contact__row hero-contact__row--guide" role="list">
          <Link
            href="/contact/inquiry"
            className="hero-contact__chip hero-contact__chip--inquiry"
            role="listitem"
          >
            <FormIcon className={CHIP_ICON_CLASS} />
            <span className="hero-contact__chip-label">
              {HERO_INQUIRY_CHIP_LABEL}
            </span>
          </Link>
          <button
            type="button"
            className="hero-contact__chip hero-contact__chip--guide"
            role="listitem"
            aria-haspopup="dialog"
            aria-label={HERO_INQUIRY_CHIP_LABEL}
            onClick={() => openFloatingConsult()}
          >
            <FormIcon className={CHIP_ICON_CLASS} />
            <span className="hero-contact__chip-label">
              {HERO_INQUIRY_CHIP_LABEL}
            </span>
          </button>
          {isNaverSmartPlaceConfigured() ? (
            <span role="listitem" className="contents">
              <NaverSmartPlaceCta
                variant="reservation"
                placement="homepage_hero"
                tone="chip"
                size="sm"
                label="네이버 예약"
                className="hero-contact__chip"
              />
            </span>
          ) : (
            <Link
              href="/location"
              className="hero-contact__chip hero-contact__chip--location"
              role="listitem"
            >
              <LocationIcon className={CHIP_ICON_CLASS} />
              <span className="hero-contact__chip-label">오시는 길</span>
            </Link>
          )}
        </div>
        <ConsultationFeeNotice
          className="mt-2"
          theme={tone === "on-dark" ? "dark" : "muted"}
        />
      </div>
    </div>
  );
}
