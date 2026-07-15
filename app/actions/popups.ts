"use server"

import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { popups } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createPopup(formData: FormData) {
  await requireAdmin()
  await db.insert(popups).values({
    title: formData.get("title") as string,
    imageUrl: (formData.get("imageUrl") as string) || null,
    linkUrl: (formData.get("linkUrl") as string) || null,
    content: (formData.get("content") as string) || null,
    active: formData.get("active") === "on",
  })
  revalidatePath("/admin/popups")
  revalidatePath("/")
}

export async function togglePopup(id: number, active: boolean) {
  await requireAdmin()
  await db.update(popups).set({ active }).where(eq(popups.id, id))
  revalidatePath("/admin/popups")
  revalidatePath("/")
}

export async function deletePopup(id: number) {
  await requireAdmin()
  await db.delete(popups).where(eq(popups.id, id))
  revalidatePath("/admin/popups")
  revalidatePath("/")
}
