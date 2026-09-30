import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getGalleryAlbums, getPosts } from "@/lib/queries"
import { AlbumCarousel } from "@/components/home/album-carousel"

const NEWS_COUNT = 6
const ALBUM_COUNT = 9

// "YYYY-MM-DD" in church time regardless of the server's zone.
const ymd = (d: Date) => new Date(d).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })

const CATEGORY_COLOR: Record<string, string> = {
  공지사항: "text-[#B42318]",
  교회소식: "text-primary",
  주보: "text-[#4A3AA8]",
  새가족소개: "text-[#1F7A4D]",
  "봉사 섬김이": "text-[#A8325E]",
  가정예배순서지: "text-[#0F6E78]",
  자료실: "text-muted-foreground",
}

const moreLink =
  "flex min-h-11 items-center gap-0.5 text-sm font-semibold text-primary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

export async function ChurchNews() {
  const [posts, albums] = await Promise.all([getPosts(undefined, NEWS_COUNT), getGalleryAlbums(ALBUM_COUNT)])

  return (
    <section className="py-20 md:py-28">
      <div className="scroll-reveal mx-auto grid max-w-6xl grid-cols-1 gap-14 px-4 lg:max-w-[1360px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16 lg:px-6">
        <div>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">News</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">최근 소식</h2>
            </div>
            <Link href="/community" className={moreLink}>
              더보기 <ChevronRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {posts.length > 0 ? (
              posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/community/${post.id}`}
                    className="group flex min-h-14 items-center gap-3 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className={`shrink-0 text-sm font-semibold ${CATEGORY_COLOR[post.category] ?? "text-primary"}`}>[{post.category}]</span>
                    <span className="min-w-0 flex-1 truncate text-foreground transition-colors group-hover:text-primary">{post.title}</span>
                    <time dateTime={ymd(post.createdAt)} className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {ymd(post.createdAt).slice(5)}
                    </time>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-10 text-center text-sm text-muted-foreground">아직 등록된 소식이 없습니다.</li>
            )}
          </ul>
        </div>

        <div>
          <AlbumCarousel
            items={albums.flatMap((a) => (a.coverUrl ? [{ id: a.id, title: a.title, imageUrl: a.coverUrl, date: ymd(a.createdAt).replaceAll("-", ".") }] : []))}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Album</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">교회 앨범</h2>
          </AlbumCarousel>
          <Link href="/gallery" className={`${moreLink} mt-2 inline-flex`}>
            사진 더보기 <ChevronRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
