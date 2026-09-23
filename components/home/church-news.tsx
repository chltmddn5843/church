import Image from "next/image"
import Link from "next/link"
import { getPosts } from "@/lib/queries"
import { ChevronRight } from "lucide-react"

const NEWS_CATEGORIES = [
  { category: "공지사항", image: "/images/gallery-2.png" },
  { category: "교회소식", image: "/images/gallery-4.png" },
  { category: "새가족소개", image: "/images/gallery-3.png" },
  { category: "봉사 섬김이", image: "/images/hero-worship.jpg" },
] as const
const POSTS_PER_CATEGORY = 5

export async function ChurchNews() {
  const results = await Promise.all(NEWS_CATEGORIES.map((c) => getPosts(c.category, POSTS_PER_CATEGORY)))
  const groups = NEWS_CATEGORIES.map((c, i) => ({ ...c, posts: results[i] }))

  return (
    <section className="py-14 md:py-20">
      <div className="scroll-reveal mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6A2C]">News</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">교회 소식</h2>
          </div>
          <Link href="/community" className="flex min-h-6 items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            전체 소식 <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(({ category, image, posts }) => (
            <div key={category} className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
              <div className="relative h-28 shrink-0">
                <Image src={image} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <span className="absolute bottom-3 left-4 text-base font-bold text-white">{category}</span>
              </div>
              <ul className="flex-1 divide-y divide-border">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/community/${post.id}`}
                        title={post.title}
                        className="group flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                      >
                        <time
                          dateTime={new Date(post.createdAt).toISOString()}
                          className="shrink-0 tabular-nums text-xs font-medium text-muted-foreground"
                        >
                          {new Date(post.createdAt).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}
                        </time>
                        <span className="truncate text-foreground transition-colors group-hover:text-primary">{post.title}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-5 py-6 text-center text-xs text-muted-foreground">아직 등록된 소식이 없습니다.</li>
                )}
              </ul>
              <Link
                href={`/community?category=${encodeURIComponent(category)}`}
                className="flex items-center justify-center gap-0.5 border-t border-border px-5 py-3 text-xs font-semibold text-primary transition hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                {category} 더보기 <ChevronRight aria-hidden className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
