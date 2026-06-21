import { PageSectionNavLayout } from "@/components/layout/PageSectionNavLayout";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="flex-1 overflow-x-hidden py-6 md:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 xl:max-w-[1440px] xl:px-8">
        <PageSectionNavLayout>{children}</PageSectionNavLayout>
      </div>
    </main>
  );
}
