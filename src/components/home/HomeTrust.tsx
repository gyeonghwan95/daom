import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { siteImages } from "@/lib/site-images";
import { homeTrust } from "@/lib/home-content";
import { siteConfig } from "@/lib/site";

export function HomeTrust() {
  return (
    <section className="home-trust w-full py-14 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal variant="scaleIn">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
              <Image
                src={siteImages.home.trust.src}
                alt={siteImages.home.trust.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="home-section-label text-navy-light">
                {siteConfig.representative}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy md:text-3xl">
                {homeTrust.title}
              </h2>
              <blockquote className="mt-5 border-l-2 border-navy/20 pl-5 text-base leading-relaxed text-navy/80 md:text-lg">
                {homeTrust.quote}
              </blockquote>
            </Reveal>

            <Stagger className="mt-8 space-y-5" stagger={0.08}>
              {homeTrust.points.map((point) => (
                <StaggerItem key={point.title} as="div">
                  <div className="border-b border-navy/8 pb-5 last:border-0">
                    <h3 className="font-semibold text-navy">{point.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy/65 md:text-base">
                      {point.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.2} className="mt-8">
              <Link href="/about" className="btn-secondary">
                법무사 소개
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
