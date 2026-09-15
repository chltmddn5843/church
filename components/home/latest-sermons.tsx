import Link from "next/link"
import { getSermons } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { getYoutubeSermons } from "@/lib/youtube"

export async function LatestSermons() {
  const [youtube, sermons] = await Promise.all([getYoutubeSermons("주일예배"), getSermons(undefined, 1)])
  const latest = youtube[0]

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Message"
          title="최근 말씀"
          description="지난 예배의 은혜를 다시 한번 나눕니다."
        />
        {latest ? (
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-xl shadow-primary/10">
            <div className="aspect-video bg-black">
              <iframe src={`https://www.youtube.com/embed/${latest.youtubeId}`} title={latest.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full" />
            </div>
            <div className="p-6 text-center md:p-8">
              <p className="text-sm font-semibold text-primary">{latest.category}</p>
              <h3 className="mt-2 font-serif text-2xl font-bold md:text-3xl">{latest.title}</h3>
            </div>
          </div>
        ) : sermons.length > 0 ? (
          <div className="mx-auto mt-10 max-w-5xl"><SermonCard sermon={sermons[0]} /></div>
        ) : (
          <p className="mt-10 text-center text-muted-foreground">최근 말씀을 불러오지 못했습니다.</p>
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
