import { getPhoneHref, getContactInfo } from "@/lib/contact";
import type { PageRelatedLink } from "./types";

/** 모든 페이지 하단 CTA에 배치할 상담·연락 링크 */
export function getStandardContactLinks(): PageRelatedLink[] {
  const { phone, kakao, naverTalk } = getContactInfo();

  return [
    {
      href: phone ? getPhoneHref(phone) : "/contact",
      label: phone ? `전화 ${phone}` : "전화 상담",
    },
    {
      href: kakao || "/contact",
      label: "카카오톡 상담",
    },
    {
      href: naverTalk || "/contact",
      label: "네이버 톡톡",
    },
    {
      href: "/location",
      label: "오시는 길",
    },
  ];
}
