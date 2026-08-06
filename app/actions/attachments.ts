"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { attachments } from "@/lib/db/schema"
import { deleteUpload } from "@/lib/uploads"

export async function deleteAttachment(id: number) {
  await requireAdmin()
  const db = getDb()
  const file = await db.select().from(attachments).where(eq(attachments.id, id)).get()
  if (!file) return
  await db.delete(attachments).where(eq(attachments.id, id))
  await deleteUpload(file.url)
  revalidatePath("/admin/attachments")
  revalidatePath(`/community/${file.postId}`)
}
