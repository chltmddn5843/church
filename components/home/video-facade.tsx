"use client"

import { useState, type ReactNode } from "react"
import { Play } from "lucide-react"

// Thumbnail + overlay until pressed, then swaps in the real player (also keeps YouTube's JS off first load).
export function VideoFacade({ youtubeId, title, children }: { youtubeId: string; title: string; children: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    )
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={`영상 재생: ${title}`} className="group relative block h-full w-full text-left">
      {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail, unoptimized images */}
      <img
        src={thumb}
        alt=""
        // YouTube serves a 120px grey placeholder (not a 404) when no HD thumbnail exists.
        onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setThumb(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
      <span className="absolute right-4 top-4 flex size-12 items-center justify-center bg-white/90 text-primary shadow-lg transition group-hover:bg-white motion-safe:group-hover:scale-110">
        <Play aria-hidden className="size-5 fill-current" />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-5 md:p-8">{children}</span>
    </button>
  )
}
