import Link from "next/link"
import { Play } from "lucide-react"
import { getSermons } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
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
    <section className="bg-background py-16 md:py-24">
      <div className="scroll-reveal mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Message"
          title="최근 말씀"
          description="지난 예배의 은혜를 다시 한번 나눕니다."
        />
        {latest ? (
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/10">
            <div className="aspect-video bg-black">
              <iframe src={`https://www.youtube.com/embed/${latest.youtubeId}`} title={latest.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full" />
            </div>
            <div className="p-6 text-center md:p-8">
              <h3 className="font-serif text-2xl font-bold md:text-3xl">{latest.title}</h3>
              {latest.scripture && <p className="mt-2 text-sm text-primary">{latest.scripture}</p>}
            </div>
          </div>
        ) : sermons.length > 0 ? (
          <div className="mx-auto mt-10 max-w-5xl"><SermonCard sermon={sermons[0]} /></div>
        ) : (
          <p className="mt-10 text-center text-muted-foreground">최근 말씀을 불러오지 못했습니다.</p>
        )}

        {recent.length > 0 && (
          <div className="mx-auto mt-6 grid max-w-5xl gap-4 sm:grid-cols-3">
            {recent.map((video) => (
              <a
                key={video.youtubeId}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail, unoptimized images */}
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition group-hover:opacity-100">
                    <Play aria-hidden className="size-8 fill-white text-white" />
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-primary">{video.category}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">{video.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{video.preachedAt.toLocaleDateString("ko-KR")}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mx-auto mt-10 max-w-5xl text-center">
          <Button
            render={<Link href="/sermons" />}
            nativeButton={false}
            variant="outline"
            className="h-14 w-full rounded-2xl border-primary/25 bg-white/80 text-base font-semibold text-primary shadow-sm hover:bg-white"
          >
            전체 말씀 보기
          </Button>
        </div>
      </div>
    </section>
  )
}
