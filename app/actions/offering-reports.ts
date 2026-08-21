"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { offeringReports } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function saveOfferingReport(formData: FormData) {
  await requireAdmin()

  const db = getDb()
  const id = Number(formData.get("id") || 0)
  const title = String(formData.get("title") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()

  if (!title || !content) {
    throw new Error("제목과 헌금 현황 내용을 입력해 주세요.")
  }

  if (id > 0) {
    await db
      .update(offeringReports)
      .set({ title, content, active: formData.get("active") === "on", updatedAt: new Date() })
      .where(eq(offeringReports.id, id))
  } else {
    const latest = await db.select().from(offeringReports).orderBy(desc(offeringReports.updatedAt)).limit(1).get()
    await db.insert(offeringReports).values({
      title,
      content,
      accessToken: latest?.accessToken ?? crypto.randomUUID(),
      active: formData.get("active") === "on",
    })
  }

  revalidatePath("/admin/offering")
  redirect("/admin/offering?saved=offering")
}
