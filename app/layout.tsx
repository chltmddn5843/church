import type { Metadata, Viewport } from "next"
import { Nanum_Gothic } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

// 나눔고딕 is the only downloaded font; anything it lacks falls back to the phone's own Korean font (globals.css).
const nanumGothic = Nanum_Gothic({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nanum-gothic",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wdchurch.com"),
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
  themeColor: "#2769A5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`bg-background ${nanumGothic.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
