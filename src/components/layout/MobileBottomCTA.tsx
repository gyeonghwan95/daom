"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getMobileBottomChannels,
  type ConsultationChannel,
} from "@/lib/contact";
import { isB2BPath } from "@/lib/b2b/options";
import { EXTERNAL_LINKS } from "@/config/external-links";
import {
  FormIcon,
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry";
import { trackNaverPlaceClick, trackCtaEvent } from "@/lib/admin-ops/track-client";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { useOrderedConsultationChannels } from "@/hooks/useOrderedConsultationChannels";

function trackMobileChannel(channel: ConsultationChannel) {
  if (channel.id === "reservation") {
    trackNaverPlaceClick({
      variant: "reservation",
      placement: "mobile_bottom",
      href: channel.href,
    });
    return;
  }
  const kind =
    channel.id === "phone"
      ? "phone"
      : channel.id === "kakao"
        ? "kakao"
        : channel.id === "naver"
          ? "naver-talk"
          : channel.id === "location"
            ? "location"
            : "contact";
  trackCtaEvent(kind, undefined, channel.href);
}

function MobileChannelButton({ channel }: { channel: ConsultationChannel }) {
  const linkProps = channel.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
    : {};

  switch (channel.id) {
    case "phone":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--phone"
          aria-label={channel.label}
          onClick={() => trackMobileChannel(channel)}
          {...linkProps}
        >
          <PhoneIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
        </a>
      );
    case "kakao":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--kakao"
          aria-label={channel.label}
          onClick={() => trackMobileChannel(channel)}
          {...linkProps}
        >
          <KakaoIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
        </a>
      );
    case "naver":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--naver-talk"
          aria-label={channel.label}
          onClick={() => trackMobileChannel(channel)}
          {...linkProps}
        >
          <NaverIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
        </a>
      );
    case "reservation":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--naver-talk"
          aria-label={channel.label}
          data-cta="naver-place"
          data-cta-variant="reservation"
          data-cta-placement="mobile_bottom"
          onClick={() =>
            trackNaverPlaceClick({
              variant: "reservation",
              placement: "mobile_bottom",
              href: channel.href,
            })
          }
          {...linkProps}
        >
          <NaverIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
        </a>
      );
    case "location":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--naver-map"
          aria-label={channel.label}
          onClick={() => trackMobileChannel(channel)}
          {...linkProps}
        >
          <span className="mobile-bottom-cta__map-icon" aria-hidden>
            <NaverIcon className="h-4 w-4 text-white" />
          </span>
          <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
        </a>
      );
    default:
      break;
  }

  const baseClass = "mobile-bottom-cta__btn bg-white text-navy";

  if (channel.href.startsWith("/")) {
    return (
      <Link
            href={channel.href}
            className={baseClass}
            aria-label={channel.label}
            onClick={() => trackMobileChannel(channel)}
          >
        <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
      </Link>
    );
  }

  return (
    <a
      href={channel.href}
      className={baseClass}
      aria-label={channel.label}
      onClick={() => trackMobileChannel(channel)}
      {...linkProps}
    >
      <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
    </a>
  );
}

export function MobileBottomCTA() {
  const pathname = usePathname() ?? "/";
  const b2b = isB2BPath(pathname);
  const channels = getMobileBottomChannels();
  const inquiry = useOptionalQuickInquiry();
  const rowChannels = useOrderedConsultationChannels(
    channels.filter((c) => ["phone", "kakao", "naver"].includes(c.id)),
  );
  const reservation: ConsultationChannel = {
    id: "reservation",
    label: "네이버 상담 예약",
    shortLabel: "예약",
    href: EXTERNAL_LINKS.naverSmartPlace,
    external: true,
    configured: true,
  };

  if (b2b) {
    const pair = rowChannels.filter(
      (c) => c.id === "phone" || c.id === "kakao",
    );
    return (
      <div
        className="mobile-bottom-cta fixed bottom-0 left-0 z-50 w-full max-w-full overflow-hidden border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="region"
        aria-label="협업 빠른 연락"
      >
        <div className="grid grid-cols-3 divide-x divide-beige-dark">
          {pair[0] ? <MobileChannelButton channel={pair[0]} /> : null}
          <Link
            href="/협업문의"
            className="mobile-bottom-cta__btn bg-navy text-white"
            aria-label="협업 문의"
            onClick={() => trackCtaEvent("collaboration", undefined, "/협업문의")}
          >
            <span className="mobile-bottom-cta__label">협업 문의</span>
          </Link>
          {pair[1] ? <MobileChannelButton channel={pair[1]} /> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mobile-bottom-cta fixed bottom-0 left-0 z-50 w-full max-w-full overflow-hidden border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="region"
        aria-label="빠른 연락"
      >
        <div
          className="grid min-w-0 w-full grid-cols-5 divide-x divide-beige-dark"
          style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
        >
        {rowChannels.map((channel) => (
          <MobileChannelButton key={channel.id} channel={channel} />
        ))}
        <button
          type="button"
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--inquiry bg-navy text-white"
          aria-haspopup="dialog"
          aria-label={consultationInquiryCopy.ctaPrimary}
          onClick={() => {
            trackCtaEvent("contact", undefined, "#inquiry");
            inquiry?.openInquiry({ source: "mobile" });
          }}
        >
          <FormIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label mobile-bottom-cta__label--inquiry">
            문의
          </span>
        </button>
        <MobileChannelButton channel={reservation} />
      </div>
    </div>
  );
}
