import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAdjacentPosts, getPost, incrementPostView } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Download, List, User } from "lucide-react"
import { after } from "next/server"
import { BulletinPdfViewer } from "@/components/bulletin-pdf-viewer-loader"
import { BulletinImageViewer } from "@/components/bulletin-image-viewer"
import { cn } from "@/lib/utils"

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
  after(() => incrementPostView(post.id))
  const { prev, next } = await getAdjacentPosts(post.id, post.category, post.createdAt)

  const isBulletin = post.category === "주보"
  const bulletinPdf = post.attachments.find((file) => file.contentType === "application/pdf")
  const bulletinImages = isBulletin && !bulletinPdf ? post.attachments.filter((file) => file.contentType.startsWith("image/")) : []
  const usedIds = new Set([bulletinPdf?.id, ...bulletinImages.map((file) => file.id)].filter((id): id is number => id !== undefined))
  const otherAttachments = post.attachments.filter((file) => !usedIds.has(file.id))

  return (
    <article className="py-12 md:py-16">
      <div className={cn("mx-auto px-4", isBulletin ? "max-w-4xl" : "max-w-3xl")}>
        <Button render={<Link href="/community" />} nativeButton={false} variant="ghost" size="sm" className="mb-6">
          <>
            <ArrowLeft className="mr-1 h-4 w-4" />
            목록으로
          </>
        </Button>

        <p className="text-sm font-medium text-muted-foreground">[{post.category}]</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
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
          <span>조회 {post.views.toLocaleString("ko-KR")}</span>
        </div>

        <div className="mt-8 whitespace-pre-line leading-relaxed text-foreground">{post.content}</div>
        {bulletinPdf && <BulletinPdfViewer url={bulletinPdf.url} title={bulletinPdf.name} />}
        {bulletinImages.length > 0 && <BulletinImageViewer images={bulletinImages} title={post.title} />}
        {otherAttachments.length > 0 && <div className="mt-10 space-y-2 border-t pt-6"><h2 className="font-semibold">첨부파일</h2>{otherAttachments.map(file => <a key={file.id} href={file.url} download className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-secondary"><Download className="size-4"/>{file.name} <span className="ml-auto text-muted-foreground">{Math.ceil(file.size / 1024)}KB</span></a>)}</div>}

        {(next || prev) && (
          <div className="mt-12 divide-y divide-border rounded-xl border border-border">
            {next && (
              <Link href={`/community/${next.id}`} className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-secondary">
                <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                <span className="shrink-0 font-medium text-muted-foreground">다음글</span>
                <span className="truncate text-foreground">{next.title}</span>
              </Link>
            )}
            {prev && (
              <Link href={`/community/${prev.id}`} className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-secondary">
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                <span className="shrink-0 font-medium text-muted-foreground">이전글</span>
                <span className="truncate text-foreground">{prev.title}</span>
              </Link>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Button render={<Link href={`/community?category=${encodeURIComponent(post.category)}`} />} nativeButton={false} variant="outline">
            <>
              <List className="mr-1.5 size-4" /> 목록으로
            </>
          </Button>
        </div>
      </div>
    </article>
  )
}
