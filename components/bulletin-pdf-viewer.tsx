import { Download, ExternalLink } from "lucide-react"

export function BulletinPdfViewer({ url, title }: { url: string; title: string }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/60 px-4 py-3">
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
      <iframe
        src={`${url}#toolbar=0&view=FitH`}
        title={title}
        className="h-[80vh] w-full bg-muted/30 md:h-[85vh]"
        loading="lazy"
      />
      <p className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
        카카오톡 등 인앱 브라우저에서는 미리보기가 보이지 않을 수 있어요. 그럴 땐 위의 &apos;새 창&apos; 버튼을 눌러주세요.
      </p>
    </div>
  )
}
