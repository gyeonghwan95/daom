"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FormIcon,
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { seoBrand } from "@/lib/seo/brand";

const PORTRAIT_SRC = encodePublicSrc("/image/썸네일-정면.jpg");

type ChannelItem = {
  id: string;
  label: string;
  hint: string;
  href: string;
  external?: boolean;
  variant: "phone" | "kakao" | "naver" | "inquiry";
  icon: ReactNode;
};

export function SidebarConsultationPanel() {
  const { phone, kakao, naverTalk } = getContactInfo();
  const availability = useConsultationAvailability();
  const reducedMotion = useReducedMotion();
  const { isOpen, statusLabel, statusHint } = availability;

  const channels: ChannelItem[] = [
    ...(phone
      ? [
          {
            id: "phone",
            label: "전화 상담",
            hint: phone,
            href: getPhoneHref(phone),
            variant: "phone" as const,
            icon: <PhoneIcon className="h-4 w-4 shrink-0" />,
          },
        ]
      : []),
    ...(kakao
      ? [
          {
            id: "kakao",
            label: "카카오톡",
            hint: "채널로 바로 연결",
            href: kakao,
            external: true,
            variant: "kakao" as const,
            icon: <KakaoIcon className="h-4 w-4 shrink-0" />,
          },
        ]
      : []),
    ...(naverTalk
      ? [
          {
            id: "naver",
            label: "네이버 톡톡",
            hint: "톡톡으로 문의",
            href: naverTalk,
            external: true,
            variant: "naver" as const,
            icon: <NaverIcon className="h-4 w-4 shrink-0" />,
          },
        ]
      : []),
    {
      id: "inquiry",
      label: "상담 신청서",
      hint: "상황만 적어 보내기",
      href: "/contact/inquiry",
      variant: "inquiry" as const,
      icon: <FormIcon className="h-4 w-4 shrink-0" />,
    },
  ];

  return (
    <aside
      className="sidebar-consult-panel"
      aria-label="안윤정 법무사 바로 상담"
    >
      <div className="sidebar-consult-panel__portrait">
        <Image
          src={PORTRAIT_SRC}
          alt={seoBrand.representative}
          fill
          className="object-cover object-[center_18%] scale-[1.14]"
          sizes="12.5rem"
          priority
        />
      </div>

      <div className="sidebar-consult-panel__body">
        <div
          className={
            isOpen
              ? "sidebar-consult-panel__status sidebar-consult-panel__status--live"
              : "sidebar-consult-panel__status sidebar-consult-panel__status--away"
          }
        >
          <span
            className={`sidebar-consult-panel__dot sidebar-consult-panel__dot--${isOpen ? "live" : "away"}${reducedMotion ? "" : " sidebar-consult-panel__dot--pulse"}`}
            aria-hidden
          />
          <span className="sidebar-consult-panel__status-text">
            <span className="sidebar-consult-panel__status-label">
              {statusLabel}
            </span>
            <span className="sidebar-consult-panel__status-hint">
              {statusHint}
            </span>
          </span>
        </div>

        <p className="sidebar-consult-panel__title">
          {seoBrand.representativeName} 법무사에게
          <br />
          바로 상담하기
        </p>
        <p className="sidebar-consult-panel__lead">
          지금 알고 계신 상황만 알려주셔도 필요한 순서부터 정리해 드립니다.
        </p>

        <ul className="sidebar-consult-panel__channels">
          {channels.map((channel) => {
            const className = `sidebar-consult-panel__channel sidebar-consult-panel__channel--${channel.variant}`;
            const content = (
              <>
                <span className="sidebar-consult-panel__channel-icon">
                  {channel.icon}
                </span>
                <span className="sidebar-consult-panel__channel-text">
                  <span className="sidebar-consult-panel__channel-label">
                    {channel.label}
                  </span>
                  <span className="sidebar-consult-panel__channel-hint">
                    {channel.hint}
                  </span>
                </span>
              </>
            );

            return (
              <li key={channel.id}>
                {channel.external ? (
                  <a
                    href={channel.href}
                    className={className}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : channel.id === "inquiry" ? (
                  <Link href={channel.href} className={className}>
                    {content}
                  </Link>
                ) : (
                  <a href={channel.href} className={className}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <Link href="/contact" className="sidebar-consult-panel__more">
          상담 안내 보기
        </Link>
      </div>
    </aside>
  );
}
