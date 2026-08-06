import type { Metadata } from "next"
import { getSermons } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { SermonFilter } from "@/components/sermon-filter"
import { PageBanner } from "@/components/page-banner"
import { getYoutubeSermons } from "@/lib/youtube"

export const metadata: Metadata = {
  title: "말씀과 찬양",
  description: "원당교회 주일예배, 금요예배, 새벽예배 설교 말씀을 만나보세요.",
}

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const sermons = await getSermons(category)
  const youtube = await getYoutubeSermons(category)
  const videos = youtube.filter(item => !sermons.some(sermon => sermon.youtubeId === item.youtubeId))

  return (
    <>
      <PageBanner title="말씀과 찬양" subtitle="선포된 하나님의 말씀으로 은혜를 나눕니다." />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SermonFilter active={category} />
          {sermons.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((s) => (
                <SermonCard key={s.id} sermon={s} />
              ))}
            </div>
          ) : (
            videos.length === 0 && <p className="mt-16 text-center text-muted-foreground">해당 분류의 설교가 아직 없습니다.</p>
          )}
          {videos.length > 0 && <><h2 className="mt-14 text-2xl font-bold">원당교회 YouTube 최신 영상</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{videos.map((video, index) => <SermonCard key={video.youtubeId} href={`https://www.youtube.com/watch?v=${video.youtubeId}`} sermon={{ id: -index - 1, title: video.title, preacher: "양승철", scripture: null, category: video.category, youtubeId: video.youtubeId, preachedAt: video.preachedAt }}/>)}</div></>}
        </div>
      </section>
    </>
  )
}
