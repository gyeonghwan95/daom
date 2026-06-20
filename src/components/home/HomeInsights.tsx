import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteImage } from "@/components/media/SiteImage";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { formatContentDate, getAllContent } from "@/lib/content/loader";
import { getBlogPostImage, getCaseImage } from "@/lib/site-images";
import { homeInsightsIntro } from "@/lib/home-content";

export function HomeInsights() {
  const cases = getAllContent("cases").slice(0, 2);
  const posts = getAllContent("blog").slice(0, 2);
  const items = [
    ...cases.map((c) => ({
      type: "사례" as const,
      title: c.title,
      excerpt: c.description,
      href: c.href,
      meta: c.category,
      image: getCaseImage(c.slug),
    })),
    ...posts.map((p) => ({
      type: "칼럼" as const,
      title: p.title,
      excerpt: p.description,
      href: p.href,
      meta: formatContentDate(p.date),
      image: getBlogPostImage(p.slug),
    })),
  ];

  return (
    <section className="w-full border-t border-beige-dark bg-white py-14 md:py-28">
      <Container>
        <HomeSectionHeader
          label="Insights"
          title={homeInsightsIntro.title}
          description={homeInsightsIntro.description}
          action={
            <>
              <HomeSectionActionLink href="/cases" label="사례 더 보기" />
              <HomeSectionActionLink href="/blog" label="칼럼 더 보기" />
            </>
          }
        />

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.06}>
          {items.map((item) => (
            <StaggerItem key={item.href} as="div">
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-xl border border-beige-dark bg-white transition-all duration-300 hover:border-navy/15 hover:shadow-md hover:shadow-navy/5"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SiteImage
                    {...item.image}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <span className="text-xs font-semibold uppercase tracking-wider text-navy-light">
                    {item.type}
                  </span>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-navy group-hover:text-navy-light md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/60">
                    {item.excerpt}
                  </p>
                  <span className="mt-3 block text-xs text-navy/45">{item.meta}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
