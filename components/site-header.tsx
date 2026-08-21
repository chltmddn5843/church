"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronDown, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"
import { church } from "@/lib/church"

type SessionUser = { name: string; email: string; role?: string | null } | null

export function SiteHeader({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/15 bg-primary text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/wd-logo.png" alt={`${church.name} 로고`} width={247} height={53} className="h-10 w-auto md:h-12" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="주 메뉴">
          {church.nav.map((item) => (
            <div key={item.title} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-md px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-white/15 hover:text-white"
              >
                {item.title}
                <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full min-w-44 rounded-md border border-border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {item.children.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href}
                    className="block rounded-sm px-3 py-2.5 text-base text-popover-foreground transition-colors hover:bg-secondary hover:text-primary"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "admin" && (
                <Button render={<Link href="/admin" />} nativeButton={false} size="sm" className="hidden bg-white text-primary hover:bg-white/90 sm:inline-flex">
                  관리자
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/15 hover:text-white" />}>
                  <>
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem render={<Link href="/admin" />}>관리자 페이지</DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>로그아웃</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button render={<Link href="/sign-in" />} nativeButton={false} variant="ghost" size="sm" className="text-white hover:bg-white/15 hover:text-white">
                로그인
              </Button>
              <Button render={<Link href="/sign-up" />} nativeButton={false} size="sm" className="bg-white text-primary hover:bg-white/90">
                회원가입
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="메뉴 열기" className="text-white hover:bg-white/15 hover:text-white" />} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="sr-only">주 메뉴</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {church.nav.map((item) => (
                  <div key={item.title} className="border-b border-border pb-2">
                    <Link href={item.href} onClick={() => setOpen(false)} className="block px-2 py-2 text-lg font-semibold text-foreground">
                      {item.title}
                    </Link>
                    <div className="ml-2 flex flex-col">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="rounded-sm px-2 py-2 text-base text-muted-foreground hover:text-primary"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      {user.role === "admin" && (
                        <Button render={<Link href="/admin" />} nativeButton={false} variant="outline" onClick={() => setOpen(false)}>
                          관리자 페이지
                        </Button>
                      )}
                      <Button onClick={handleSignOut}>로그아웃</Button>
                    </>
                  ) : (
                    <>
                      <Button render={<Link href="/sign-in" />} nativeButton={false} variant="outline" onClick={() => setOpen(false)}>
                        로그인
                      </Button>
                      <Button render={<Link href="/sign-up" />} nativeButton={false} onClick={() => setOpen(false)}>
                        회원가입
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
