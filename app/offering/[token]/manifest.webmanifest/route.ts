import { NextResponse } from "next/server"
import { getActiveOfferingReportByToken } from "@/lib/queries"

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!await getActiveOfferingReportByToken(token)) return new NextResponse("Not found", { status: 404 })

  return NextResponse.json({
    name: "원당교회 헌금 현황",
    short_name: "헌금 현황",
    description: "원당교회 주간 헌금 현황",
    start_url: `/offering/${token}`,
    scope: `/offering/${token}`,
    display: "standalone",
    background_color: "#f6fbff",
    theme_color: "#123A63",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  }, { headers: { "Cache-Control": "private, no-store", "Content-Type": "application/manifest+json" } })
}
