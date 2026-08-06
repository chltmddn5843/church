import Link from "next/link"
import { getSermons } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { getYoutubeSermons } from "@/lib/youtube"

export async function LatestSermons() {
  const [youtube, sermons] = await Promise.all([getYoutubeSermons(), getSermons(undefined, 1)])
  const latest = youtube[0]

  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Message"
          title="최근 말씀"
          description="지난 예배의 은혜를 다시 한번 나눕니다."
        />
        {latest ? (
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="aspect-video bg-black">
              <iframe src={`https://www.youtube.com/embed/${latest.youtubeId}`} title={latest.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full" />
            </div>
            <div className="p-5 md:p-6"><p className="text-sm font-semibold text-primary">{latest.category}</p><h3 className="mt-2 font-serif text-xl font-bold md:text-2xl">{latest.title}</h3><time className="mt-2 block text-sm text-muted-foreground" dateTime={latest.preachedAt.toISOString()}>{latest.preachedAt.toLocaleDateString("ko-KR")}</time></div>
          </div>
        ) : sermons.length > 0 ? (
          <div className="mx-auto mt-10 max-w-sm"><SermonCard sermon={sermons[0]} /></div>
        ) : (
          <p className="mt-10 text-center text-muted-foreground">최근 말씀을 불러오지 못했습니다.</p>
        )}
        <div className="mt-10 text-center">
          <Button render={<Link href="/sermons" />} nativeButton={false} variant="outline">
            전체 말씀 보기
          </Button>
        </div>
      </div>
    </section>
  )
}
