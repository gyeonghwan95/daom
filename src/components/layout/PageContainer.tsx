import { PageSectionNavLayout } from "@/components/layout/PageSectionNavLayout";
import { SiteChromeAfterMain } from "@/components/layout/SiteChromeAfterMain";
import { MainContactPhone } from "@/components/layout/MainContactPhone";

export function PageContainer({
  children,
  articleFirst = false,
}: {
  children: React.ReactNode;
  articleFirst?: boolean;
}) {
  return (
    <>
      <main id="main-content" className="flex-1 overflow-x-hidden py-7 md:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 xl:max-w-[1440px] xl:px-8">
          {/* 말미 비용 문의·상담 전화는 본문 열 안에 둔다(좌측 패널 열과 겹치지 않게) */}
          <PageSectionNavLayout articleFirst={articleFirst}>
            {children}
            <MainContactPhone />
          </PageSectionNavLayout>
        </div>
      </main>
      <SiteChromeAfterMain />
    </>
  );
}
