import type { Metadata } from "next";
import { HomeActivitiesMarquee } from "@/components/home/HomeActivitiesMarquee";
import { HomeContactClosing } from "@/components/home/HomeContactClosing";
import { HomePlaceGuide } from "@/components/home/HomePlaceGuide";
import { HomeFaqTeaser } from "@/components/home/HomeFaqTeaser";
import { HomeFullpageSwiper } from "@/components/home/HomeFullpageSwiper";
import { HomeHero } from "@/components/home/HomeHero";
import { HomePopularSearches } from "@/components/home/HomePopularSearches";
import { HomeInsights } from "@/components/home/HomeInsights";
import { HomePressMarquee } from "@/components/home/HomePressMarquee";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeB2BSection } from "@/components/home/HomeB2BSection";
import { HomeLawyerEeat } from "@/components/home/HomeLawyerEeat";
import { HomeTrust } from "@/components/home/HomeTrust";
import { HomeYoutube } from "@/components/home/HomeYoutube";
import { SiteChromeAfterMain } from "@/components/layout/SiteChromeAfterMain";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageSchema, buildWebPageSchema } from "@/lib/seo/json-ld";
import { homeFaqs, homeReviewedOn } from "@/lib/home-content";
import {
  HOME_H1,
  HOME_METADATA_DESCRIPTION,
  HOME_METADATA_TITLE,
  homeMetadata,
} from "@/lib/seo/metadata";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <main id="main-content" className="home-page flex min-h-0 flex-1 flex-col overflow-x-hidden">
        <JsonLd
          data={[
            buildWebPageSchema({
              title: HOME_METADATA_TITLE,
              description: HOME_METADATA_DESCRIPTION,
              path: "/",
              h1: HOME_H1,
              image: siteImages.home.hero.src,
              dateModified: homeReviewedOn,
            }),
            buildFaqPageSchema([...homeFaqs], "/"),
          ]}
        />
        <HomeFullpageSwiper>
          <HomeHero />
          <HomeTrust />
          <HomePressMarquee />
          <HomeActivitiesMarquee />
          <HomeLawyerEeat />
          <HomeServices />
          <HomePopularSearches />
          <HomeYoutube />
          <HomeInsights />
          <HomeFaqTeaser />
          <HomePlaceGuide />
          <HomeContactClosing />
          <HomeB2BSection />
        </HomeFullpageSwiper>
      </main>
      <SiteChromeAfterMain />
    </>
  );
}
