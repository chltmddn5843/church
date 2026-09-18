import type { ReactNode } from "react"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ToastFromQuery } from "@/components/toast-from-query"
import { getSessionUser } from "@/lib/session"
import { getLatestBulletin } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [user, bulletin] = await Promise.all([getSessionUser(), getLatestBulletin()])
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} bulletin={bulletin} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>
    </div>
  )
}
