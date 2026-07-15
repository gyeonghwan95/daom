"use client";

import { motion } from "framer-motion";
import { HeroBrand } from "@/components/home/HeroBrand";
import { HeroContactBlock } from "@/components/home/HeroContactBlock";
import { HeroImageMarquee } from "@/components/home/HeroImageMarquee";
import { PhoneIcon } from "@/components/consultation/ConsultationIcons";
import { Container } from "@/components/layout/Container";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  getContactInfo,
  getDirectConsultationChannels,
  getPhoneHref,
} from "@/lib/contact";
import { siteImages } from "@/lib/site-images";
import { homeHero } from "@/lib/home-content";
import { scrollToNextHomeSection } from "@/lib/home-scroll";
import { heroTransition } from "@/lib/motion";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: heroTransition,
  },
};

function HeroScrollHint() {
  const reduced = useReducedMotion();

  function scrollToNext() {
    scrollToNextHomeSection(reduced ? 0 : 750);
  }

  return (
    <button
      type="button"
      onClick={scrollToNext}
      className="home-hero__scroll-hint group"
      aria-label={`${homeHero.scrollHint}, 업무 안내로 이동`}
    >
      {reduced ? (
        <span className="home-hero__scroll-label">{homeHero.scrollHint}</span>
      ) : (
        <motion.span
          className="home-hero__scroll-label"
          animate={{ y: [0, 4, 0], opacity: [0.85, 1, 0.85] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {homeHero.scrollHint}
        </motion.span>
      )}

      <span className="home-hero__scroll-line" aria-hidden>
        {!reduced && <span className="home-hero__scroll-dot" />}
      </span>

      <svg
        className="home-hero__scroll-chevron"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function HomeHero() {
  const { phone } = getContactInfo();
  const channels = getDirectConsultationChannels();
  const reduced = useReducedMotion();
  const lines = homeHero.headline.split("\n");
  const phoneHref = phone ? getPhoneHref(phone) : "/contact";

  return (
    <section className="home-hero relative flex min-h-full flex-col">
      <div className="home-hero__ambient" aria-hidden>
        <div className="home-hero__orb home-hero__orb--1" />
        <div className="home-hero__orb home-hero__orb--2" />
        <div className="home-hero__grid" />
      </div>

      <Container className="home-hero__container relative w-full flex-1">
        <motion.div
          className="home-hero__body flex w-full min-h-0 flex-col lg:grid lg:grid-cols-12 lg:items-center"
          variants={reduced ? undefined : stagger}
          initial={reduced ? false : "hidden"}
          animate="visible"
        >
          <motion.div className="home-hero__copy min-h-0 shrink-0 lg:col-span-7">
            <motion.div variants={item} className="hidden lg:block">
              <HeroBrand />
            </motion.div>

            <motion.p variants={item} className="home-hero__eyebrow">
              {homeHero.eyebrow}
            </motion.p>

            <motion.h1 variants={item} className="home-hero__title">
              {lines.map((line, i) => (
                <span key={line} className={i > 0 ? "block" : undefined}>
                  {line}
                </span>
              ))}
            </motion.h1>

            <motion.p variants={item} className="home-hero__sub">
              {homeHero.sub}
            </motion.p>

            <motion.p variants={item} className="home-hero__promise">
              {homeHero.promise}
            </motion.p>

            <motion.ul
              variants={item}
              className="home-hero__tags"
              aria-label="주요 업무"
            >
              {homeHero.serviceTags.map((tag) => (
                <li key={tag} className="home-hero__tag">
                  {tag}
                </li>
              ))}
            </motion.ul>

            <motion.p variants={item} className="home-hero__location">
              {homeHero.locationHint}
            </motion.p>

            <motion.div variants={item} className="home-hero__mobile-convert lg:hidden">
              <a
                href={phoneHref}
                className="home-hero__mobile-cta"
                aria-label={homeHero.mobileCta}
              >
                <PhoneIcon className="home-hero__mobile-cta-icon" />
                <span>{homeHero.mobileCta}</span>
              </a>
              <p className="home-hero__mobile-cta-note">{homeHero.mobileCtaNote}</p>
            </motion.div>

            <motion.div variants={item} className="home-hero__desktop-contact hidden lg:block">
              <HeroContactBlock phone={phone} channels={channels} />
            </motion.div>
          </motion.div>

          <motion.div
            className="home-hero__marquee lg:col-span-5"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroTransition, delay: 0.22 }}
          >
            <HeroImageMarquee slides={siteImages.home.heroSlides} />
          </motion.div>
        </motion.div>
      </Container>

      <div className="home-hero__scroll-bottom">
        <HeroScrollHint />
      </div>
    </section>
  );
}
