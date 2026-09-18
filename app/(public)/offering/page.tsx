import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Banknote, Building2, Ticket } from "lucide-react"

export const metadata: Metadata = {
  title: "스마트 헌금",
  description: "일반 헌금, 건축헌금, 식권을 온라인으로 이용하세요.",
}

const offerings = [
  { title: "일반 헌금", description: "십일조·감사·주일·선교 헌금", href: "https://aq.gy/f/Smhf4", icon: Banknote },
  { title: "건축헌금", description: "교회 건축을 위한 헌금", href: "https://aq.gy/f/gL9jy", icon: Building2 },
  { title: "식권", description: "교회 식권 신청 및 결제", href: "https://aq.gy/f/B6Tx1", icon: Ticket },
] as const

export default function SmartOfferingPage() {
  return (
    <section className="bg-[#f6fbff] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[.2em] text-ring">SMART OFFERING</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#183247] md:text-5xl">스마트 헌금</h1>
          <p className="mx-auto mt-4 max-w-xl break-keep text-muted-foreground">
            이용할 항목을 선택하면 안전한 외부 신청 페이지로 이동합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {offerings.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-56 flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#eaf7ff] text-primary">
                <Icon className="size-6" />
              </span>
              <h2 className="mt-6 text-xl font-bold text-[#183247]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-auto flex items-center gap-1 pt-6 text-sm font-semibold text-ring">
                이용하기 <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">헌금 현황은 관리자가 전달한 전용 링크에서만 확인할 수 있습니다.</p>
      </div>
    </section>
  )
}
