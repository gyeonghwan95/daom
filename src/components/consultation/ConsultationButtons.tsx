import Link from "next/link";
import type { ConsultationChannel, ConsultationChannelId } from "@/lib/contact";
import { ConsultationPanel } from "@/components/consultation/ConsultationPanel";
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
  /** grid: 2열 / stack: 세로 / equal: 채널 수만큼 균등 열 / tile: 아이콘 위·라벨 아래 타일 */
  layout?: "grid" | "stack" | "equal" | "tile";
  showLabels?: "full" | "short";
  showQrCodes?: boolean;
  className?: string;
  pageSlug?: string;
};

function getButtonClass(
  id: ConsultationChannelId,
  theme: "dark" | "light",
  layout: ConsultationButtonsProps["layout"] = "grid",
): string {
  const isTile = layout === "tile";
  const base = isTile
    ? "interactive-surface inline-flex min-h-[4.75rem] w-full flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center text-xs font-semibold leading-tight sm:min-h-[5.25rem] sm:gap-2 sm:text-sm"
    : "interactive-surface inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold sm:px-4";

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
  tile = false,
}: {
  channel: ConsultationChannel;
  label: string;
  className: string;
  tile?: boolean;
}) {
  const iconWrap =
    channel.id === "phone"
      ? "bg-white/15 text-white"
      : channel.id === "naver" || channel.id === "reservation"
        ? "bg-white/20 text-white"
        : channel.id === "kakao"
          ? "bg-black/5 text-[#191919]"
          : "bg-black/5";

  const content = tile ? (
    <>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${iconWrap}`}
      >
        <ChannelIcon id={channel.id} />
      </span>
      <span className="max-w-full px-0.5 break-keep">{label}</span>
    </>
  ) : (
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
  showQrCodes,
  className = "",
  pageSlug,
}: ConsultationButtonsProps) {
  const labelFor = (channel: ConsultationChannel) =>
    showLabels === "short" ? channel.shortLabel : channel.label;

  const wantsQrPanel =
    (showQrCodes ?? layout === "grid") &&
    layout === "grid" &&
    channels.some(
      (channel) =>
        (channel.id === "kakao" || channel.id === "naver") && channel.configured,
    );

  if (wantsQrPanel) {
    return (
      <ConsultationPanel
        channels={channels}
        theme={theme}
        showLabels={showLabels}
        className={className}
        pageSlug={pageSlug}
      />
    );
  }

  const count = Math.max(channels.length, 1);
  const gridClass =
    layout === "stack"
      ? "flex flex-col gap-2.5 sm:gap-3"
      : layout === "equal" || layout === "tile"
        ? `grid gap-2 sm:gap-3 ${
            count === 1
              ? "grid-cols-1"
              : count === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`
        : "grid grid-cols-2 gap-2 sm:gap-3";

  const isTile = layout === "tile";

  return (
    <div className={className}>
      <div className={gridClass}>
        {channels.map((channel) => (
          <ChannelLink
            key={channel.id}
            channel={channel}
            label={labelFor(channel)}
            className={getButtonClass(channel.id, theme, layout)}
            tile={isTile}
          />
        ))}
      </div>
    </div>
  );
}
