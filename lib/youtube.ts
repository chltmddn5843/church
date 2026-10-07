const FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UC0KYIf-En7v5Ee91PL1IchQ"
const PLAYLISTS: Record<string, string | null> = {
  "주일예배": "PL61Tjrp-GLP7vWfc5urYAh0ZJEY_XF6bK",
  "금요예배": "PL61Tjrp-GLP6Ub5td2fFjsd0LVHIpAj7A",
  "새벽예배": null,
  "쉐키나찬양단": "PL61Tjrp-GLP4HMfRHBvXU2jOMXVuF3O3I",
  "찬양대": "PL61Tjrp-GLP7khZV0uZfKGNjoE_UTn-rT",
}

function decode(value: string) {
  return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&quot;", '"')
}

function categoryOf(title: string) {
  if (/새벽|월삭/.test(title)) return "새벽예배"
  if (/금요/.test(title)) return "금요예배"
  if (/주일|설교/.test(title)) return "주일예배"
  return null
}

export function parseSermonTitle(rawTitle: string) {
  const parts = rawTitle.split(/\s*[|ㅣ]\s*|\s+l\s+/i).map(part => part.trim()).filter(Boolean)
  if (!/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(parts[0]) || parts.length < 3) return { title: rawTitle, scripture: null, preacher: null }
  const hasPreacher = /목사|전도사/.test(parts.at(-1) ?? "")
  return { title: parts.slice(2, hasPreacher ? -1 : undefined).join(" | "), scripture: parts[1], preacher: hasPreacher ? parts.at(-1)! : null }
}

type Video = { youtubeId: string; title: string; scripture: string | null; preacher: string | null; category: string; preachedAt: Date }
type Entry = { youtubeId: string; rawTitle: string; published: string }

const CHANNEL_UPLOADS = "UU0KYIf-En7v5Ee91PL1IchQ" // uploads playlist of channel UC0KYIf-En7v5Ee91PL1IchQ
const FRESH_MS = 30 * 60 * 1000 // ~48 API calls per list per day, far inside the 10,000-unit daily quota

// YouTube Data API v3: reliable, needs YOUTUBE_API_KEY. Private/deleted items have no videoPublishedAt.
async function fromApi(playlistId: string, key: string): Promise<Entry[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${encodeURIComponent(key)}`
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`YouTube API ${response.status}`)
  const data = (await response.json()) as { items?: { snippet?: { title?: string }; contentDetails?: { videoId?: string; videoPublishedAt?: string } }[] }
  const entries = (data.items ?? []).flatMap(({ snippet, contentDetails }) =>
    contentDetails?.videoId && contentDetails.videoPublishedAt && snippet?.title
      ? [{ youtubeId: contentDetails.videoId, rawTitle: snippet.title, published: contentDetails.videoPublishedAt }]
      : [],
  )
  if (!entries.length) return entries
  // Pre-created and running streams sit in playlists too; they belong in the live slot, not the sermon list.
  const status = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${entries.map((e) => e.youtubeId).join(",")}&key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(8000) })
  if (!status.ok) throw new Error(`YouTube API ${status.status}`)
  const aired = new Set(((await status.json()) as { items?: { id: string; snippet: { liveBroadcastContent: string } }[] }).items?.filter((item) => item.snippet.liveBroadcastContent === "none").map((item) => item.id))
  return entries.filter((entry) => aired.has(entry.youtubeId))
}

// Public RSS: no key, but YouTube serves it unreliably (intermittent 404/500), so it is only the fallback.
async function fromRss(playlistId: string | null): Promise<Entry[]> {
  const url = playlistId ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}` : FEED
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`YouTube feed ${response.status}`)
  const xml = await response.text()
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const youtubeId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    const rawTitle = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
    return youtubeId && rawTitle && published ? [{ youtubeId, rawTitle: decode(rawTitle), published }] : []
  })
}

function toVideos(entries: Entry[], category: string, filterByTitle: boolean): Video[] {
  return entries.flatMap(({ youtubeId, rawTitle, published }) =>
    filterByTitle && categoryOf(rawTitle) !== category ? [] : [{ youtubeId, ...parseSermonTitle(rawTitle), category, preachedAt: new Date(published) }],
  )
}

// JSON rows in D1's app_cache table. Imported lazily so lib/youtube.test.ts can load this file under plain Node.
async function cacheStore() {
  const [{ getDb }, { appCache }, { eq }] = await Promise.all([import("@/lib/db"), import("@/lib/db/schema"), import("drizzle-orm")])
  const db = getDb()
  return {
    get: async <T>(key: string) => {
      const row = await db.select({ value: appCache.value }).from(appCache).where(eq(appCache.key, key)).get().catch(() => undefined)
      return row ? (JSON.parse(row.value) as T) : null
    },
    put: async (key: string, value: unknown) => {
      const json = JSON.stringify(value)
      await db.insert(appCache).values({ key, value: json }).onConflictDoUpdate({ target: appCache.key, set: { value: json } }).catch(() => {})
    },
  }
}
type CacheStore = Awaited<ReturnType<typeof cacheStore>>

// API → RSS → last good copy in D1. Fresh copies are reused for 30 minutes so page views don't spend quota.
// A stale copy is served at once and refreshed in the background, so no visitor waits on YouTube (up to 8s per try).
async function loadVideos(category: string): Promise<Video[]> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare")
  const { runtimeEnv } = await import("@/lib/runtime-env")
  const { ctx } = getCloudflareContext()
  const store = await cacheStore()
  const cacheKey = `youtube:v2:${category}`
  const playlist = PLAYLISTS[category]
  const revive = (videos: Video[]) => videos.map((video) => ({ ...video, preachedAt: new Date(video.preachedAt) }))

  const cached = await store.get<{ at: number; videos: Video[] }>(cacheKey)
  if (cached && Date.now() - cached.at < FRESH_MS) return revive(cached.videos)

  const refresh = async () => {
    const key = runtimeEnv("YOUTUBE_API_KEY")
    for (const [source, load] of [
      ["api", () => (key ? fromApi(playlist ?? CHANNEL_UPLOADS, key) : Promise.reject(new Error("YOUTUBE_API_KEY not set")))],
      ["rss", () => fromRss(playlist)],
    ] as const) {
      try {
        const videos = toVideos(await load(), category, !playlist)
        await store.put(cacheKey, { at: Date.now(), videos })
        return videos
      } catch (error) {
        console.warn(`YouTube ${source} failed for ${category}:`, error instanceof Error ? error.message : error)
      }
    }
    return null
  }

  // ponytail: every request that sees the stale copy starts its own refresh until one lands; add a lock row if quota ever runs short.
  if (cached) {
    ctx.waitUntil(refresh())
    return revive(cached.videos)
  }
  return (await refresh()) ?? []
}

export type LiveBroadcast = { youtubeId: string; title: string; status: "live" | "upcoming"; scheduledStart: Date | null }

const LIVE_FRESH_MS = 5 * 60 * 1000 // 2 API units per check → ~600 units/day at most
const UPCOMING_WINDOW_MS = 2 * 60 * 60 * 1000

// Which video should fill the home page's main slot right now, if any.
// A link saved in 관리자 > 예배 영상 관리 wins; otherwise the channel's newest uploads are checked for a live
// broadcast, or one scheduled to start within 2 hours. The church pre-creates "upcoming" streams with no start
// time that sit there for days, so those are ignored.
export async function getLiveBroadcast(manual: { youtubeId: string } | null | undefined): Promise<LiveBroadcast | null> {
  if (manual) return { youtubeId: manual.youtubeId, title: "", status: "live", scheduledStart: null }

  const { getCloudflareContext } = await import("@opennextjs/cloudflare")
  const { runtimeEnv } = await import("@/lib/runtime-env")
  const store = await cacheStore()
  const cacheKey = "youtube:v1:live"
  type Cached = { at: number; live: (Omit<LiveBroadcast, "scheduledStart"> & { scheduledStart: string | null }) | null }
  const revive = (live: Cached["live"]) => (live ? { ...live, scheduledStart: live.scheduledStart ? new Date(live.scheduledStart) : null } : null)

  const cached = await store.get<Cached>(cacheKey)
  if (cached && Date.now() - cached.at < LIVE_FRESH_MS) return revive(cached.live)

  const key = runtimeEnv("YOUTUBE_API_KEY")
  if (!key) return null
  // A broadcast seen in the last 15 minutes is probably still on: serve it now and re-check in the background.
  // Anything older must not linger, so that request waits for the check.
  if (cached && Date.now() - cached.at < 15 * 60 * 1000) {
    getCloudflareContext().ctx.waitUntil(checkLive(key, store, cacheKey))
    return revive(cached.live)
  }
  const live = await checkLive(key, store, cacheKey)
  return live === undefined ? null : revive(live)
}

async function checkLive(key: string, store: CacheStore, cacheKey: string) {
  try {
    const api = "https://www.googleapis.com/youtube/v3"
    const uploads = await fetch(`${api}/playlistItems?part=contentDetails&maxResults=10&playlistId=${CHANNEL_UPLOADS}&key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(8000) })
    if (!uploads.ok) throw new Error(`YouTube API ${uploads.status}`)
    const ids = ((await uploads.json()) as { items?: { contentDetails?: { videoId?: string } }[] }).items?.flatMap((item) => item.contentDetails?.videoId ?? []) ?? []
    const details = await fetch(`${api}/videos?part=snippet,liveStreamingDetails&id=${ids.join(",")}&key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(8000) })
    if (!details.ok) throw new Error(`YouTube API ${details.status}`)
    type Item = { id: string; snippet: { title: string; liveBroadcastContent: string }; liveStreamingDetails?: { scheduledStartTime?: string } }
    const items = ((await details.json()) as { items?: Item[] }).items ?? []
    const now = Date.now()
    const live = items.find((item) => item.snippet.liveBroadcastContent === "live")
    const upcoming = items
      .filter((item) => item.snippet.liveBroadcastContent === "upcoming" && item.liveStreamingDetails?.scheduledStartTime)
      .map((item) => ({ item, start: Date.parse(item.liveStreamingDetails!.scheduledStartTime!) }))
      .filter(({ start }) => start - now < UPCOMING_WINDOW_MS && now - start < 30 * 60 * 1000)
      .sort((a, b) => a.start - b.start)[0]
    const pick = live
      ? { youtubeId: live.id, title: parseSermonTitle(decode(live.snippet.title)).title, status: "live" as const, scheduledStart: null }
      : upcoming
        ? { youtubeId: upcoming.item.id, title: parseSermonTitle(decode(upcoming.item.snippet.title)).title, status: "upcoming" as const, scheduledStart: new Date(upcoming.start).toISOString() }
        : null
    await store.put(cacheKey, { at: now, live: pick })
    return pick
  } catch (error) {
    console.warn("YouTube live check failed:", error instanceof Error ? error.message : error)
    return undefined
  }
}

export async function getYoutubeSermons(category?: string) {
  if (category && !(category in PLAYLISTS)) return []
  const categories = category ? [category] : Object.keys(PLAYLISTS)
  const videos = (await Promise.all(categories.map(loadVideos))).flat()
  return [...new Map(videos.map(video => [video.youtubeId, video])).values()]
    .sort((a, b) => b.preachedAt.getTime() - a.preachedAt.getTime())
}

// Accepts a bare 11-char id or any YouTube link form admins paste: watch?v= (any param order), youtu.be,
// /live/ (what YouTube shares for live streams), /embed/, /shorts/, with or without scheme, www./m. prefixes.
export function parseYoutubeId(input: string): string | null {
  const value = input.trim()
  if (/^[\w-]{11}$/.test(value)) return value
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
  } catch {
    return null
  }
  const host = url.hostname.replace(/^(www|m|music)\./, "")
  const id = host === "youtu.be"
    ? url.pathname.split("/")[1]
    : host === "youtube.com" || host === "youtube-nocookie.com"
      ? url.searchParams.get("v") ?? url.pathname.match(/^\/(?:live|embed|shorts|v)\/([^/]+)/)?.[1]
      : undefined
  return id && /^[\w-]{11}$/.test(id) ? id : null
}
