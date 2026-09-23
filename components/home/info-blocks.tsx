"use client"

import Link from "next/link"
import { useState } from "react"
import { FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BulletinPdfViewer } from "@/components/bulletin-pdf-viewer-loader"
import { BulletinImageViewer } from "@/components/bulletin-image-viewer"

type Bulletin = {
  id: number
  title: string
  pdf: { url: string; name: string } | null
  images: { url: string; name: string }[]
} | null

const links = [
  { key: "worship", en: "Worship", title: "예배 안내", href: "/worship" },
  { key: "newcomer", en: "Welcome", title: "새가족 안내", href: "/community?category=새가족소개" },
  { key: "location", en: "Location", title: "오시는 길", href: "/about#location" },
  { key: "about", en: "About", title: "교회 소개", href: "/about" },
  { key: "discipleship", en: "Disciple", title: "제자훈련", href: "/discipleship" },
  { key: "next-generation", en: "Next Gen", title: "다음세대", href: "/next-generation" },
  { key: "gallery", en: "Gallery", title: "갤러리", href: "/gallery" },
] as const

// Alternating navy shades like a tiled band; hover lifts the tile above its neighbours.
const tileClass =
  "group relative flex h-full w-full flex-col items-center justify-center gap-1 px-2 py-6 text-center text-white transition duration-200 hover:z-10 hover:bg-[#8C6A2C] hover:shadow-xl motion-safe:hover:scale-105 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white md:py-8"
const shade = (i: number) => (i % 2 === 0 ? "bg-primary" : "bg-[#285d91]")
const enClass = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E0C48A] transition-colors group-hover:text-white"
const koClass = "break-keep text-sm font-bold md:text-base"

export function InfoBlocks({ bulletin }: { bulletin: Bulletin }) {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="바로가기">
      <ul className="grid grid-cols-4 lg:grid-cols-8">
        <li className={shade(0)}>
          <button type="button" onClick={() => setOpen(true)} className={tileClass}>
            <span className={enClass}>Bulletin</span>
            <span className={koClass}>주보</span>
          </button>
        </li>
        {links.map((item, i) => (
          <li key={item.key} className={shade(i + 1)}>
            <Link href={item.href} className={tileClass}>
              <span className={enClass}>{item.en}</span>
              <span className={koClass}>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[92vh] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 font-serif text-xl font-bold">
              <FileText className="size-5" aria-hidden />
              {bulletin?.title ?? "주보"}
            </DialogTitle>
          </DialogHeader>
          {bulletin && (bulletin.pdf || bulletin.images.length > 0) ? (
            <div className="min-h-0 flex-1">
              {bulletin.pdf ? (
                <BulletinPdfViewer url={bulletin.pdf.url} title={bulletin.pdf.name} className="h-full" heightClassName="flex-1 min-h-0" />
              ) : (
                <BulletinImageViewer images={bulletin.images} title={bulletin.title} className="h-full" heightClassName="flex-1 min-h-0" />
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">등록된 주보가 아직 없어요.</p>
          )}
          <Link
            href="/community?category=주보"
            onClick={() => setOpen(false)}
            className="shrink-0 text-center text-sm font-medium text-primary hover:underline"
          >
            지난 주보 전체 보기 →
          </Link>
        </DialogContent>
      </Dialog>
    </nav>
  )
}
