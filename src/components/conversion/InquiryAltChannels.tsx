"use client";

import type { ReactNode } from "react";
import {
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { trackCTA } from "@/lib/analytics/track-cta";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import {
  isNaverSmartPlaceConfigured,
  type NaverSmartPlacePlacement,
} from "@/lib/naver-smartplace/cta";

export type InquiryAltChannelId = "phone" | "kakao" | "talk" | "reservation" | "map";

type InquiryAltChannelsProps = {
  title?: string;
  description?: string;
  channels?: InquiryAltChannelId[];
  placement: NaverSmartPlacePlacement;
  pageSlug?: string;
  className?: string;
};

const buttonBase =
  "interactive-surface inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold no-underline transition";

/**
 * 이메일 문의 폼 옆에 두는 「다른 연락 방법」 — 폼 작성이 부담스러운 분을 위한 대안 채널.
 */
export function InquiryAltChannels({
  title = "메일 대신 편한 방법으로 연락하셔도 됩니다",
  description = "작성이 번거로우시면 전화·카카오톡·네이버 톡톡으로 바로 말씀해 주세요. 같은 담당 법무사가 확인합니다.",
  channels = ["phone", "kakao", "talk", "map"],
  placement,
  pageSlug = "",
  className = "",
}: InquiryAltChannelsProps) {
  const { phone, kakao, naverTalk } = getContactInfo();
  const naverOn = isNaverSmartPlaceConfigured();

  const items: { id: InquiryAltChannelId; node: ReactNode }[] = [];

  for (const id of channels) {
    if (id === "phone" && phone) {
      const href = getPhoneHref(phone);
      items.push({
        id,
        node: (
          <a
            href={href}
            data-cta="phone"
            onClick={() => trackCTA("phone", pageSlug, href)}
            className={`${buttonBase} bg-navy text-white hover:bg-navy-dark`}
            aria-label={`전화 상담 ${phone}`}
          >
            <PhoneIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">전화 상담</span>
          </a>
        ),
      });
    } else if (id === "kakao" && kakao) {
      items.push({
        id,
        node: (
          <a
            href={kakao}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="kakao"
            onClick={() => trackCTA("kakao", pageSlug, kakao)}
            className={`${buttonBase} bg-[#FEE500] text-[#191919] hover:brightness-95`}
          >
            <KakaoIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">카카오톡</span>
            <span className="sr-only"> (새 창)</span>
          </a>
        ),
      });
    } else if (id === "talk" && naverTalk) {
      items.push({
        id,
        node: (
          <a
            href={naverTalk}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="naver-talk"
            onClick={() => trackCTA("naver-talk", pageSlug, naverTalk)}
            className={`${buttonBase} bg-[#03C75A] text-white hover:brightness-95`}
          >
            <NaverIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">네이버 톡톡</span>
            <span className="sr-only"> (새 창)</span>
          </a>
        ),
      });
    } else if ((id === "reservation" || id === "map") && naverOn) {
      items.push({
        id,
        node: (
          <NaverSmartPlaceCta
            variant={id}
            placement={placement}
            tone={id === "reservation" ? "brand" : "soft"}
            size="md"
            fullWidth
            label={id === "reservation" ? "네이버 예약" : "네이버 지도"}
            className="!min-h-11"
          />
        ),
      });
    }
  }

  if (items.length === 0) return null;

  return (
    <section
      aria-label="다른 연락 방법"
      className={`@container rounded-xl border border-beige-dark bg-beige/35 p-4 md:p-5 ${className}`.trim()}
    >
      <p className="text-sm font-semibold text-navy md:text-[0.95rem]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-navy/65 md:text-sm">{description}</p>
      <ul
        className={`mt-3 grid grid-cols-2 gap-2 [&>li:last-child:nth-child(odd)]:col-span-2 ${
          items.length >= 4 ? "@xl:grid-cols-4" : items.length === 3 ? "@xl:grid-cols-3" : ""
        } @xl:[&>li:last-child:nth-child(odd)]:col-span-1`}
      >
        {items.map((item) => (
          <li key={item.id}>{item.node}</li>
        ))}
      </ul>
    </section>
  );
}
