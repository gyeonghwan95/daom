import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteImage } from "@/components/media/SiteImage";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { formatContentDate, getAllContent } from "@/lib/content/loader";
import { getNaverBlogUrl } from "@/lib/contact";
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
    <section className="home-section-compact w-full border-t border-beige-dark bg-white">
      <Container>
        <HomeSectionHeader
          label="Insights"
          title={homeInsightsIntro.title}
          description={homeInsightsIntro.description}
          action={
            <>
              <HomeSectionActionLink href="/services#cases" label="사례 더 보기" />
              <HomeSectionActionLink href="/blog" label="포스팅 더 보기" />
              <HomeSectionActionLink
                href={getNaverBlogUrl()}
                label="네이버 블로그"
              />
            </>
          }
        />

        <Stagger className="listing-card-grid mt-6 md:mt-8" stagger={0.06}>
          {items.map((item) => (
            <StaggerItem key={item.href} as="div">
              <Link
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-beige-dark bg-white transition-all duration-300 hover:border-navy/15 hover:shadow-md hover:shadow-navy/5"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <SiteImage
                    {...item.image}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-navy-light sm:text-xs">
                    {item.type}
                  </span>
                  <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-navy-light md:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-navy/60 sm:text-sm">
                    {item.excerpt}
                  </p>
                  <span className="mt-2 text-[0.6875rem] text-navy/45 sm:text-xs">
                    {item.meta}
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
