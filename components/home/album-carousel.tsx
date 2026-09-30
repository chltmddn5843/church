"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Photo = { id: number; title: string; imageUrl: string; date: string }

const arrow =
  "flex size-11 items-center justify-center border border-border text-foreground transition-colors hover:bg-secondary disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

// Native scroll-snap track: swipe on touch, arrows page by one visible width.
export function AlbumCarousel({ items, children }: { items: Photo[]; children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: true })

  function update() {
    const el = track.current
    if (el) setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 })
  }

  useEffect(() => {
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  function page(dir: 1 | -1) {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({ left: dir * el.clientWidth, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>{children}</div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => page(-1)} disabled={edge.start} aria-label="이전 사진" className={arrow}>
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={() => page(1)} disabled={edge.end} aria-label="다음 사진" className={arrow}>
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        )}
      </div>

      {items.length > 0 ? (
        <ul
          ref={track}
          onScroll={update}
          aria-label="교회 앨범 사진"
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((p) => (
            <li key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)]">
              <Link href={`/gallery/${p.id}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="relative block aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={p.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 72vw"
                    className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 block truncate font-semibold text-foreground transition-colors group-hover:text-primary">{p.title}</span>
                <span className="mt-0.5 block text-sm tabular-nums text-muted-foreground">{p.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 border-y border-border py-10 text-center text-sm text-muted-foreground">등록된 사진이 없습니다.</p>
      )}
    </div>
  )
}
