"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { Container } from "@/components/layout/Container";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { consultationCopy } from "@/lib/consultation";
import { getContactInfo, getDirectConsultationChannels, getPhoneHref } from "@/lib/contact";
import { homeClosing } from "@/lib/home-content";
import { easeOutSoft } from "@/lib/motion";
import { siteConfig } from "@/lib/site";

export function HomeContactClosing() {
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const reduced = useReducedMotion();
  const titleLines = homeClosing.title.split("\n");

  return (
    <section className="home-closing relative w-full overflow-hidden py-8 md:py-16 lg:py-20">
      <Container>
        <Reveal variant="scaleIn">
          <div className="home-closing__inner relative rounded-2xl px-5 py-8 text-white sm:px-6 sm:py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
            <motion.div
              className="relative max-w-2xl"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease: easeOutSoft }}
            >
              <h2 className="text-2xl font-bold leading-snug tracking-tight md:text-3xl lg:text-4xl">
                {titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">
                {homeClosing.description}
              </p>

              {phone && (
                <a
                  href={getPhoneHref(phone)}
                  className="mt-6 inline-block break-all text-xl font-semibold tracking-tight text-white transition-opacity hover:text-white/90 sm:mt-8 sm:text-2xl md:text-3xl"
                >
                  {phone}
                </a>
              )}

              <div className="mt-8">
                <ConsultationButtons channels={channels} theme="dark" layout="grid" />
              </div>

              <div className="mt-6">
                <VisitNoticeBanner variant="compact" theme="dark" />
              </div>

              <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/55 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                <span>{siteConfig.name}</span>
                <span>{homeClosing.address}</span>
                <Link href="/about" className="text-white/70 hover:text-white">
                  법무사 소개 →
                </Link>
                <Link href="/contact" className="text-white/70 hover:text-white">
                  상담 문의 →
                </Link>
                <Link href="/location" className="text-white/70 hover:text-white">
                  오시는 길 →
                </Link>
              </div>
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
