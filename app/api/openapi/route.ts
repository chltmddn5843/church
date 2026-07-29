import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { openApiDocument } from "@/lib/openapi"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 })
  }

  const currentUser = await getDb()
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)
    .get()

  if (currentUser?.role !== "admin") {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 })
  }

  return NextResponse.json(openApiDocument, {
    headers: { "Cache-Control": "private, no-store" },
  })
}
