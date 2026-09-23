"use client"

import Link from "next/link"
import { useState } from "react"
import { BookOpen, ChevronRight, Church, FileText, Images, Info, MapPin, Sprout, UserPlus } from "lucide-react"
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
  { key: "worship", title: "예배 안내", href: "/worship", icon: Church },
  { key: "newcomer", title: "새가족 안내", href: "/community?category=새가족소개", icon: UserPlus },
  { key: "location", title: "오시는 길", href: "/about#location", icon: MapPin },
  { key: "about", title: "교회 소개", href: "/about", icon: Info },
  { key: "discipleship", title: "제자훈련", href: "/discipleship", icon: BookOpen },
  { key: "next-generation", title: "다음세대", href: "/next-generation", icon: Sprout },
  { key: "gallery", title: "갤러리", href: "/gallery", icon: Images },
] as const

const rowClass = "group flex w-full items-center gap-3 py-3 text-left text-base font-semibold text-foreground transition-colors hover:text-primary"
const iconBadgeClass = "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
const arrowClass = "ml-auto size-4 shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"

export function InfoBlocks({ bulletin }: { bulletin: Bulletin }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A]">Guide</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">바로가기</h2>
      </div>
      <ul className="divide-y divide-border">
        <li>
          <button type="button" onClick={() => setOpen(true)} className={rowClass}>
            <span className={iconBadgeClass}>
              <FileText className="size-5" />
            </span>
            주보
            <ChevronRight className={arrowClass} />
          </button>
        </li>
        {links.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className={rowClass}>
              <span className={iconBadgeClass}>
                <item.icon className="size-5" />
              </span>
              {item.title}
              <ChevronRight className={arrowClass} />
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
    </div>
  )
}
