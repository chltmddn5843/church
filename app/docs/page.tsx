import type { Metadata } from "next"
import { requireAdmin } from "@/lib/admin"
import { SwaggerDocs } from "./swagger"

export const metadata: Metadata = {
  title: "API 문서",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function ApiDocsPage() {
  await requireAdmin()

  return (
    <main className="min-h-screen bg-white">
      <SwaggerDocs />
    </main>
  )
}
