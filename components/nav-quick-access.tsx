"use client"

import Link from "next/link"
import { CalendarClock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BulletinPdfViewer } from "@/components/bulletin-pdf-viewer-loader"
import { WorshipSchedule } from "@/components/worship-schedule"

type Bulletin = {
  id: number
  title: string
  pdf: { url: string; name: string } | null
} | null

export function NavQuickAccess({
  bulletin,
  className = "flex items-center gap-1",
  triggerClassName = "text-white hover:bg-[#2F5D8A]",
}: {
  bulletin: Bulletin
  className?: string
  triggerClassName?: string
}) {
  const triggerClass = cn("flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors", triggerClassName)

  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger render={<button type="button" className={triggerClass} />}>
          <CalendarClock className="size-4" aria-hidden />
          예배 안내
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">예배 안내</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <WorshipSchedule />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<button type="button" className={triggerClass} />}>
          <FileText className="size-4" aria-hidden />
          주보
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">{bulletin?.title ?? "주보"}</DialogTitle>
          </DialogHeader>
          {bulletin?.pdf ? (
            <BulletinPdfViewer url={bulletin.pdf.url} title={bulletin.pdf.name} />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">등록된 주보가 아직 없어요.</p>
          )}
          <Link href="/community?category=주보" className="text-center text-sm font-medium text-primary hover:underline">
            지난 주보 전체 보기 →
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  )
}
