import Link from "next/link"
import { ArrowUpRight, ChevronRight, Play } from "lucide-react"
import { getSermons } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { getYoutubeSermons } from "@/lib/youtube"

const OTHER_CATEGORIES = ["금요예배", "새벽예배", "쉐키나찬양단"] as const

export async function FeaturedSermons() {
  const [sundayVideos, otherVideos, sermons] = await Promise.all([
    getYoutubeSermons("주일예배"),
    Promise.all(OTHER_CATEGORIES.map((category) => getYoutubeSermons(category))),
    getSermons(undefined, 1),
  ])
  const latest = sundayVideos[0]
  const recent = otherVideos.map((videos) => videos[0]).filter((video): video is NonNullable<typeof video> => video !== undefined)

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A]">Message</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">최근 말씀</h2>
        </div>
        <Link href="/sermons" className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          전체 말씀 <ChevronRight className="size-4" />
        </Link>
      </div>
      {latest ? (
        <div className="mt-6">
          <div className="aspect-video overflow-hidden rounded-md bg-black">
            <iframe src={`https://www.youtube.com/embed/${latest.youtubeId}`} title={latest.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold leading-snug text-foreground md:text-xl">{latest.title}</h3>
            {latest.scripture && <p className="mt-1 text-sm text-muted-foreground">{latest.scripture}</p>}
          </div>
        </div>
      ) : sermons.length > 0 ? (
        <div className="mt-6"><SermonCard sermon={sermons[0]} /></div>
      ) : (
        <p className="mt-6 text-center text-muted-foreground">최근 말씀을 불러오지 못했습니다.</p>
      )}

      {recent.length > 0 && (
        <>
          <div className="mt-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A]">Worship Video</p>
              <h3 className="mt-0.5 text-lg font-bold text-foreground md:text-xl">최근 예배 영상</h3>
            </div>
            <a
              href="https://www.youtube.com/@wondang1964"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              유튜브 채널 <ChevronRight className="size-4" />
            </a>
          </div>
          <ol className="mt-4 space-y-1">
            {recent.map((video, i) => (
              <li key={video.youtubeId} className="scroll-reveal">
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -mx-3 flex items-center gap-4 rounded-md p-3 transition-colors hover:bg-muted/70 sm:gap-6"
                >
                  <span className="hidden w-8 shrink-0 font-serif text-2xl font-bold tabular-nums text-primary/25 transition-colors group-hover:text-primary sm:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md bg-muted sm:w-48">
                    {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail, unoptimized images */}
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                      <Play aria-hidden className="size-6 fill-white text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#C9A15A]">{video.category}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">{video.title}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{video.preachedAt.toLocaleDateString("ko-KR")}</p>
                  </div>
                  <ArrowUpRight aria-hidden className="hidden size-5 shrink-0 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
