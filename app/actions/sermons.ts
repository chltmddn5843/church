"use server"

import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { sermons } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Extract a YouTube video id from a full URL or return the raw id. */
function parseYoutubeId(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
    /^([\w-]{11})$/,
  ]
  for (const p of patterns) {
    const m = trimmed.match(p)
    if (m) return m[1]
  }
  return trimmed || null
}

export async function createSermon(formData: FormData) {
  await requireAdmin()
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
  await db.delete(sermons).where(eq(sermons.id, id))
  revalidatePath("/admin/sermons")
  revalidatePath("/sermons")
}
