import Link from "next/link";
import {
  getMobileBottomChannels,
  type ConsultationChannel,
} from "@/lib/contact";
import {
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";

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
  const channels = getMobileBottomChannels();

  return (
    <div
      className="mobile-bottom-cta fixed inset-x-0 bottom-0 z-50 border-t border-beige-dark bg-white shadow-[0_-2px_16px_rgba(30,58,95,0.1)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="빠른 연락"
    >
      <div className="grid grid-cols-4 divide-x divide-beige-dark">
        {channels.map((channel) => (
          <MobileChannelButton key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}
