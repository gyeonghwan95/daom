import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { PageContainer } from "@/components/layout/PageContainer";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";
import { getDirectConsultationChannels } from "@/lib/contact";

export const metadata = createPageMetadata({
  title: buildSeoTitle("페이지를 찾을 수 없습니다", { includeRepresentative: false }),
  description:
    "요청하신 페이지를 찾을 수 없습니다. 다옴법무사사무소 홈페이지 메뉴에서 원하시는 정보를 찾아보시거나 상담을 문의해 주세요.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  const channels = getDirectConsultationChannels();

  return (
    <PageContainer>
      <section className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium text-navy-light">404</p>
        <h1 className="page-title mt-2">페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-base leading-relaxed text-navy/75">
          주소가 변경되었거나 삭제된 페이지일 수 있습니다. 아래 메뉴에서
          원하시는 정보를 찾아보시거나 상담을 문의해 주세요.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary">
            홈으로
          </Link>
          <Link href="/contact" className="btn-secondary">
            상담 문의
          </Link>
        </div>

        <div className="mt-8 text-left">
          <p className="text-sm font-semibold text-navy">빠른 상담</p>
          <div className="mt-3">
            <ConsultationButtons channels={channels} theme="light" layout="grid" />
          </div>
        </div>

        <nav className="mt-8 text-left" aria-label="주요 페이지">
          <p className="text-sm font-semibold text-navy">자주 찾는 페이지</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { href: "/services", label: "업무안내" },
              { href: "/blog", label: "포스팅" },
              { href: "/services#cases", label: "업무 사례" },
              { href: "/faq", label: "자주 묻는 질문" },
              { href: "/location", label: "오시는 길" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-12 w-full items-center rounded-lg border border-beige-dark px-4 text-sm font-medium text-navy hover:bg-beige"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </PageContainer>
  );
}
