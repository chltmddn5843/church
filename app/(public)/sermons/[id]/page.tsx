import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSermon } from "@/lib/queries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const sermon = await getSermon(Number(id))
  if (!sermon) return { title: "설교를 찾을 수 없습니다" }
  return { title: sermon.title, description: sermon.summary ?? undefined }
}

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sermon = await getSermon(Number(id))
  if (!sermon) notFound()

  return (
    <article className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Button render={<Link href="/sermons" />} nativeButton={false} variant="ghost" size="sm" className="mb-6">
          <>
            <ArrowLeft className="mr-1 h-4 w-4" />
            목록으로
          </>
        </Button>

        <Badge variant="secondary">{sermon.category}</Badge>
        <h1 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
          {sermon.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {sermon.preacher} 목사
          </span>
          {sermon.scripture && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {sermon.scripture}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(sermon.preachedAt).toLocaleDateString("ko-KR")}
          </span>
        </div>

        {sermon.youtubeId ? (
          <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${sermon.youtubeId}`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-secondary text-muted-foreground">
            영상이 준비 중입니다.
          </div>
        )}

        {sermon.summary && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-lg font-bold text-foreground">말씀 요약</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{sermon.summary}</p>
          </div>
        )}
      </div>
    </article>
  )
}
