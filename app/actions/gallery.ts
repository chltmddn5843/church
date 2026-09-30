"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { gallery, galleryAlbums } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { deleteUpload, uploadFile } from "@/lib/uploads"

const CATEGORIES = new Set(["교회", "전체 수료자", "새가족반", "양육반", "제자반", "사역반"])

function revalidateGallery() {
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery", "layout")
  revalidatePath("/")
  revalidatePath("/discipleship")
}

export async function createGalleryAlbum(formData: FormData) {
  await requireAdmin()
  const images = formData.getAll("images").filter((file): file is File => file instanceof File && file.size > 0)
  const title = String(formData.get("title") ?? "").trim()
  const category = String(formData.get("category") ?? "교회").trim()
  const description = String(formData.get("description") ?? "").trim() || null
  if (!images.length) throw new Error("사진을 한 장 이상 선택해 주세요.")
  if (!title || !CATEGORIES.has(category)) throw new Error("제목과 올바른 분류를 입력해 주세요.")

  const uploaded: string[] = []
  const db = getDb()
  let albumId: number | null = null
  try {
    // Upload in selection order so photo ids (the album's display order) follow it.
    for (const image of images) uploaded.push((await uploadFile(image, "gallery")).url)
    albumId = (await db.insert(galleryAlbums).values({ title, description, category }).returning({ id: galleryAlbums.id }).get()).id
    const rows = uploaded.map((imageUrl) => ({ albumId, title, imageUrl, description, category }))
    // D1 caps a query at 100 bound parameters (5 per row here).
    for (let i = 0; i < rows.length; i += 15) await db.insert(gallery).values(rows.slice(i, i + 15))
  } catch (error) {
    if (albumId) {
      await db.delete(gallery).where(eq(gallery.albumId, albumId))
      await db.delete(galleryAlbums).where(eq(galleryAlbums.id, albumId))
    }
    await Promise.all(uploaded.map(deleteUpload))
    throw error
  }
  revalidateGallery()
  redirect("/admin/gallery?saved=gallery")
}

export async function deleteGalleryAlbum(id: number, formData: FormData) {
  await requireAdmin()
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("올바른 앨범 번호가 아닙니다.")
  const db = getDb()
  const photos = await db.select({ imageUrl: gallery.imageUrl }).from(gallery).where(eq(gallery.albumId, id))
  await db.delete(gallery).where(eq(gallery.albumId, id))
  await db.delete(galleryAlbums).where(eq(galleryAlbums.id, id))
  await Promise.all(photos.map((photo) => deleteUpload(photo.imageUrl)))
  revalidateGallery()
  const back = String(formData.get("returnTo") ?? "")
  const base = back.startsWith("/admin/gallery") ? back : "/admin/gallery"
  redirect(`${base}${base.includes("?") ? "&" : "?"}saved=deleted`)
}
