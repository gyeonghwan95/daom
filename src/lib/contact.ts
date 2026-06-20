import { getPrimaryInquiryForm } from "@/lib/consultation";

export const defaultContact = {
  phone: "070-4172-8056",
  kakao: "http://pf.kakao.com/_Bvhxnn/chat",
  naverTalk: "https://talk.naver.com/ct/w661kd4",
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
      label: phone ? `전화 상담 ${phone}` : "전화 상담",
      shortLabel: "전화",
      href: phone ? getPhoneHref(phone) : "/contact",
      external: false,
      configured: Boolean(phone),
    },
    {
      id: "kakao",
      label: "카카오톡 상담",
      shortLabel: "카카오",
      href: kakao || "/contact",
      external: Boolean(kakao),
      configured: Boolean(kakao),
    },
    {
      id: "naver",
      label: "네이버 톡톡 상담",
      shortLabel: "톡톡",
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
