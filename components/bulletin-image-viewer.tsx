"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type BulletinImage = { url: string; name: string }

export function BulletinImageViewer({
  images,
  title,
  className = "mt-8",
  heightClassName = "h-[70vh] md:h-[80vh]",
}: {
  images: BulletinImage[]
  title: string
  className?: string
  heightClassName?: string
}) {
  const [index, setIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const current = images[index]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [index])

  if (!current) return null
  const multi = images.length > 1

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm", className)}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-secondary/60 px-4 py-3">
        <p className="truncate text-sm font-semibold text-foreground">
          {title}
          {multi && <span className="ml-1.5 text-xs font-normal text-muted-foreground">({index + 1}/{images.length})</span>}
        </p>
        <div className="flex shrink-0 gap-2">
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <ExternalLink className="size-3.5" /> 새 창
          </a>
          <a
            href={current.url}
            download
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Download className="size-3.5" /> 다운로드
          </a>
        </div>
      </div>

      <div className={cn("relative overflow-hidden bg-muted/30", heightClassName)}>
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-2 md:p-4">
          <div className="mx-auto max-w-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic upload URL, natural size varies per bulletin */}
            <img
              src={current.url}
              alt={multi ? `${title} ${index + 1}페이지` : title}
              className="w-full rounded-lg object-contain shadow-sm"
            />
          </div>
        </div>

        {multi && (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="이전 페이지"
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(images.length - 1, i + 1))}
              disabled={index === images.length - 1}
              aria-label="다음 페이지"
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {multi && (
        <div className="flex shrink-0 items-center justify-center gap-1.5 border-t border-border bg-secondary/40 py-2.5">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}페이지로 이동`}
              aria-current={i === index}
              className={cn("size-2 rounded-full transition", i === index ? "bg-primary" : "bg-border hover:bg-muted-foreground")}
            />
          ))}
        </div>
      )}
    </div>
  )
}
