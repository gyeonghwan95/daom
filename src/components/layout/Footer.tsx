import { FooterBusinessInfo } from "@/components/layout/FooterBusinessInfo";
import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { Container } from "@/components/layout/Container";
import { consultationCopy } from "@/lib/consultation";
import { getDirectConsultationChannels, getNaverBlogUrl } from "@/lib/contact";
import { getNapInfo } from "@/lib/business-info";
import { footerCollaborationLinks } from "@/lib/b2b/collaboration-registry";
const FOOTER_QUICK_LINKS = [
  { href: "/about", label: "법무사 소개" },
  { href: "/office", label: "해운대·센텀 사무소" },
  { href: "/services", label: "업무안내" },
  { href: "/업무사례", label: "업무 사례" },
  { href: "/contact", label: "상담 문의" },
  { href: "/location", label: "오시는 길" },
  { href: "/reviews", label: "고객후기" },
  { href: "/자가진단", label: "자가진단" },
  { href: "/법률강의", label: "강의·특강" },
  { href: "/partners", label: "협업문의" },
  { href: "/situations", label: "상황별 안내" },
  { href: "/faq", label: "FAQ" },
] as const;

const FOOTER_COLLAB_LABELS: Record<string, string> = {
  "/partners": "협업문의 안내",
  "/부산법무사복대리": "법무사 복대리",
  "/부산부동산협력법무사": "부동산 협업",
  "/부산집단등기": "집단등기",
  "/공공기관등기업무": "기업·기관 등기",
  "/협업문의": "협업 문의서",
};

export function Footer() {
  const nap = getNapInfo();
  const naverBlog = getNaverBlogUrl();
  const channels = getDirectConsultationChannels();
  const collabLinks = footerCollaborationLinks();

  return (
    <footer className="border-t border-beige-dark bg-navy text-white">
      <Container className="py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <p className="text-lg font-bold">{nap.tradeName}</p>
            <p className="mt-1 text-base text-white/80">{nap.representative}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              안윤정 법무사. 해운대·센텀에서 부산 전역 상속등기·부동산등기·법인등기·개인회생을 상담합니다.
            </p>
            <p className="mt-2 text-sm text-white/60">{nap.address}</p>
            <p className="mt-2 text-sm text-white/60">{nap.phone}</p>
          </div>

          <div>
            <p className="font-semibold text-beige">바로가기</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:text-base">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-beige">협업문의</p>
            <ul className="mt-3 space-y-1 text-sm text-white/70">
              {collabLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white"
                  >
                    {FOOTER_COLLAB_LABELS[link.href] ?? link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/부산시행사등기"
                  className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white"
                >
                  건축·시행사 등기
                </Link>
              </li>
              <li>
                <Link
                  href="/partners#all-services"
                  className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white"
                >
                  전체 협업업무 보기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-3">
          <div>
            <p className="font-semibold text-beige">전국 의뢰 업무</p>
            <ul className="mt-3 space-y-1 text-sm text-white/70">
              {[
                { href: "/전국업무", label: "전국 업무 안내" },
                { href: "/업무사례/지역별", label: "지역별 업무사례" },
                { href: "/전국상속등기", label: "전국 상속등기" },
                { href: "/업무사례/경남법무사업무", label: "경남 업무사례" },
                { href: "/업무사례/울산법무사업무", label: "울산 업무사례" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-semibold text-beige">상담 안내</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {consultationCopy.default}
            </p>
            <div className="mt-4">
              <ConsultationButtons
                channels={channels}
                theme="dark"
                layout="grid"
                showQrCodes={false}
              />
            </div>
            <ul className="mt-4 space-y-1 text-sm text-white/70">
              <li>
                <Link href="/contact" className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white">
                  상담 문의 페이지
                </Link>
              </li>
              <li>
                <Link href="/faq" className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <a
                  href={naverBlog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white"
                >
                  네이버 블로그
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/65">
          이 사무소는 등기·비송 서류와 개인회생·파산 신청 서류를 안내합니다.
          소송 대리와 형사 변론은 변호사 업무이며, 여기서 대신하지 않습니다.
        </p>

        <FooterBusinessInfo />

        <p className="mt-10 border-t border-white/15 pt-6 text-center text-sm text-white/60 md:text-left">
          © {new Date().getFullYear()} {nap.tradeName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
