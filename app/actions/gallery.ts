"use server"

import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { gallery } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createGalleryItem(formData: FormData) {
  await requireAdmin()
  await db.insert(gallery).values({
    title: formData.get("title") as string,
    imageUrl: formData.get("imageUrl") as string,
    description: (formData.get("description") as string) || null,
  })
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery")
  revalidatePath("/")
}

export async function deleteGalleryItem(id: number) {
  await requireAdmin()
  await db.delete(gallery).where(eq(gallery.id, id))
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery")
}
