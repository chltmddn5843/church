import type { Metadata } from "next"
import Link from "next/link"
import { getPosts } from "@/lib/queries"
import { PageBanner } from "@/components/page-banner"
import { Badge } from "@/components/ui/badge"
import { Pin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getSessionUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "원당교회의 교회소식과 공지사항을 확인하세요.",
}

const categories = ["전체", "공지사항", "교회소식", "새가족소개", "가정예배순서지"]

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const posts = await getPosts(category)
  const user = await getSessionUser()

  return (
    <>
      <PageBanner title="커뮤니티" subtitle="원당교회의 다양한 소식을 나눕니다." />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const isActive = (cat === "전체" && !category) || cat === category
              const href = cat === "전체" ? "/community" : `/community?category=${encodeURIComponent(cat)}`
              return (
                <Link
                  key={cat}
                  href={href}
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {cat}
                </Link>
              )
            })}
          </div>

          {user?.role === "admin" && (
            <div className="mt-6 flex justify-end">
              <Button render={<Link href="/admin/posts" />} nativeButton={false}>글쓰기</Button>
            </div>
          )}

          <div className={`${user?.role === "admin" ? "mt-4" : "mt-10"} divide-y divide-border overflow-hidden rounded-xl border border-border bg-card`}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-secondary"
                >
                  {post.pinned && <Pin className="h-4 w-4 shrink-0 text-accent-foreground" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.pinned && <span className="text-xs font-medium text-primary">고정</span>}
                    </div>
                    <h3 className="mt-1.5 truncate font-medium text-foreground">{post.title}</h3>
                  </div>
                  <div className="shrink-0 text-right text-sm text-muted-foreground"><time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</time><p>조회 {post.views.toLocaleString("ko-KR")}</p></div>
                </Link>
              ))
            ) : (
              <p className="px-6 py-16 text-center text-muted-foreground">등록된 게시글이 없습니다.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
