import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Wording from the church's own 비전·사명 page (wdchurch.com/Page/Index/14).
const messages = [
  {
    label: "비전",
    title: "하나님이 영광 받으시고, 예수님이 주인 되시고, 성령님이 이끌어 가시는 교회",
    desc: "모든 면에서 예수님을 첫 자리에 모시고, 사람의 힘과 지혜가 아니라 성령님이 이끌어 가시도록 기도하며 순종합니다.",
    image: "/images/worship-praise-2.jpg",
  },
  {
    label: "우리의 사명",
    title: "예수님의 제자 되어 세상을 변화시키자",
    desc: "인격적으로 예수님을 닮고, 하나님 나라를 가르치고 전파하고 치유하는 사역을 감당합니다. 내가 먼저 변할 때 이웃과 세상이 변합니다.",
    image: "/images/worship-sermon.jpg",
  },
  {
    label: "시대적 사명",
    title: "예배회복과 다음 세대 세움",
    desc: "하나님의 임재가 충만한 예배를 회복하고, 말씀 암송과 제자훈련으로 다음 세대를 하나님 나라의 리더로 세웁니다.",
    image: "/images/worship-praise-wide.jpg",
  },
  {
    label: "교회의 역할",
    title: "복된 만남을 통해 사랑하며 섬기는 행복한 교회",
    desc: "누구든지 예수님을 만나고 가족으로 만나, 예배와 셀공동체 안에서 예수님의 사랑을 경험하며 이웃을 섬깁니다.",
    image: "/images/discipleship/newfamily-graduation.jpg",
  },
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
          <li key={m.label} className="group relative isolate flex min-h-[440px] flex-col overflow-hidden pt-36 text-white md:min-h-[560px] md:pt-44">
            <Image
              src={m.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="-z-10 object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
            <div className="mt-auto p-6 md:p-8">
              <span aria-hidden className="text-sm font-bold tabular-nums tracking-[0.2em] text-brand-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-sm font-semibold text-white/85">{m.label}</p>
              <h3 className="mt-2 break-keep font-serif text-2xl font-semibold leading-snug md:text-[1.7rem]">{m.title}</h3>
              <p className="mt-4 break-keep leading-relaxed text-white/90">{m.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
