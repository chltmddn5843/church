import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, ImageIcon, List } from "lucide-react"
import { getGalleryAlbum } from "@/lib/queries"
import { Button } from "@/components/ui/button"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const album = await getGalleryAlbum(Number((await params).id))
  if (!album) return { title: "앨범을 찾을 수 없습니다" }
  return { title: album.title, openGraph: album.photos[0] ? { images: [album.photos[0].imageUrl] } : undefined }
}

export default async function GalleryAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const album = await getGalleryAlbum(Number((await params).id))
  if (!album) notFound()
  const { prev, next } = album

  return (
    <article className="py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <Button render={<Link href="/gallery" />} nativeButton={false} variant="ghost" size="sm" className="mb-6">
          <>
            <ArrowLeft className="mr-1 h-4 w-4" />
            목록으로
          </>
        </Button>

        <p className="text-sm font-semibold text-primary">갤러리</p>
        <h1 className="mt-2 text-balance break-keep font-serif text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">{album.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(album.createdAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}
          </span>
          <span className="flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4" />
            사진 {album.photos.length}장
          </span>
        </div>

        {album.description && <div className="mt-8 whitespace-pre-line leading-relaxed text-foreground">{album.description}</div>}
        <div className="mt-8 space-y-4">
          {album.photos.map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- R2 files of unknown size, images are unoptimized anyway
            <img key={photo.id} src={photo.imageUrl} alt={`${album.title} 사진 ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} className="mx-auto h-auto w-full bg-muted" />
          ))}
        </div>

        {(next || prev) && (
          <div className="mt-12 divide-y divide-border border border-border">
            {next && (
              <Link href={`/gallery/${next.id}`} className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-secondary">
                <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                <span className="shrink-0 font-medium text-muted-foreground">다음 앨범</span>
                <span className="truncate text-foreground">{next.title}</span>
              </Link>
            )}
            {prev && (
              <Link href={`/gallery/${prev.id}`} className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-secondary">
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                <span className="shrink-0 font-medium text-muted-foreground">이전 앨범</span>
                <span className="truncate text-foreground">{prev.title}</span>
              </Link>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Button render={<Link href="/gallery" />} nativeButton={false} variant="outline">
            <>
              <List className="mr-1.5 size-4" /> 목록으로
            </>
          </Button>
        </div>
      </div>
    </article>
  )
}
