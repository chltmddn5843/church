"use client"

import { useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

export function BulletinPdfViewer({
  url,
  title,
  className = "mt-8",
  heightClassName = "max-h-[80vh] md:max-h-[85vh]",
}: {
  url: string
  title: string
  className?: string
  heightClassName?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageWidth, setPageWidth] = useState<number>()
  const [numPages, setNumPages] = useState<number>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setPageWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm", className)}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-secondary/60 px-4 py-3">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
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

      <div ref={containerRef} className={cn("overflow-y-auto bg-muted/30 p-2 md:p-4", heightClassName)}>
        {failed ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            미리보기를 불러오지 못했어요. 위의 &apos;새 창&apos; 버튼으로 열어주세요.
          </p>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setFailed(true)}
            loading={<p className="py-16 text-center text-sm text-muted-foreground">주보를 불러오는 중이에요...</p>}
            className="flex flex-col items-center gap-3"
          >
            {Array.from({ length: numPages ?? 0 }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="overflow-hidden rounded-lg shadow-sm"
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  )
}
