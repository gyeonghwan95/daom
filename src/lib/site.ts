import { seoBrand } from "@/lib/seo/brand";

export const siteConfig = {
  name: seoBrand.siteName,
  representative: seoBrand.representative,
  description: seoBrand.defaultDescription,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://daom-law.com",
  locale: "ko_KR",
  region: {
    city: "부산광역시",
    districts: ["해운대구 센텀", "센텀시티", "반여동"],
  },
  services: seoBrand.services,
  credentials: [
    "법무사",
    "공인중개사",
    "신용관리사",
    "대한법무사협회장 표창 수상",
    "부산 지역 법률 강의 경험",
  ],
} as const;
