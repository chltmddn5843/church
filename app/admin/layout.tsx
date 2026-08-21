import type React from "react"
import Link from "next/link"
import { Suspense } from "react"
import { ExternalLink } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ToastFromQuery } from "@/components/toast-from-query"
import { requireAdmin } from "@/lib/admin"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-[#f3f9fd] text-[#183247]">
      <header className="flex h-[72px] items-center justify-between border-b border-[#d7e5ee] bg-white px-5 text-[#183247] md:px-8">
        <Link href="/admin" className="font-serif text-xl font-semibold tracking-tight md:text-2xl">
          원당교회 관리자
        </Link>
        <div className="flex items-center gap-5">
          <span className="hidden text-sm text-[#526a7d] sm:inline">{admin.name} 관리자</span>
          <Link href="/" className="flex items-center gap-2 text-sm text-[#2F5D8A] transition hover:text-[#123A63]">
            <span className="hidden sm:inline">홈페이지 보기</span>
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] flex-col md:min-h-[calc(100vh-72px)] md:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 bg-white px-5 py-8 md:px-10 md:py-12 xl:px-16">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>
    </div>
  )
}
