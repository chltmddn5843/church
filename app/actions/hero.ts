"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { heroSlides } from "@/lib/church"
import { getDb } from "@/lib/db"
import { heroImages } from "@/lib/db/schema"
import { contentTypeOf } from "@/lib/upload-types"
import { deleteUpload, uploadFile } from "@/lib/uploads"

function checkSlot(slot: number) {
  if (!Number.isSafeInteger(slot) || slot < 0 || slot >= heroSlides.length) throw new Error("올바른 슬라이드가 아닙니다.")
}

export async function saveHeroImage(slot: number, formData: FormData) {
  await requireAdmin()
  checkSlot(slot)
  const image = formData.get("image")
  // GIF excluded: a full-screen animated hero is heavy and Cloudflare resizing drops the animation anyway.
  if (!(image instanceof File) || image.size > 20 * 1024 * 1024 || !/^image\/(jpeg|png|webp)$/.test(contentTypeOf(image) ?? "")) {
    redirect("/admin/hero?error=hero")
  }

  const db = getDb()
  const current = await db.select({ imageUrl: heroImages.imageUrl }).from(heroImages).where(eq(heroImages.slot, slot)).get()
  const { url } = await uploadFile(image, "hero")
  try {
    await db.insert(heroImages).values({ slot, imageUrl: url, updatedAt: new Date() }).onConflictDoUpdate({ target: heroImages.slot, set: { imageUrl: url, updatedAt: new Date() } })
  } catch (error) {
    await deleteUpload(url)
    throw error
  }
  if (current) await deleteUpload(current.imageUrl)

  revalidatePath("/admin/hero")
  revalidatePath("/")
  redirect("/admin/hero?saved=hero")
}

export async function resetHeroImage(slot: number) {
  await requireAdmin()
  checkSlot(slot)
  const db = getDb()
  const current = await db.select({ imageUrl: heroImages.imageUrl }).from(heroImages).where(eq(heroImages.slot, slot)).get()
  await db.delete(heroImages).where(eq(heroImages.slot, slot))
  if (current) await deleteUpload(current.imageUrl)

  revalidatePath("/admin/hero")
  revalidatePath("/")
  redirect("/admin/hero?saved=hero")
}
