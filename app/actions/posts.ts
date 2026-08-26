"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { attachments, posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { deleteUpload, uploadFile } from "@/lib/uploads"

const VISIBILITIES = new Set(["public", "member", "bylaws", "offering", "committee"])

function readPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  const visibility = String(formData.get("visibility") ?? "public")
  if (!title || !content) throw new Error("제목과 내용을 입력해 주세요.")
  if (!VISIBILITIES.has(visibility)) throw new Error("올바른 공개 범위를 선택해 주세요.")
  return { title, content, visibility }
}

export async function createPost(formData: FormData) {
  const admin = await requireAdmin()
  const db = getDb()
  const post = await db
    .insert(posts)
    .values({
      ...readPost(formData),
      category: String(formData.get("category") || "교회소식"),
      pinned: formData.get("pinned") === "on",
      authorId: admin.id,
      authorName: admin.name || "관리자",
    })
    .returning({ id: posts.id })
    .get()

  const uploaded: string[] = []
  try {
    for (const file of formData.getAll("files")) {
      if (!(file instanceof File) || !file.size) continue
      const item = await uploadFile(file, "attachments")
      uploaded.push(item.url)
      await db.insert(attachments).values({
        postId: post.id,
        name: file.name,
        url: item.url,
        contentType: file.type,
        size: file.size,
      })
    }
  } catch (error) {
    await Promise.all(uploaded.map(deleteUpload))
    await db.delete(posts).where(eq(posts.id, post.id))
    throw error
  }

  revalidatePath("/admin/posts")
  revalidatePath("/community")
  revalidatePath("/")
  const requestedReturnTo = String(formData.get("returnTo") ?? "")
  const returnTo = requestedReturnTo === "/community?category=새가족소개" ? requestedReturnTo : "/admin/posts"
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}saved=created`)
}

export async function updatePost(id: number, formData: FormData) {
  await requireAdmin()
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("올바른 게시글 번호가 아닙니다.")
  const db = getDb()
  await db
    .update(posts)
    .set({
      ...readPost(formData),
      category: String(formData.get("category") || "교회소식"),
      pinned: formData.get("pinned") === "on",
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))

  revalidatePath("/admin/posts")
  revalidatePath("/community")
  revalidatePath(`/community/${id}`)
  redirect("/admin/posts?saved=updated")
}

export async function deletePost(id: number) {
  await requireAdmin()
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("올바른 게시글 번호가 아닙니다.")
  const db = getDb()
  const files = await db.select({ url: attachments.url }).from(attachments).where(eq(attachments.postId, id))

  await db.delete(posts).where(eq(posts.id, id))
  await Promise.all(files.map(({ url }) => deleteUpload(url)))

  revalidatePath("/admin/posts")
  revalidatePath("/community")
  redirect("/admin/posts?saved=deleted")
}
