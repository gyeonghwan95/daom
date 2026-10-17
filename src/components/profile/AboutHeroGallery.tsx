"use client";

import Image from "next/image";
import { InfiniteMarquee } from "@/components/motion/InfiniteMarquee";
import type { AboutHeroSlide } from "@/lib/about-appeal";

function HeroRail({
  slides,
  direction,
  speed,
  label,
  priority,
}: {
  slides: AboutHeroSlide[];
  direction: "left" | "right";
  speed: number;
  label: string;
  priority?: boolean;
}) {
  if (slides.length === 0) return null;

  return (
    <InfiniteMarquee
      speed={speed}
      direction={direction}
      className="about-hero__rail"
    >
      {slides.map((slide, index) => (
        <figure key={`${label}-${slide.src}-${slide.caption}`} className="about-hero__tile">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={Boolean(priority && index < 2)}
            sizes="280px"
            className="object-cover"
            style={
              slide.objectPosition
                ? { objectPosition: slide.objectPosition }
                : undefined
            }
          />
          <figcaption className="about-hero__caption">{slide.caption}</figcaption>
        </figure>
      ))}
    </InfiniteMarquee>
  );
}

export function AboutHeroGallery({
  representative,
  appeal,
}: {
  representative: AboutHeroSlide[];
  appeal: AboutHeroSlide[];
}) {
  if (representative.length === 0 && appeal.length === 0) return null;

  return (
    <div className="about-hero__gallery" aria-label="안윤정 법무사 소개 사진">
      <HeroRail
        slides={representative}
        direction="left"
        speed={120}
        label="대표"
        priority
      />
      <HeroRail slides={appeal} direction="right" speed={140} label="활동" />
    </div>
  );
}
