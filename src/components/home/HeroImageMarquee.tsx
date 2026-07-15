"use client";

import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SiteImageAsset } from "@/lib/site-images";

type HeroImageMarqueeProps = {
  slides: readonly SiteImageAsset[];
  /** 한 바퀴 도는 데 걸리는 초 (클수록 느림) */
  speed?: number;
  direction?: "up" | "down";
  className?: string;
  pauseOnHover?: boolean;
};

function HeroSlide({ image, priority = false }: { image: SiteImageAsset; priority?: boolean }) {
  return (
    <div className="home-hero__slide relative w-full shrink-0 overflow-hidden rounded-2xl">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 42vw"
        priority={priority}
      />
      <div className="home-hero__frame-border" aria-hidden />
    </div>
  );
}

export function HeroImageMarquee({
  slides,
  speed = 22,
  direction = "up",
  className = "",
  pauseOnHover = true,
}: HeroImageMarqueeProps) {
  const reduced = useReducedMotion();

  if (slides.length === 0) {
    return null;
  }

  if (slides.length === 1 || reduced) {
    return (
      <div
        className={`home-hero__frame home-hero__frame--static relative h-full min-h-0 overflow-hidden rounded-2xl ${className}`}
      >
        <Image
          src={slides[0].src}
          alt={slides[0].alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 42vw"
          priority
        />
        <div className="home-hero__frame-border" aria-hidden />
      </div>
    );
  }

  return (
    <div
      className={`marquee-v-root home-hero__frame h-full min-h-0 ${pauseOnHover ? "marquee-v-root--pause" : ""} ${className}`}
      aria-label="사무소 사진"
    >
      <div
        className="marquee-v-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "down" ? "reverse" : "normal",
        }}
      >
        <div className="marquee-v-set">
          {slides.map((image, index) => (
            <HeroSlide key={image.src} image={image} priority={index === 0} />
          ))}
        </div>
        <div className="marquee-v-set" aria-hidden>
          {slides.map((image) => (
            <HeroSlide key={`dup-${image.src}`} image={image} />
          ))}
        </div>
      </div>
    </div>
  );
}
