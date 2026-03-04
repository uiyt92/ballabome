import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BALLABOM | 프리미엄 포포먼스 스킨케어",
  description: "Apply Excellence. 남자의 피부를 연구하는 발라봄.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtOty50//qqwceWyy85eE5s/H008sTFceJ0N88//Z8ppj"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Script id="kakao-init" strategy="lazyOnload">
          {`
            window.onload = function() {
              if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init('${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || ''}');
              }
            };
          `}
        </Script>
      </body>
    </html>
  );
}
