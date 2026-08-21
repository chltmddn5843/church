"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Paperclip,
  Radio,
  ReceiptText,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const links = [
  { href: "/admin", label: "관리자 메인", icon: LayoutDashboard },
  { href: "/admin/live", label: "예배 영상 관리", icon: Radio },
  { href: "/admin/popups", label: "팝업 관리", icon: Bell },
  { href: "/admin/sermons", label: "설교 관리", icon: BookOpen },
  { href: "/admin/posts", label: "소식·공지 관리", icon: Newspaper },
  { href: "/admin/offering", label: "헌금 현황 관리", icon: ReceiptText },
  { href: "/admin/gallery", label: "갤러리 관리", icon: ImageIcon },
  { href: "/admin/attachments", label: "첨부파일 관리", icon: Paperclip },
  { href: "/admin/statistics", label: "조회수 통계", icon: BarChart3 },
  { href: "/admin/pages", label: "소개 페이지 관리", icon: FileText },
  { href: "/admin/members", label: "회원 승인 관리", icon: Users },
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
    <aside className="shrink-0 border-b border-[#dedede] bg-[#fafafa] md:w-[260px] md:border-r md:border-b-0">
      <nav aria-label="관리자 메뉴" className="flex overflow-x-auto md:block md:py-8">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-14 shrink-0 items-center gap-3 border-r border-[#e2e2e2] px-5 text-sm font-medium transition-colors md:h-[62px] md:w-full md:border-r-0 md:border-b md:px-7 md:first:border-t",
                active
                  ? "bg-[#e8f2fa] text-[#20597d] md:shadow-[inset_4px_0_0_#2d739e]"
                  : "text-[#444] hover:bg-[#f1f1f1] hover:text-black",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={2.2} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="hidden border-t border-[#dedede] md:block">
        <Link href="/" className="flex h-14 items-center gap-3 px-7 text-sm text-[#555] hover:bg-[#f1f1f1]">
          <Home className="size-[18px]" /> 홈페이지 보기
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-14 w-full items-center gap-3 px-7 text-sm text-[#555] hover:bg-[#f1f1f1]"
        >
          <LogOut className="size-[18px]" /> 로그아웃
        </button>
      </div>
    </aside>
  )
}
