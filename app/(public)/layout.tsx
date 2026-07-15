import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSessionUser } from "@/lib/session"

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
