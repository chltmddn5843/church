import type { Metadata } from "next"
import { getSermons, getSermonsCount } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { SermonFilter } from "@/components/sermon-filter"
import { PageBanner } from "@/components/page-banner"
import { Pagination } from "@/components/pagination"
import { getYoutubeSermons } from "@/lib/youtube"

const PAGE_SIZE = 12

export const metadata: Metadata = {
  title: "말씀과 찬양",
  description: "원당교회 주일예배, 금요예배, 새벽예배 설교 말씀을 만나보세요.",
}

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const [sermons, total] = await Promise.all([
    getSermons(category, PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getSermonsCount(category),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const youtube = page === 1 ? await getYoutubeSermons(category) : []
  const videos = youtube.filter(item => !sermons.some(sermon => sermon.youtubeId === item.youtubeId))

  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (p > 1) params.set("page", String(p))
    const qs = params.toString()
    return qs ? `/sermons?${qs}` : "/sermons"
  }

  return (
    <>
      <PageBanner title="말씀과 찬양" subtitle="선포된 하나님의 말씀으로 은혜를 나눕니다." />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SermonFilter active={category} />
          {sermons.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((s) => (
                <SermonCard key={s.id} sermon={s} category={category} />
              ))}
            </div>
          ) : (
            videos.length === 0 && <p className="mt-16 text-center text-muted-foreground">해당 분류의 설교가 아직 없습니다.</p>
          )}
          <Pagination page={page} totalPages={totalPages} hrefFor={pageHref} />
          {videos.length > 0 && <><h2 className="mt-14 text-2xl font-bold">원당교회 YouTube 최신 영상</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{videos.map((video, index) => <SermonCard key={video.youtubeId} href={`https://www.youtube.com/watch?v=${video.youtubeId}`} sermon={{ id: -index - 1, title: video.title, preacher: "양승철", scripture: video.scripture, category: video.category, youtubeId: video.youtubeId, preachedAt: video.preachedAt }}/>)}</div></>}
        </div>
      </section>
    </>
  )
}
