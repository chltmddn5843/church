import { getCloudflareContext } from "@opennextjs/cloudflare"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { attachments, posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { canAccess, getViewerAccess } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params
  const objectKey = key.join("/")
  if (!/^(popups|gallery|attachments)\//.test(objectKey) || key.some((part) => !part || part === "." || part === "..")) {
    return new NextResponse("Not found", { status: 404 })
  }

  if (objectKey.startsWith("attachments/")) {
    const file = await getDb().select({ visibility: posts.visibility }).from(attachments).innerJoin(posts, eq(attachments.postId, posts.id)).where(eq(attachments.url, `/api/uploads/${objectKey}`)).get()
    if (!file || !canAccess(file.visibility, await getViewerAccess())) return new NextResponse("Not found", { status: 404 })
  }

  const { env } = getCloudflareContext()
  const object = await env.POPUP_IMAGES.get(objectKey)
  if (!object) return new NextResponse("Not found", { status: 404 })

  const headers = new Headers()
  // Not object.writeHttpMetadata(headers): that RPCs across the Node/workerd
  // boundary in local dev and throws (DevalueError: Cannot stringify Headers).
  if (object.httpMetadata?.contentType) headers.set("content-type", object.httpMetadata.contentType)
  headers.set("content-length", String(object.size))
  headers.set("etag", object.httpEtag)
  headers.set("cache-control", objectKey.startsWith("attachments/") ? "private, no-store" : "public, max-age=31536000, immutable")
  headers.set("x-content-type-options", "nosniff")
  return new NextResponse(object.body, { headers })
}
