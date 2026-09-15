import Link from "next/link"
import { Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Sermon = {
  id: number
  title: string
  preacher: string
  scripture: string | null
  category: string
  youtubeId: string | null
  preachedAt: Date
}

function thumb(youtubeId: string | null) {
  return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "/images/cross-light.png"
}

export function SermonCard({ sermon, href }: { sermon: Sermon, href?: string }) {
  return (
    <Link
      href={href ?? `/sermons/${sermon.id}`}
      target={href ? "_blank" : undefined}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb(sermon.youtubeId) || "/placeholder.svg"}
          alt={sermon.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="secondary" className="w-fit">
          {sermon.category}
        </Badge>
        <h3 className="mt-3 line-clamp-2 font-serif text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {sermon.title}
        </h3>
        {sermon.scripture && <p className="mt-1 text-sm text-primary">{sermon.scripture}</p>}
      </div>
    </Link>
  )
}
