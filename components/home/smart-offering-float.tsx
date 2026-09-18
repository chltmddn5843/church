"use client"

import Link from "next/link"
import { useState } from "react"
import { Banknote, Building2, HandCoins, Ticket, X } from "lucide-react"

const links = [
  { label: "일반 헌금", href: "https://aq.gy/f/Smhf4", icon: Banknote },
  { label: "건축헌금", href: "https://aq.gy/f/gL9jy", icon: Building2 },
  { label: "식권", href: "https://aq.gy/f/B6Tx1", icon: Ticket },
] as const

export function SmartOfferingFloat() {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="스마트 헌금 열기"
        className="fixed right-4 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-xl transition hover:bg-foreground active:scale-95 md:right-6"
      >
        <HandCoins className="size-6" />
      </button>
    )
  }

  return (
    <aside
      className="fixed right-4 top-1/2 z-40 -translate-y-1/2 overflow-hidden rounded-xl border border-accent/60 bg-white/95 shadow-xl backdrop-blur md:right-6"
      aria-label="스마트 헌금 바로가기"
    >
      <div className="flex h-11 items-center justify-between gap-2 bg-primary pl-4 pr-2 text-xs font-bold text-white">
        <Link href="/offering" className="flex items-center gap-2">
          <HandCoins className="size-4" />
          <span>스마트 헌금</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="스마트 헌금 닫기"
          className="rounded p-1.5 hover:bg-white/20"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="divide-y divide-border">
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-12 items-center justify-start gap-2 px-4 text-[#294d68] transition hover:bg-[#eaf7ff] hover:text-primary"
          >
            <Icon className="size-4 shrink-0" />
            <span className="text-sm font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
