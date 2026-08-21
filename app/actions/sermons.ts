"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { sermons } from "@/lib/db/schema"
import { parseYoutubeId } from "@/lib/youtube"

export async function createSermon(formData: FormData) {
  await requireAdmin()
  const preachedAt = String(formData.get("preachedAt") ?? "")
  await getDb().insert(sermons).values({
    title: String(formData.get("title") ?? ""),
    preacher: String(formData.get("preacher") ?? "") || "정승천",
    scripture: String(formData.get("scripture") ?? "") || null,
    category: String(formData.get("category") ?? "") || "주일예배",
    youtubeId: parseYoutubeId(String(formData.get("youtubeId") ?? "")),
    summary: String(formData.get("summary") ?? "") || null,
    preachedAt: preachedAt ? new Date(preachedAt) : new Date(),
  })
  revalidatePath("/admin/sermons")
  revalidatePath("/sermons")
  revalidatePath("/")
  redirect("/admin/sermons?saved=created")
}

export async function updateSermon(id: number, formData: FormData) {
  await requireAdmin()
  const preachedAt = String(formData.get("preachedAt") ?? "")
  await getDb()
    .update(sermons)
    .set({
      title: String(formData.get("title") ?? ""),
      preacher: String(formData.get("preacher") ?? "") || "정승천",
      scripture: String(formData.get("scripture") ?? "") || null,
      category: String(formData.get("category") ?? "") || "주일예배",
      youtubeId: parseYoutubeId(String(formData.get("youtubeId") ?? "")),
      summary: String(formData.get("summary") ?? "") || null,
      preachedAt: preachedAt ? new Date(preachedAt) : new Date(),
    })
    .where(eq(sermons.id, id))
  revalidatePath("/admin/sermons")
  revalidatePath("/sermons")
  revalidatePath(`/sermons/${id}`)
  redirect("/admin/sermons?saved=updated")
}

export async function deleteSermon(id: number) {
  await requireAdmin()
  await getDb().delete(sermons).where(eq(sermons.id, id))
  revalidatePath("/admin/sermons")
  revalidatePath("/sermons")
  redirect("/admin/sermons?saved=deleted")
}
