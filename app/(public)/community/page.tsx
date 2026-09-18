import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, Pin } from "lucide-react"
import { createPost } from "@/app/actions/posts"
import { PageBanner } from "@/components/page-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getPosts } from "@/lib/queries"
import { getSessionUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "원당교회의 공지사항, 교회소식, 새가족소개와 봉사 섬김이 신청을 확인하세요.",
}

const categories = ["전체", "공지사항", "교회소식", "주보", "새가족소개", "가정예배순서지", "봉사 섬김이"]
const serviceFormUrl = "https://forms.gle/AmDQV5ukLCm3x5gV6"

function externalUrl(content: string) {
  const match = content.trim().match(/https?:\/\/[^\s]+|forms\.gle\/[^\s]+/)
  if (!match) return null
  return match[0].startsWith("http") ? match[0] : `https://${match[0]}`
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const selected = category && categories.includes(category) ? category : undefined
  const posts = await getPosts(selected)
  const user = await getSessionUser()
  const visiblePosts =
    selected === "봉사 섬김이"
      ? [
          {
            id: -1,
            title: "봉사 섬김이 신청서",
            content: serviceFormUrl,
            category: "봉사 섬김이",
            pinned: true,
            views: 0,
            createdAt: new Date(),
          },
          ...posts,
        ]
      : posts

  return (
    <>
      <PageBanner title="커뮤니티" subtitle="원당교회의 소식과 나눔을 확인하세요." />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="overflow-x-auto rounded-[1.5rem] border border-border bg-card p-2 shadow-sm" aria-label="커뮤니티 게시판">
            <div className="flex min-w-max gap-2">
              {categories.map((cat) => {
                const isActive = (cat === "전체" && !selected) || cat === selected
                const href = cat === "전체" ? "/community" : `/community?category=${encodeURIComponent(cat)}`
                return (
                  <Link
                    key={cat}
                    href={href}
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

          <div className={`${user?.role === "admin" ? "mt-4" : "mt-10"} divide-y divide-border overflow-hidden rounded-xl border border-border bg-card`}>
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => {
                const href = post.category === "봉사 섬김이" ? externalUrl(post.content) : null
                const row = (
                  <>
                    {post.pinned && <Pin className="h-4 w-4 shrink-0 text-accent-foreground" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                        {post.pinned && <span className="text-xs font-medium text-primary">고정</span>}
                        {href && <ExternalLink className="size-3 text-muted-foreground" />}
                      </div>
                      <h3 className="mt-1.5 truncate font-medium text-foreground">{post.title}</h3>
                    </div>
                    <div className="shrink-0 text-right text-sm text-muted-foreground">
                      <time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</time>
                      {post.id > 0 && <p>조회 {post.views.toLocaleString("ko-KR")}</p>}
                    </div>
                  </>
                )

                return href ? (
                  <a key={post.id} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-secondary">
                    {row}
                  </a>
                ) : (
                  <Link key={post.id} href={`/community/${post.id}`} className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-secondary">
                    {row}
                  </Link>
                )
              })
            ) : (
              <p className="px-6 py-16 text-center text-muted-foreground">등록된 게시글이 없습니다.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
