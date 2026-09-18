import type { ReactNode } from "react"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ToastFromQuery } from "@/components/toast-from-query"
import { getSessionUser } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        본문으로 바로가기
      </a>
      <SiteHeader user={user} />
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter />
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>
    </div>
  )
}
