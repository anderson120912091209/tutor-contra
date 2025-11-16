import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

// 思源黑體 (Noto Sans TC) - 現代、清晰、適合學術用途
// 由 Google 和 Adobe 合作開發，專為繁體中文優化
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

// 思源宋體 (Noto Serif TC) - 優雅、正式、適合長篇閱讀
// 可選用於標題或特殊內容
const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Pinpin 拼拼家教平台 - 教育者的活履歷",
  description: "讓教育者被看見，讓家長更安心",
  icons: {
    icon: [
      { url: "/pinpinlogo.png", sizes: "any" },
    ],
    apple: [
      { url: "/pinpinlogo.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        {/* Preload the loading animation for instant display */}
        <link rel="preload" href="/morphing-animation.webm" as="video" type="video/webm" />
      </head>
      <body className={`${notoSansTC.variable} ${notoSerifTC.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}


