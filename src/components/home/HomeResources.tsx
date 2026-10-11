import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { ResourceCard } from "@/components/resources/ResourceHubView";
import { getResourceGuide } from "@/data/resources/guides";

/** 메인 중간 — 기존 의뢰 전 준비자료 중 대표 3개(상속·법인·부동산). 파일·내용은 /resources 원본 그대로 */
const FEATURED_RESOURCE_SLUGS = ["inheritance-family", "company-change", "property-closing"] as const;

export function HomeResources() {
  const guides = FEATURED_RESOURCE_SLUGS.map((slug) => getResourceGuide(slug)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g),
  );
  return (
    <section className="home-section-compact w-full border-t border-beige-dark bg-cream/40">
      <Container>
        <HomeSectionHeader
          label="Resources"
          title="맡기기 전에 함께 정리해 보세요"
          description="가족이나 회사 담당자와 같이 볼 수 있는 의뢰 전 준비자료입니다. 빈 정리표와 PNG·PDF로 바로 나눌 수 있습니다."
          action={<HomeSectionActionLink href="/resources" label="자료실 전체 보기" />}
        />
        <ul className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3">
          {guides.map((g) => (
            <li key={g.slug}>
              <ResourceCard guide={g} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
