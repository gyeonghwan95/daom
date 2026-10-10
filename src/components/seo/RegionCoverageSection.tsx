import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { REGION_COVERAGE } from "@/data/seo/region-coverage";

/**
 * 시·도 상속 페이지 하단: 그 시·도의 시·군·구 전체를 안내한다.
 * 전용 페이지가 있으면 링크, 없으면 이름만 둔다(지역명만 바꾼 페이지를 새로 만들지 않기 위해).
 * 법령: 부동산등기법 제7조의3, 가사소송법 제44조 제1항 제6호.
 */
export function RegionCoverageSection({ path }: { path: string }) {
  const coverage = REGION_COVERAGE[path];
  if (!coverage) return null;
  const { sido, kind, areas } = coverage;
  return (
    <section id="region-coverage" className="readability-section section-anchor">
      <h2 className="section-heading">
        {sido} {kind} 어디든, 부산 방문 없이 진행합니다
      </h2>
      <div className="readability-section__body mt-5 space-y-4 md:mt-6">
        <p>
          {sido}의 아래 {areas.length}개 지역에 부동산이 있거나 고인이 살았어도 같은 방식으로 진행합니다.
          상속등기는 부동산 소재지 관할 등기소가 원칙이지만, 2025년 1월 31일부터 상속·유증 등기는 관할이
          아닌 등기소에서도 처리할 수 있습니다(부동산등기법 제7조의3). 상속포기·한정승인은 고인의 마지막
          주소지를 관할하는 가정법원에 신고합니다(가사소송법 제44조 제1항 제6호).
        </p>
        <ul className="flex flex-wrap gap-2" aria-label={`${sido} 안내 지역`}>
          {areas.map((area) => (
            <li key={area.name}>
              {area.href ? (
                <Link
                  href={area.href}
                  className="inline-block rounded-full border border-beige-dark px-3 py-1 text-sm text-navy hover:bg-beige"
                >
                  {area.name}
                </Link>
              ) : (
                <span className="inline-block rounded-full bg-beige px-3 py-1 text-sm text-navy/70">{area.name}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="text-sm text-navy/70">
          전용 안내가 없는 지역도 고인의 마지막 주소와 부동산 소재지만 알려 주시면 신고처와 접수 등기소를 확인해
          서류를 사진·우편으로 먼저 준비합니다.
        </p>
      </div>
    </section>
  );
}

/** 전용 레이아웃(자체 컨테이너) 뒤에 붙일 때 — 커버리지 데이터가 있는 경로에서만 컨테이너를 렌더한다. */
export function RegionCoverageContained({ path }: { path: string }) {
  if (!REGION_COVERAGE[path]) return null;
  return (
    <PageContainer>
      <RegionCoverageSection path={path} />
    </PageContainer>
  );
}
