import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user as {
    id: string
    name: string
    email: string
    role?: string
  }
}
