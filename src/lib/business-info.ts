import { getContactInfo } from "@/lib/contact";
import { officeLocation } from "@/lib/office-location";
import { seoBrand } from "@/lib/seo/brand";
import { siteConfig } from "@/lib/site";

export const defaultBusinessRegistrationNumber = "657-51-00996";

export type BusinessInfo = {
  tradeName: string;
  representative: string;
  representativeTitle: string;
  address: string;
  phone: string;
  businessRegistrationNumber: string;
  legalNotice: string;
};

export function getBusinessInfo(): BusinessInfo {
  const { phone } = getContactInfo();
  const businessRegistrationNumber =
    process.env.NEXT_PUBLIC_BUSINESS_REGISTRATION_NUMBER?.trim() ||
    defaultBusinessRegistrationNumber;

  return {
    tradeName: siteConfig.name,
    representative: seoBrand.representativeName,
    representativeTitle: seoBrand.jobTitle,
    address: officeLocation.fullAddress,
    phone,
    businessRegistrationNumber,
    legalNotice:
      "본 사이트의 법률 정보는 일반 안내이며, 개별 사건에 대한 법률 자문이 아닙니다.",
  };
}
