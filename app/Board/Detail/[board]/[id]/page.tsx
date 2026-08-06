import { notFound, redirect } from "next/navigation"
import { getLegacyPost } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function LegacyPostPage({ params }: { params: Promise<{ board: string, id: string }> }) {
  const { board, id } = await params
  const post = await getLegacyPost(Number(board), Number(id))
  if (!post) notFound()
  redirect(`/community/${post.id}`)
}
