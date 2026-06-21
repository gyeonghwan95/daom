"use client";

import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { ShowcaseImageCard } from "@/components/home/ShowcaseImageCard";
import { InfiniteMarquee } from "@/components/motion/InfiniteMarquee";
import { Reveal } from "@/components/motion/Reveal";
import { homePressItems, homeShowcaseIntro } from "@/lib/home-showcase";

export function HomePressMarquee() {
  return (
    <section className="relative w-full overflow-hidden border-y border-beige-dark bg-white py-14 md:py-28">
      <Container>
        <HomeSectionHeader
          label={homeShowcaseIntro.press.label}
          title={homeShowcaseIntro.press.title}
          description={homeShowcaseIntro.press.description}
          action={
            <HomeSectionActionLink href="/media#press" label="언론·활동 더 보기" />
          }
        />

        <Reveal delay={0.1} className="mt-12">
          <InfiniteMarquee speed={60} direction="right">
            {homePressItems.map((item) => (
              <ShowcaseImageCard
                key={item.id}
                variant="press"
                image={item.image}
                category={item.source}
                title={item.title}
                subtitle={item.source}
                meta={item.date}
                href={item.url}
              />
            ))}
          </InfiniteMarquee>
        </Reveal>
      </Container>
    </section>
  );
}
