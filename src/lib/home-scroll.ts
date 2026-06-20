import type { Swiper as SwiperInstance } from "swiper";

export const HOME_SECTION_IDS = [
  "home-hero",
  "home-services",
  "home-trust",
  "home-activities",
  "home-press",
  "home-youtube",
  "home-insights",
  "home-faq",
  "home-contact",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

let homeSwiper: SwiperInstance | null = null;

export function setHomeSwiper(swiper: SwiperInstance | null): void {
  homeSwiper = swiper;
}

export function getHomeSwiper(): SwiperInstance | null {
  return homeSwiper;
}

export function scrollToHomeSection(
  id: HomeSectionId | string,
  speed = 750,
): void {
  const index = HOME_SECTION_IDS.indexOf(id as HomeSectionId);

  if (homeSwiper && index >= 0) {
    homeSwiper.slideTo(index, speed);
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToNextHomeSection(speed = 750): void {
  if (homeSwiper) {
    homeSwiper.slideNext(speed);
    return;
  }

  scrollToHomeSection("home-services", speed);
}
