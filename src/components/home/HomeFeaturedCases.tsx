import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteImage } from "@/components/media/SiteImage";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { getContentMeta } from "@/lib/content/loader";
import { getCaseImage } from "@/lib/site-images";

/** 메인 대표 사례 — 공개된 실제 처리 사례(slug가 -case) 중 업무별 1건. 사건 사실은 사례 본문에서만 가져온다. */
const FEATURED_CASE_SLUGS = [
  "haeundae-inheritance-registration-case",
  "centum-ownership-transfer-case",
  "yeonje-director-change-case",
] as const;

export function HomeFeaturedCases() {
  const cases = FEATURED_CASE_SLUGS.map((slug) => getContentMeta("cases", slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  if (cases.length < 2) return null;

  return (
    <section className="home-section-compact w-full border-t border-beige-dark bg-white">
      <Container>
        <HomeSectionHeader
          label="Cases"
          title="비슷한 일을 이렇게 진행했습니다"
          description="사무소에서 실제로 처리한 사건을 개인정보를 빼고 정리했습니다. 어떤 조건을 확인했고 무엇을 맡았는지 볼 수 있습니다."
          action={<HomeSectionActionLink href="/업무사례#case-list" label="사례 전체 보기" />}
        />
        <ul className="mt-6 grid gap-4 md:mt-8 md:grid-cols-3">
          {cases.map((c) => (
            <li key={c.slug}>
              <Link
                href={c.href}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-beige-dark bg-white no-underline transition-all duration-300 hover:border-navy/15 hover:shadow-md hover:shadow-navy/5"
                data-home-case={c.slug}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <SiteImage
                    {...getCaseImage(c.slug)}
                    fill
                    variant="thumbnail"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <span className="text-xs font-semibold text-navy-light">실제 처리 사례 · {c.category}</span>
                  <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy group-hover:text-navy-light">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/65">{c.description}</p>
                  <span className="mt-3 text-sm font-semibold text-navy-light">사례 자세히 보기 →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
