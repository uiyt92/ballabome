import type { Metadata } from "next";
import KakaoInit from "@/components/KakaoInit";
import "./globals.css";

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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
        <KakaoInit />
      </body>
    </html>
  );
}
