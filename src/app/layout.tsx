import type { Metadata } from "next";
import { preload } from "react-dom";
import { Header } from "@/components/layout/Header";
import { PublicOnly } from "@/components/layout/PublicOnly";
import { AppClientShell } from "@/components/ux/AppClientShell";
import { GlobalJsonLd } from "@/components/seo/GlobalJsonLd";
import { seoBrand } from "@/lib/seo/brand";
import { getMetadataBaseUrl } from "@/lib/site-url";
import "./globals.css";
import "./noto-sans-kr-subset.css";

// 본문 글꼴: Noto Sans KR 가변 글꼴을 이 사이트가 실제로 쓰는 글자로 다시 나눈 자체 호스팅 조각이다(public/fonts).
// Google 한글 글꼴은 120여 조각이라 한 페이지가 17~19개(약 320KB)를 받았지만, 여기서는 core 한 개(약 60KB)에
// 글자 빈도가 낮은 조각(mid·t1·t2)이 화면에 글자가 있을 때만 더해진다. 조각 정의와 재생성 방법은 scripts/fonts/build-font-subsets.py.
// 폭을 맞춘 폴백(KR Fallback Adjusted)은 globals.css에 그대로 있다.
const FONT_PRELOAD = [
  "/fonts/noto-sans-kr-core.20bb9305.woff2",
  "/fonts/noto-sans-kr-mid.13b5df69.woff2",
] as const;

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
  // 첫 화면 글자는 거의 core·mid 조각에 있으므로 두 조각만 미리 받는다(나머지는 필요할 때 unicode-range로).
  for (const href of FONT_PRELOAD) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="ko" className="h-full">
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
