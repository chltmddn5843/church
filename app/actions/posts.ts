"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { attachments, posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { deleteUpload, uploadFile } from "@/lib/uploads"

export async function createPost(formData: FormData) {
  const admin = await requireAdmin()
  const db = getDb()
  const post = await db.insert(posts).values({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: (formData.get("category") as string) || "교회소식",
    pinned: formData.get("pinned") === "on",
    visibility: String(formData.get("visibility") ?? "public"),
    authorId: admin.id,
    authorName: admin.name || "관리자",
  }).returning({ id: posts.id }).get()
  const uploaded: string[] = []
  try {
    for (const file of formData.getAll("files")) {
      if (!(file instanceof File) || !file.size) continue
      const item = await uploadFile(file, "attachments")
      uploaded.push(item.url)
      await db.insert(attachments).values({ postId: post.id, name: file.name, url: item.url, contentType: file.type, size: file.size })
    }
  } catch (error) {
    await Promise.all(uploaded.map(deleteUpload))
    await db.delete(posts).where(eq(posts.id, post.id))
    throw error
  }
  revalidatePath("/admin/posts")
  revalidatePath("/community")
  revalidatePath("/")
}

export async function updatePost(id: number, formData: FormData) {
  await requireAdmin()
  const db = getDb()
  await db
    .update(posts)
    .set({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: (formData.get("category") as string) || "교회소식",
      pinned: formData.get("pinned") === "on",
      visibility: String(formData.get("visibility") ?? "public"),
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
  revalidatePath("/admin/posts")
  revalidatePath("/community")
  revalidatePath(`/community/${id}`)
}

export async function deletePost(id: number) {
  await requireAdmin()
  const db = getDb()
  const files = await db.select({ url: attachments.url }).from(attachments).where(eq(attachments.postId, id))
  await db.delete(posts).where(eq(posts.id, id))
  await Promise.all(files.map(({ url }) => deleteUpload(url)))
  revalidatePath("/admin/posts")
  revalidatePath("/community")
}
