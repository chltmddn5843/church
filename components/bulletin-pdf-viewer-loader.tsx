"use client"

import dynamic from "next/dynamic"

export const BulletinPdfViewer = dynamic(
  () => import("@/components/bulletin-pdf-viewer").then((m) => m.BulletinPdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 rounded-2xl border border-border bg-card p-16 text-center text-sm text-muted-foreground shadow-sm">
        주보를 불러오는 중이에요...
      </div>
    ),
  },
)
