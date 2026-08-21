import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

export async function getSessionUser() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const current = await getDb()
    .select({ id: user.id, name: user.name, email: user.email, role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)
    .get()
  return current ?? session.user
}
