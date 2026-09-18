"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

const slides = [
  { src: "/images/wd-main.jpg", title: "원당교회", subtitle: "함께 예배하는 기쁨" },
  { src: "/images/hero-worship.jpg", title: "주일예배", subtitle: "은혜 안에서 하나 되는 예배" },
  { src: "/images/gallery-1.jpg", title: "찬양대", subtitle: "마음을 다해 드리는 찬양" },
  { src: "/images/next-generation.jpg", title: "다음세대", subtitle: "믿음의 다음세대를 함께 세워갑니다" },
] as const

const AUTOPLAY_MS = 5000

export function Hero() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [])
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (!playing) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [playing, next])

  return (
    <section className="relative isolate h-[70dvh] min-h-[420px] w-full overflow-hidden md:h-[85dvh] md:min-h-[600px]">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          priority={i === 0}
          aria-hidden={i !== index}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D39]/60 via-transparent to-[#0B1D39]/25" />

      <div className="absolute left-6 top-6 max-w-[75%] md:left-10 md:top-10 md:max-w-sm">
        <div className="relative">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              aria-hidden={i !== index}
              className={`transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "absolute inset-0 opacity-0"}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 md:text-sm">{slide.title}</p>
              <p className="mt-2 text-balance font-serif text-xl font-bold leading-snug text-white md:text-3xl">
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm md:bottom-8 md:left-8 md:translate-x-0">
        <button
          type="button"
          onClick={prev}
          aria-label="이전 이미지"
          className="rounded-full p-2.5 text-white/90 transition hover:text-white focus-visible:outline-white"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "슬라이드 정지" : "슬라이드 재생"}
          className="rounded-full p-2.5 text-white/90 transition hover:text-white focus-visible:outline-white"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="다음 이미지"
          className="rounded-full p-2.5 text-white/90 transition hover:text-white focus-visible:outline-white"
        >
          <ChevronRight className="size-5" />
        </button>
        <span className="ml-1 text-xs font-semibold tabular-nums text-white/90" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
        </span>
        <span className="sr-only" aria-live="polite">
          {slides.length}장 중 {index + 1}번째 이미지: {slides[index].title} — {slides[index].subtitle}
        </span>
      </div>
    </section>
  )
}
