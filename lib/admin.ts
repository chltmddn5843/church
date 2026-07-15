import "server-only"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Ensures the current request is from an authenticated admin.
 * Redirects to sign-in when unauthenticated, or home when not an admin.
 * Use this in every admin page and server action.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")
  if ((session.user as { role?: string }).role !== "admin") redirect("/")
  return session.user as { id: string; name: string; email: string; role: string }
}
