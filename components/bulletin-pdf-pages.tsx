"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

// ponytail: every page is one canvas capped at 2400 device px wide (~33MB per A4 page), so deep zoom gets
// slightly soft instead of blowing mobile canvas memory limits; tiled rendering (pdf.js viewer) is the upgrade.
const MAX_CANVAS_WIDTH = 2400

export function BulletinPdfPages({
  url,
  width,
  renderZoom,
  onLoad,
}: {
  url: string
  width: number
  renderZoom: number
  onLoad: (numPages: number) => void
}) {
  const [numPages, setNumPages] = useState(0)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        미리보기를 불러오지 못했어요. 위의 &apos;새 창&apos; 버튼으로 열어주세요.
      </p>
    )
  }

  return (
    <Document
      file={url}
      onLoadSuccess={({ numPages }) => {
        setNumPages(numPages)
        onLoad(numPages)
      }}
      onLoadError={() => setFailed(true)}
      loading={<p className="py-16 text-center text-sm text-muted-foreground">주보를 불러오는 중이에요...</p>}
      className="contents"
    >
      {width > 0 &&
        Array.from({ length: numPages }, (_, i) => (
          <div key={i} data-page className="bg-white shadow-md">
            {/* Canvas is stretched to the zoomed column by CSS; resolution follows renderZoom once pinching settles. */}
            <Page
              pageNumber={i + 1}
              width={width}
              devicePixelRatio={Math.min(window.devicePixelRatio * renderZoom, MAX_CANVAS_WIDTH / width)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={null}
              className="[&_canvas]:!h-auto [&_canvas]:!w-full"
            />
          </div>
        ))}
    </Document>
  )
}
