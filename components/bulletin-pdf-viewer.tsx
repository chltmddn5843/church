"use client"

import { useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

export function BulletinPdfViewer({
  url,
  title,
  className = "mt-8",
  heightClassName = "h-[70vh] md:h-[80vh]",
}: {
  url: string
  title: string
  className?: string
  heightClassName?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageWidth, setPageWidth] = useState<number>()
  const [numPages, setNumPages] = useState<number>()
  const [pageIndex, setPageIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setPageWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 })
  }, [pageIndex])

  const multi = (numPages ?? 0) > 1

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm", className)}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-secondary/60 px-4 py-3">
        <p className="truncate text-sm font-semibold text-foreground">
          {title}
          {multi && <span className="ml-1.5 text-xs font-normal text-muted-foreground">({pageIndex + 1}/{numPages})</span>}
        </p>
        <div className="flex shrink-0 gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <ExternalLink className="size-3.5" /> 새 창
          </a>
          <a
            href={url}
            download
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Download className="size-3.5" /> 다운로드
          </a>
        </div>
      </div>

      <div className={cn("relative overflow-hidden bg-muted/30", heightClassName)}>
        <div ref={containerRef} className="absolute inset-0 overflow-y-auto p-2 md:p-4">
          {failed ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              미리보기를 불러오지 못했어요. 위의 &apos;새 창&apos; 버튼으로 열어주세요.
            </p>
          ) : (
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages)
                setPageIndex(0)
              }}
              onLoadError={() => setFailed(true)}
              loading={<p className="py-16 text-center text-sm text-muted-foreground">주보를 불러오는 중이에요...</p>}
              className="flex flex-col items-center"
            >
              <Page
                pageNumber={pageIndex + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="overflow-hidden rounded-lg shadow-sm"
              />
            </Document>
          )}
        </div>

        {multi && (
          <>
            <button
              type="button"
              onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              disabled={pageIndex === 0}
              aria-label="이전 페이지"
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setPageIndex((i) => Math.min((numPages ?? 1) - 1, i + 1))}
              disabled={pageIndex === (numPages ?? 1) - 1}
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
          {Array.from({ length: numPages ?? 0 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPageIndex(i)}
              aria-label={`${i + 1}페이지로 이동`}
              aria-current={i === pageIndex}
              className={cn("size-2 rounded-full transition", i === pageIndex ? "bg-primary" : "bg-border hover:bg-muted-foreground")}
            />
          ))}
        </div>
      )}
    </div>
  )
}
