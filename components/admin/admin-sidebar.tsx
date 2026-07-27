"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Newspaper, ImageIcon, Bell, Users, Home, LogOut, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const links = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/sermons", label: "설교 관리", icon: BookOpen },
  { href: "/admin/posts", label: "소식/공지 관리", icon: Newspaper },
  { href: "/admin/gallery", label: "갤러리 관리", icon: ImageIcon },
  { href: "/admin/popups", label: "팝업 관리", icon: Bell },
  { href: "/admin/pages", label: "소개 페이지 관리", icon: FileText },
  { href: "/admin/members", label: "회원 조회", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-6 py-5">
        <p className="font-serif text-lg font-bold text-sidebar-primary">원당교회</p>
        <p className="text-xs text-sidebar-foreground/70">관리자 페이지</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="space-y-1 border-t border-sidebar-border px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Home className="h-4 w-4" />
          홈페이지로
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
