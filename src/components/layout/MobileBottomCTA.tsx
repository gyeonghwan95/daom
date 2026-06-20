import Link from "next/link";
import {
  getPrimaryConsultationChannels,
  type ConsultationChannel,
} from "@/lib/contact";
import {
  KakaoIcon,
  LocationIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";

function MobileChannelButton({ channel }: { channel: ConsultationChannel }) {
  const iconClass = "h-5 w-5 shrink-0";

  const content = (
    <>
      {channel.id === "phone" && <PhoneIcon className={iconClass} />}
      {channel.id === "kakao" && <KakaoIcon className={iconClass} />}
      {channel.id === "naver" && <NaverIcon className={iconClass} />}
      {channel.id === "location" && <LocationIcon className={iconClass} />}
      <span className="text-xs font-semibold leading-tight sm:text-sm">
        {channel.shortLabel}
      </span>
    </>
  );

  const baseClass =
    "flex min-h-[3.5rem] cursor-pointer flex-col items-center justify-center gap-1 px-1 text-center transition-colors active:scale-[0.98]";

  const colorClass: Record<ConsultationChannel["id"], string> = {
    phone: "bg-navy text-white",
    kakao: "bg-[#FEE500] text-[#191919]",
    naver: "bg-[#03C75A] text-white",
    location: "bg-white text-navy",
    inquiry: "bg-white text-navy",
  };

  if (channel.external) {
    return (
      <a
        href={channel.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${colorClass[channel.id]}`}
      >
        {content}
      </a>
    );
  }

  if (channel.href.startsWith("/")) {
    return (
      <Link href={channel.href} className={`${baseClass} ${colorClass[channel.id]}`}>
        {content}
      </Link>
    );
  }

  return (
    <a href={channel.href} className={`${baseClass} ${colorClass[channel.id]}`}>
      {content}
    </a>
  );
}

export function MobileBottomCTA() {
  const channels = getPrimaryConsultationChannels();

  return (
    <div
      className="mobile-bottom-cta fixed inset-x-0 bottom-0 z-50 border-t border-beige-dark bg-white shadow-[0_-4px_24px_rgba(30,58,95,0.12)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="빠른 상담"
    >
      <div className="grid grid-cols-2">
        {channels.map((channel, index) => (
          <div
            key={channel.id}
            className={[
              index % 2 === 0 ? "border-r border-beige-dark" : "",
              index < 2 ? "border-b border-beige-dark" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <MobileChannelButton channel={channel} />
          </div>
        ))}
      </div>
    </div>
  );
}
