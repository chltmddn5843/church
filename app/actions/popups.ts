"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { popups } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCloudflareContext } from "@opennextjs/cloudflare"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
])

function readPopupValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    linkUrl: String(formData.get("linkUrl") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim() || null,
    width: Math.min(Math.max(Number(formData.get("width") || 420), 280), 760),
    height: Math.min(Math.max(Number(formData.get("height") || 540), 320), 900),
    active: formData.get("active") === "on",
  }
}

async function uploadPopupImage(image: File) {
  if (image.size > MAX_IMAGE_SIZE) throw new Error("이미지는 5MB 이하만 업로드할 수 있습니다.")

  const extension = ALLOWED_IMAGE_TYPES.get(image.type)
  if (!extension) throw new Error("JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.")

  const { env } = getCloudflareContext()
  const imageKey = `popups/${crypto.randomUUID()}.${extension}`
  await env.POPUP_IMAGES.put(imageKey, await image.arrayBuffer(), {
    httpMetadata: { contentType: image.type },
    customMetadata: { originalName: image.name },
  })

  return {
    imageUrl: `/api/uploads/${imageKey}`,
    cleanup: () => env.POPUP_IMAGES.delete(imageKey),
  }
}

async function deletePopupImage(imageUrl?: string | null) {
  const uploadPrefix = "/api/uploads/"
  if (!imageUrl?.startsWith(uploadPrefix)) return

  const { env } = getCloudflareContext()
  await env.POPUP_IMAGES.delete(imageUrl.slice(uploadPrefix.length))
}

export async function createPopup(formData: FormData) {
  await requireAdmin()

  const image = formData.get("image")
  if (!(image instanceof File) || image.size === 0) throw new Error("팝업 이미지를 선택해 주세요.")

  const uploaded = await uploadPopupImage(image)
  const db = getDb()

  try {
    await db.insert(popups).values({
      ...readPopupValues(formData),
      imageUrl: uploaded.imageUrl,
    })
  } catch (error) {
    await uploaded.cleanup()
    throw error
  }

  revalidatePath("/admin/popups")
  revalidatePath("/")
  redirect("/admin/popups?saved=created")
}

export async function updatePopup(id: number, formData: FormData) {
  await requireAdmin()

  const db = getDb()
  const current = await db.select({ imageUrl: popups.imageUrl }).from(popups).where(eq(popups.id, id)).get()
  const image = formData.get("image")
  const nextImage = image instanceof File && image.size > 0 ? await uploadPopupImage(image) : null

  try {
    await db
      .update(popups)
      .set({
        ...readPopupValues(formData),
        ...(nextImage ? { imageUrl: nextImage.imageUrl } : {}),
      })
      .where(eq(popups.id, id))
  } catch (error) {
    await nextImage?.cleanup()
    throw error
  }

  if (nextImage) await deletePopupImage(current?.imageUrl)

  revalidatePath("/admin/popups")
  revalidatePath("/")
  redirect("/admin/popups?saved=updated")
}

export async function togglePopup(id: number, active: boolean) {
  await requireAdmin()
  const db = getDb()
  await db.update(popups).set({ active }).where(eq(popups.id, id))
  revalidatePath("/admin/popups")
  revalidatePath("/")
  redirect("/admin/popups?saved=popup")
}

export async function deletePopup(id: number) {
  await requireAdmin()
  const db = getDb()
  const item = await db.select({ imageUrl: popups.imageUrl }).from(popups).where(eq(popups.id, id)).get()

  await db.delete(popups).where(eq(popups.id, id))
  await deletePopupImage(item?.imageUrl)

  revalidatePath("/admin/popups")
  revalidatePath("/")
  redirect("/admin/popups?saved=deleted")
}
