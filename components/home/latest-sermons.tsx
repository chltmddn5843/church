import Link from "next/link"
import { getSermons } from "@/lib/queries"
import { SermonCard } from "@/components/sermon-card"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"

export async function LatestSermons() {
  const sermons = await getSermons(undefined, 3)

  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Message"
          title="최근 말씀"
          description="지난 예배의 은혜를 다시 한번 나눕니다."
        />
        {sermons.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sermons.map((s) => (
              <SermonCard key={s.id} sermon={s} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-muted-foreground">등록된 설교가 없습니다.</p>
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
