import type { Metadata } from "next"
import Link from "next/link"
import { Eye, ExternalLink, User } from "lucide-react"
import { createPost } from "@/app/actions/posts"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import { cn } from "@/lib/utils"
import { getPosts, getPostsCount } from "@/lib/queries"
import { getSessionUser } from "@/lib/session"

const PAGE_SIZE = 15

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "원당교회의 공지사항, 교회소식, 새가족소개와 봉사 섬김이 신청을 확인하세요.",
}

const categories = ["전체", "공지사항", "교회소식", "주보", "새가족소개", "가정예배순서지", "봉사 섬김이", "자료실", "정관", "조직표"]
const serviceFormUrl = "https://forms.gle/AmDQV5ukLCm3x5gV6"

function externalUrl(content: string) {
  const match = content.trim().match(/https?:\/\/[^\s]+|forms\.gle\/[^\s]+/)
  if (!match) return null
  return match[0].startsWith("http") ? match[0] : `https://${match[0]}`
}

function excerpt(content: string, max = 70) {
  const clean = content.replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

const NEW_WINDOW_MS = 3 * 24 * 60 * 60 * 1000
function isNewPost(createdAt: Date) {
  return Date.now() - new Date(createdAt).getTime() < NEW_WINDOW_MS
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page: pageParam } = await searchParams
  const selected = category && categories.includes(category) ? category : undefined
  const page = Math.max(1, Number(pageParam) || 1)
  const [posts, total] = await Promise.all([
    getPosts(selected, PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getPostsCount(selected),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const user = await getSessionUser()
  const visiblePosts =
    selected === "봉사 섬김이" && page === 1
      ? [
          {
            id: -1,
            title: "봉사 섬김이 신청서",
            content: serviceFormUrl,
            category: "봉사 섬김이",
            authorName: "관리자",
            pinned: true,
            views: 0,
            createdAt: new Date(),
          },
          ...posts,
        ]
      : posts

  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (selected) params.set("category", selected)
    if (p > 1) params.set("page", String(p))
    const qs = params.toString()
    return qs ? `/community?${qs}` : "/community"
  }

  return (
    <>
      <PageBanner title="커뮤니티" subtitle="원당교회의 소식과 나눔을 확인하세요." />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-sm" aria-label="커뮤니티 게시판">
            <div className="flex min-w-max gap-2">
              {categories.map((cat) => {
                const isActive = (cat === "전체" && !selected) || cat === selected
                const href = cat === "전체" ? "/community" : `/community?category=${encodeURIComponent(cat)}`
                return (
                  <Link
                    key={cat}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex h-12 items-center justify-center rounded-2xl px-6 text-center text-base font-semibold transition-all active:scale-[0.98] active:bg-white/40",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-white/40 text-foreground hover:bg-secondary hover:text-primary",
                    )}
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
          </nav>

          {user?.role === "admin" && selected === "새가족소개" && (
            <details className="mt-6 rounded-xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold text-primary">새가족소개 글쓰기</summary>
              <form action={createPost} className="mt-5 grid gap-3">
                <input type="hidden" name="category" value="새가족소개" />
                <input type="hidden" name="visibility" value="public" />
                <input type="hidden" name="returnTo" value="/community?category=새가족소개" />
                <input name="title" required placeholder="제목" className="h-11 rounded-lg border bg-background px-3" />
                <textarea name="content" required rows={6} placeholder="내용" className="rounded-lg border bg-background p-3" />
                <Button type="submit" className="w-fit">등록</Button>
              </form>
            </details>
          )}

          {user?.role === "admin" && selected !== "새가족소개" && (
            <div className="mt-6 flex justify-end">
              <Button render={<Link href="/admin/posts" />} nativeButton={false}>글쓰기</Button>
            </div>
          )}

          <div className={`${user?.role === "admin" ? "mt-4" : "mt-10"} divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm`}>
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => {
                const href = post.category === "봉사 섬김이" ? externalUrl(post.content) : null
                const row = (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-wrap items-baseline gap-2 text-xs font-medium text-muted-foreground">
                        <span>[{post.category}]</span>
                        {post.pinned && <span className="font-bold text-primary">공지</span>}
                        {isNewPost(post.createdAt) && <span className="font-bold text-primary">N</span>}
                        {href && <ExternalLink className="size-3.5 shrink-0" />}
                      </div>
                      <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
                        <time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</time>
                        {post.id > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="size-3.5" /> {post.views.toLocaleString("ko-KR")}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-1.5 truncate text-lg font-semibold text-foreground">{post.title}</h3>
                    {!href && (
                      <p className="mt-1 truncate text-sm text-muted-foreground">{excerpt(post.content)}</p>
                    )}

                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground sm:hidden">
                      <span className="flex items-center gap-1">
                        <User className="size-3.5" /> {post.authorName}
                      </span>
                      <time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</time>
                      {post.id > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="size-3.5" /> {post.views.toLocaleString("ko-KR")}
                        </span>
                      )}
                    </div>
                  </>
                )

                const rowClass = "block px-5 py-5 transition-colors hover:bg-secondary/60 md:px-6"

                return href ? (
                  <a key={post.id} href={href} target="_blank" rel="noreferrer" className={rowClass}>
                    {row}
                  </a>
                ) : (
                  <Link key={post.id} href={`/community/${post.id}`} className={rowClass}>
                    {row}
                  </Link>
                )
              })
            ) : (
              <p className="px-6 py-16 text-center text-muted-foreground">등록된 게시글이 없습니다.</p>
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} hrefFor={pageHref} />
        </div>
      </section>
    </>
  )
}
