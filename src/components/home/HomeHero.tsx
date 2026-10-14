"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeroStage } from "@/components/home/HeroStage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { HomeHeroChannels } from "@/components/home/HomeHeroChannels";
import { trackCTA } from "@/lib/analytics/track-cta";
import { homeHero } from "@/lib/home-content";
import { heroTransition } from "@/lib/motion";

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

/**
 * 메인 첫 화면 — 대표 인물(영상·사진 무대) + 핵심 문장 + 연락·안내 버튼(HomeHeroChannels).
 * 초기 HTML에서 문장·링크가 보이도록 등장 애니메이션은 숨김 상태에서 시작하지 않는다(JS 지연·영상 실패 대비).
 * 버튼 아래에는 전화번호만 글자로 남긴다(번호를 보고 직접 거는 분).
 */
export function HomeHero() {
  const { phone } = getContactInfo();
  const reduced = useReducedMotion();
  const track = (kind: string, href?: string) => trackCTA(`home-hero-${kind}`, "/", href);

  return (
    <section className="home-hero home-hero--stage">
      {/* 모바일: 미디어가 먼저(상단). 데스크톱: absolute로 전면 배경 */}
      <div className="home-hero__photo">
        <HeroStage />
        <div className="home-hero__fade" aria-hidden />
      </div>

      <motion.div
        className="home-hero__copy"
        variants={reduced ? undefined : stagger}
        initial={false}
        animate="visible"
      >
        <div className="home-hero__copy-main">
          <motion.p variants={item} className="home-hero__eyebrow">
            {homeHero.locationLabel}
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

          <motion.p variants={item} className="home-hero__subtitle home-hero__headline">
            {homeHero.headline}
          </motion.p>

          <span className="home-hero__rule" aria-hidden />

          <motion.p variants={item} className="home-hero__sub home-hero__lead">
            {homeHero.sub}
          </motion.p>

          <motion.div variants={item}>
            <HomeHeroChannels />
          </motion.div>
          <motion.p variants={item} className="home-hero__cta-note">
            {homeHero.ctaNote}
          </motion.p>

          <motion.ul variants={item} className="home-hero__proof" aria-label="확인할 수 있는 근거">
            {homeHero.proofLinks.map((proof) => (
              <li key={proof.label}>
                <Link href={proof.href} className="home-hero__proof-link">
                  {proof.label}
                </Link>
              </li>
            ))}
          </motion.ul>

          <motion.nav variants={item} className="home-hero__quick" aria-label="업무 바로가기">
            <span className="home-hero__quick-label">업무 바로가기</span>
            {homeHero.quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="home-hero__quick-link">
                {link.label}
              </Link>
            ))}
          </motion.nav>

          <motion.p variants={item} className="home-hero__location">
            {homeHero.locationHint}
          </motion.p>

          <motion.p variants={item} className="home-hero__contact-line">
            <a href={getPhoneHref(phone)} onClick={() => track("phone")}>
              전화 {phone}
            </a>
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
