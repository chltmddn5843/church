"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { user, userGroups } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function setMemberRole(userId: string, role: "pending" | "member" | "admin") {
  const admin = await requireAdmin()
  if (!userId || !(["pending", "member", "admin"] as const).includes(role)) throw new Error("올바른 회원 정보가 아닙니다.")
  if (admin.id === userId) throw new Error("자신의 관리자 권한은 변경할 수 없습니다.")
  await getDb().update(user).set({ role, updatedAt: new Date() }).where(eq(user.id, userId))
  revalidatePath("/admin/members")
  redirect("/admin/members?saved=member")
}

export async function setMemberGroup(userId: string, group: "bylaws" | "offering" | "committee", enabled: boolean) {
  await requireAdmin()
  if (!userId || !(["bylaws", "offering", "committee"] as const).includes(group) || typeof enabled !== "boolean") throw new Error("올바른 그룹 정보가 아닙니다.")
  const db = getDb()
  if (enabled) await db.insert(userGroups).values({ userId, group }).onConflictDoNothing()
  else await db.delete(userGroups).where(and(eq(userGroups.userId, userId), eq(userGroups.group, group)))
  revalidatePath("/admin/members")
  redirect("/admin/members?saved=group")
}
