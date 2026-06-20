import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { CaseCard } from "@/components/cards/CaseCard";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllContent } from "@/lib/content/loader";
import { createPageMetadata } from "@/lib/metadata";
import { buildArticleListSchema } from "@/lib/seo/json-ld";
import { getCaseImage, siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.cases);

export default function CasesPage() {
  const cases = getAllContent("cases");

  return (
    <PageContainer>
      <JsonLd data={buildArticleListSchema(cases)} />
      <PageContentSection
        h1="업무 사례"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "사례" },
        ]}
        currentPath="/cases"
        coverImage={siteImages.cases.cover}
        intro="다옴법무사사무소 안윤정 법무사가 처리한 사례를 소개합니다. 개인정보 보호를 위해 구체적 의뢰인 정보는 비공개하며, 사건 유형과 처리 과정 위주로 안내합니다."
        relatedLinks={[
          { href: "/services/inheritance-registration", label: "상속등기" },
          { href: "/services/corporate-registration", label: "법인등기" },
          { href: "/blog", label: "법률칼럼" },
          { href: "/contact", label: "상담 신청" },
        ]}
        relatedTitle="관련 업무"
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {cases.map((item) => (
            <li key={item.slug}>
              <CaseCard
                title={item.title}
                summary={item.description}
                category={item.category}
                href={item.href}
                image={getCaseImage(item.slug)}
              />
            </li>
          ))}
        </ul>
      </PageContentSection>
    </PageContainer>
  );
}
