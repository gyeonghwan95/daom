"use client";

import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

export function AboutHeroActions() {
  return (
    <InquiryNaverCtaPair
      placement="profile_page"
      layout="row"
      size="lg"
      className="about-hero__cta"
      inquiry={
        <InquiryStartButton
          className="btn-primary w-full"
          source="cta"
          pageSlug="about"
        >
          {consultationInquiryCopy.ctaPrimary}
        </InquiryStartButton>
      }
    />
  );
}
