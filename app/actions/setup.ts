"use server"

import { count, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { user } from "@/lib/db/schema"

// Compare digests so the check takes the same time however many leading characters match.
async function sameSecret(a: string, b: string) {
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))
  const [x, y] = await Promise.all([digest(a), digest(b)])
  return x.every((byte, i) => byte === y[i])
}

export async function bootstrapAdmin(formData: FormData) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase()
  const key = process.env.BOOTSTRAP_ADMIN_KEY
  const suppliedKey = String(formData.get("key") ?? "")
  const [{ value: admins }] = await getDb().select({ value: count() }).from(user).where(eq(user.role, "admin"))

  if (admins > 0 || !email || !key || session.user.email.toLowerCase() !== email || !(await sameSecret(suppliedKey, key))) {
    throw new Error("최초 관리자 설정 조건이 맞지 않습니다.")
  }

  await getDb().update(user).set({ role: "admin", updatedAt: new Date() }).where(eq(user.id, session.user.id))
  redirect("/admin")
}
