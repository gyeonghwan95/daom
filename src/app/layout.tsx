import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomCTA } from "@/components/layout/MobileBottomCTA";
import { FloatingCTA } from "@/components/consultation/FloatingCTA";
import { QuickInquiryRoot } from "@/components/quick-inquiry";
import { GlobalJsonLd } from "@/components/seo/GlobalJsonLd";
import { seoBrand } from "@/lib/seo/brand";
import { getMetadataBaseUrl } from "@/lib/site-url";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getMetadataBaseUrl()),
  authors: [{ name: seoBrand.representative, url: "/about" }],
  creator: seoBrand.representative,
  publisher: seoBrand.siteName,
  category: "법률 서비스",
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION?.trim() ||
      "googlee2ec15533e61c1d2",
    other: {
      "naver-site-verification":
        process.env.NAVER_SITE_VERIFICATION?.trim() ||
        "124ba44be3fa9cde20730093315f661f9520e911",
    },
  },
  // icons: app/icon.png · apple-icon.png · public/favicon.ico (ASCII 경로)
  // metadata.icons에 한글 파일명(/image/로고.png)을 넣으면 Link 헤더 ByteString 오류 발생
  alternates: {
    types: {
      // Link 헤더는 ASCII만 허용 — 한글 title은 ByteString 오류를 유발함
      "application/rss+xml": [
        {
          url: "/rss.xml",
          title: "DAOM RSS",
        },
      ],
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className="has-mobile-cta min-h-full flex flex-col font-sans antialiased">
        <QuickInquiryRoot>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
          >
            본문 바로가기
          </a>
          <GlobalJsonLd />
          <Header />
          {children}
          <Footer />
          <MobileBottomCTA />
          <FloatingCTA />
        </QuickInquiryRoot>
      </body>
    </html>
  );
}
