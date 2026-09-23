"use client"

import Image from "next/image"
import Link from "next/link"
import { Pause, Play } from "lucide-react"
import { useEffect, useState } from "react"

type GalleryItem = { id: number; title: string; imageUrl: string }

const AUTOPLAY_MS = 3500

export function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing || items.length <= 1) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [playing, items.length])

  const current = items[index]
  const multi = items.length > 1

  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A]">Photo</p>
        {multi && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "사진 슬라이드 정지" : "사진 슬라이드 재생"}
            className="flex size-6 items-center justify-center text-muted-foreground transition hover:text-primary"
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
        )}
      </div>
      <Link href="/gallery" className="group mt-3 block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
          {current ? (
            <>
              {items.map((item, i) => (
                <Image
                  key={item.id}
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className={`object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105 ${i === index ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 truncate px-3 py-2.5 text-sm font-medium text-white">{current.title}</p>
            </>
          ) : (
            <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
              아직 등록된 사진이 없어요.
            </p>
          )}
        </div>
      </Link>
      {multi && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 사진으로 이동`}
              aria-current={i === index}
              className="flex size-6 items-center justify-center"
            >
              <span className={`size-1.5 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-border"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
