import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { homeFaqIntro } from "@/lib/home-content";
import { faqs } from "@/lib/faq-data";

export function HomeFaqTeaser() {
  const preview = faqs.slice(0, 3);

  return (
    <section className="home-trust w-full py-14 md:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-navy md:text-3xl">
              {homeFaqIntro.title}
            </h2>
            <HomeSectionActionLink href="/faq" label="FAQ 전체 보기" />
          </div>
        </Reveal>

        <Stagger className="mt-8 divide-y divide-beige-dark border-y border-beige-dark" stagger={0.06}>
          {preview.map((faq) => (
            <StaggerItem key={faq.question} as="div">
              <div className="py-5 md:py-6">
                <h3 className="font-semibold text-navy">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/70 md:text-base">
                  {faq.answer}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
