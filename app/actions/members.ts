"use server"

import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function setMemberRole(userId: string, role: "pending" | "member" | "admin") {
  const admin = await requireAdmin()
  if (admin.id === userId) throw new Error("자신의 관리자 권한은 변경할 수 없습니다.")
  await getDb().update(user).set({ role, updatedAt: new Date() }).where(eq(user.id, userId))
  revalidatePath("/admin/members")
}
