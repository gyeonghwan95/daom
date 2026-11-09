"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getMobileBottomChannels,
  type ConsultationChannel,
} from "@/lib/contact";
import { isB2BPath } from "@/lib/b2b/options";
import {
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { trackNaverPlaceClick, trackCtaEvent } from "@/lib/admin-ops/track-client";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { useConsultChatLaunch } from "@/hooks/useConsultChatLaunch";
import {
  consultPasteText,
  consultSlaLine,
  getConsultEmpathy,
} from "@/lib/consultation-empathy";
import { consultChatHint, type ConsultChatStatus } from "@/lib/open-consult-chat";
import { isConsultationPhoneOffered } from "@/lib/consultation-availability";

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

function chatLabel(status: ConsultChatStatus, idle: string): string {
  if (status === "copied") return "붙여넣기";
  if (status === "failed") return "한 줄만";
  return idle;
}

function MobileChannelButton({
  channel,
  status,
  onChat,
}: {
  channel: ConsultationChannel;
  status: ConsultChatStatus;
  onChat: () => void;
}) {
  const linkProps = channel.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
    : {};
  const openChat = () => {
    trackMobileChannel(channel);
    onChat();
  };

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
          aria-label={status === "idle" ? channel.label : consultChatHint(status)}
          onClick={openChat}
          {...linkProps}
        >
          <KakaoIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">
            {chatLabel(status, channel.shortLabel)}
          </span>
          <span className="sr-only"> (새 창)</span>
        </a>
      );
    case "naver":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--naver-talk"
          aria-label={status === "idle" ? channel.label : consultChatHint(status)}
          onClick={openChat}
          {...linkProps}
        >
          <NaverIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">
            {chatLabel(status, channel.shortLabel)}
          </span>
          <span className="sr-only"> (새 창)</span>
        </a>
      );
    case "reservation":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--reservation"
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
          <span className="sr-only"> (새 창)</span>
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
  const { isOpen, isResolved } = useConsultationAvailability();
  const empathy = getConsultEmpathy(pathname);
  const { status, launch } = useConsultChatLaunch();
  const channels = getMobileBottomChannels().filter((c) => {
    if (!c.configured) return false;
    if (c.id === "phone" && (!isConsultationPhoneOffered(isResolved, isOpen) || empathy.quiet)) {
      return false;
    }
    if (
      empathy.hidePlaces &&
      (c.id === "reservation" || c.id === "location")
    ) {
      return false;
    }
    return true;
  });
  const paste = consultPasteText(empathy);
  const sla = consultSlaLine(isOpen, isResolved);
  const chatBtn = (channel: ConsultationChannel) => (
    <div key={channel.id} className="mobile-bottom-cta__cell">
      <MobileChannelButton
        channel={channel}
        status={status}
        onChat={() => launch(paste)}
      />
    </div>
  );

  if (b2b) {
    const pair = channels.filter(
      (c) => c.id === "phone" || c.id === "kakao",
    );
    return (
      <div
        className="mobile-bottom-cta fixed bottom-0 left-0 z-50 w-full max-w-full overflow-hidden border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="region"
        aria-label="협업 빠른 연락"
      >
        {status !== "idle" ? (
          <p className="mobile-bottom-cta__toast" role="status">
            {consultChatHint(status)}
          </p>
        ) : null}
        <div className="grid grid-cols-3 divide-x divide-beige-dark">
          {pair[0] ? chatBtn(pair[0]) : null}
          <div className="mobile-bottom-cta__cell">
            <Link
              href="/협업문의"
              className="mobile-bottom-cta__btn bg-navy text-white"
              aria-label="협업 문의"
              onClick={() => trackCtaEvent("collaboration", undefined, "/협업문의")}
            >
              <span className="mobile-bottom-cta__label">협업 문의</span>
            </Link>
          </div>
          {pair[1] ? chatBtn(pair[1]) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mobile-bottom-cta${empathy.comfort ? " mobile-bottom-cta--comfort" : ""} fixed bottom-0 left-0 z-50 w-full max-w-full overflow-hidden border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="빠른 연락"
    >
      {status !== "idle" ? (
        <p className="mobile-bottom-cta__toast" role="status">
          {consultChatHint(status)}
        </p>
      ) : (
        <p className="mobile-bottom-cta__sla">{sla}</p>
      )}
      <div
        className="grid min-w-0 w-full divide-x divide-beige-dark"
        style={{
          gridTemplateColumns: `repeat(${channels.length}, minmax(0, 1fr))`,
        }}
      >
        {channels.map((channel) => chatBtn(channel))}
      </div>
    </div>
  );
}
