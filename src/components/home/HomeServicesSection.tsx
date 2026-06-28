"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { HomeLandingHubLinks } from "@/components/home/HomeLandingHubLinks";
import { HomeServiceAllLinks } from "@/components/home/HomeServiceAllLinks";
import { HomeReviewsMarquee } from "@/components/home/HomeReviewsMarquee";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { homeFeaturedServiceSlugs, homeServicesIntro } from "@/lib/home-content";
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";
import { allServiceDetails } from "@/lib/services-data";

const services = homeFeaturedServiceSlugs
  .map((slug) => allServiceDetails.find((s) => s.slug === slug))
  .filter((s): s is (typeof allServiceDetails)[number] => Boolean(s));

type HomeServicesSectionProps = {
  reviews: NaverPlaceReview[];
};

export function HomeServicesSection({ reviews }: HomeServicesSectionProps) {
  return (
    <section className="relative w-full border-t border-beige-dark bg-white py-14 md:py-28">
      <Container>
        <HomeSectionHeader
          label="Services"
          title={homeServicesIntro.title}
          description={homeServicesIntro.description}
          action={
            <HomeSectionActionLink href="/services" label="전체 업무 보기" />
          }
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
              {services.map((service) => (
                <StaggerItem key={service.slug} as="div">
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="home-service-card group flex h-full flex-col rounded-2xl border border-beige-dark bg-cream/50 p-6 backdrop-blur-sm transition-shadow duration-500 hover:border-navy/10 hover:shadow-xl hover:shadow-navy/5 md:p-8"
                    >
                      <h3 className="text-lg font-semibold text-navy">
                        {service.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65 md:text-base">
                        {service.description.split("—")[0]?.trim() ??
                          service.description}
                      </p>
                      <span className="mt-5 inline-flex items-center text-sm font-medium text-navy-light transition-transform duration-300 group-hover:translate-x-1.5">
                        자세히 보기 →
                      </span>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
            <HomeServiceAllLinks />
            <HomeLandingHubLinks />
          </div>

          <div className="min-h-[22rem] lg:min-h-0">
            <HomeReviewsMarquee reviews={reviews} />
          </div>
        </div>
      </Container>
    </section>
  );
}
