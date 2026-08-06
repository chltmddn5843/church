"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { gallery } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { deleteUpload, uploadFile } from "@/lib/uploads"

export async function createGalleryItem(formData: FormData) {
  await requireAdmin()
  const image = formData.get("image")
  if (!(image instanceof File)) throw new Error("이미지를 선택해 주세요.")
  const uploaded = await uploadFile(image, "gallery")
  const db = getDb()
  try {
    await db.insert(gallery).values({
      title: String(formData.get("title") ?? "").trim(),
      imageUrl: uploaded.url,
      description: String(formData.get("description") ?? "").trim() || null,
    })
  } catch (error) {
    await deleteUpload(uploaded.url)
    throw error
  }
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery")
  revalidatePath("/")
}

export async function deleteGalleryItem(id: number) {
  await requireAdmin()
  const db = getDb()
  const item = await db.select({ imageUrl: gallery.imageUrl }).from(gallery).where(eq(gallery.id, id)).get()
  await db.delete(gallery).where(eq(gallery.id, id))
  if (item) await deleteUpload(item.imageUrl)
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery")
}
