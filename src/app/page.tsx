import type { Metadata } from "next";
import { HomeActivitiesMarquee } from "@/components/home/HomeActivitiesMarquee";
import { HomeContactClosing } from "@/components/home/HomeContactClosing";
import { HomeFaqTeaser } from "@/components/home/HomeFaqTeaser";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeInsights } from "@/components/home/HomeInsights";
import { HomePressMarquee } from "@/components/home/HomePressMarquee";
import { HomeSectionAnchor } from "@/components/home/HomeSectionAnchor";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeTrust } from "@/components/home/HomeTrust";
import { HomeYoutube } from "@/components/home/HomeYoutube";
import { HomeScrollSnapController } from "@/components/home/HomeScrollSnapController";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { homeMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = homeMetadata;

export default function Home() {
  return (
    <main id="main-content" className="home-scroll-snap flex-1 overflow-x-hidden">
      <HomeScrollSnapController />
      <ScrollProgress />

      <HomeSectionAnchor id="home-hero">
        <HomeHero />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-services">
        <HomeServices />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-trust">
        <HomeTrust />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-activities">
        <HomeActivitiesMarquee />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-press">
        <HomePressMarquee />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-youtube">
        <HomeYoutube />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-insights">
        <HomeInsights />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-faq">
        <HomeFaqTeaser />
      </HomeSectionAnchor>

      <HomeSectionAnchor id="home-contact">
        <HomeContactClosing />
      </HomeSectionAnchor>
    </main>
  );
}
