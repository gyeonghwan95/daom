"use client";

import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { YoutubeVideoSection } from "@/components/media/YoutubeVideoSection";
import { homeShowcaseIntro } from "@/lib/home-showcase-types";
import { youtubeVideos } from "@/lib/youtube-videos";

export function HomeYoutube() {
  return (
    <section className="home-youtube relative w-full overflow-hidden py-14 md:py-28">
      <div className="home-youtube__mesh" aria-hidden />
      <Container className="relative">
        <HomeSectionHeader
          label={homeShowcaseIntro.youtube.label}
          title={homeShowcaseIntro.youtube.title}
          description={homeShowcaseIntro.youtube.description}
          dark
          action={
            <HomeSectionActionLink
              href="/media"
              label="더 많은 활동 보기"
              dark
            />
          }
        />

        <div className="mt-12">
          <YoutubeVideoSection videos={youtubeVideos} variant="dark" />
        </div>
      </Container>
    </section>
  );
}
