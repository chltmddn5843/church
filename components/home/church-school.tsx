import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { departments } from "@/lib/church"

export function ChurchSchool() {
  return (
    <section className="bg-primary py-14 text-white md:py-20">
      <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E0C48A]">Next Generation</p>
            <h2 className="mt-1 font-serif text-2xl font-bold md:text-3xl">교회학교</h2>
          </div>
          <Link
            href="/next-generation"
            className="flex min-h-6 items-center gap-0.5 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            다음세대 전체 <ChevronRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-3 gap-3 lg:grid-cols-9">
          {departments.map((d, i) => (
            <li
              key={d.id}
              className="scroll-reveal"
              // Same row enters together, so offset each card slightly; all finish before the row is fully on screen.
              style={{ animationRange: `entry ${(i % 9) * 4}% entry ${35 + (i % 9) * 6}%`, "--reveal-from": 0.45 } as CSSProperties}
            >
              <Link
                href={`/next-generation#${d.id}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-md bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Image src={d.image} alt="" fill sizes="(min-width: 1024px) 150px, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="block truncate text-[11px] text-white/85">{d.age}</span>
                  <span className="mt-0.5 block break-keep text-sm font-bold md:text-base">{d.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
