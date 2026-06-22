"use client";

import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { ShowcaseImageCard } from "@/components/home/ShowcaseImageCard";
import { InfiniteMarquee } from "@/components/motion/InfiniteMarquee";
import { Reveal } from "@/components/motion/Reveal";
import { homeActivityItems, homeShowcaseIntro } from "@/lib/home-showcase";

export function HomeActivitiesMarquee() {
  return (
    <section className="home-showcase relative w-full overflow-hidden py-14 md:py-28">
      <div className="home-showcase__glow home-showcase__glow--left" aria-hidden />
      <Container className="relative">
        <HomeSectionHeader
          label={homeShowcaseIntro.activities.label}
          title={homeShowcaseIntro.activities.title}
          description={homeShowcaseIntro.activities.description}
          action={
            <HomeSectionActionLink href="/media" label="대외활동 더보기" />
          }
        />

        <Reveal delay={0.1} className="mt-12">
          <InfiniteMarquee speed={55} direction="left">
            {homeActivityItems.map((item) => (
              <ShowcaseImageCard
                key={item.id}
                variant="activity"
                image={item.image}
                category={item.category}
                title={item.title}
                subtitle={item.subtitle}
                meta={item.period}
              />
            ))}
          </InfiniteMarquee>
        </Reveal>
      </Container>
    </section>
  );
}
