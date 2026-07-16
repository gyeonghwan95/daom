import type { LocalLandingConfig } from "@/types/local-landing";
import { getAllLectureSlugs } from "@/lib/lectures/content";

const serviceBySlug: Record<string, string> = {
  전세사기예방교육: "real-estate-registration",
  청년생활법률특강: "real-estate-registration",
  창업법률교육: "company-establishment",
  기업법률교육: "corporate-registration",
  공공기관법률교육: "corporate-registration",
  디지털법률교육: "real-estate-registration",
  학교법률교육: "inheritance-registration",
  법무사진로특강: "inheritance-registration",
  법률강의: "inheritance-registration",
  부산법률강사: "inheritance-registration",
  강사소개: "inheritance-registration",
  강의문의: "inheritance-registration",
  부산도서관법률특강: "inheritance-registration",
  부산법무사강의: "inheritance-registration",
  부산기관법률특강: "corporate-registration",
};

export const lectureLandingConfigs: LocalLandingConfig[] =
  getAllLectureSlugs().map((slug) => ({
    slug,
    pageType: "lecture" as const,
    keywordKey: slug,
    serviceSlug: serviceBySlug[slug] ?? "inheritance-registration",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀", "연제구", "수영구"],
  }));
