"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { contentPages } from "@/lib/db/schema"

export async function saveContentPage(formData: FormData) {
  await requireAdmin()
  const legacyId = Number(formData.get("legacyId"))
  if (!Number.isSafeInteger(legacyId) || legacyId < 1) throw new Error("올바른 페이지 번호를 입력해 주세요.")
  const title = String(formData.get("title") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const visibility = String(formData.get("visibility") ?? "public")
  if (!title || !content) throw new Error("제목과 내용을 입력해 주세요.")
  if (imageUrl && !imageUrl.startsWith("/")) throw new Error("이미지는 사이트 내부 경로만 사용할 수 있습니다.")
  if (!new Set(["public", "member", "offering"]).has(visibility)) throw new Error("올바른 공개 범위를 선택해 주세요.")
  const values = {
    legacyId,
    title,
    content,
    imageUrl: imageUrl || null,
    published: formData.get("published") === "on",
    visibility,
    updatedAt: new Date(),
  }
  await getDb().insert(contentPages).values(values).onConflictDoUpdate({ target: contentPages.legacyId, set: values })
  revalidatePath("/admin/pages")
  revalidatePath(`/Page/Index/${legacyId}`)
  redirect("/admin/pages?saved=updated")
}
