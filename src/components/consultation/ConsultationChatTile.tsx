import Image from "next/image";
import {
  consultationQrCodes,
  type ConsultationChannel,
  type ConsultationQrChannelId,
} from "@/lib/contact";
import { KakaoIcon, NaverIcon } from "@/components/consultation/ConsultationIcons";

type ConsultationChatTileProps = {
  channel: ConsultationChannel;
  channelId: ConsultationQrChannelId;
  label: string;
};

const brand = {
  kakao: {
    accent: "bg-[#FEE500]",
    text: "text-[#191919]",
    subtitle: "카카오톡 채널",
    hint: "QR 스캔 또는 클릭",
  },
  naver: {
    accent: "bg-[#03C75A]",
    text: "text-white",
    subtitle: "네이버 톡톡",
    hint: "QR 스캔 또는 클릭",
  },
} as const;

export function ConsultationChatTile({
  channel,
  channelId,
  label,
}: ConsultationChatTileProps) {
  const qr = consultationQrCodes[channelId];
  const style = brand[channelId];
  const Icon = channelId === "kakao" ? KakaoIcon : NaverIcon;

  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      className="consultation-chat-tile group"
      aria-label={`${label} 상담`}
    >
      {/* 모바일: 가로형 탭 카드 */}
      <div className="consultation-chat-tile__mobile sm:hidden">
        <span
          className={`consultation-chat-tile__icon-wrap ${style.accent} ${style.text}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-navy">{label}</span>
          <span className="block text-xs text-navy/55">탭하여 바로 상담</span>
        </span>
        <span className="text-navy/30" aria-hidden>
          →
        </span>
      </div>

      {/* 데스크톱: QR 카드 */}
      <div className="consultation-chat-tile__desktop hidden sm:flex">
        <div className={`consultation-chat-tile__header ${style.accent} ${style.text}`}>
          <Icon className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{label}</span>
        </div>
        <div className="consultation-chat-tile__body">
          <div className="consultation-chat-tile__qr">
            <Image
              src={qr.src}
              alt={qr.alt}
              fill
              className="object-contain p-1.5"
              sizes="120px"
            />
          </div>
          <p className="mt-3 text-center text-xs leading-relaxed text-navy/55">
            {style.hint}
          </p>
        </div>
      </div>
    </a>
  );
}
