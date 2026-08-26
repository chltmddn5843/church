"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { gallery } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { deleteUpload, uploadFile } from "@/lib/uploads"

const CATEGORIES = new Set(["교회", "전체 수료자", "새가족반", "양육반", "제자반", "사역반"])

export async function createGalleryItem(formData: FormData) {
  await requireAdmin()
  const image = formData.get("image")
  const title = String(formData.get("title") ?? "").trim()
  const category = String(formData.get("category") ?? "교회").trim()
  if (!(image instanceof File) || !image.size) throw new Error("이미지를 선택해 주세요.")
  if (!title || !CATEGORIES.has(category)) throw new Error("제목과 올바른 분류를 입력해 주세요.")
  const uploaded = await uploadFile(image, "gallery")
  const db = getDb()
  try {
    await db.insert(gallery).values({
      title,
      imageUrl: uploaded.url,
      description: String(formData.get("description") ?? "").trim() || null,
      category,
    })
  } catch (error) {
    await deleteUpload(uploaded.url)
    throw error
  }
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery")
  revalidatePath("/")
  revalidatePath("/discipleship")
  redirect("/admin/gallery?saved=gallery")
}

export async function deleteGalleryItem(id: number) {
  await requireAdmin()
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("올바른 사진 번호가 아닙니다.")
  const db = getDb()
  const item = await db.select({ imageUrl: gallery.imageUrl }).from(gallery).where(eq(gallery.id, id)).get()
  await db.delete(gallery).where(eq(gallery.id, id))
  if (item) await deleteUpload(item.imageUrl)
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery")
  revalidatePath("/discipleship")
  redirect("/admin/gallery?saved=deleted")
}
