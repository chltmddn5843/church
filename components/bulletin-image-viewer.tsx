"use client"

import { forwardRef, useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip"
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type BulletinImage = { url: string; name: string }

const Page = forwardRef<HTMLDivElement, { image: BulletinImage; alt: string }>(function Page({ image, alt }, ref) {
  // react-pageflip overwrites this node's `style` attribute wholesale for its own layout math,
  // so image rendering must live on a nested child instead of this ref'd element.
  return (
    <div ref={ref} className="h-full w-full bg-white">
      {/* Pages share the first page's box; top-align so shorter pages don't float down the sheet. */}
      <div className="flex h-full w-full items-start justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic upload URL inside a flip-page canvas */}
        <img src={image.url} alt={alt} className="h-auto max-h-full w-auto max-w-full object-contain" />
      </div>
    </div>
  )
})

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
  // react-pageflip ships loose typings for the ref's imperative handle; `any` matches the library's own declaration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const book = useRef<any>(null)
  const current = images[index]
  const multi = images.length > 1

  if (!current) return null

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

      <div className={cn("relative flex items-center justify-center overflow-hidden bg-muted/30 p-4", heightClassName)}>
        {multi ? (
          // Width follows the available height (same 300:680 ratio as the book) so the page never overflows vertically.
          <div className="mx-auto aspect-[300/680] h-full max-w-full">
            <HTMLFlipBook
              key={images.length}
              ref={book}
              width={300}
              height={680}
              size="stretch"
              minWidth={200}
              maxWidth={340}
              minHeight={450}
              maxHeight={1170}
              maxShadowOpacity={0.4}
              showCover={false}
              usePortrait
              mobileScrollSupport={false}
              className=""
              style={{}}
              startPage={0}
              drawShadow
              flippingTime={600}
              useMouseEvents
              swipeDistance={30}
              clickEventForward
              showPageCorners
              disableFlipByClick={false}
              startZIndex={0}
              autoSize
              onFlip={(e: { data: number }) => setIndex(e.data)}
            >
              {images.map((image, i) => (
                <Page key={image.url} image={image} alt={`${title} ${i + 1}페이지`} />
              ))}
            </HTMLFlipBook>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic upload URL, natural size varies per bulletin
          <img src={current.url} alt={title} className="max-h-full max-w-full rounded-lg object-contain shadow-sm" />
        )}

        {multi && (
          <>
            <button
              type="button"
              onClick={() => book.current?.pageFlip().flipPrev()}
              disabled={index === 0}
              aria-label="이전 페이지"
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => book.current?.pageFlip().flipNext()}
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
              onClick={() => book.current?.pageFlip().flip(i)}
              aria-label={`${i + 1}페이지로 이동`}
              aria-current={i === index}
              className="flex size-6 items-center justify-center"
            >
              <span className={cn("size-2 rounded-full transition", i === index ? "bg-primary" : "bg-border hover:bg-muted-foreground")} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
