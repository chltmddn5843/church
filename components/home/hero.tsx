"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { heroSlides } from "@/lib/church"


const AUTOPLAY_MS = 5000

export function Hero({ images }: { images: Record<number, string> }) {
  const slides = heroSlides.map((slide, i) => ({ ...slide, src: images[i] ?? slide.src }))
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  // Only the current slide and the next one are fetched; the rest load as the show reaches them.
  const [loaded, setLoaded] = useState(() => new Set([0, 1]))

  const go = useCallback((target: number) => {
    setIndex(target)
    setLoaded((seen) => new Set([...seen, target, (target + 1) % heroSlides.length]))
  }, [])
  const next = useCallback(() => go((index + 1) % heroSlides.length), [go, index])
  const prev = useCallback(() => go((index - 1 + heroSlides.length) % heroSlides.length), [go, index])

  useEffect(() => {
    if (!playing) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [playing, next])

  return (
    <section className="relative isolate -mt-16 h-dvh min-h-[480px] w-full overflow-x-clip md:-mt-24">
      {slides.map((slide, i) => loaded.has(i) && (
        <Image
          key={slide.title}
          src={slide.src}
          alt=""
          fill
          priority={i === 0}
          quality={85}
          aria-hidden={i !== index}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 via-65% to-transparent" />

      <div className="absolute inset-x-6 bottom-40 md:inset-x-12 md:bottom-52 lg:max-w-3xl">
        <div className="relative">
          {slides.map((slide, i) => (
            <div
              key={slide.title}
              aria-hidden={i !== index}
              className={`transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "absolute inset-0 opacity-0"}`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white md:text-base">{slide.title}</p>
              <p className="mt-3 break-keep text-balance font-serif text-4xl font-bold leading-[1.15] text-white md:text-6xl lg:text-7xl">
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-24 left-6 flex items-center gap-3 md:bottom-32 md:left-12">
        <button
          type="button"
          onClick={prev}
          aria-label="이전 이미지"
          className="flex size-10 items-center justify-center text-white/90 drop-shadow-[0_1px_3px_rgb(0_0_0_/_0.5)] transition hover:text-white focus-visible:outline-white"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "슬라이드 정지" : "슬라이드 재생"}
          className="flex size-10 items-center justify-center text-white/90 drop-shadow-[0_1px_3px_rgb(0_0_0_/_0.5)] transition hover:text-white focus-visible:outline-white"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="다음 이미지"
          className="flex size-10 items-center justify-center text-white/90 drop-shadow-[0_1px_3px_rgb(0_0_0_/_0.5)] transition hover:text-white focus-visible:outline-white"
        >
          <ChevronRight className="size-6" />
        </button>
        <span className="text-sm font-semibold tabular-nums text-white drop-shadow-[0_1px_3px_rgb(0_0_0_/_0.5)]" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
        </span>
        <span className="sr-only" aria-live="polite">
          {heroSlides.length}장 중 {index + 1}번째 이미지: {slides[index].title} — {slides[index].subtitle}
        </span>
      </div>
    </section>
  )
}
