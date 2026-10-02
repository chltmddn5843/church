"use client"

import Link from "next/link"
import { useState } from "react"
import { BookOpen, Church, Clock, FileText, HandHeart, Images, List, MapPin, UserPlus, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BulletinViewer, toolbarButtonClass } from "@/components/bulletin-viewer"
import { cn } from "@/lib/utils"

type Bulletin = {
  id: number
  title: string
  pdf: { url: string; name: string } | null
  images: { url: string; name: string }[]
} | null

const links = [
  { key: "worship", title: "예배 안내", href: "/worship", Icon: Clock },
  { key: "newcomer", title: "새가족 안내", href: "/community?category=새가족소개", Icon: UserPlus },
  { key: "location", title: "오시는 길", href: "/about#location", Icon: MapPin },
  { key: "about", title: "교회 소개", href: "/about", Icon: Church },
  { key: "discipleship", title: "제자훈련", href: "/discipleship", Icon: BookOpen },
  { key: "offering", title: "스마트 헌금", href: "/offering", Icon: HandHeart },
  { key: "gallery", title: "갤러리", href: "/gallery", Icon: Images },
] as const

// White card bar that overlaps the bottom of the hero: 4×2 on mobile, one row of 8 on web.
const tileClass =
  "group flex h-full w-full flex-col items-center justify-center gap-2 bg-card px-2 py-5 text-center text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary md:py-7"
const iconClass = "size-6 text-brand transition-colors group-hover:text-white md:size-7"
const labelClass = "break-keep text-sm font-semibold md:text-base"

export function InfoBlocks({ bulletin }: { bulletin: Bulletin }) {
  const [open, setOpen] = useState(false)
  const hasBulletin = bulletin && (bulletin.pdf || bulletin.images.length > 0)

  return (
    <nav aria-label="바로가기" className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 md:-mt-24 lg:max-w-[1360px] lg:px-6">
      <ul className="grid grid-cols-4 gap-px border border-border bg-border shadow-xl shadow-black/10 lg:grid-cols-8">
        <li>
          <button type="button" onClick={() => setOpen(true)} className={tileClass}>
            <FileText aria-hidden className={iconClass} />
            <span className={labelClass}>주보</span>
          </button>
        </li>
        {links.map(({ key, title, href, Icon }) => (
          <li key={key}>
            <Link href={href} className={tileClass}>
              <Icon aria-hidden className={iconClass} />
              <span className={labelClass}>{title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        {hasBulletin ? (
          // Full screen so the bulletin gets every pixel; the viewer's own toolbar doubles as the dialog header.
          <DialogContent
            showCloseButton={false}
            className="inset-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0 ring-0 sm:max-w-none"
          >
            <DialogTitle className="sr-only">{bulletin.title}</DialogTitle>
            <BulletinViewer title={bulletin.title} pdf={bulletin.pdf} images={bulletin.images} className="min-h-0 flex-1">
              <Link href="/community?category=주보" onClick={() => setOpen(false)} aria-label="지난 주보 전체 보기" className={toolbarButtonClass}>
                <List className="size-4" aria-hidden /> <span className="hidden sm:inline">지난 주보</span>
              </Link>
              <DialogClose aria-label="닫기" className={cn(toolbarButtonClass, "sm:w-9 sm:px-0")}>
                <X className="size-5" aria-hidden />
              </DialogClose>
            </BulletinViewer>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-xl font-semibold">
                <FileText className="size-5" aria-hidden />
                주보
              </DialogTitle>
            </DialogHeader>
            <p className="py-6 text-center text-sm text-muted-foreground">등록된 주보가 아직 없어요.</p>
            <Link href="/community?category=주보" onClick={() => setOpen(false)} className="text-center text-sm font-medium text-primary hover:underline">
              지난 주보 전체 보기 →
            </Link>
          </DialogContent>
        )}
      </Dialog>
    </nav>
  )
}
