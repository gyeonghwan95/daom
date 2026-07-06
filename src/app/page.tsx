import type { Metadata } from "next";
import { HomeActivitiesMarquee } from "@/components/home/HomeActivitiesMarquee";
import { HomeContactClosing } from "@/components/home/HomeContactClosing";
import { HomePlaceGuide } from "@/components/home/HomePlaceGuide";
import { HomeFaqTeaser } from "@/components/home/HomeFaqTeaser";
import { HomeFullpageSwiper } from "@/components/home/HomeFullpageSwiper";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeHubGuide } from "@/components/home/HomeHubGuide";
import { HomePopularSearches } from "@/components/home/HomePopularSearches";
import { HomeInsights } from "@/components/home/HomeInsights";
import { HomePressMarquee } from "@/components/home/HomePressMarquee";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeLawyerEeat } from "@/components/home/HomeLawyerEeat";
import { HomeTrust } from "@/components/home/HomeTrust";
import { HomeYoutube } from "@/components/home/HomeYoutube";
import { homeMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = homeMetadata;

export default function Home() {
  return (
    <main id="main-content" className="home-page flex min-h-0 flex-1 flex-col overflow-x-hidden">
      <HomeFullpageSwiper>
        <HomeHero />
        <HomeServices />
        <HomePopularSearches />
        <HomeHubGuide />
        <HomeTrust />
        <HomeLawyerEeat />
        <HomeActivitiesMarquee />
        <HomePressMarquee />
        <HomeYoutube />
        <HomeInsights />
        <HomeFaqTeaser />
        <HomePlaceGuide />
        <HomeContactClosing />
      </HomeFullpageSwiper>
    </main>
  );
}
