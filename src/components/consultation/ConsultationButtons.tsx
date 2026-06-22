import Link from "next/link";
import type { ConsultationChannel, ConsultationChannelId } from "@/lib/contact";
import {
  FormIcon,
  KakaoIcon,
  LocationIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";

type ConsultationButtonsProps = {
  channels: ConsultationChannel[];
  theme?: "dark" | "light";
  layout?: "grid" | "stack";
  showLabels?: "full" | "short";
  className?: string;
};

function getButtonClass(
  id: ConsultationChannelId,
  theme: "dark" | "light",
  compactRow = false,
): string {
  const base = compactRow
    ? "inline-flex min-h-11 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[11px] font-semibold leading-tight transition-colors sm:min-h-12 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
    : "inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-colors sm:min-h-12 sm:gap-2 sm:px-4 sm:text-sm";

  if (theme === "dark") {
    switch (id) {
      case "phone":
        return `${base} bg-white text-navy hover:bg-beige`;
      case "kakao":
        return `${base} bg-[#FEE500] text-[#191919] hover:brightness-95`;
      case "naver":
        return `${base} bg-[#03C75A] text-white hover:opacity-90`;
      case "reservation":
        return `${base} bg-[#03C75A] text-white hover:opacity-90`;
      case "location":
        return `${base} border-2 border-white/40 text-white hover:bg-white/10`;
      case "inquiry":
        return `${base} border-2 border-white/40 text-white hover:bg-white/10`;
      default:
        return `${base} border-2 border-white/40 text-white hover:bg-white/10`;
    }
  }

  switch (id) {
    case "phone":
      return `${base} bg-navy text-white hover:bg-navy-dark`;
    case "kakao":
      return `${base} bg-[#FEE500] text-[#191919] hover:brightness-95`;
    case "naver":
      return `${base} bg-[#03C75A] text-white hover:opacity-90`;
    case "reservation":
      return `${base} bg-[#03C75A] text-white hover:opacity-90`;
    case "location":
      return `${base} border-2 border-beige-muted bg-white text-navy hover:border-navy-light hover:bg-beige`;
    case "inquiry":
      return `${base} border-2 border-beige-muted bg-white text-navy hover:border-navy-light hover:bg-beige`;
    default:
      return `${base} border-2 border-beige-muted bg-white text-navy hover:border-navy-light hover:bg-beige`;
  }
}

function ChannelIcon({ id }: { id: ConsultationChannelId }) {
  const className = "h-5 w-5 shrink-0";

  switch (id) {
    case "phone":
      return <PhoneIcon className={className} />;
    case "kakao":
      return <KakaoIcon className={className} />;
    case "naver":
      return <NaverIcon className={className} />;
    case "reservation":
      return <NaverIcon className={className} />;
    case "location":
      return <LocationIcon className={className} />;
    case "inquiry":
      return <FormIcon className={className} />;
    default:
      return <PhoneIcon className={className} />;
  }
}

function ChannelLink({
  channel,
  label,
  className,
}: {
  channel: ConsultationChannel;
  label: string;
  className: string;
}) {
  const content = (
    <>
      <ChannelIcon id={channel.id} />
      <span className="truncate">{label}</span>
    </>
  );

  if (channel.external) {
    return (
      <a
        href={channel.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  if (channel.href.startsWith("/")) {
    return (
      <Link href={channel.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={channel.href} className={className}>
      {content}
    </a>
  );
}

export function ConsultationButtons({
  channels,
  theme = "light",
  layout = "grid",
  showLabels = "full",
  className = "",
}: ConsultationButtonsProps) {
  const labelFor = (channel: ConsultationChannel) =>
    showLabels === "short" ? channel.shortLabel : channel.label;

  const isDirectRow =
    layout === "grid" &&
    channels.length === 3 &&
    channels.every((channel) =>
      ["phone", "kakao", "naver", "reservation"].includes(channel.id),
    );

  const gridClass = isDirectRow
    ? "grid grid-cols-3 gap-1.5 sm:gap-2"
    : layout === "grid"
      ? "grid grid-cols-2 gap-2 sm:gap-3"
      : "flex flex-col gap-2.5 sm:gap-3";

  return (
    <div className={`${gridClass} ${className}`}>
      {channels.map((channel) => (
        <ChannelLink
          key={channel.id}
          channel={channel}
          label={labelFor(channel)}
          className={getButtonClass(channel.id, theme, isDirectRow)}
        />
      ))}
    </div>
  );
}
