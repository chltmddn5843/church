import { Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export function BulletinImageViewer({
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

      <div className={cn("overflow-y-auto bg-muted/30 p-2 md:p-4", heightClassName)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic upload URL, natural size varies per bulletin */}
        <img src={url} alt={title} className="mx-auto h-auto w-full rounded-lg object-contain shadow-sm" />
      </div>
    </div>
  )
}
