"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useState, type KeyboardEvent } from "react"
import { ChevronRight, Clock, MapPin } from "lucide-react"
import { departments } from "@/lib/church"
import { cn } from "@/lib/utils"

// Full-bleed showcase: one department fills the section, tabs switch it (only the shown photo is loaded).
export function ChurchSchool() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const d = departments[active]

  function select(i: number) {
    const next = (i + departments.length) % departments.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  function onKeyDown(e: KeyboardEvent) {
    const move = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: departments.length - 1 }[e.key]
    if (move === undefined) return
    e.preventDefault()
    select(move)
  }

  return (
    <section className="relative isolate overflow-hidden bg-primary text-white">
      <Image
        key={d.id}
        src={d.image}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover animate-in fade-in duration-700 motion-reduce:animate-none"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/35 lg:to-black/25" />

      <div className="mx-auto grid min-h-[600px] max-w-6xl grid-rows-[auto_auto_1fr] gap-8 px-4 py-16 md:min-h-[640px] md:py-20 lg:max-w-[1360px] lg:grid-cols-[minmax(0,1fr)_300px] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:px-6">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2 lg:col-start-1 lg:row-start-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Next Generation</p>
            <h2 className="mt-1 font-serif text-2xl font-bold md:text-3xl">교회학교</h2>
          </div>
          <Link
            href="/next-generation"
            className="flex min-h-11 items-center gap-0.5 text-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            다음세대 전체 <ChevronRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="교회학교 부서"
          onKeyDown={onKeyDown}
          className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:flex-col lg:gap-0 lg:self-center lg:overflow-visible lg:border lg:border-white/20 lg:bg-black/45 lg:px-0 lg:backdrop-blur-md [&::-webkit-scrollbar]:hidden"
        >
          {departments.map((dep, i) => {
            const selected = i === active
            return (
              <button
                key={dep.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`school-tab-${dep.id}`}
                aria-selected={selected}
                aria-controls="school-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "flex min-h-11 shrink-0 items-center justify-between gap-3 px-4 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white lg:py-3 lg:text-base",
                  selected ? "bg-white text-primary focus-visible:outline-primary" : "bg-white/10 text-white hover:bg-white/20 lg:bg-transparent",
                )}
              >
                {dep.name}
                <span className={cn("hidden text-sm font-normal lg:block", selected ? "text-muted-foreground" : "text-white/80")}>{dep.age}</span>
              </button>
            )
          })}
        </div>

        <div
          key={d.id}
          role="tabpanel"
          id="school-panel"
          aria-labelledby={`school-tab-${d.id}`}
          className="max-w-2xl self-end animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none lg:col-start-1 lg:row-start-2"
        >
          <p className="text-sm font-semibold text-brand-light">{d.age}</p>
          <h3 className="mt-2 font-serif text-4xl font-bold md:text-6xl">{d.name}</h3>
          <p className="mt-4 line-clamp-3 break-keep leading-relaxed text-white/90 md:line-clamp-none md:text-lg">{d.desc}</p>
          <dl className="mt-5 flex flex-col gap-1.5 text-sm text-white/85 sm:flex-row sm:gap-6 md:text-base">
            <div>
              <dt className="sr-only">예배 시간</dt>
              <dd className="flex items-center gap-1.5">
                <Clock aria-hidden className="size-4 shrink-0" />
                {d.time}
              </dd>
            </div>
            <div>
              <dt className="sr-only">장소</dt>
              <dd className="flex items-center gap-1.5">
                <MapPin aria-hidden className="size-4 shrink-0" />
                {d.place}
              </dd>
            </div>
          </dl>
          <Link
            href={`/next-generation#${d.id}`}
            className="mt-7 inline-flex min-h-12 items-center gap-1 border border-white/30 bg-white/10 px-5 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-base"
          >
            {d.name} 자세히 보기 <ChevronRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
