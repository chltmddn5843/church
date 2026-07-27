import { getAuth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSessionUser() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user
}
