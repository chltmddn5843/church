"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { contentPages } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"

export async function saveContentPage(formData: FormData) {
  await requireAdmin()
  const legacyId = Number(formData.get("legacyId"))
  if (!Number.isSafeInteger(legacyId) || legacyId < 1) throw new Error("올바른 페이지 번호를 입력하세요.")
  const values = {
    legacyId,
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    published: formData.get("published") === "on",
    visibility: String(formData.get("visibility") ?? "public"),
    updatedAt: new Date(),
  }
  await getDb().insert(contentPages).values(values).onConflictDoUpdate({ target: contentPages.legacyId, set: values })
  revalidatePath("/admin/pages")
  revalidatePath(`/Page/Index/${legacyId}`)
}
