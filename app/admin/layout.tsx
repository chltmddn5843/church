import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in?redirect=/admin")
  // @ts-expect-error role is added to the user table
  if (session.user.role !== "admin") redirect("/")

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
