import Link from "next/link"
import Image from "next/image"
import { HandCoins } from "lucide-react"

const tiles = [
  { title: "제자훈련", href: "/discipleship", image: "/images/discipleship.png" },
  { title: "다음세대", href: "/next-generation", image: "/images/next-generation.jpg" },
  { title: "교회소식", href: "/community", image: "/images/hero-worship.jpg" },
  { title: "갤러리", href: "/gallery", image: "/images/gallery-1.jpg" },
] as const

export function QuickLinks() {
  return (
    <section className="bg-secondary/50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group relative flex h-56 items-end overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl focus-visible:shadow-xl"
            >
              <Image
                src={tile.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="relative z-10 w-full px-5 py-5 text-lg font-bold text-white">{tile.title}</span>
            </Link>
          ))}
          <Link
            href="/offering"
            className="group relative flex h-56 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1D39] via-[#123A63] to-[#2F5D8A] text-center text-white shadow-md transition-shadow hover:shadow-xl focus-visible:shadow-xl"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-[#C9A15A]/20 text-[#e8c988] transition-colors group-hover:bg-[#C9A15A]/30">
              <HandCoins className="size-7" />
            </span>
            <span className="text-lg font-bold">스마트 헌금</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
