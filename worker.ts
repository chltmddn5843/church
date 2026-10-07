// Edge-caches public pages for signed-out visitors so most page views skip SSR + D1 entirely.
// Signed-in users (session cookie) and client-side navigations (RSC requests) always go to Next,
// so member-only posts and the logged-in header never land in the shared cache.
// ponytail: admin edits take up to TTL seconds to show for signed-out visitors (revalidatePath
// doesn't purge this cache), and post view counts only tick on cache misses.
// @ts-expect-error -- .open-next/worker.js only exists after `opennextjs-cloudflare build`
import nextWorker from "./.open-next/worker.js"
// @ts-expect-error -- see above; Durable Object classes must be re-exported from the entry
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js"

const TTL_SECONDS = 60
const PUBLIC_PAGE = /^\/(about|worship|discipleship|next-generation|campus|sermons|gallery|community)?(\/|$)/

type Env = CloudflareEnv & { CF_VERSION_METADATA?: { id: string } }

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    if (request.method === "GET" && url.pathname.startsWith("/api/uploads/")) return cachedUpload(request, env, ctx)
    const cacheable =
      request.method === "GET" &&
      PUBLIC_PAGE.test(url.pathname) &&
      !url.searchParams.has("_rsc") &&
      !request.headers.has("rsc") &&
      !(request.headers.get("cookie") ?? "").includes("session_token")
    if (!cacheable) return nextWorker.fetch(request, env, ctx)

    // Keyed by deploy so cached HTML never points at a previous build's CSS/JS chunks.
    const keyUrl = new URL(url)
    keyUrl.searchParams.set("__v", env.CF_VERSION_METADATA?.id ?? "dev")
    const key = new Request(keyUrl.toString())
    const cache = caches.default

    const hit = await cache.match(key)
    if (hit) return withBrowserNoStore(hit)

    const response: Response = await nextWorker.fetch(request, env, ctx)
    if (response.status === 200 && !response.headers.has("set-cookie")) {
      const stored = new Response(response.clone().body, response)
      stored.headers.set("Cache-Control", `public, s-maxage=${TTL_SECONDS}`)
      stored.headers.delete("Vary")
      ctx.waitUntil(cache.put(key, stored))
    }
    return response
  },
}

export default worker

// Worker responses skip the CDN cache, so a shared post's images (and /cdn-cgi/image fetching them)
// re-ran Next + D1 on every view and tripped the CPU limit. The upload route marks only files anyone
// may see as "public"; those are stored here for their own max-age, everything else passes through.
async function cachedUpload(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const path = new URL(request.url).pathname.slice("/api/uploads/".length)
  if (/^(gallery|popups)\//.test(path)) return publicUpload(path, env)

  const cache = caches.default
  const hit = await cache.match(request)
  if (hit) return hit

  const response: Response = await nextWorker.fetch(request, env, ctx)
  if (response.status === 200 && response.headers.get("cache-control")?.startsWith("public") && !response.headers.has("set-cookie")) {
    ctx.waitUntil(cache.put(request, response.clone()))
  }
  return response
}

// gallery/ and popups/ are public, immutable files with no access check, so they skip Next
// (booting it cost 180–340ms CPU per request). Mirrors app/api/uploads/[...key]/route.ts, which `next dev` still uses.
async function publicUpload(path: string, env: Env): Promise<Response> {
  const parts = path.split("/").map((part) => { try { return decodeURIComponent(part) } catch { return "" } })
  const object = parts.some((part) => !part || part === "." || part === ".." || part.includes("/")) ? null : await env.POPUP_IMAGES.get(parts.join("/"))
  if (!object) return new Response("Not found", { status: 404 })
  const headers = new Headers({
    "content-length": String(object.size),
    etag: object.httpEtag,
    "cache-control": "public, max-age=31536000, immutable",
    "x-content-type-options": "nosniff",
  })
  if (object.httpMetadata?.contentType) headers.set("content-type", object.httpMetadata.contentType)
  return new Response(object.body, { headers })
}

// The edge copy is shared; browsers should still revalidate every visit like before.
function withBrowserNoStore(response: Response) {
  const out = new Response(response.body, response)
  out.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate")
  out.headers.set("X-Edge-Cache", "HIT")
  return out
}
