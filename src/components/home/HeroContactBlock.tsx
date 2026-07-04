import Link from "next/link";
import {
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { getPhoneHref, type ConsultationChannel } from "@/lib/contact";

type HeroContactBlockProps = {
  phone: string;
  channels: ConsultationChannel[];
};

const channelMeta: Record<
  "phone" | "kakao" | "naver",
  { label: string }
> = {
  phone: { label: "전화걸기" },
  kakao: { label: "카카오톡" },
  naver: { label: "네이버 톡톡" },
};

function ChannelIcon({ id }: { id: "phone" | "kakao" | "naver" }) {
  const className = "h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem]";

  switch (id) {
    case "phone":
      return <PhoneIcon className={className} />;
    case "kakao":
      return <KakaoIcon className={className} />;
    case "naver":
      return <NaverIcon className={className} />;
  }
}

export function HeroContactBlock({ phone, channels }: HeroContactBlockProps) {
  const directChannels = channels.filter((c) =>
    ["phone", "kakao", "naver"].includes(c.id),
  );

  return (
    <div className="hero-contact">
      <div className="hero-contact__row" role="list">
        {directChannels.map((channel) => {
          const id = channel.id as "phone" | "kakao" | "naver";
          const meta = channelMeta[id];
          const href =
            id === "phone" && phone ? getPhoneHref(phone) : channel.href;
          const className = `hero-contact__chip hero-contact__chip--${id}`;
          const ariaLabel = meta.label;

          const content = (
            <>
              <ChannelIcon id={id} />
              <span className="hero-contact__chip-label">{meta.label}</span>
            </>
          );

          if (channel.external) {
            return (
              <a
                key={channel.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                role="listitem"
                aria-label={ariaLabel}
                title={ariaLabel}
              >
                {content}
              </a>
            );
          }

          return (
            <a
              key={channel.id}
              href={href}
              className={className}
              role="listitem"
              aria-label={ariaLabel}
              title={ariaLabel}
            >
              {content}
            </a>
          );
        })}
      </div>

      <div className="hero-contact__footer">
        <div className="hero-contact__row hero-contact__row--guide" role="list">
          <Link
            href="/contact"
            className="hero-contact__chip hero-contact__chip--contact"
            role="listitem"
          >
            <span className="hero-contact__chip-label">상담 안내</span>
          </Link>
          <Link
            href="/location"
            className="hero-contact__chip hero-contact__chip--location"
            role="listitem"
          >
            <span className="hero-contact__chip-label">오시는 길</span>
          </Link>
        </div>
        <ConsultationFeeNotice className="mt-2" />
      </div>
    </div>
  );
}
