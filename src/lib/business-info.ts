import { getContactInfo } from "@/lib/contact";
import {
  getNaverPlaceUrl,
  officeHours,
  officeLocation,
} from "@/lib/office-location";
import { seoBrand } from "@/lib/seo/brand";
import { siteConfig } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export const defaultBusinessRegistrationNumber = "657-51-00996";
export const defaultBusinessEmail = "lawyoonjung@naver.com";

export type NapInfo = {
  tradeName: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  websiteUrl: string;
  naverPlaceUrl: string;
  openingHoursSummary: string;
  openingHoursWeekday: string;
  openingHoursLunch: string;
  openingHoursClosed: string;
  openingHoursNote: string;
  businessRegistrationNumber: string;
  legalNotice: string;
};

export function getBusinessEmail(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || defaultBusinessEmail
  );
}

export function getMailtoHref(email: string): string {
  return `mailto:${email}`;
}

/** JSON-LD·NAP 표기용 전화번호 (하이픈 유지) */
export function formatPhoneForDisplay(phone: string): string {
  return phone.trim();
}

export function getNapInfo(): NapInfo {
  const { phone } = getContactInfo();
  const businessRegistrationNumber =
    process.env.NEXT_PUBLIC_BUSINESS_REGISTRATION_NUMBER?.trim() ||
    defaultBusinessRegistrationNumber;

  return {
    tradeName: siteConfig.name,
    representative: seoBrand.representative,
    address: officeLocation.fullAddress,
    phone,
    email: getBusinessEmail(),
    websiteUrl: getSiteUrl(),
    naverPlaceUrl: getNaverPlaceUrl(),
    openingHoursSummary: officeHours.summary,
    openingHoursWeekday: officeHours.weekday,
    openingHoursLunch: officeHours.lunch,
    openingHoursClosed: officeHours.closed,
    openingHoursNote: officeHours.note,
    businessRegistrationNumber,
    legalNotice:
      "본 사이트의 법률 정보는 일반 안내이며, 개별 사건에 대한 법률 자문이 아닙니다.",
  };
}

/** @deprecated getNapInfo 사용 */
export function getBusinessInfo(): NapInfo {
  return getNapInfo();
}

export type BusinessInfo = NapInfo;
