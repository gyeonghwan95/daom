import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { HOME_HUB_SECTIONS } from "@/lib/hub/home-sections";

export function HomeHubGuide() {
  return (
    <section className="relative w-full border-t border-beige-dark bg-cream/40 py-14 md:py-24">
      <Container>
        <HomeSectionHeader
          label="Busan Legal Hub"
          title="부산 법무사 검색·상담 허브"
          description="지역·업무·비용·법원·등기소별로 필요한 안내 페이지로 바로 이동할 수 있습니다."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {HOME_HUB_SECTIONS.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-[calc(var(--header-height)+1rem)] rounded-2xl border border-beige-dark bg-white p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-navy md:text-xl">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/70 md:text-base">
                {section.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="interactive-surface inline-flex min-h-10 items-center rounded-full border border-beige-dark bg-cream/40 px-4 py-2 text-sm font-medium text-navy hover:bg-beige/50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
