import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteImage } from "@/components/media/SiteImage";
import { siteImages, type SiteImageAsset } from "@/lib/site-images";

type HeroSectionProps = {
  h1: React.ReactNode;
  subtitle?: string;
  description: string;
  image?: SiteImageAsset;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

export function HeroSection({
  h1,
  subtitle,
  description,
  image = siteImages.home.hero,
  primaryCta = { href: "/contact", label: "상담 신청하기" },
  secondaryCta = { href: "/services", label: "업무안내 보기" },
}: HeroSectionProps) {
  return (
    <section className="bg-beige">
      <Container className="py-10 md:py-14 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex-1">
            {subtitle && (
              <p className="mb-2 text-base font-medium text-navy-light md:text-lg">
                {subtitle}
              </p>
            )}
            <h1 className="page-title">{h1}</h1>
            <p className="body-text mt-4 max-w-2xl md:mt-5">{description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
              <Link href={primaryCta.href} className="btn-primary w-full sm:w-auto">
                {primaryCta.label}
              </Link>
              <Link href={secondaryCta.href} className="btn-secondary w-full sm:w-auto">
                {secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className="lg:w-5/12">
            <SiteImage
              {...image}
              className="w-full rounded-2xl shadow-md"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
