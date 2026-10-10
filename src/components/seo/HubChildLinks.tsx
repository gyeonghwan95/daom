import { ContentSection, RelatedContentGrid } from "@/components/readability";
import { HUB_CHILD_LINKS } from "@/data/seo/hub-child-links";

/**
 * 전용 레이아웃(우선순위·복구·선박·법인 의도 등) 상위 허브에 하위 상세 안내 링크를 붙인다.
 * PageData 경로는 resolvers.ts의 withHubChildLinks가 같은 목록을 섹션으로 넣는다.
 */
export function HubChildLinks({ path }: { path: string }) {
  const links = HUB_CHILD_LINKS[path];
  if (!links?.length) return null;
  return (
    <ContentSection id="hub-child-links" title="이어서 볼 수 있는 상세 안내">
      <p className="text-sm text-navy/70">
        같은 업무·지역에서 따로 정리한 안내입니다. 지금 상황에 가까운 항목을 골라 보세요.
      </p>
      <div className="mt-4">
        <RelatedContentGrid links={links.map((l) => ({ href: l.href, label: l.label }))} />
      </div>
    </ContentSection>
  );
}
