"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

const slides = [
  { src: "/images/worship-sanctuary-wide.jpg", title: "원당교회", subtitle: "함께 예배하는 기쁨" },
  { src: "/images/worship-praise.jpg", title: "주일예배", subtitle: "은혜 안에서 하나 되는 예배" },
  { src: "/images/worship-choir.jpg", title: "찬양대", subtitle: "마음을 다해 드리는 찬양" },
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
    <section className="relative isolate -mt-16 h-dvh min-h-[480px] w-full overflow-x-clip md:-mt-24">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 via-65% to-transparent" />

      <div className="absolute inset-x-6 bottom-28 md:inset-x-12 md:bottom-36 lg:max-w-3xl">
        <div className="relative">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
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

      <div className="absolute bottom-14 left-6 flex items-center gap-3 md:bottom-20 md:left-12">
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
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <span className="sr-only" aria-live="polite">
          {slides.length}장 중 {index + 1}번째 이미지: {slides[index].title} — {slides[index].subtitle}
        </span>
      </div>
      <div aria-hidden="true" className="absolute -bottom-0.5 left-1/2 h-9 w-[160%] -translate-x-1/2 rounded-t-[50%_100%] bg-white md:h-[58px] md:w-[130%]" />
    </section>
  )
}
