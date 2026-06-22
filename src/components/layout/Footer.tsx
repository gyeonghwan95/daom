import { FooterBusinessInfo } from "@/components/layout/FooterBusinessInfo";
import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { Container } from "@/components/layout/Container";
import { consultationCopy } from "@/lib/consultation";
import { getContactInfo, getDirectConsultationChannels, getNaverBlogUrl, getPhoneHref } from "@/lib/contact";
import { officeLocation } from "@/lib/office-location";
import { mainNavigation } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const { phone } = getContactInfo();
  const naverBlog = getNaverBlogUrl();
  const channels = getDirectConsultationChannels();

  return (
    <footer className="border-t border-beige-dark bg-navy text-white">
      <Container className="py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <p className="text-lg font-bold">{siteConfig.name}</p>
            <p className="mt-1 text-base text-white/80">{siteConfig.representative}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              부산 해운대·센텀 상속등기·부동산등기·법인등기·개인회생 전문
            </p>
            <p className="mt-2 text-sm text-white/60">{officeLocation.fullAddress}</p>
            {phone && (
              <a
                href={getPhoneHref(phone)}
                className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-beige hover:text-white sm:text-base"
              >
                전화 {phone}
              </a>
            )}
          </div>

          <div>
            <p className="font-semibold text-beige">바로가기</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:text-base">
              {mainNavigation.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-white/80 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-beige">상담 안내</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {consultationCopy.default}
            </p>
            <div className="mt-4">
              <ConsultationButtons
                channels={channels}
                theme="dark"
                layout="grid"
              />
            </div>
            <ul className="mt-4 space-y-1 text-sm text-white/70">
              <li>
                <Link href="/contact" className="inline-flex min-h-10 items-center hover:text-white">
                  상담 문의 페이지
                </Link>
              </li>
              <li>
                <Link href="/faq" className="inline-flex min-h-10 items-center hover:text-white">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <a
                  href={naverBlog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center hover:text-white"
                >
                  네이버 블로그
                </a>
              </li>
            </ul>
          </div>
        </div>

        <FooterBusinessInfo />

        <p className="mt-10 border-t border-white/15 pt-6 text-center text-sm text-white/60 md:text-left">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
