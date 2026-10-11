import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { homeFaqIntro, homeFaqs } from "@/lib/home-content";

/**
 * 홈 FAQ — motion 없이 정적 HTML + details로 크롤·접근성 정렬.
 * FAQPage JSON-LD와 동일 Q&A를 유지합니다.
 */
export function HomeFaqTeaser() {
  const preview = homeFaqs;

  return (
    <section className="home-trust w-full py-14 md:py-28">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-3xl">
            {homeFaqIntro.title}
          </h2>
          <HomeSectionActionLink href="/faq" label="FAQ 전체 보기" />
        </div>

        <div className="mt-8 divide-y divide-beige-dark border-y border-beige-dark">
          {preview.map((faq) => (
            <details key={faq.question} className="home-faq-teaser__item group py-5 md:py-6">
              <summary className="cursor-pointer list-none font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span>{faq.question}</span>
                  <span
                    className="mt-0.5 shrink-0 text-navy/40 transition-transform group-open:rotate-180"
                    aria-hidden
                  >
                    ▾
                  </span>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-navy/70 md:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
