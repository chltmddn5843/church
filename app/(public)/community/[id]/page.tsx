import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPost } from "@/lib/queries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(Number(id))
  if (!post) return { title: "게시글을 찾을 수 없습니다" }
  return { title: post.title }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(Number(id))
  if (!post) notFound()

  return (
    <article className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Button render={<Link href="/community" />} variant="ghost" size="sm" className="mb-6">
          <>
            <ArrowLeft className="mr-1 h-4 w-4" />
            목록으로
          </>
        </Button>

        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>

        <div className="mt-8 whitespace-pre-line leading-relaxed text-foreground">{post.content}</div>
      </div>
    </article>
  )
}
