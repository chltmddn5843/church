import Image from "next/image"
import Link from "next/link"
import { getPosts } from "@/lib/queries"
import { SectionHeading } from "@/components/section-heading"
import { cn } from "@/lib/utils"

const NEWS_CATEGORIES = [
  { category: "공지사항", tag: "공지", image: "/images/gallery-2.png", textClass: "text-red-700" },
  { category: "교회소식", tag: "소식", image: "/images/gallery-4.png", textClass: "text-blue-700" },
  { category: "새가족소개", tag: "새가족", image: "/images/gallery-3.png", textClass: "text-emerald-700" },
  { category: "봉사 섬김이", tag: "섬김이", image: "/images/hero-worship.jpg", textClass: "text-pink-700" },
] as const
const POSTS_PER_CATEGORY = 5

export async function ChurchNews() {
  const results = await Promise.all(NEWS_CATEGORIES.map((c) => getPosts(c.category, POSTS_PER_CATEGORY)))
  const groups = NEWS_CATEGORIES.map((c, i) => ({ ...c, posts: results[i] }))

  return (
    <section className="py-10">
      <div className="scroll-reveal mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
        <SectionHeading eyebrow="News" title="교회 소식" description="원당교회의 최근 소식을 확인하세요." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(({ category, tag, image, textClass, posts }) => (
            <div key={category} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
                        className="flex items-center gap-2 px-5 py-3 text-sm transition hover:bg-secondary/60"
                      >
                        <time
                          dateTime={new Date(post.createdAt).toISOString()}
                          className="shrink-0 tabular-nums text-xs font-medium text-muted-foreground"
                        >
                          {new Date(post.createdAt).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}
                        </time>
                        <span className={cn("shrink-0 text-xs font-bold", textClass)}>[{tag}]</span>
                        <span className="truncate text-foreground">{post.title}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-5 py-6 text-center text-xs text-muted-foreground">아직 등록된 소식이 없습니다.</li>
                )}
              </ul>
              <Link
                href={`/community?category=${encodeURIComponent(category)}`}
                className="block border-t border-border px-5 py-3 text-center text-xs font-semibold text-primary transition hover:bg-secondary/60"
              >
                더보기 →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
