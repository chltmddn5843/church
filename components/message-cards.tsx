import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// From the church's own 비전·사명 page (wdchurch.com/Page/Index/14), cut to a keyword and one line each.
// Photos are real church events chosen per message (gallery board 62). trimTop zooms in from the bottom
// to cut the lyric screens at the top of sanctuary shots (portrait cards crop only the sides).
const messages = [
  { label: "비전", keyword: "하나님께 영광", line: "예수님이 주인 되시고 성령님이 이끄시는 교회", image: "/images/vision/glory.jpg", trimTop: true },
  { label: "우리의 사명", keyword: "제자 되어 세상으로", line: "예수님을 닮아 이웃과 세상을 변화시킵니다", image: "/images/vision/serve-neighbors.jpg" },
  { label: "시대적 사명", keyword: "예배와 다음 세대", line: "예배를 회복하고 다음 세대를 세웁니다", image: "/images/vision/anniversary-worship.jpg" },
  { label: "교회의 역할", keyword: "복된 만남", line: "사랑하며 섬기는 행복한 교회", image: "/images/vision/fellowship.jpg" },
]

// Full-width 비전·사명 panels, shared by the home page and 교회소개.
// The section title sits on the photos (no separate heading row); photos avoid the hero slides.
export function MessageCards({ home = false }: { home?: boolean }) {
  return (
    <section id={home ? undefined : "vision"} className={cn("relative scroll-mt-24", home && "mt-20 md:mt-28")}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent pb-16">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-10 md:pt-12 lg:max-w-[1360px] lg:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Vision &amp; Mission</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-white md:text-3xl">비전과 사명</h2>
          </div>
          {home && (
            <Link
              href="/about#vision"
              className="pointer-events-auto flex min-h-11 items-center gap-0.5 text-sm font-semibold text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              교회 소개 <ChevronRight aria-hidden className="size-4" />
            </Link>
          )}
        </div>
      </div>

      <ol className="grid gap-px bg-foreground sm:grid-cols-2 lg:grid-cols-4">
        {messages.map((m, i) => (
          <li key={m.label} className="group relative isolate flex min-h-[340px] flex-col overflow-hidden pt-28 text-white sm:min-h-[440px] sm:pt-36 md:min-h-[560px] md:pt-44">
            <Image
              src={m.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                "-z-10 object-cover transition-transform duration-700",
                m.trimTop ? "origin-bottom scale-[1.35] motion-safe:group-hover:scale-[1.4]" : "motion-safe:group-hover:scale-105",
              )}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
            <div className="mt-auto p-6 md:p-8">
              <span aria-hidden className="text-sm font-bold tabular-nums tracking-[0.2em] text-brand-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-sm font-semibold text-white/85">{m.label}</p>
              <h3 className="mt-2 break-keep text-3xl font-bold leading-tight lg:text-[1.9rem] xl:text-4xl">{m.keyword}</h3>
              <p className="mt-3 break-keep text-base leading-relaxed text-white/90">{m.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
