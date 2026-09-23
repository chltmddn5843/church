import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getSermons } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { getYoutubeSermons } from "@/lib/youtube"
import { VideoFacade } from "@/components/home/video-facade"

const OTHER_CATEGORIES = ["금요예배", "새벽예배", "쉐키나찬양단"] as const
const RECENT_COUNT = 5

const fmt = (d: Date) => d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\.\s?/g, "-").replace(/-$/, "")

export async function FeaturedSermons() {
  const [sundayVideos, otherVideos, sermons] = await Promise.all([
    getYoutubeSermons("주일예배"),
    Promise.all(OTHER_CATEGORIES.map((category) => getYoutubeSermons(category))),
    getSermons(undefined, 1),
  ])
  const latest = sundayVideos[0]
  // At most 2 per category so one busy playlist (e.g. 3부 찬양 uploads) doesn't fill the list.
  const perCategory = new Map<string, number>()
  const recent = [...sundayVideos.slice(1), ...otherVideos.flat()]
    .sort((a, b) => b.preachedAt.getTime() - a.preachedAt.getTime())
    .filter((v) => perCategory.set(v.category, (perCategory.get(v.category) ?? 0) + 1).get(v.category)! <= 2)
    .slice(0, RECENT_COUNT)

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6A2C]">Message</p>
      <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">말씀 다시보기</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10">
        {latest ? (
          <div className="aspect-video overflow-hidden rounded-md bg-black shadow-xl shadow-primary/15">
            <VideoFacade youtubeId={latest.youtubeId} title={latest.title}>
              <span className="block text-sm font-semibold tabular-nums text-[#E0C48A]">
                {latest.category} · {fmt(latest.preachedAt)}
              </span>
              <span className="mt-2 block break-keep font-serif text-2xl font-bold leading-snug text-white md:text-4xl">{latest.title}</span>
              {(latest.preacher || latest.scripture) && (
                <span className="mt-2 block text-sm text-white/85 md:text-base">
                  {[latest.preacher, latest.scripture].filter(Boolean).join(" / ")}
                </span>
              )}
            </VideoFacade>
          </div>
        ) : sermons.length > 0 ? (
          <SermonCard sermon={sermons[0]} />
        ) : (
          <p className="text-muted-foreground">최근 말씀을 불러오지 못했습니다.</p>
        )}

        {recent.length > 0 && (
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-foreground">최근 올라온 말씀</h3>
            <ul className="mt-2 divide-y divide-border">
              {recent.map((video) => (
                <li key={video.youtubeId}>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <p className="text-xs tabular-nums">
                      <span className="font-semibold text-primary">{video.category}</span>
                      <span className="ml-2 text-muted-foreground">{fmt(video.preachedAt)}</span>
                    </p>
                    <p className="mt-1 line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-primary">{video.title}</p>
                    {(video.preacher || video.scripture) && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{[video.preacher, video.scripture].filter(Boolean).join(" · ")}</p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/sermons"
              className="group mt-auto inline-flex min-h-6 items-center gap-1 pt-3 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              말씀 전체 보기 <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
