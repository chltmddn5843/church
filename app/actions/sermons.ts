"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { sermons } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { parseYoutubeId } from "@/lib/youtube"

export async function createSermon(formData: FormData) {
  await requireAdmin()
  const db = getDb()
  const preachedAt = formData.get("preachedAt") as string
  await db.insert(sermons).values({
    title: formData.get("title") as string,
    preacher: (formData.get("preacher") as string) || "양승철",
    scripture: (formData.get("scripture") as string) || null,
    category: (formData.get("category") as string) || "주일예배",
    youtubeId: parseYoutubeId(formData.get("youtubeId") as string),
    summary: (formData.get("summary") as string) || null,
    preachedAt: preachedAt ? new Date(preachedAt) : new Date(),
  })
  revalidatePath("/admin/sermons")
  revalidatePath("/sermons")
  revalidatePath("/")
}

export async function updateSermon(id: number, formData: FormData) {
  await requireAdmin()
  const db = getDb()
  const preachedAt = formData.get("preachedAt") as string
  await db
    .update(sermons)
    .set({
      title: formData.get("title") as string,
      preacher: (formData.get("preacher") as string) || "양승철",
      scripture: (formData.get("scripture") as string) || null,
      category: (formData.get("category") as string) || "주일예배",
      youtubeId: parseYoutubeId(formData.get("youtubeId") as string),
      summary: (formData.get("summary") as string) || null,
      preachedAt: preachedAt ? new Date(preachedAt) : new Date(),
    })
    .where(eq(sermons.id, id))
  revalidatePath("/admin/sermons")
  revalidatePath("/sermons")
  revalidatePath(`/sermons/${id}`)
}

export async function deleteSermon(id: number) {
  await requireAdmin()
  const db = getDb()
  await db.delete(sermons).where(eq(sermons.id, id))
  revalidatePath("/admin/sermons")
  revalidatePath("/sermons")
}
