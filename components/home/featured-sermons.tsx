import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
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
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Message</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">말씀 다시보기</h2>
        </div>
        <Link
          href="/sermons"
          className="group flex min-h-11 items-center gap-1 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          말씀 전체 보기 <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10">
        {latest ? (
          <div className="aspect-video overflow-hidden bg-black shadow-xl shadow-primary/15">
            <VideoFacade youtubeId={latest.youtubeId} title={latest.title}>
              <span className="block text-sm font-semibold tabular-nums text-brand-light">
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
          // On lg the list leaves the flow so the row height is the video's; five equal rows then line up top and bottom with it.
          <div className="relative">
            <h3 className="sr-only">최근 올라온 말씀</h3>
            <ol className="divide-y divide-border lg:absolute lg:inset-0 lg:grid lg:grid-rows-5">
              {recent.map((video, i) => (
                <li key={video.youtubeId} className="min-h-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-3 py-2.5 pr-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-4"
                  >
                    <span aria-hidden className="w-7 shrink-0 text-xl font-bold tabular-nums text-primary/30 transition-colors group-hover:text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden bg-muted sm:w-32">
                      {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail, unoptimized images */}
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm tabular-nums">
                        <span className="font-semibold text-primary">{video.category}</span>
                        <span className="ml-2 text-muted-foreground">{fmt(video.preachedAt)}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 break-keep text-sm font-semibold text-foreground transition-colors group-hover:text-primary md:text-base lg:text-sm xl:text-base">
                        {video.title}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
