import "server-only"
import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { user, userGroups } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

export const accessOptions = [
  ["public", "전체 공개"],
  ["member", "승인 회원"],
  ["bylaws", "정관 열람 그룹"],
  ["offering", "헌금 내역 그룹"],
  ["committee", "제직회 그룹"],
] as const

export async function getViewerAccess() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) return { role: "guest", groups: [] as string[] }
  const current = await getDb().select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).get()
  if (!current) return { role: "guest", groups: [] as string[] }
  const groups = await getDb().select({ group: userGroups.group }).from(userGroups).where(eq(userGroups.userId, session.user.id))
  return { role: current.role, groups: groups.map(({ group }) => group) }
}

export function canAccess(visibility: string, viewer: Awaited<ReturnType<typeof getViewerAccess>>) {
  return visibility === "public" || viewer.role === "admin" ||
    (visibility === "member" ? viewer.role === "member" : viewer.groups.includes(visibility))
}
