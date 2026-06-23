"use client";

import { motion } from "framer-motion";
import { HeroBrand } from "@/components/home/HeroBrand";
import { HeroContactBlock } from "@/components/home/HeroContactBlock";
import { HeroImageMarquee } from "@/components/home/HeroImageMarquee";
import { Container } from "@/components/layout/Container";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  getContactInfo,
  getDirectConsultationChannels,
} from "@/lib/contact";
import { siteImages } from "@/lib/site-images";
import { homeHero } from "@/lib/home-content";
import { scrollToNextHomeSection } from "@/lib/home-scroll";
import { heroTransition } from "@/lib/motion";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
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

  return (
    <section className="home-hero relative flex min-h-full flex-col">
      <div className="home-hero__ambient" aria-hidden>
        <div className="home-hero__orb home-hero__orb--1" />
        <div className="home-hero__orb home-hero__orb--2" />
        <div className="home-hero__grid" />
      </div>

      <Container className="home-hero__container relative w-full flex-1">
        <motion.div
          className="home-hero__body grid w-full min-h-0 items-center gap-5 lg:grid-cols-12 lg:gap-8"
          variants={reduced ? undefined : stagger}
          initial={reduced ? false : "hidden"}
          animate="visible"
        >
          <motion.div className="min-h-0 lg:col-span-7">
            <motion.div variants={item}>
              <HeroBrand />
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-3 text-[1.65rem] font-bold leading-[1.18] tracking-tight text-navy sm:text-[2rem] lg:mt-4 lg:text-[2.5rem] xl:text-[2.85rem]"
            >
              {lines.map((line, i) => (
                <span key={line} className={i > 0 ? "block" : undefined}>
                  {line}
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-2.5 max-w-xl text-[0.875rem] leading-relaxed text-navy/75 sm:text-[0.9375rem] md:text-base"
            >
              {homeHero.sub}
            </motion.p>

            <motion.ul
              variants={item}
              className="mt-2.5 flex flex-wrap gap-1.5"
              aria-label="주요 업무"
            >
              {homeHero.serviceTags.map((tag) => (
                <li key={tag} className="home-hero__tag">
                  {tag}
                </li>
              ))}
            </motion.ul>

            <motion.p
              variants={item}
              className="mt-2 text-sm text-navy/55"
            >
              {homeHero.locationHint}
            </motion.p>

            <motion.div variants={item} className="mt-4 sm:mt-5">
              <HeroContactBlock phone={phone} channels={channels} />
            </motion.div>
          </motion.div>

          <motion.div
            className="relative flex min-h-[16rem] sm:min-h-[18rem] lg:col-span-5 lg:min-h-0 lg:h-full"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroTransition, delay: 0.25 }}
          >
            <HeroImageMarquee
              slides={siteImages.home.heroSlides}
              className="h-full w-full max-h-[19rem] sm:max-h-[22rem] lg:max-h-none"
            />
          </motion.div>
        </motion.div>
      </Container>

      <div className="home-hero__scroll-bottom">
        <HeroScrollHint />
      </div>
    </section>
  );
}
