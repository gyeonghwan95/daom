"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getContactInfo,
  getMobileBottomChannels,
  getPhoneHref,
  type ConsultationChannel,
} from "@/lib/contact";
import { isB2BPath } from "@/lib/b2b/options";
import {
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { quickInquiryCopy as copy } from "@/lib/quick-inquiry/copy";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry";

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
  const phone = getContactInfo().phone;
  const phoneHref = phone ? getPhoneHref(phone) : "/contact";
  const kakao = channels.find((c) => c.id === "kakao");

  if (b2b) {
    const phoneChannel = channels.find((c) => c.id === "phone");
    return (
      <div
        className="mobile-bottom-cta fixed inset-x-0 bottom-0 z-50 border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="region"
        aria-label="협업 빠른 연락"
      >
        <div className="grid grid-cols-3 divide-x divide-beige-dark">
          {phoneChannel ? <MobileChannelButton channel={phoneChannel} /> : null}
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
      className="mobile-bottom-cta mobile-bottom-cta--inquiry fixed inset-x-0 bottom-0 z-50 border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="빠른 연락"
    >
      <div className="mobile-bottom-cta__inquiry-grid">
        <a
          href={phoneHref}
          className="mobile-bottom-cta__btn mobile-bottom-cta__btn--phone"
          aria-label="전화 상담"
        >
          <PhoneIcon className="mobile-bottom-cta__icon" />
          <span className="mobile-bottom-cta__label">전화</span>
        </a>

        <button
          type="button"
          className="mobile-bottom-cta__inquiry"
          aria-haspopup="dialog"
          onClick={() => inquiry?.openInquiry({ source: "mobile" })}
        >
          <span className="mobile-bottom-cta__inquiry-label">{copy.mobileLabel}</span>
          <span className="mobile-bottom-cta__inquiry-hint">{copy.mobileHint}</span>
        </button>

        {kakao ? <MobileChannelButton channel={kakao} /> : null}
      </div>
    </div>
  );
}
