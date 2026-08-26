import Link from "next/link"
import { Banknote, Building2, HandCoins, Ticket } from "lucide-react"

const links = [
  { label: "일반 헌금", href: "https://aq.gy/f/Smhf4", icon: Banknote },
  { label: "건축헌금", href: "https://aq.gy/f/gL9jy", icon: Building2 },
  { label: "식권", href: "https://aq.gy/f/B6Tx1", icon: Ticket },
] as const

export function SmartOfferingFloat() {
  return (
    <aside className="fixed right-2 top-1/2 z-40 -translate-y-1/2 overflow-hidden rounded-xl border border-[#9CC7E6]/60 bg-white/95 shadow-xl backdrop-blur md:right-5" aria-label="스마트 헌금 바로가기">
      <Link href="/offering" className="flex h-11 items-center justify-center gap-2 bg-[#123A63] px-3 text-xs font-bold text-white md:justify-start md:px-4">
        <HandCoins className="size-4" />
        <span className="hidden md:inline">스마트 헌금</span>
      </Link>
      <div className="divide-y divide-[#d7e5ee]">
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-12 items-center justify-center gap-2 text-[#294d68] transition hover:bg-[#eaf7ff] hover:text-[#123A63] md:h-12 md:w-32 md:justify-start md:px-4"
          >
            <Icon className="size-4 shrink-0" />
            <span className="hidden text-sm font-semibold md:inline">{label}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
