"use client"

import dynamic from "next/dynamic"
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { Download, ExternalLink, Minus, Plus } from "lucide-react"
import cloudflareLoader from "@/lib/image-loader"
import { cn } from "@/lib/utils"

type BulletinFile = { url: string; name: string }

const BulletinPdfPages = dynamic(() => import("@/components/bulletin-pdf-pages").then((m) => m.BulletinPdfPages), {
  ssr: false,
  loading: () => <p className="py-16 text-center text-sm text-muted-foreground">주보를 불러오는 중이에요...</p>,
})

const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
// Pages fit the viewer width but never get wider than this at 100%, so desktop doesn't blow a page up to 2000px.
const MAX_PAGE_WIDTH = 960
export const toolbarButtonClass =
  "inline-flex size-9 shrink-0 items-center justify-center gap-1.5 border border-border bg-background text-sm font-medium text-foreground transition hover:bg-muted sm:w-auto sm:px-3"

export function BulletinViewer({
  title,
  pdf,
  images,
  className,
  children,
}: {
  title: string
  pdf: BulletinFile | null
  images: BulletinFile[]
  className?: string
  /** Extra toolbar actions (e.g. a dialog close button). */
  children?: ReactNode
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef(1)
  // Client point to keep still across a zoom, plus where it sat inside the page column (0..1).
  const anchor = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  // Pixel resolution trails the visual zoom so pinching doesn't re-rasterize PDF pages every frame.
  const [renderZoom, setRenderZoom] = useState(1)
  const [baseWidth, setBaseWidth] = useState(0)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(pdf ? 0 : images.length)
  const download = pdf ?? images[page] ?? images[0]

  function zoomTo(next: number, x?: number, y?: number) {
    const el = scrollRef.current
    const content = contentRef.current
    if (!el || !content) return
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next))
    const box = el.getBoundingClientRect()
    const rect = content.getBoundingClientRect()
    x ??= box.left + box.width / 2
    y ??= box.top + box.height / 2
    anchor.current = { x, y, fx: (x - rect.left) / rect.width, fy: (y - rect.top) / rect.height }
    zoomRef.current = z
    setZoom(z)
  }

  useLayoutEffect(() => {
    const a = anchor.current
    const el = scrollRef.current
    const content = contentRef.current
    if (!a || !el || !content) return
    anchor.current = null
    const rect = content.getBoundingClientRect()
    el.scrollLeft += rect.left + a.fx * rect.width - a.x
    el.scrollTop += rect.top + a.fy * rect.height - a.y
  }, [zoom])

  useEffect(() => {
    const t = setTimeout(() => setRenderZoom(Math.max(1, zoom)), 300)
    return () => clearTimeout(t)
  }, [zoom])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setBaseWidth(Math.min(entry.contentRect.width, MAX_PAGE_WIDTH)))
    observer.observe(el)

    // Pinch (touch) and ctrl+wheel (trackpad pinch / ctrl+scroll) zoom the pages, not the whole site.
    let pinch: { dist: number; zoom: number } | null = null
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
    const onTouchStart = (e: TouchEvent) => {
      pinch = e.touches.length === 2 ? { dist: dist(e.touches), zoom: zoomRef.current } : null
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!pinch || e.touches.length !== 2) return
      e.preventDefault()
      const [a, b] = [e.touches[0], e.touches[1]]
      zoomTo((pinch.zoom * dist(e.touches)) / pinch.dist, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2)
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinch = null
    }
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      zoomTo(zoomRef.current * Math.exp(-e.deltaY / 100), e.clientX, e.clientY)
    }
    // Desktop Safari reports trackpad pinch as non-standard gesture events instead of ctrl+wheel.
    // iOS fires them too, but there the touch handler already owns the pinch.
    type GestureEvent = Event & { scale: number; clientX: number; clientY: number }
    let gestureZoom = 1
    const onGestureStart = (e: Event) => {
      e.preventDefault()
      gestureZoom = zoomRef.current
    }
    const onGestureChange = (e: Event) => {
      e.preventDefault()
      const g = e as GestureEvent
      if (!pinch) zoomTo(gestureZoom * g.scale, g.clientX, g.clientY)
    }
    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd)
    el.addEventListener("touchcancel", onTouchEnd)
    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("gesturestart", onGestureStart)
    el.addEventListener("gesturechange", onGestureChange)
    return () => {
      observer.disconnect()
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("touchcancel", onTouchEnd)
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("gesturestart", onGestureStart)
      el.removeEventListener("gesturechange", onGestureChange)
    }
    // zoomTo only touches refs and a state setter, so the first render's copy stays valid.
  }, [])

  function trackPage() {
    const el = scrollRef.current
    if (!el || !contentRef.current) return
    const line = el.scrollTop + el.clientHeight / 3
    const pages = contentRef.current.querySelectorAll<HTMLElement>("[data-page]")
    let current = 0
    pages.forEach((p, i) => {
      if (p.offsetTop <= line) current = i
    })
    setPage(current)
  }

  return (
    <div className={cn("flex flex-col overflow-hidden bg-card", className)}>
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-3 md:px-4">
        <p className="min-w-0 truncate text-sm font-semibold text-foreground md:text-base">{title}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {download && (
            <>
              <a href={download.url} target="_blank" rel="noopener noreferrer" aria-label="새 창에서 열기" className={toolbarButtonClass}>
                <ExternalLink className="size-4" aria-hidden /> <span className="hidden sm:inline">새 창</span>
              </a>
              <a href={download.url} download aria-label="다운로드" className={cn(toolbarButtonClass, "border-primary bg-primary text-primary-foreground hover:bg-primary/90")}>
                <Download className="size-4" aria-hidden /> <span className="hidden sm:inline">다운로드</span>
              </a>
            </>
          )}
          {children}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-muted">
        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label={`${title} 내용`}
          onScroll={trackPage}
          onDoubleClick={(e) => zoomTo(zoomRef.current > 1 ? 1 : 2, e.clientX, e.clientY)}
          className="absolute inset-0 touch-pan-x touch-pan-y overflow-auto p-3 pb-20 outline-none md:p-6 md:pb-24"
        >
          <div ref={contentRef} className="mx-auto flex flex-col gap-3 md:gap-6" style={{ width: baseWidth * zoom || undefined }}>
            {pdf ? (
              <BulletinPdfPages url={pdf.url} width={baseWidth} renderZoom={renderZoom} onLoad={setPageCount} />
            ) : (
              images.map((image, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- R2 uploads resized by Cloudflare; srcset grows with zoom
                <img
                  key={image.url}
                  data-page
                  src={cloudflareLoader({ src: image.url, width: 2048 })}
                  srcSet={[1080, 2048, 3072].map((w) => `${cloudflareLoader({ src: image.url, width: w })} ${w}w`).join(", ")}
                  sizes={`${Math.round(baseWidth * renderZoom) || 1080}px`}
                  alt={`${title} ${i + 1}페이지`}
                  draggable={false}
                  className="h-auto w-full select-none bg-white shadow-md"
                />
              ))
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center bg-foreground/85 text-background shadow-lg backdrop-blur">
          {pageCount > 1 && (
            <span className="whitespace-nowrap border-r border-background/20 px-3 text-sm tabular-nums" aria-live="polite">
              {page + 1} / {pageCount}
            </span>
          )}
          <button type="button" onClick={() => zoomTo(zoomRef.current / 1.25)} disabled={zoom <= MIN_ZOOM} aria-label="축소" className="flex size-11 items-center justify-center transition hover:bg-background/15 disabled:opacity-40">
            <Minus className="size-5" />
          </button>
          <button type="button" onClick={() => zoomTo(1)} aria-label="화면 너비에 맞추기" className="h-11 min-w-16 px-1 text-sm font-medium tabular-nums transition hover:bg-background/15">
            {Math.round(zoom * 100)}%
          </button>
          <button type="button" onClick={() => zoomTo(zoomRef.current * 1.25)} disabled={zoom >= MAX_ZOOM} aria-label="확대" className="flex size-11 items-center justify-center transition hover:bg-background/15 disabled:opacity-40">
            <Plus className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
