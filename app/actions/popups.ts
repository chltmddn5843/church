"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { popups } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getCloudflareContext } from "@opennextjs/cloudflare"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
])

export async function createPopup(formData: FormData) {
  await requireAdmin()
  const image = formData.get("image")
  if (!(image instanceof File) || image.size === 0) throw new Error("팝업 이미지를 선택해 주세요.")
  if (image.size > MAX_IMAGE_SIZE) throw new Error("이미지는 5MB 이하만 업로드할 수 있습니다.")

  const extension = ALLOWED_IMAGE_TYPES.get(image.type)
  if (!extension) throw new Error("JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.")

  const { env } = getCloudflareContext()
  const imageKey = `popups/${crypto.randomUUID()}.${extension}`
  await env.POPUP_IMAGES.put(imageKey, await image.arrayBuffer(), {
    httpMetadata: { contentType: image.type },
    customMetadata: { originalName: image.name },
  })

  const db = getDb()
  try {
    await db.insert(popups).values({
      title: String(formData.get("title") ?? "").trim(),
      imageUrl: `/api/uploads/${imageKey}`,
      linkUrl: String(formData.get("linkUrl") ?? "").trim() || null,
      content: String(formData.get("content") ?? "").trim() || null,
      active: formData.get("active") === "on",
    })
  } catch (error) {
    await env.POPUP_IMAGES.delete(imageKey)
    throw error
  }
  revalidatePath("/admin/popups")
  revalidatePath("/")
}

export async function togglePopup(id: number, active: boolean) {
  await requireAdmin()
  const db = getDb()
  await db.update(popups).set({ active }).where(eq(popups.id, id))
  revalidatePath("/admin/popups")
  revalidatePath("/")
}

export async function deletePopup(id: number) {
  await requireAdmin()
  const db = getDb()
  const item = await db.select({ imageUrl: popups.imageUrl }).from(popups).where(eq(popups.id, id)).get()
  await db.delete(popups).where(eq(popups.id, id))

  const uploadPrefix = "/api/uploads/"
  if (item?.imageUrl?.startsWith(uploadPrefix)) {
    const { env } = getCloudflareContext()
    await env.POPUP_IMAGES.delete(item.imageUrl.slice(uploadPrefix.length))
  }
  revalidatePath("/admin/popups")
  revalidatePath("/")
}
