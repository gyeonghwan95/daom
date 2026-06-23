import Link from "next/link";
import {
  getContactInfo,
  type ConsultationChannel,
  type ConsultationChannelId,
  type ConsultationQrChannelId,
} from "@/lib/contact";
import { ConsultationChatTile } from "@/components/consultation/ConsultationChatTile";
import {
  FormIcon,
  KakaoIcon,
  LocationIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";

const qrChannelIds = new Set<ConsultationQrChannelId>(["kakao", "naver"]);

function isQrChannel(id: ConsultationChannelId): id is ConsultationQrChannelId {
  return qrChannelIds.has(id as ConsultationQrChannelId);
}

type ConsultationPanelProps = {
  channels: ConsultationChannel[];
  theme?: "dark" | "light";
  showLabels?: "full" | "short";
  className?: string;
};

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

function SimpleChannelButton({
  channel,
  label,
  theme,
}: {
  channel: ConsultationChannel;
  label: string;
  theme: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const base =
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors";

  const colorById: Partial<Record<ConsultationChannelId, string>> = isDark
    ? {
        phone: `${base} bg-white text-navy hover:bg-beige`,
        kakao: `${base} bg-[#FEE500] text-[#191919] hover:brightness-95`,
        naver: `${base} bg-[#03C75A] text-white hover:opacity-90`,
        reservation: `${base} bg-[#03C75A] text-white hover:opacity-90`,
        location: `${base} border-2 border-white/40 text-white hover:bg-white/10`,
        inquiry: `${base} border-2 border-white/40 text-white hover:bg-white/10`,
      }
    : {
        phone: `${base} bg-navy text-white hover:bg-navy-dark`,
        kakao: `${base} bg-[#FEE500] text-[#191919] hover:brightness-95`,
        naver: `${base} bg-[#03C75A] text-white hover:opacity-90`,
        reservation: `${base} bg-[#03C75A] text-white hover:opacity-90`,
        location: `${base} border-2 border-beige-muted bg-white text-navy hover:border-navy-light hover:bg-beige`,
        inquiry: `${base} border-2 border-beige-muted bg-white text-navy hover:border-navy-light hover:bg-beige`,
      };

  const className =
    colorById[channel.id] ??
    (isDark
      ? `${base} border-2 border-white/40 text-white hover:bg-white/10`
      : `${base} border-2 border-beige-muted bg-white text-navy hover:border-navy-light hover:bg-beige`);

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

function ConsultationPhoneStrip({
  channel,
  theme,
}: {
  channel: ConsultationChannel;
  theme: "dark" | "light";
}) {
  const { phone } = getContactInfo();
  const isDark = theme === "dark";

  return (
    <a
      href={channel.href}
      className={
        isDark
          ? "consultation-panel__phone consultation-panel__phone--on-dark"
          : "consultation-panel__phone"
      }
    >
      <span className="consultation-panel__phone-icon" aria-hidden>
        <PhoneIcon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-xs font-medium opacity-75">전화 상담</span>
        <span className="block truncate text-lg font-bold tracking-tight">
          {phone || "전화걸기"}
        </span>
      </span>
      <span className="consultation-panel__phone-action">전화걸기</span>
    </a>
  );
}

export function ConsultationPanel({
  channels,
  theme = "light",
  showLabels = "full",
  className = "",
}: ConsultationPanelProps) {
  const labelFor = (channel: ConsultationChannel) =>
    showLabels === "short" ? channel.shortLabel : channel.label;

  const phoneChannel = channels.find((c) => c.id === "phone");
  const chatChannels = channels.filter(
    (c) => isQrChannel(c.id) && c.configured,
  );
  const otherChannels = channels.filter(
    (c) => c.id !== "phone" && !(isQrChannel(c.id) && c.configured),
  );

  return (
    <div className={`consultation-panel ${className}`.trim()}>
      {phoneChannel ? (
        <ConsultationPhoneStrip channel={phoneChannel} theme={theme} />
      ) : null}

      {chatChannels.length > 0 ? (
        <div
          className={`grid gap-3 ${phoneChannel ? "mt-3" : ""} ${
            chatChannels.length > 1 ? "sm:grid-cols-2" : "sm:max-w-sm"
          }`}
        >
          {chatChannels.map((channel) => (
            <ConsultationChatTile
              key={channel.id}
              channel={channel}
              channelId={channel.id as ConsultationQrChannelId}
              label={labelFor(channel)}
            />
          ))}
        </div>
      ) : null}

      {otherChannels.length > 0 ? (
        <div
          className={`grid gap-2 sm:grid-cols-2 ${
            phoneChannel || chatChannels.length > 0 ? "mt-3" : ""
          }`}
        >
          {otherChannels.map((channel) => (
            <SimpleChannelButton
              key={channel.id}
              channel={channel}
              label={labelFor(channel)}
              theme={theme}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
