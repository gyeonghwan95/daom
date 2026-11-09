import { getPrimaryInquiryForm } from "@/lib/consultation";
import {
  getNaverSmartPlaceUrl,
  isNaverSmartPlaceEnabled,
} from "@/config/external-links";

export const defaultContact = {
  /** 사이트 공식 전화 — 010만 사용. 0507·070 안심/인터넷전화는 쓰지 않는다. */
  phone: "010-4277-1279",
  /** 팩스 (전화와 별도) */
  fax: "051-980-1279",
  kakao: "https://pf.kakao.com/_Bvhxnn/chat",
  naverTalk: "https://talk.naver.com/ct/w661kd4",
  naverBlog: "https://blog.naver.com/law-yoon-91",
  /** @deprecated Use getNaverReservationUrl() → SmartPlace SSOT */
  naverReservation: "https://naver.me/58j9SzPA",
} as const;

/** 050·070 등 가상번호는 사이트 전화로 쓰지 않는다. */
export function isSitePhoneAllowed(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return false;
  if (digits.startsWith("050") || digits.startsWith("070")) return false;
  return true;
}

function resolveSitePhone(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return defaultContact.phone;
  if (!isSitePhoneAllowed(trimmed)) return defaultContact.phone;
  return trimmed;
}

export const consultationQrCodes = {
  kakao: {
    src: "/qrCode/QR-카카오톡.png",
    alt: "카카오톡 채널 QR코드",
    label: "카카오톡",
    hint: "스마트폰으로 스캔해 채널 추가",
  },
  naver: {
    src: "/qrCode/QR-네이버톡톡.png",
    alt: "네이버톡톡 QR코드",
    label: "네이버톡톡",
    hint: "스마트폰으로 스캔해 상담 시작",
  },
} as const;

export type ConsultationQrChannelId = keyof typeof consultationQrCodes;

export type ContactInfo = {
  phone: string;
  kakao: string;
  naverTalk: string;
};

export type ConsultationChannelId =
  | "phone"
  | "kakao"
  | "naver"
  | "reservation"
  | "location"
  | "inquiry";

export type ConsultationChannel = {
  id: ConsultationChannelId;
  label: string;
  shortLabel: string;
  href: string;
  external: boolean;
  configured: boolean;
};

function readEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

export function getNaverBlogUrl(): string {
  return readEnv("NEXT_PUBLIC_NAVER_BLOG") || defaultContact.naverBlog;
}

export function getNaverReservationUrl(): string {
  // Single destination with SmartPlace SSOT (naver.me). Env override optional.
  if (!isNaverSmartPlaceEnabled()) return "";
  const override = process.env.NEXT_PUBLIC_NAVER_RESERVATION?.trim();
  if (override) return override;
  return getNaverSmartPlaceUrl() || defaultContact.naverReservation;
}

export function getContactInfo(): ContactInfo {
  const naverTalk =
    readEnv("NEXT_PUBLIC_NAVER_TALK") ||
    readEnv("NEXT_PUBLIC_NAVER_BOOKING") ||
    defaultContact.naverTalk;

  return {
    phone: resolveSitePhone(readEnv("NEXT_PUBLIC_PHONE") || defaultContact.phone),
    kakao: readEnv("NEXT_PUBLIC_KAKAO_CHANNEL") || defaultContact.kakao,
    naverTalk,
  };
}

export function getFaxNumber(): string {
  return readEnv("NEXT_PUBLIC_FAX") || defaultContact.fax;
}

export function getPhoneHref(phone: string): string {
  return `tel:${phone.replace(/\D/g, "")}`;
}

export function getConsultationChannels(): ConsultationChannel[] {
  const { phone, kakao, naverTalk } = getContactInfo();
  const inquiry = getPrimaryInquiryForm();

  return [
    {
      id: "phone",
      label: "전화걸기",
      shortLabel: "전화걸기",
      href: phone ? getPhoneHref(phone) : "/contact",
      external: false,
      configured: Boolean(phone),
    },
    {
      id: "kakao",
      label: "카카오톡",
      shortLabel: "카카오톡",
      href: kakao || "/contact",
      external: Boolean(kakao),
      configured: Boolean(kakao),
    },
    {
      id: "naver",
      label: "네이버톡톡",
      shortLabel: "네이버톡톡",
      href: naverTalk || "/contact",
      external: Boolean(naverTalk),
      configured: Boolean(naverTalk),
    },
    {
      id: "location",
      label: "오시는 길",
      shortLabel: "오시는 길",
      href: "/location",
      external: false,
      configured: true,
    },
    ...(inquiry
      ? [
          {
            id: "inquiry" as const,
            label: inquiry.label,
            shortLabel: "문의",
            href: inquiry.url,
            external: true,
            configured: true,
          },
        ]
      : []),
  ];
}

export function getPrimaryConsultationChannels(): ConsultationChannel[] {
  return getConsultationChannels().filter((channel) => channel.id !== "inquiry");
}

/** 전화·카카오·톡톡 등 원클릭 상담 채널만 */
export function getDirectConsultationChannels(): ConsultationChannel[] {
  return getPrimaryConsultationChannels().filter((channel) =>
    ["phone", "kakao", "naver"].includes(channel.id),
  );
}

/** 지역 랜딩 등 전환 페이지: 전화 · 카카오톡 · 네이버톡톡 · 네이버예약 */
export function getConversionConsultationChannels(): ConsultationChannel[] {
  const { phone, kakao, naverTalk } = getContactInfo();
  const reservation = getNaverReservationUrl();

  return [
    {
      id: "phone",
      label: "전화 상담",
      shortLabel: "전화하기",
      href: phone ? getPhoneHref(phone) : "/contact",
      external: false,
      configured: Boolean(phone),
    },
    {
      id: "kakao",
      label: "카카오톡 상담",
      shortLabel: "카카오톡",
      href: kakao || "/contact",
      external: Boolean(kakao),
      configured: Boolean(kakao),
    },
    {
      id: "naver",
      label: "네이버톡톡 상담",
      shortLabel: "네이버톡톡",
      href: naverTalk || "/contact",
      external: Boolean(naverTalk),
      configured: Boolean(naverTalk),
    },
    {
      id: "reservation",
      label: "네이버 상담 예약",
      shortLabel: "네이버예약",
      href: reservation || "/contact",
      external: Boolean(reservation),
      configured: Boolean(reservation),
    },
  ];
}

/** 모바일 하단 고정: 전화 · 카카오톡 · 네이버톡톡 · 네이버예약 */
export function getMobileBottomChannels(): ConsultationChannel[] {
  const { phone, kakao, naverTalk } = getContactInfo();
  const reservation = getNaverReservationUrl();

  return [
    {
      id: "phone",
      label: "전화 상담",
      shortLabel: "전화",
      href: phone ? getPhoneHref(phone) : "/contact",
      external: false,
      configured: Boolean(phone),
    },
    {
      id: "kakao",
      label: "카카오톡 상담",
      shortLabel: "카카오톡",
      href: kakao || "/contact",
      external: Boolean(kakao),
      configured: Boolean(kakao),
    },
    {
      id: "naver",
      label: "네이버톡톡",
      shortLabel: "네이버톡톡",
      href: naverTalk || "/contact",
      external: Boolean(naverTalk),
      configured: Boolean(naverTalk),
    },
    {
      id: "reservation",
      label: "네이버 상담 예약",
      shortLabel: "네이버예약",
      href: reservation || "/contact",
      external: Boolean(reservation),
      configured: Boolean(reservation),
    },
  ];
}
