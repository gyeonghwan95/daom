"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getMobileBottomChannels,
  type ConsultationChannel,
} from "@/lib/contact";
import { isB2BPath } from "@/lib/b2b/options";
import {
  FormIcon,
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry";

function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3v2M16 3v2M4 9h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--reservation"
          aria-label={channel.label}
          {...linkProps}
        >
          <CalendarIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
        </a>
      );
    case "location":
      return (
        <a
          href={channel.href}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--naver-map"
          aria-label={channel.label}
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
      <Link href={channel.href} className={baseClass} aria-label={channel.label}>
        <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
      </Link>
    );
  }

  return (
    <a href={channel.href} className={baseClass} aria-label={channel.label} {...linkProps}>
      <span className="mobile-bottom-cta__label">{channel.shortLabel}</span>
    </a>
  );
}

export function MobileBottomCTA() {
  const pathname = usePathname() ?? "/";
  const b2b = isB2BPath(pathname);
  const channels = getMobileBottomChannels();
  const inquiry = useOptionalQuickInquiry();

  if (b2b) {
    const phone = channels.find((c) => c.id === "phone");
    const kakao = channels.find((c) => c.id === "kakao");
    return (
      <div
        className="mobile-bottom-cta fixed inset-x-0 bottom-0 z-50 border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="region"
        aria-label="협업 빠른 연락"
      >
        <div className="grid grid-cols-3 divide-x divide-beige-dark">
          {phone ? <MobileChannelButton channel={phone} /> : null}
          <Link
            href="/협업문의"
            className="mobile-bottom-cta__btn bg-navy text-white"
            aria-label="협업 문의"
          >
            <span className="mobile-bottom-cta__label">협업 문의</span>
          </Link>
          {kakao ? <MobileChannelButton channel={kakao} /> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mobile-bottom-cta fixed inset-x-0 bottom-0 z-50 border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="빠른 연락"
    >
      <div className="grid grid-cols-5 divide-x divide-beige-dark">
        {channels.map((channel) => (
          <MobileChannelButton key={channel.id} channel={channel} />
        ))}
        <button
          type="button"
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--inquiry"
          aria-haspopup="dialog"
          aria-label="간편 문의"
          onClick={() => inquiry?.openInquiry({ source: "mobile" })}
        >
          <FormIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">문의</span>
        </button>
      </div>
    </div>
  );
}
