import { notFound, redirect } from "next/navigation"
import { getLegacyGalleryAlbum, getLegacyPost } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function LegacyPostPage({ params }: { params: Promise<{ board: string, id: string }> }) {
  const { board, id } = await params
  if (board === "62") {
    const album = await getLegacyGalleryAlbum(Number(id))
    if (!album) notFound()
    redirect(`/gallery/${album.id}`)
  }
  const post = await getLegacyPost(Number(board), Number(id))
  if (!post) notFound()
  redirect(`/community/${post.id}`)
}
