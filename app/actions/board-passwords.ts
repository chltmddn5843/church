"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { boardPasswords } from "@/lib/db/schema"
import { BOARD_COOKIE, boardToken, hashBoardPassword, readTokens, verifyBoardPassword } from "@/lib/board-password"
import { runtimeEnv } from "@/lib/runtime-env"

type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> }

export async function unlockBoard(formData: FormData) {
  const requested = String(formData.get("returnTo") ?? "")
  // Only back to a post or album page, never an arbitrary URL.
  const back = /^\/(community|gallery)\/\d+$/.test(requested) ? requested : "/"
  const category = String(formData.get("category") ?? "")
  const password = String(formData.get("password") ?? "")

  // Shared board passwords are short, so guessing is throttled per IP (wrangler.toml [[ratelimits]]).
  const limiter = (getCloudflareContext().env as unknown as { BOARD_UNLOCK_LIMITER?: RateLimiter }).BOARD_UNLOCK_LIMITER
  const ip = (await headers()).get("cf-connecting-ip") ?? "local"
  if (limiter && !(await limiter.limit({ key: ip })).success) redirect(`${back}?unlock=limited`)

  const row = await getDb().select({ hash: boardPasswords.hash }).from(boardPasswords).where(eq(boardPasswords.category, category)).get()
  if (!row) redirect(back)
  if (!password || password.length > 100 || !(await verifyBoardPassword(password, row.hash))) redirect(`${back}?unlock=wrong`)

  const secret = runtimeEnv("BETTER_AUTH_SECRET")
  if (!secret) throw new Error("BETTER_AUTH_SECRET is not set")
  const jar = await cookies()
  const tokens = [...readTokens(jar.get(BOARD_COOKIE)?.value), await boardToken(secret, category, row.hash)]
  jar.set(BOARD_COOKIE, [...new Set(tokens)].slice(-20).join("."), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect(back)
}

const adminPages = new Set(["/admin/posts", "/admin/gallery"])

export async function setBoardPassword(category: string, adminPage: string, formData: FormData) {
  await requireAdmin()
  if (!category || category.length > 40 || !adminPages.has(adminPage)) throw new Error("올바른 게시판이 아닙니다.")
  const password = String(formData.get("password") ?? "")
  if (password.length < 4 || password.length > 100) redirect(`${adminPage}?error=board-password`)
  const hash = await hashBoardPassword(password)
  await getDb()
    .insert(boardPasswords)
    .values({ category, hash })
    .onConflictDoUpdate({ target: boardPasswords.category, set: { hash, updatedAt: new Date() } })
  revalidatePath("/", "layout")
  redirect(`${adminPage}?saved=board-password`)
}

export async function clearBoardPassword(category: string, adminPage: string) {
  await requireAdmin()
  if (!adminPages.has(adminPage)) throw new Error("올바른 게시판이 아닙니다.")
  await getDb().delete(boardPasswords).where(eq(boardPasswords.category, category))
  revalidatePath("/", "layout")
  redirect(`${adminPage}?saved=board-password`)
}
