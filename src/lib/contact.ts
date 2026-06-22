import { getPrimaryInquiryForm } from "@/lib/consultation";
import { getNaverPlaceUrl } from "@/lib/office-location";

export const defaultContact = {
  phone: "070-4172-8056",
  kakao: "http://pf.kakao.com/_Bvhxnn/chat",
  naverTalk: "https://talk.naver.com/ct/w661kd4",
  naverBlog: "https://blog.naver.com/law-yoon-91",
  naverReservation:
    "https://map.naver.com/p/entry/place/2035745096?c=15.00,0,0,0,dh&placePath=/ticket?from=map&fromPanelNum=1&additionalHeight=76&locale=ko&svcName=map_pcv5",
} as const;

export type ContactInfo = {
  phone: string;
  kakao: string;
  naverTalk: string;
};

export type ConsultationChannelId =
  | "phone"
  | "kakao"
  | "naver"
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
  return (
    readEnv("NEXT_PUBLIC_NAVER_RESERVATION") ||
    defaultContact.naverReservation
  );
}

export function getContactInfo(): ContactInfo {
  const naverTalk =
    readEnv("NEXT_PUBLIC_NAVER_TALK") ||
    readEnv("NEXT_PUBLIC_NAVER_BOOKING") ||
    defaultContact.naverTalk;

  return {
    phone: readEnv("NEXT_PUBLIC_PHONE") || defaultContact.phone,
    kakao: readEnv("NEXT_PUBLIC_KAKAO_CHANNEL") || defaultContact.kakao,
    naverTalk,
  };
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
      label: "네이버 톡톡",
      shortLabel: "네이버 톡톡",
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

/** 모바일 하단 고정: 전화하기 · 카카오톡 · 길찾기 */
export function getMobileBottomChannels(): ConsultationChannel[] {
  const { phone, kakao } = getContactInfo();

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
      id: "location",
      label: "길찾기",
      shortLabel: "길찾기",
      href: getNaverPlaceUrl(),
      external: true,
      configured: true,
    },
  ];
}
