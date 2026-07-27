"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { contentPages } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"

export async function saveContentPage(formData: FormData) {
  await requireAdmin()
  const legacyId = Number(formData.get("legacyId"))
  if (!Number.isInteger(legacyId) || legacyId < 11 || legacyId > 223) throw new Error("페이지 번호는 11~223이어야 합니다.")
  const values = {
    legacyId,
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    published: formData.get("published") === "on",
    updatedAt: new Date(),
  }
  await getDb().insert(contentPages).values(values).onConflictDoUpdate({ target: contentPages.legacyId, set: values })
  revalidatePath("/admin/pages")
  revalidatePath(`/Page/Index/${legacyId}`)
}
