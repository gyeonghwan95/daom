"use client";

import { motion } from "framer-motion";
import { HeroContactBlock } from "@/components/home/HeroContactBlock";
import { HeroStage } from "@/components/home/HeroStage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  getContactInfo,
  getDirectConsultationChannels,
} from "@/lib/contact";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { FormIcon } from "@/components/consultation/ConsultationIcons";
import { homeHero, homeSituationChips } from "@/lib/home-content";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { heroTransition } from "@/lib/motion";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry/QuickInquiryProvider";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: heroTransition,
  },
};

export function HomeHero() {
  const { phone } = getContactInfo();
  const channels = getDirectConsultationChannels();
  const reduced = useReducedMotion();
  const inquiry = useOptionalQuickInquiry();

  return (
    <section className="home-hero home-hero--stage">
      <motion.div
        className="home-hero__copy"
        variants={reduced ? undefined : stagger}
        initial={reduced ? false : "hidden"}
        animate="visible"
      >
        <div className="home-hero__copy-main">
          <motion.p variants={item} className="home-hero__eyebrow">
            {homeHero.officeName}
          </motion.p>
          <motion.h1 variants={item} className="home-hero__title">
            <span className="home-hero__title-ornament" aria-hidden>
              <span className="home-hero__title-diamond" />
              <span className="home-hero__title-stem" />
            </span>
            <span className="home-hero__title-text">
              <span className="home-hero__office">{homeHero.h1}</span>
            </span>
          </motion.h1>

          <motion.p variants={item} className="home-hero__subtitle">
            {homeHero.subtitle}
          </motion.p>

          <span className="home-hero__rule" aria-hidden />

          <motion.p variants={item} className="home-hero__sub">
            {homeHero.sub}
          </motion.p>

          <motion.p variants={item} className="home-hero__promise">
            {homeHero.promise}
          </motion.p>

          <motion.ul
            variants={item}
            className="home-hero__proof"
            aria-label="사무소 신뢰 요약"
          >
            {homeHero.proof.map((itemLabel) => (
              <li key={itemLabel}>{itemLabel}</li>
            ))}
          </motion.ul>

          <motion.ul
            variants={item}
            className="home-hero__tags"
            aria-label="주요 업무"
          >
            {homeSituationChips.map((chip) => (
              <li key={chip.label}>
                <button
                  type="button"
                  className="home-hero__tag home-hero__tag--action"
                  aria-haspopup="dialog"
                  onClick={() =>
                    inquiry?.openInquiry({
                      source: "inline",
                      presetSituationIds: [chip.situationId],
                    })
                  }
                >
                  {chip.label}
                </button>
              </li>
            ))}
          </motion.ul>

          <motion.p variants={item} className="home-hero__location">
            {homeHero.locationHint}
          </motion.p>

          <motion.div variants={item} className="home-hero__mobile-convert lg:hidden">
            <InquiryStartButton
              className="home-hero__mobile-cta"
              source="inline"
            >
              <FormIcon className="home-hero__mobile-cta-icon" />
              {consultationInquiryCopy.ctaPrimary}
            </InquiryStartButton>
            <p className="home-hero__mobile-cta-note">{homeHero.mobileCtaNote}</p>
          </motion.div>
        </div>

        <div className="home-hero__copy-actions">
          {/* 모바일·PC 동일 문구를 DOM에 두 번 두지 않음 (responsive CSS만) */}
          <motion.div variants={item} className="home-hero__convert">
            <p className="home-hero__contact-lead">{homeHero.contactSub}</p>
            <HeroContactBlock phone={phone} channels={channels} tone="on-dark" />
          </motion.div>
        </div>
      </motion.div>

      <div className="home-hero__photo">
        <HeroStage />
        <div className="home-hero__fade" aria-hidden />
      </div>
    </section>
  );
}
