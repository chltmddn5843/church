"use server"

import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createPost(formData: FormData) {
  const admin = await requireAdmin()
  await db.insert(posts).values({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: (formData.get("category") as string) || "교회소식",
    pinned: formData.get("pinned") === "on",
    authorId: admin.id,
    authorName: admin.name || "관리자",
  })
  revalidatePath("/admin/posts")
  revalidatePath("/community")
  revalidatePath("/")
}

export async function updatePost(id: number, formData: FormData) {
  await requireAdmin()
  await db
    .update(posts)
    .set({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: (formData.get("category") as string) || "교회소식",
      pinned: formData.get("pinned") === "on",
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
  revalidatePath("/admin/posts")
  revalidatePath("/community")
  revalidatePath(`/community/${id}`)
}

export async function deletePost(id: number) {
  await requireAdmin()
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath("/admin/posts")
  revalidatePath("/community")
}
