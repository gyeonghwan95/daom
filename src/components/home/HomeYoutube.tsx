"use client";

import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { YoutubeVideoSection } from "@/components/media/YoutubeVideoSection";
import { homeShowcaseIntro } from "@/lib/home-showcase-types";
import { youtubeVideos } from "@/lib/youtube-videos";

export function HomeYoutube() {
  return (
    <section className="home-youtube home-section-compact relative w-full overflow-hidden">
      <div className="home-youtube__mesh" aria-hidden />
      <Container className="relative">
        <HomeSectionHeader
          label={homeShowcaseIntro.youtube.label}
          title={homeShowcaseIntro.youtube.title}
          description="강의·인터뷰·법률 정보 영상입니다."
          dark
          action={
            <HomeSectionActionLink
              href="/media"
              label="더 많은 활동 보기"
              dark
            />
          }
        />

        <div className="mt-6 md:mt-8">
          <YoutubeVideoSection
            videos={youtubeVideos}
            variant="dark"
            density="compact"
          />
        </div>
      </Container>
    </section>
  );
}
