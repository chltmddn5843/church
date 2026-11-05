"use server"

import { eq, inArray } from "drizzle-orm"
import type { BatchItem } from "drizzle-orm/batch"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { siteContent } from "@/lib/db/schema"
import { findContentField, findContentGroup } from "@/lib/site-content"
import { contentTypeOf } from "@/lib/upload-types"
import { deleteUpload, uploadFile } from "@/lib/uploads"

export async function saveContent(groupId: string, formData: FormData) {
  await requireAdmin()
  const found = findContentGroup(groupId)
  if (!found) throw new Error("올바른 항목이 아닙니다.")
  const { page, group } = found
  const back = `/admin/content?page=${page.id}`

  const imageField = group.fields.find((field) => field.kind === "image")
  const entry = imageField && formData.get(imageField.key)
  const file = entry instanceof File && entry.size > 0 ? entry : null
  // GIF excluded: Cloudflare resizing drops the animation anyway.
  if (file && (file.size > 20 * 1024 * 1024 || !/^image\/(jpeg|png|webp)$/.test(contentTypeOf(file) ?? ""))) {
    redirect(`${back}&error=content#${group.id}`)
  }

  const db = getDb()
  const keys = group.fields.map((field) => field.key)
  const previous = await db.select().from(siteContent).where(inArray(siteContent.key, keys))
  const uploaded = file ? await uploadFile(file, "hero") : null // Same R2 folder as the old hero images, already public.

  const updatedAt = new Date()
  const writes = group.fields.flatMap<BatchItem<"sqlite">>((field) => {
    const value = field.kind === "image" ? uploaded?.url : String(formData.get(field.key) ?? "").replace(/\r\n/g, "\n").trim()
    if (field.kind === "image" && !value) return [] // No new photo: keep the current one.
    // Blank or back to the default: drop the row so later default changes in code still apply.
    if (!value || value === field.value) return [db.delete(siteContent).where(eq(siteContent.key, field.key))]
    return [db.insert(siteContent).values({ key: field.key, value, updatedAt }).onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt } })]
  })

  try {
    if (writes.length) await db.batch(writes as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]])
  } catch (error) {
    if (uploaded) await deleteUpload(uploaded.url)
    throw error
  }
  const replaced = uploaded && previous.find((row) => row.key === imageField?.key)
  if (replaced) await deleteUpload(replaced.value)

  revalidatePath("/", "layout") // Some content shows on several pages (교회학교, 비전과 사명, 예배 시간).
  redirect(`${back}&saved=content#${group.id}`)
}

export async function resetContentImage(key: string) {
  await requireAdmin()
  const found = findContentField(key)
  if (found?.field.kind !== "image") throw new Error("올바른 항목이 아닙니다.")
  const db = getDb()
  const current = await db.select().from(siteContent).where(eq(siteContent.key, key)).get()
  await db.delete(siteContent).where(eq(siteContent.key, key))
  if (current) await deleteUpload(current.value)

  revalidatePath("/", "layout")
  redirect(`/admin/content?page=${found.page.id}&saved=content`)
}
