import { getCloudflareContext } from "@opennextjs/cloudflare"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params
  const objectKey = key.join("/")
  if (!objectKey.startsWith("popups/") || key.some((part) => !part || part === "." || part === "..")) {
    return new NextResponse("Not found", { status: 404 })
  }

  const { env } = getCloudflareContext()
  const object = await env.POPUP_IMAGES.get(objectKey)
  if (!object) return new NextResponse("Not found", { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("etag", object.httpEtag)
  headers.set("cache-control", "public, max-age=31536000, immutable")
  headers.set("x-content-type-options", "nosniff")
  return new NextResponse(object.body, { headers })
}
