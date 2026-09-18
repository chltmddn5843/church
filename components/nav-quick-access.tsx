"use client"

import Link from "next/link"
import { CalendarClock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BulletinPdfViewer } from "@/components/bulletin-pdf-viewer-loader"
import { BulletinImageViewer } from "@/components/bulletin-image-viewer"
import { WorshipSchedule } from "@/components/worship-schedule"

type Bulletin = {
  id: number
  title: string
  file: { url: string; name: string; contentType: string } | null
} | null

export function NavQuickAccess({
  bulletin,
  className = "flex items-center gap-1",
  triggerClassName = "text-white hover:bg-ring",
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
        <DialogContent className="flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden sm:max-w-2xl md:max-w-3xl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="font-serif text-xl font-bold">예배 안내</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <WorshipSchedule />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<button type="button" className={triggerClass} />}>
          <FileText className="size-4" aria-hidden />
          주보
        </DialogTrigger>
        <DialogContent className="flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="font-serif text-xl font-bold">{bulletin?.title ?? "주보"}</DialogTitle>
          </DialogHeader>
          {bulletin?.file ? (
            <div className="min-h-0 flex-1">
              {bulletin.file.contentType === "application/pdf" ? (
                <BulletinPdfViewer url={bulletin.file.url} title={bulletin.file.name} className="h-full" heightClassName="flex-1 min-h-0" />
              ) : (
                <BulletinImageViewer url={bulletin.file.url} title={bulletin.file.name} className="h-full" heightClassName="flex-1 min-h-0" />
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">등록된 주보가 아직 없어요.</p>
          )}
          <Link href="/community?category=주보" className="shrink-0 text-center text-sm font-medium text-primary hover:underline">
            지난 주보 전체 보기 →
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  )
}
