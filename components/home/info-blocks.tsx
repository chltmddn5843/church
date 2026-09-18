"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { FileText } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BulletinPdfViewer } from "@/components/bulletin-pdf-viewer-loader"
import { BulletinImageViewer } from "@/components/bulletin-image-viewer"

type Bulletin = {
  id: number
  title: string
  pdf: { url: string; name: string } | null
  images: { url: string; name: string }[]
} | null

const blocks = [
  { key: "worship", title: "예배 안내", image: "/images/worship-sermon.jpg", href: "/worship" },
  { key: "newcomer", title: "새가족 안내", image: "/images/gallery-3.png", href: "/community?category=새가족소개" },
  { key: "location", title: "오시는 길", image: "/images/church-exterior.png", href: "/about#location" },
  { key: "about", title: "교회 소개", image: "/images/wd-pastor.jpg", href: "/about" },
  { key: "discipleship", title: "제자훈련", image: "/images/discipleship.png", href: "/discipleship" },
  { key: "next-generation", title: "다음세대", image: "/images/next-generation.jpg", href: "/next-generation" },
  { key: "gallery", title: "갤러리", image: "/images/gallery-1.jpg", href: "/gallery" },
] as const

const blockClass =
  "group relative flex h-56 items-end overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl focus-visible:shadow-xl"
const imageClass = "object-cover transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110"
const overlayClass = "absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
const labelClass = "relative z-10 w-full px-5 py-5 text-center text-lg font-bold text-white"

export function InfoBlocks({ bulletin }: { bulletin: Bulletin }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="bg-secondary/50 py-16 md:py-20">
      <div className="scroll-reveal mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Guide" title="바로가기" description="원당교회의 안내와 소식을 한 곳에서 확인하세요." />
        <div className="mt-10 space-y-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative flex h-64 w-full items-end overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl focus-visible:shadow-xl md:h-72"
          >
            <Image src="/images/cross-light.png" alt="" fill className={imageClass} />
            <div className={overlayClass} />
            <span className="relative z-10 w-full px-6 py-6 text-center text-2xl font-bold text-white md:text-3xl">주보</span>
          </button>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {blocks.map((b) => (
              <Link key={b.key} href={b.href} className={blockClass}>
                <Image src={b.image} alt="" fill className={imageClass} />
                <div className={overlayClass} />
                <span className={labelClass}>{b.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
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
    </section>
  )
}
