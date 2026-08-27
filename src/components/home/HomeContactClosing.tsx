"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import { Container } from "@/components/layout/Container";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { consultationCopy } from "@/lib/consultation";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { getContactInfo, getDirectConsultationChannels, getPhoneHref } from "@/lib/contact";
import { getNapInfo } from "@/lib/business-info";
import { homeClosing } from "@/lib/home-content";
import { easeOutSoft } from "@/lib/motion";

export function HomeContactClosing() {
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const nap = getNapInfo();
  const reduced = useReducedMotion();
  const titleLines = homeClosing.title.split("\n");

  return (
    <section className="home-closing relative w-full overflow-hidden py-8 md:py-14 lg:py-16">
      <Container>
        <Reveal variant="scaleIn">
          <div className="home-closing__panel">
            <motion.div
              className="home-closing__copy"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease: easeOutSoft }}
            >
              <p className="home-section-label home-closing__eyebrow">
                {homeClosing.eyebrow}
              </p>
              <h2 className="home-closing__title">
                {titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="home-closing__lede">{homeClosing.description}</p>

              <ol className="home-closing__steps" aria-label="상담 후 진행 순서">
                {homeClosing.steps.map((step) => (
                  <li key={step.index} className="home-closing__step">
                    <span className="home-closing__step-index" aria-hidden>
                      {step.index}
                    </span>
                    <span className="home-closing__step-label">{step.label}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              className="home-closing__aside"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: reduced ? 0 : 0.08, ease: easeOutSoft }}
            >
              {phone ? (
                <a href={getPhoneHref(phone)} className="home-closing__phone">
                  <span className="home-closing__phone-kicker">지금 전화</span>
                  <span className="home-closing__phone-number">{phone}</span>
                </a>
              ) : null}

              <p className="home-closing__channel-hint">
                전화 · 카카오톡 · 네이버 톡톡 중 편한 방법 하나면 됩니다.
              </p>

              <div className="home-closing__channels">
                <ConsultationButtons channels={channels} theme="dark" layout="tile" />
              </div>

              <div className="home-closing__visit">
                <VisitNoticeBanner variant="compact" theme="dark" />
              </div>

              <div className="home-closing__cta">
                <InquiryNaverCtaPair
                  placement="homepage_closing"
                  layout="stack"
                  size="md"
                  inquiry={
                    <InquiryStartButton
                      className="home-closing__inquiry"
                      source="cta"
                    >
                      {consultationInquiryCopy.ctaShort}
                    </InquiryStartButton>
                  }
                />
                <Link href="/location" className="home-closing__location">
                  오시는 길
                </Link>
              </div>

              <p className="home-closing__nap">
                <span>{nap.tradeName}</span>
                <span aria-hidden className="home-closing__nap-dot">
                  ·
                </span>
                <span>{nap.address}</span>
              </p>
            </motion.div>
          </div>
        </Reveal>

        <p className="mt-6 text-center text-xs text-navy/45">
          {consultationCopy.inquiryNotice}
        </p>
        <ConsultationFeeNotice className="mt-2 text-center" />
      </Container>
    </section>
  );
}
