"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { siteImages, type SiteImageAsset } from "@/lib/site-images";

const INTERVAL_MS = 6500;

function StageSlides({
  slides,
  className,
  objectClass,
}: {
  slides: readonly SiteImageAsset[];
  className: string;
  objectClass: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || slides.length < 2) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [reduced, slides.length]);

  return (
    <div className={className}>
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          priority={i === 0}
          quality={80}
          sizes="100vw"
          className={`home-hero__stage-img object-cover ${objectClass} ${
            i === index ? "is-active" : ""
          }`}
        />
      ))}
    </div>
  );
}

export function HeroStage() {
  return (
    <div className="home-hero__stage" aria-hidden>
      <StageSlides
        slides={siteImages.home.heroStageSlides}
        className="home-hero__stage-media"
        objectClass="object-center"
      />
      <div className="home-hero__stage-shade" />
    </div>
  );
}
