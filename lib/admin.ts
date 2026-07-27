import "server-only"
import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Ensures the current request is from an authenticated admin.
 * Redirects to sign-in when unauthenticated, or home when not an admin.
 * Use this in every admin page and server action.
 */
export async function requireAdmin() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  // KV is eventually consistent. Authorization always comes from D1.
  const currentUser = await getDb()
    .select({ id: user.id, name: user.name, email: user.email, role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)
    .get()

  if (currentUser?.role !== "admin") redirect("/")
  return currentUser
}
