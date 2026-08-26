"use client";

import { Children, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HomeContinueScrollHint } from "@/components/home/HomeContinueScrollHint";
import { HomeSwiperProgress } from "@/components/home/HomeSwiperProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { bindHomeSlideNestedScroll } from "@/lib/home-slide-scroll";
import { HOME_SECTION_IDS, setHomeSwiper, scrollToHomeSection } from "@/lib/home-scroll";

import "swiper/css";

type HomeFullpageSwiperProps = {
  children: ReactNode;
};

function useHomeHeroBodyClass(reduced: boolean, activeIndex: number) {
  useEffect(() => {
    if (reduced) {
      const hero = document.getElementById("home-hero");
      if (!hero) return undefined;

      const observer = new IntersectionObserver(
        ([entry]) => {
          document.body.classList.toggle(
            "home-on-hero",
            Boolean(entry?.isIntersecting && (entry.intersectionRatio ?? 0) >= 0.4),
          );
        },
        { threshold: [0.4, 0.6] },
      );
      observer.observe(hero);
      return () => {
        observer.disconnect();
        document.body.classList.remove("home-on-hero");
      };
    }

    document.body.classList.toggle("home-on-hero", activeIndex === 0);
    return () => document.body.classList.remove("home-on-hero");
  }, [reduced, activeIndex]);
}

export function HomeFullpageSwiper({ children }: HomeFullpageSwiperProps) {
  const reduced = useReducedMotion();
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const unbindSlideScrollRef = useRef<(() => void) | null>(null);
  const slides = useMemo(() => Children.toArray(children), [children]);

  useHomeHeroBodyClass(reduced, activeIndex);

  useEffect(() => {
    if (!swiper) return;

    unbindSlideScrollRef.current?.();
    unbindSlideScrollRef.current = bindHomeSlideNestedScroll(swiper);

    return () => {
      unbindSlideScrollRef.current?.();
      unbindSlideScrollRef.current = null;
    };
  }, [swiper]);

  if (slides.length !== HOME_SECTION_IDS.length) {
    console.warn(
      `HomeFullpageSwiper: expected ${HOME_SECTION_IDS.length} sections, got ${slides.length}`,
    );
  }

  if (reduced) {
    return (
      <>
        {slides.map((slide, index) => {
          const id = HOME_SECTION_IDS[index] ?? `home-section-${index}`;
          return (
            <div key={id} id={id} className="home-section-anchor home-static-section">
              {slide}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      <HomeSwiperProgress swiper={swiper} sectionCount={slides.length} />
      <Swiper
        className="home-fullpage-swiper"
        direction="vertical"
        slidesPerView={1}
        speed={750}
        resistanceRatio={0.85}
        longSwipesRatio={0.2}
        threshold={12}
        touchReleaseOnEdges
        modules={[Mousewheel, Keyboard]}
        mousewheel={{
          enabled: true,
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
          thresholdDelta: 20,
          thresholdTime: 400,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        onSwiper={(instance) => {
          setHomeSwiper(instance);
          setSwiper(instance);
          setActiveIndex(instance.activeIndex ?? 0);
        }}
        onDestroy={() => {
          unbindSlideScrollRef.current?.();
          unbindSlideScrollRef.current = null;
          setHomeSwiper(null);
          setSwiper(null);
          setActiveIndex(0);
        }}
        onSlideChange={(instance) => {
          setActiveIndex(instance.activeIndex ?? 0);
        }}
      >
        {slides.map((slide, index) => {
          const id = HOME_SECTION_IDS[index] ?? `home-section-${index}`;
          return (
            <SwiperSlide
              key={id}
              id={id}
              className="home-fullpage-slide"
              aria-label={id}
            >
              <div className="home-fullpage-slide__inner">{slide}</div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        className={`home-slide-nav${activeIndex === 0 ? " home-slide-nav--hero" : ""}${
          activeIndex >= slides.length - 1 ? " home-slide-nav--last" : ""
        }`}
      >
        {activeIndex < slides.length - 1 ? <HomeContinueScrollHint /> : null}
        {activeIndex > 0 ? (
          <button
            type="button"
            className="home-back-to-top"
            onClick={() => scrollToHomeSection("home-hero", 750)}
            aria-label="맨 위 섹션으로 이동"
          >
            <span className="home-back-to-top__icon" aria-hidden>
              ↑
            </span>
          </button>
        ) : null}
      </div>
    </>
  );
}
