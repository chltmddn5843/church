"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { historyEvents } from "@/lib/db/schema"
import { formatHistoryDate } from "@/lib/history"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function readHistoryValues(formData: FormData) {
  const field = (name: string) => String(formData.get(name) ?? "")
  const date = formatHistoryDate(field("year"), field("month"), field("day"))
  const event = field("event").trim()
  if (!date) throw new Error("연도(4자리)와 월을 올바르게 입력해 주세요. 일은 비워 둘 수 있습니다.")
  if (!event) throw new Error("내용을 입력해 주세요.")
  if (event.length > 500) throw new Error("내용은 500자 이내로 입력해 주세요.")
  return { date, event }
}

function checkId(id: number) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("올바른 발자취 번호가 아닙니다.")
}

function done(saved: string): never {
  revalidatePath("/admin/history")
  revalidatePath("/about")
  redirect(`/admin/history?saved=${saved}`)
}

export async function createHistoryEvent(formData: FormData) {
  await requireAdmin()
  await getDb().insert(historyEvents).values(readHistoryValues(formData))
  done("created")
}

export async function updateHistoryEvent(id: number, formData: FormData) {
  await requireAdmin()
  checkId(id)
  await getDb().update(historyEvents).set(readHistoryValues(formData)).where(eq(historyEvents.id, id))
  done("updated")
}

export async function deleteHistoryEvent(id: number) {
  await requireAdmin()
  checkId(id)
  await getDb().delete(historyEvents).where(eq(historyEvents.id, id))
  done("deleted")
}
