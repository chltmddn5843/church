import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ImageIcon } from "lucide-react"
import { getGalleryAlbumCount, getGalleryAlbums } from "@/lib/queries"
import { PageBanner } from "@/components/page-banner"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { getSessionUser } from "@/lib/session"

const PAGE_SIZE = 12

export const metadata: Metadata = {
  title: "갤러리",
  description: "원당교회의 소중한 순간들을 사진으로 만나보세요.",
}

// "YYYY.MM.DD" in church time regardless of the server's zone.
const ymd = (d: Date) => new Date(d).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }).replaceAll("-", ".")

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const [albums, total, user] = await Promise.all([
    getGalleryAlbums(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getGalleryAlbumCount(),
    getSessionUser(),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <PageBanner title="갤러리" subtitle="원당교회의 소중한 순간들" image="/images/gallery-1.jpg" />
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <p className="text-sm text-muted-foreground">앨범 {total.toLocaleString("ko-KR")}개</p>
            {user?.role === "admin" && <Button render={<Link href="/admin/gallery" />} nativeButton={false}>앨범 등록</Button>}
          </div>
          {albums.length === 0 ? (
            <p className="border-y border-border py-16 text-center text-muted-foreground">등록된 앨범이 없습니다.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {albums.map((album) => (
                <li key={album.id}>
                  <Link href={`/gallery/${album.id}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <span className="relative block aspect-[4/3] overflow-hidden bg-muted">
                      {album.coverUrl && (
                        <Image
                          src={album.coverUrl}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                        />
                      )}
                      <span className="absolute bottom-0 right-0 flex items-center gap-1 bg-foreground/70 px-2 py-1 text-xs tabular-nums text-white">
                        <ImageIcon aria-hidden className="size-3.5" />
                        <span className="sr-only">사진</span>{album.photoCount}
                      </span>
                    </span>
                    <span className="mt-3 line-clamp-2 break-keep font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">{album.title}</span>
                    <time dateTime={ymd(album.createdAt).replaceAll(".", "-")} className="mt-1 block text-sm tabular-nums text-muted-foreground">{ymd(album.createdAt)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Pagination page={page} totalPages={totalPages} hrefFor={(p) => (p > 1 ? `/gallery?page=${p}` : "/gallery")} />
        </div>
      </section>
    </>
  )
}
