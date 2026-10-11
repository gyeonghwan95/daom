import { ContentSection, RelatedContentGrid } from "@/components/readability";
import { HUB_CHILD_LINKS } from "@/data/seo/hub-child-links";

/**
 * 전용 레이아웃(우선순위·복구·선박·법인 의도 등) 상위 허브에 하위 상세 안내 링크를 붙인다.
 * PageData 경로는 resolvers.ts의 withHubChildLinks가 같은 목록을 섹션으로 넣는다.
 * splitBusan: 부산 지역 안내와 부산 밖 지역 안내가 섞인 허브에서 두 묶음으로 나눠 보여 준다(링크는 그대로).
 */
export function HubChildLinks({ path, splitBusan = false }: { path: string; splitBusan?: boolean }) {
  const links = HUB_CHILD_LINKS[path];
  if (!links?.length) return null;
  const all = links.map((l) => ({ href: l.href, label: l.label }));

  if (splitBusan) {
    const busan = all.filter((l) => l.label.includes("부산"));
    const others = all.filter((l) => !l.label.includes("부산"));
    if (busan.length && others.length) {
      return (
        <ContentSection id="hub-child-links" title="이어서 볼 수 있는 상세 안내">
          <h3 className="text-base font-semibold text-navy">부산 지역 안내</h3>
          <p className="mt-1 text-sm text-navy/70">부산 안의 생활권·역·산업단지별로 정리한 안내입니다.</p>
          <div className="mt-3">
            <RelatedContentGrid links={busan} />
          </div>
          <h3 className="mt-8 text-base font-semibold text-navy">부산 밖 지역의 상속등기 안내</h3>
          <p className="mt-1 text-sm text-navy/70">
            부동산이나 상속인이 다른 지역에 있을 때의 진행 방법입니다. 다옴법무사사무소는 부산 해운대구에 있으며, 그 지역에
            사무소가 있다는 뜻은 아닙니다.
          </p>
          <div className="mt-3">
            <RelatedContentGrid links={others} />
          </div>
        </ContentSection>
      );
    }
  }

  return (
    <ContentSection id="hub-child-links" title="이어서 볼 수 있는 상세 안내">
      <p className="text-sm text-navy/70">
        같은 업무·지역에서 따로 정리한 안내입니다. 지금 상황에 가까운 항목을 골라 보세요.
      </p>
      <div className="mt-4">
        <RelatedContentGrid links={all} />
      </div>
    </ContentSection>
  );
}
