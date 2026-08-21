import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
})

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "원당교회",
    template: "%s | 원당교회",
  },
  description:
    "인천 검단구 원당교회 공식 홈페이지입니다. 예배 안내, 설교 말씀, 제자훈련, 다음세대, 교회 소식을 만나보세요.",
  keywords: ["원당교회", "인천교회", "검단교회", "예배", "설교", "제자훈련", "다음세대"],
  openGraph: {
    title: "원당교회",
    description: "인천 검단구 원당교회 공식 홈페이지",
    type: "website",
    locale: "ko_KR",
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#2f5d4f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`bg-background ${notoSansKr.variable} ${notoSerifKr.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
