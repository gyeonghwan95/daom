import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { PublicOnly } from "@/components/layout/PublicOnly";
import { AppClientShell } from "@/components/ux/AppClientShell";
import { GlobalJsonLd } from "@/components/seo/GlobalJsonLd";
import { seoBrand } from "@/lib/seo/brand";
import { getMetadataBaseUrl } from "@/lib/site-url";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
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
        <AppClientShell>
          <PublicOnly>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
            >
              본문 바로가기
            </a>
            <GlobalJsonLd />
            <Header />
          </PublicOnly>
          {/*
            Footer는 layout 형제가 아니라 page 트리(PageContainer / home)의
            Main 뒤에 둔다. layout에서 children Suspense hole 뒤에 Footer가
            있으면 정적 HTML에 Footer NAP이 Main/H1보다 먼저 출력된다.
          */}
          {children}
        </AppClientShell>
      </body>
    </html>
  );
}
